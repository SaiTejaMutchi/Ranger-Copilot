import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

const SYSTEM_PROMPT = `You are an AI wildlife analyst for the Ranger Copilot system. 
You will be provided with images from camera traps. 
Analyze the image and return a strict JSON response.
Labels must be one of: [empty, human, car, bobcat, fox, coyote, raccoon, deer, opossum, skunk, unknown].

JSON Schema:
{
  "top_predictions": [{"label": string, "prob": number}, {"label": string, "prob": number}, {"label": string, "prob": number}],
  "confidence": number,
  "is_empty": boolean
}`;

export const runInference = action({
    args: {
        batchId: v.id("batches"),
        imageIds: v.array(v.id("images")),
    },
    handler: async (ctx, args) => {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) throw new Error("OPENAI_API_KEY not set");

        for (const imageId of args.imageIds) {
            const image = await ctx.runQuery(api.images.getImageById, { imageId });
            if (!image || !image.fileUrl) continue;

            try {
                const response = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify({
                        model: "gpt-4o-mini", // Rapid and cost-effective for vision
                        messages: [
                            { role: "system", content: SYSTEM_PROMPT },
                            {
                                role: "user",
                                content: [
                                    { type: "text", text: "Analyze this camera trap image." },
                                    { type: "image_url", image_url: { url: image.fileUrl } },
                                ],
                            },
                        ],
                        response_format: { type: "json_object" },
                    }),
                });

                const data = await response.json();
                const result = JSON.parse(data.choices[0].message.content);

                // Update image results in the database
                await ctx.runMutation(api.images.updateImageResults, {
                    imageId,
                    predictions: result.top_predictions,
                    confidence: result.confidence,
                });
            } catch (error) {
                console.error(`Inference failed for image ${imageId}:`, error);
            }
        }
    },
});
