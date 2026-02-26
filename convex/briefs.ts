import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generateBrief = mutation({
    args: {
        batchId: v.id("batches"),
    },
    handler: async (ctx, args) => {
        const images = await ctx.db
            .query("images")
            .withIndex("by_batch", (q) => q.eq("batchId", args.batchId))
            .collect();

        const priorityImages = images.filter(img => img.priorityCategory === "URGENT" || img.priorityCategory === "PRIORITY");
        const imagesWithMeta = images.filter(img => img.captureDate ?? img.location);

        // Helper to format capture date
        const fmtDate = (ts: number) => new Date(ts).toISOString().replace("T", " ").slice(0, 19);
        // Helper to format location
        const fmtLoc = (loc: { lat: number; lng: number }) => `${loc.lat.toFixed(5)}°, ${loc.lng.toFixed(5)}°`;
        // Escape HTML for safe injection
        const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

        // Calculate KPIs
        const timeSavedSeconds = images.length * 20; // Assume 20s manual review per image saved
        const priorityCount = priorityImages.length;
        const verificationRate = (images.filter(img => img.verificationStatus !== "UNVERIFIED").length / images.length) * 100;

        // Structured Brief Generation
        let text = `Ranger Intelligence Report - Batch ${args.batchId.slice(-4)}\n\n`;

        // Capture metadata summary (EXIF date & location)
        if (imagesWithMeta.length > 0) {
            const withDate = images.filter(img => img.captureDate);
            const withLoc = images.filter(img => img.location);
            text += "FIELD INTELLIGENCE (EXIF Metadata)\n";
            if (withDate.length > 0) {
                const dates = withDate.map(img => img.captureDate!);
                const minD = new Date(Math.min(...dates));
                const maxD = new Date(Math.max(...dates));
                text += `Capture Window: ${fmtDate(minD.getTime())} — ${fmtDate(maxD.getTime())} (${withDate.length} images with timestamp)\n`;
            }
            if (withLoc.length > 0) {
                const coords = withLoc.map(img => img.location!);
                const lats = coords.map(c => c.lat);
                const lngs = coords.map(c => c.lng);
                const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
                const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
                text += `Geographic Spread: ${withLoc.length} images with GPS. Approx center: ${fmtLoc({ lat: centerLat, lng: centerLng })}\n`;
            }
            text += "\n";
        }

        const summaryStyle = "background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.35);border-radius:0.5rem;padding:0.75rem 1rem;margin:0.5rem 0;";
        if (priorityCount > 0) {
            let block = `SURVEILLANCE SUMMARY: We have identified ${priorityCount} high-priority sightings in this batch.\n\n`;
            priorityImages.forEach(img => {
                const label = esc(img.correctedLabel || img.predictions[0]?.label || "unknown");
                let meta = "";
                if (img.captureDate) meta += ` Captured ${fmtDate(img.captureDate)}.`;
                if (img.location) meta += ` GPS: ${fmtLoc(img.location)}.`;
                block += `[#${img._id.slice(-4)} - ${img.priorityCategory}] Detected ${label}.${meta} Vision Rationale: ${esc(img.rationale ?? "")}\n`;
            });
            text += `<div class="surveillance-summary-block" style="${summaryStyle}">${block.replace(/\n/g, "<br/>")}</div>`;
        } else {
            text += `<div class="surveillance-summary-block" style="${summaryStyle}">SURVEILLANCE SUMMARY: No high-priority wildlife threats detected in this cycle.</div>`;
        }

        const briefId = await ctx.db.insert("briefs", {
            batchId: args.batchId,
            text,
            kpis: {
                timeSavedSeconds,
                priorityCount,
                verificationRate: isNaN(verificationRate) ? 0 : parseFloat(verificationRate.toFixed(1)),
            },
            createdAt: Date.now(),
        });

        return briefId;
    },
});

export const getBrief = query({
    args: {
        batchId: v.id("batches"),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("briefs")
            .withIndex("by_batch", (q) => q.eq("batchId", args.batchId))
            .unique();
    },
});

export const getBriefById = query({
    args: {
        briefId: v.id("briefs"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.briefId);
    },
});

/** Summary of all review queue images across completed batches with briefs. */
export const getReviewQueueBriefsSummary = query({
    args: {},
    handler: async (ctx) => {
        const batches = await ctx.db
            .query("batches")
            .withIndex("by_created", (q) => q.gte("createdAt", 0))
            .order("desc")
            .take(50);
        const completedBatches = batches.filter((b) => b.status === "completed");

        const items: Array<{
            batchId: string;
            batchName: string;
            batchCreatedAt: number;
            briefText: string;
            kpis: { timeSavedSeconds: number; priorityCount: number; verificationRate: number };
            urgentCount: number;
            priorityCount: number;
            reviewCount: number;
            totalImages: number;
        }> = [];

        for (const batch of completedBatches) {
            const brief = await ctx.db
                .query("briefs")
                .withIndex("by_batch", (q) => q.eq("batchId", batch._id))
                .unique();
            const images = await ctx.db
                .query("images")
                .withIndex("by_batch", (q) => q.eq("batchId", batch._id))
                .collect();

            const urgentCount = images.filter((i) => i.priorityCategory === "URGENT").length;
            const priorityCount = images.filter((i) => i.priorityCategory === "PRIORITY").length;
            const reviewCount = images.filter((i) => i.priorityCategory === "REVIEW").length;

            items.push({
                batchId: batch._id,
                batchName: batch.name,
                batchCreatedAt: batch.createdAt,
                briefText: brief?.text ?? "No brief generated yet. Generate from results page.",
                kpis: brief?.kpis ?? { timeSavedSeconds: 0, priorityCount: 0, verificationRate: 0 },
                urgentCount,
                priorityCount,
                reviewCount,
                totalImages: images.length,
            });
        }

        const totals = items.reduce(
            (acc, i) => ({
                totalImages: acc.totalImages + i.totalImages,
                urgentCount: acc.urgentCount + i.urgentCount,
                priorityCount: acc.priorityCount + i.priorityCount,
                reviewCount: acc.reviewCount + i.reviewCount,
            }),
            { totalImages: 0, urgentCount: 0, priorityCount: 0, reviewCount: 0 }
        );

        return { items, totals };
    },
});

export const saveVoiceUrl = mutation({
    args: {
        briefId: v.id("briefs"),
        audioUrl: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.briefId, {
            audioUrl: args.audioUrl,
        });
    },
});
