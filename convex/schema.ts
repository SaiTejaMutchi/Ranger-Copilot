import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const schema = defineSchema({
  ...authTables,
  batches: defineTable({
    createdAt: v.number(),
    createdBy: v.string(), // userId
    name: v.string(),
    status: v.optional(v.union(v.literal("processing"), v.literal("completed"), v.literal("error"))),
    isReferenceBatch: v.optional(v.boolean()), // Strictly for LILA/Benchmark data
  }).index("by_created", ["createdAt"]),
  images: defineTable({
    batchId: v.id("batches"),
    fileName: v.string(),
    storageId: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
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
    receiptTags: v.optional(v.array(v.string())), // e.g. ["low_light", "reference_mismatch"]
    evidence: v.optional(v.object({
      model: v.string(),
      timestamp: v.number(),
    })),
    verificationStatus: v.union(
      v.literal("UNVERIFIED"),
      v.literal("VERIFIED"),
      v.literal("CORRECTED")
    ),
    correctedLabel: v.optional(v.string()), // For human correction loop
    referenceLabel: v.optional(v.string()), // "Reference Label (Demo)" for AI vs Truth testcase
    captureDate: v.optional(v.number()), // EXIF DateTimeOriginal/CreateDate (unix ms)
    location: v.optional(v.object({ lat: v.number(), lng: v.number() })), // EXIF GPS
    approvedForPatrol: v.optional(v.boolean()), // Approved for patrol notification
    patrolNotifiedAt: v.optional(v.number()), // Timestamp when notification was sent
    poachingAnalysis: v.optional(v.object({
      humans: v.optional(v.number()),
      vehicles: v.optional(v.string()),
      species: v.optional(v.string()),
      time: v.optional(v.string()),
      armsVisible: v.optional(v.string()),
      analysisParagraph: v.optional(v.string()),
    })),
  }).index("by_batch", ["batchId"]),
  verifications: defineTable({
    imageId: v.id("images"),
    predictedLabel: v.string(),
    correctedLabel: v.optional(v.string()),
    userId: v.string(),
    createdAt: v.number(),
  }).index("by_image", ["imageId"]),
  briefs: defineTable({
    batchId: v.id("batches"),
    text: v.string(),
    kpis: v.object({
      timeSavedSeconds: v.number(),
      priorityCount: v.number(),
      verificationRate: v.number(),
    }),
    audioUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_batch", ["batchId"]),
});

export default schema;