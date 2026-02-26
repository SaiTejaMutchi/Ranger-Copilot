import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

const PROTOCOL = {
    threatLabels: ["poaching"], // Direct poaching indicator
    humanVehicleLabels: ["human", "car", "human_with_tool"],
    animalLabels: ["bobcat", "fox", "coyote", "badger", "rhino", "elephant", "deer", "raccoon", "opossum", "skunk", "mountain_lion"],
    lowConfidenceThreshold: 0.55
};

const VALID_LABELS = new Set(["empty", "human", "car", "bobcat", "fox", "coyote", "raccoon", "deer", "opossum", "skunk", "mountain_lion", "rhino", "elephant", "poaching", "conservation_dehorning", "human_with_tool", "unknown"]);

// Synonym map: normalizes OpenAI free-text spellings to our whitelist
const LABEL_SYNONYMS: Record<string, string> = {
    "mountain lion": "mountain_lion",
    "puma": "mountain_lion",
    "cougar": "mountain_lion",
    "grey fox": "fox",
    "gray fox": "fox",
    "red fox": "fox",
    "kit fox": "fox",
    "coyote dog": "coyote",
    "north american raccoon": "raccoon",
    "white-tailed deer": "deer",
    "whitetail deer": "deer",
    "mule deer": "deer",
    "vehicle": "car",
    "automobile": "car",
    "truck": "car",
    "person": "human",
    "pedestrian": "human",
    "no animal": "empty",
    "blank": "empty",
    "nothing": "empty",
    "rhinoceros": "rhino",
    "elephant": "elephant",
    "illegal poaching": "poaching",
    "horn removal": "poaching",
    "dehorning": "conservation_dehorning",
    "conservation dehorning": "conservation_dehorning",
    "sedated rhino": "conservation_dehorning",
    "person with chainsaw": "human_with_tool",
    "human with chainsaw": "human_with_tool",
};

/**
 * Normalize a raw label string:
 * 1. lowercase + trim
 * 2. spaces → underscores
 * 3. synonym lookup
 * 4. whitelist check — if still not valid, return the original (for UI display) + flag as uncertain
 */
function normalizeLabel(raw: string): { label: string; wasNormalized: boolean; isUnknown: boolean } {
    const cleaned = raw.toLowerCase().trim();
    const underscored = cleaned.replace(/\s+/g, "_");
    const synonym = LABEL_SYNONYMS[cleaned] ?? LABEL_SYNONYMS[underscored];
    const candidate = synonym ?? underscored;
    if (VALID_LABELS.has(candidate)) {
        return { label: candidate, wasNormalized: candidate !== cleaned, isUnknown: false };
    }
    // Not in whitelist — preserve raw for display, flag as uncertain
    return { label: cleaned, wasNormalized: true, isUnknown: true };
}

const SYSTEM_PROMPT = `You are an AI wildlife analyst for the Ranger Copilot system. Your job includes detecting poaching threats.

Analyze the image and return a strict JSON response.

POACHING DETECTION (critical):
- If you see rhino/elephant horn removal or wildlife harm: distinguish POACHING vs CONSERVATION_DEHORNING.
  - POACHING: Illegal. Signs: dead/injured animal, violent scene, clandestine activity, carcass, blood, rushed removal.
  - CONSERVATION_DEHORNING: Legal anti-poaching. Signs: sedated/tranquilized animal (alive, still), controlled procedure, professional setting, animal appears calm.
- If human is using chainsaw/power tool on rhino/elephant: assess context. Sedated animal + controlled = conservation_dehorning. Dead animal or violent = poaching.
- Use label "poaching" for illegal activity; "conservation_dehorning" for legal dehorning; "human_with_tool" if unclear.

Labels must be one of: [empty, human, car, bobcat, fox, coyote, raccoon, deer, opossum, skunk, mountain_lion, rhino, elephant, poaching, conservation_dehorning, human_with_tool, unknown].

JSON Schema:
{
  "top_predictions": [{"label": string, "prob": number}, {"label": string, "prob": number}],
  "confidence": number,
  "rationale": string,
  "quality_issue": boolean,
  "poaching_indicator": "poaching" | "conservation_dehorning" | "none" (required; use "none" when no poaching or wildlife harm is seen — e.g. animals in natural behavior only)
}`;

function rankFinding(
    predictions: any[],
    confidence: number,
    qualityIssue: boolean,
    referenceLabel?: string,
    isReferenceBatch?: boolean,
    armsVisible?: string,
    analysisOverrides?: { humans?: number; vehicles?: string; armsVisible?: string; poachingIndicator?: string }
) {
    const labels = predictions.map((p) => (p?.label ?? "").toLowerCase()).filter(Boolean);
    let hasHuman = labels.some((l) => l === "human" || l === "human_with_tool");
    let hasVehicle = labels.some((l) => l === "car");
    let hasArms = !!(armsVisible && armsVisible.toLowerCase() !== "none" && armsVisible.toLowerCase() !== "no");
    let hasPoaching = labels.includes("poaching");

    // When we have structured poaching_analysis, use it as source of truth so threat matches the narrative
    if (analysisOverrides) {
        if (analysisOverrides.humans === 0) hasHuman = false;
        const v = (analysisOverrides.vehicles ?? "").toLowerCase().trim();
        if (v === "none" || v === "no" || v === "" || v === "—") hasVehicle = false;
        const a = (analysisOverrides.armsVisible ?? armsVisible ?? "").toLowerCase().trim();
        if (a === "none" || a === "no") hasArms = false;
        if (analysisOverrides.poachingIndicator === "none") hasPoaching = false;
    }

    const hasHumanOrVehicle = hasHuman || hasVehicle;
    const hasAnimal = labels.some((l) => PROTOCOL.animalLabels.includes(l));
    const topLabel = labels[0] ?? "unknown";

    // Threat = 0 when no humans, no vehicles, no arms. Each one present increases threat.
    let score = 0;
    let category: "URGENT" | "PRIORITY" | "REVIEW" | "ALL" = "ALL";
    let reason = "Standard observation.";
    let uncertaintyFlag = qualityIssue;
    let receiptTags: string[] = [];

    if (qualityIssue) receiptTags.push("low_quality_input");

    const threatFactors = (hasHuman ? 1 : 0) + (hasVehicle ? 1 : 0) + (hasArms ? 1 : 0);

    // 1. Direct poaching
    if (hasPoaching) {
        category = "URGENT";
        score = 10;
        reason = "Poaching activity detected. Immediate patrol response required.";
    }
    // 2. Human, vehicle, or arms present → threat increases
    else if (threatFactors > 0) {
        if (hasHumanOrVehicle && hasAnimal) {
            category = "URGENT";
            score = Math.min(10, 4 + threatFactors * 2 + (hasAnimal ? 2 : 0));
            reason = "Human or vehicle detected near wildlife. Possible poaching risk — escalate.";
        } else if (hasHumanOrVehicle) {
            category = "PRIORITY";
            score = Math.min(10, 3 + threatFactors * 2);
            reason = "Human or vehicle in frame. Monitor for wildlife proximity.";
        } else if (hasArms) {
            category = "PRIORITY";
            score = Math.min(10, 3 + threatFactors * 2);
            reason = "Arms or weapons visible. Escalate for review.";
        }
    }
    // 3. No humans, vehicles, or arms → threat = 0 (even with animal)
    else if (hasAnimal || topLabel === "empty") {
        category = topLabel === "empty" ? "ALL" : "REVIEW";
        score = 0;
        reason = topLabel === "empty"
            ? "Clear frame."
            : `Wildlife detected: ${topLabel}. No humans, vehicles, or arms — threat level 0.`;
    }

    // 4. Uncertainty Check (Deterministic)
    const probDiff = predictions.length > 1 ? predictions[0].prob - predictions[1].prob : 1.0;

    if (probDiff < 0.1) {
        uncertaintyFlag = true;
        receiptTags.push("conflicting_labels");
    }

    if (confidence < PROTOCOL.lowConfidenceThreshold) {
        uncertaintyFlag = true;
        receiptTags.push("low_confidence");
    }

    // 5. Reference Mismatch (Strictly Benchmark Only)
    const isMismatch = isReferenceBatch && referenceLabel && topLabel !== "unknown" && topLabel !== referenceLabel;
    if (isMismatch) {
        uncertaintyFlag = true;
        receiptTags.push("reference_mismatch");
    }

    // 6. Safety Rule (No URGENT Downgrade)
    if (uncertaintyFlag) {
        if (category === "URGENT") {
            // Keep URGENT but add warning
            reason += " [High Uncertainty: Needs human confirmation]";
        } else {
            // Non-urgent uncertain findings go to REVIEW
            category = "REVIEW";
            reason = isMismatch
                ? "System detected mismatch with benchmark; routing for verification."
                : "High uncertainty detected; routing for human review.";
        }
    }

    return {
        priorityCategory: category,
        priorityScore: Math.min(parseFloat(score.toFixed(1)), 10),
        priorityReason: reason,
        uncertaintyFlag,
        receiptTags
    };
}

export const runPipeline = action({
    args: {
        batchId: v.id("batches"),
        imageIds: v.array(v.id("images")),
        cloudEnabled: v.boolean(),
    },
    handler: async (ctx, args) => {
        const apiKey = process.env.OPENAI_API_KEY;

        // Fetch batch to check if it's a reference/benchmark batch
        const batch = await ctx.runQuery(api.batches.getBatchById, { batchId: args.batchId });
        const isReferenceBatch = batch?.isReferenceBatch ?? false;

        let debugLogCount = 0; // Only log raw responses for first 3 images

        for (const imageId of args.imageIds) {
            const image = await ctx.runQuery(api.images.getImageById, { imageId });
            if (!image) continue;

            let predictions = image.predictions;
            let confidence = image.confidence;
            let rationale = "";
            let qualityIssue = false;
            let modelUsed = "mock-fallback";
            let poachingAnalysis: { humans?: number; vehicles?: string; species?: string; time?: string; armsVisible?: string; analysisParagraph?: string } | undefined;
            let poachingIndicator: string | undefined;

            try {
                if (args.cloudEnabled && apiKey) {
                    let base64Image = "";

                    if (image.storageId) {
                        // Cast to Id<"_storage"> — Convex stores these as strings internally
                        const blob = await ctx.storage.get(image.storageId as any);
                        if (blob) {
                            const buffer = await blob.arrayBuffer();
                            const bytes = new Uint8Array(buffer);
                            let binary = "";
                            const CHUNK = 8192;
                            for (let i = 0; i < bytes.byteLength; i += CHUNK) {
                                binary += String.fromCharCode(...Array.from(bytes.subarray(i, i + CHUNK)));
                            }
                            base64Image = btoa(binary);
                        } else {
                            // Blob not returned directly — try via public URL
                            const storageUrl = await ctx.storage.getUrl(image.storageId as any);
                            if (storageUrl) {
                                const r = await fetch(storageUrl);
                                const buf = await r.arrayBuffer();
                                const bytes2 = new Uint8Array(buf);
                                let bin = "";
                                const CHUNK = 8192;
                                for (let i = 0; i < bytes2.byteLength; i += CHUNK) {
                                    bin += String.fromCharCode(...Array.from(bytes2.subarray(i, i + CHUNK)));
                                }
                                base64Image = btoa(bin);
                            }
                        }
                    } else if (image.fileUrl && image.fileUrl.startsWith("data:image")) {
                        // Only accept data URLs — blob:// URLs are browser-only, unreachable from Convex
                        base64Image = image.fileUrl.split(",")[1];
                    }

                    if (base64Image) {
                        modelUsed = "gpt-4o-mini";
                        const response = await fetch("https://api.openai.com/v1/chat/completions", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${apiKey}`,
                            },
                            body: JSON.stringify({
                                model: "gpt-4o-mini",
                                messages: [
                                    { role: "system", content: SYSTEM_PROMPT },
                                        {
                                        role: "user",
                                        content: [
                                            { type: "text", text: "Analyze for anti-poaching. List ALL entities in top_predictions (human, car, species). Return poaching_analysis: { humans, vehicles, species, time, armsVisible, analysisParagraph }. ALWAYS fill species when any animal is visible or mentioned (e.g. elephant, rhino, deer). Use analysisParagraph for the narrative like 'Three human figures detected near elephant herd at 03:42. One white pickup parked 40m from herd. Tusk condition unconfirmed — recommend immediate ranger response.'" },
                                            {
                                                type: "image_url",
                                                image_url: { url: `data:image/jpeg;base64,${base64Image}` },
                                            },
                                        ],
                                    },
                                ],
                                response_format: { type: "json_object" },
                            }),
                        });

                        const data = await response.json();

                        // [DEBUG] Log raw response for first 3 images
                        if (debugLogCount < 3) {
                            console.log(`[RAW OpenAI response for ${image.fileName}]:`, JSON.stringify(data, null, 2));
                            debugLogCount++;
                        }

                        // Always parse — the content is valid JSON from response_format: json_object
                        const content = data.choices?.[0]?.message?.content;
                        if (!content) {
                            // Log the actual error from OpenAI (e.g., billing, quota, content policy)
                            console.error(`[OpenAI error for ${image.fileName}]:`, JSON.stringify(data?.error ?? data, null, 2));
                            throw new Error(data?.error?.message ?? "Empty OpenAI response");
                        }

                        const rawResult = JSON.parse(content);

                        // Use poaching_indicator when present — elevate to poaching label for triage
                        poachingIndicator = rawResult.poaching_indicator;
                        if (poachingIndicator === "poaching") {
                            rawResult.top_predictions = rawResult.top_predictions ?? [];
                            rawResult.top_predictions.unshift({ label: "poaching", prob: rawResult.confidence ?? 0.85 });
                        }

                        // Normalize labels before using them — no whitelist throw, just flag uncertain
                        const normalizedPredictions = ((rawResult.top_predictions ?? rawResult.predictions ?? []) as any[]).map((p: any) => {
                            const { label, isUnknown } = normalizeLabel(String(p.label ?? "unknown"));
                            if (isUnknown) qualityIssue = true;
                            return { label, prob: typeof p.prob === "number" ? p.prob : typeof p.probability === "number" ? p.probability : 0.5 };
                        });

                        predictions = normalizedPredictions.length > 0 ? normalizedPredictions : [{ label: "unknown", prob: 0.5 }];

                        // Derive confidence from top1.prob if OpenAI omits the field (no strict equality check)
                        confidence = typeof rawResult.confidence === "number"
                            ? rawResult.confidence
                            : predictions[0]?.prob ?? 0.5;

                        rationale = rawResult.rationale ?? rawResult.explanation ?? rawResult.description ?? "";
                        qualityIssue = qualityIssue || (rawResult.quality_issue === true);

                        // Parse poaching_analysis for structured display (before rankFinding for armsVisible)
                        const pa = rawResult.poaching_analysis;
                        const armsVisible = (pa && typeof pa === "object" && typeof pa.armsVisible === "string") ? pa.armsVisible : undefined;
                        if (pa && typeof pa === "object") {
                            poachingAnalysis = {
                                humans: typeof pa.humans === "number" ? pa.humans : undefined,
                                vehicles: typeof pa.vehicles === "string" ? pa.vehicles : undefined,
                                species: typeof pa.species === "string" ? pa.species : undefined,
                                time: typeof pa.time === "string" ? pa.time : undefined,
                                armsVisible,
                                analysisParagraph: typeof pa.analysisParagraph === "string" ? pa.analysisParagraph : rationale || undefined,
                            };
                            if (pa.analysisParagraph) rationale = pa.analysisParagraph;
                        }
                    }
                } else {
                    // Force a fallback if cloud is disabled or key missing
                    throw new Error("Cloud inference unavailable");
                }
            } catch (error) {
                console.warn(`Failsafe triggered for ${imageId}:`, error);
                // Graceful degradation: Fallback to uncertain "unknown"
                predictions = [{ label: "unknown", prob: 0.1 }];
                confidence = 0.1;
                rationale = "Cloud intelligence unavailable. Manual verification required.";
                qualityIssue = true;
                modelUsed = "mock-failsafe";
            }

            const triage = rankFinding(
                predictions,
                confidence,
                qualityIssue,
                image.referenceLabel,
                isReferenceBatch,
                poachingAnalysis?.armsVisible,
                poachingAnalysis
                    ? {
                        humans: poachingAnalysis.humans,
                        vehicles: poachingAnalysis.vehicles,
                        armsVisible: poachingAnalysis.armsVisible,
                        poachingIndicator,
                    }
                    : undefined
            );

            const updatePayload: Record<string, unknown> = {
                imageId,
                predictions,
                confidence,
                ...triage,
                rationale: rationale || "Analysis completed.",
                evidence: { model: modelUsed, timestamp: Date.now() },
            };
            if (poachingAnalysis) updatePayload.poachingAnalysis = poachingAnalysis;
            await ctx.runMutation(api.images.updateImageResult, updatePayload as any);
        }

        await ctx.runMutation(api.batches.setStatus, {
            batchId: args.batchId,
            status: "completed",
        });
    },
});
