import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const generateVoiceBrief = action({
    args: {
        briefId: v.id("briefs"),
    },
    handler: async (ctx, args) => {
        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey) throw new Error("ELEVENLABS_API_KEY not set");

        const brief = await ctx.runQuery(api.briefs.getBriefById, { briefId: args.briefId });
        if (!brief) throw new Error("Brief not found");

        // Use current model (eleven_monolingual_v1 is deprecated and can return 404)
        const voiceId = process.env.ELEVENLABS_VOICE_ID || "JBFqnCBsd6RMkjVDRZzb"; // Docs example voice
        const modelId = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";

        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "xi-api-key": apiKey,
            },
            body: JSON.stringify({
                text: brief.text,
                model_id: modelId,
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.5,
                },
            }),
        });

        if (!response.ok) {
            const body = await response.text();
            let detail = body;
            try {
                const j = JSON.parse(body);
                if (j.detail?.message) detail = j.detail.message;
                else if (j.message) detail = j.message;
            } catch {
                // use body as-is
            }
            throw new Error(`ElevenLabs API failed: ${response.status} ${response.statusText}. ${detail}`);
        }

        const audioBuffer = await response.arrayBuffer();

        // In a real app, we would upload to Convex Storage.
        // For the demo, we'll return a data URI. Convex runtime has no Buffer; use btoa + chunking.
        const bytes = new Uint8Array(audioBuffer);
        let binary = "";
        const chunkSize = 8192;
        for (let i = 0; i < bytes.length; i += chunkSize) {
            binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
        }
        const base64Audio = btoa(binary);
        const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

        await ctx.runMutation(api.briefs.saveVoiceUrl, {
            briefId: args.briefId,
            audioUrl: audioUrl,
        });

        return audioUrl;
    },
});
