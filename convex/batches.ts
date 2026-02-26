import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createBatch = mutation({
    args: {
        name: v.optional(v.string()),
        isReferenceBatch: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const userId = (await getAuthUserId(ctx)) ?? "guest-ranger";

        const batchId = await ctx.db.insert("batches", {
            name: args.name ?? "New Batch",
            createdBy: userId,
            createdAt: Date.now(),
            status: "processing",
            isReferenceBatch: args.isReferenceBatch ?? false,
        });
        return batchId;
    },
});

export const setStatus = mutation({
    args: {
        batchId: v.id("batches"),
        status: v.union(v.literal("processing"), v.literal("completed"), v.literal("error")),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.batchId, { status: args.status });
    },
});

export const listBatches = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const batches = await ctx.db
            .query("batches")
            .withIndex("by_created", (q) => q.gte("createdAt", 0))
            .order("desc")
            .take(args.limit ?? 50);
        return batches;
    },
});

export const getBatchById = query({
    args: { batchId: v.id("batches") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.batchId);
    },
});

/** Deletes all triaged data: verifications, images, briefs, batches. Use for reset. */
export const clearAllTriagedData = mutation({
    args: {},
    handler: async (ctx) => {
        const verifications = await ctx.db.query("verifications").collect();
        for (const v of verifications) await ctx.db.delete(v._id);
        const images = await ctx.db.query("images").collect();
        for (const img of images) await ctx.db.delete(img._id);
        const briefs = await ctx.db.query("briefs").collect();
        for (const b of briefs) await ctx.db.delete(b._id);
        const batches = await ctx.db.query("batches").collect();
        for (const b of batches) await ctx.db.delete(b._id);
        return { deleted: { verifications: verifications.length, images: images.length, briefs: briefs.length, batches: batches.length } };
    },
});

/** All batches with images for Threat Database page. */
export const getThreatDatabase = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const batches = await ctx.db
            .query("batches")
            .withIndex("by_created", (q) => q.gte("createdAt", 0))
            .order("desc")
            .take(args.limit ?? 100);

        const result = [];
        for (const batch of batches) {
            const images = await ctx.db
                .query("images")
                .withIndex("by_batch", (q) => q.eq("batchId", batch._id))
                .collect();
            const imagesWithUrls = await Promise.all(
                images.map(async (img) => {
                    if (img.storageId && !img.fileUrl) {
                        const url = await ctx.storage.getUrl(img.storageId as any);
                        return { ...img, fileUrl: url ?? undefined };
                    }
                    return img;
                })
            );
            result.push({ batch, images: imagesWithUrls });
        }
        return result;
    },
});

export const getBatchResults = query({
    args: { batchId: v.id("batches") },
    handler: async (ctx, args) => {
        const images = await ctx.db
            .query("images")
            .withIndex("by_batch", (q) => q.eq("batchId", args.batchId))
            .collect();

        // Resolve storageId → public URL so both uploaded and Caltech images show previews
        const imagesWithUrls = await Promise.all(
            images.map(async (img) => {
                if (img.storageId && !img.fileUrl) {
                    const url = await ctx.storage.getUrl(img.storageId as any);
                    return { ...img, fileUrl: url ?? undefined };
                }
                return img;
            })
        );

        // Sort by priorityScore desc, then confidence desc
        return imagesWithUrls.sort((a, b) => {
            if (b.priorityScore !== a.priorityScore) {
                return b.priorityScore - a.priorityScore;
            }
            return b.confidence - a.confidence;
        });
    },
});
