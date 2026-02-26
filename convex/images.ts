import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";

// Force sync

export const getUploadUrls = action({
    args: {
        count: v.number(),
    },
    handler: async (ctx, args) => {
        const urls = [];
        for (let i = 0; i < args.count; i++) {
            urls.push(await ctx.storage.generateUploadUrl());
        }
        return urls;
    },
});

export const createImages = mutation({
    args: {
        batchId: v.id("batches"),
        images: v.array(
            v.object({
                fileName: v.string(),
                storageId: v.optional(v.string()),
                fileUrl: v.optional(v.string()), // For demo/caltech images
                referenceLabel: v.optional(v.string()), // Added for AI vs Truth demo
                captureDate: v.optional(v.number()), // EXIF creation date (unix ms)
                location: v.optional(v.object({ lat: v.number(), lng: v.number() })), // EXIF GPS
            })
        ),
    },
    handler: async (ctx, args) => {
        const imageIds = [];
        for (const img of args.images) {
            const id = await ctx.db.insert("images", {
                batchId: args.batchId,
                fileName: img.fileName,
                storageId: img.storageId,
                fileUrl: img.fileUrl,
                referenceLabel: img.referenceLabel,
                captureDate: img.captureDate,
                location: img.location,
                predictions: [],
                confidence: 0,
                priorityCategory: "REVIEW",
                priorityScore: 0,
                priorityReason: "Pending inference",
                verificationStatus: "UNVERIFIED",
            });
            imageIds.push(id);
        }
        return imageIds;
    },
});

export const updateImageResult = mutation({
    args: {
        imageId: v.id("images"),
        predictions: v.array(
            v.object({
                label: v.string(),
                prob: v.number(),
            })
        ),
        confidence: v.number(),
        priorityCategory: v.union(
            v.literal("URGENT"),
            v.literal("PRIORITY"),
            v.literal("REVIEW"),
            v.literal("ALL")
        ),
        priorityScore: v.number(),
        priorityReason: v.string(),
        uncertaintyFlag: v.optional(v.boolean()),
        rationale: v.optional(v.string()),
        receiptTags: v.optional(v.array(v.string())),
        evidence: v.optional(v.object({ model: v.string(), timestamp: v.number() })),
        poachingAnalysis: v.optional(v.object({
            humans: v.optional(v.number()),
            vehicles: v.optional(v.string()),
            species: v.optional(v.string()),
            time: v.optional(v.string()),
            armsVisible: v.optional(v.string()),
            analysisParagraph: v.optional(v.string()),
        })),
    },
    handler: async (ctx, args) => {
        const { imageId, ...results } = args;
        await ctx.db.patch(imageId, results);
    },
});

export const getImageById = query({
    args: { imageId: v.id("images") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.imageId);
    },
});

export const verifyImage = mutation({
    args: { imageId: v.id("images") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.imageId, {
            verificationStatus: "VERIFIED",
        });
    },
});

export const correctImageLabel = mutation({
    args: {
        imageId: v.id("images"),
        correctedLabel: v.string(),
    },
    handler: async (ctx, args) => {
        const image = await ctx.db.get(args.imageId);
        if (!image) throw new Error("Image not found");

        await ctx.db.patch(args.imageId, {
            verificationStatus: "CORRECTED",
            correctedLabel: args.correctedLabel,
        });

        // Audit/Learning Loop log
        await ctx.db.insert("verifications", {
            imageId: args.imageId,
            predictedLabel: image.predictions[0]?.label ?? "unknown",
            correctedLabel: args.correctedLabel,
            userId: "guest-ranger", // Simplify for demo
            createdAt: Date.now(),
        });
    },
});

/** Approve or unapprove an image for patrol notification (poaching priority). */
export const approveForPatrol = mutation({
    args: { imageId: v.id("images"), approved: v.boolean() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.imageId, { approvedForPatrol: args.approved });
    },
});

/** Send notifications to patrol for all approved images in batch. */
export const sendPatrolNotifications = mutation({
    args: { batchId: v.id("batches") },
    handler: async (ctx, args) => {
        const images = await ctx.db
            .query("images")
            .withIndex("by_batch", (q) => q.eq("batchId", args.batchId))
            .filter((q) => q.eq(q.field("approvedForPatrol"), true))
            .collect();
        const now = Date.now();
        for (const img of images) {
            await ctx.db.patch(img._id, { patrolNotifiedAt: now });
        }
        return { notifiedCount: images.length };
    },
});

export const exportTrainingSet = query({
    args: {},
    handler: async (ctx) => {
        // Only export findings that rangers have actually verified or corrected
        const auditedImages = await ctx.db
            .query("images")
            .filter((q) =>
                q.or(
                    q.eq(q.field("verificationStatus"), "VERIFIED"),
                    q.eq(q.field("verificationStatus"), "CORRECTED")
                )
            )
            .collect();

        return auditedImages.map((img) => ({
            imageId: img._id,
            fileName: img.fileName,
            predictedLabel: img.predictions[0]?.label ?? "unknown",
            correctedLabel: img.correctedLabel || img.predictions[0]?.label,
            rationale: img.rationale,
            verifiedAt: img._creationTime,
        }));
    },
});
