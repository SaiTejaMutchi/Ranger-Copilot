import { omit } from "convex-helpers";
import { literals } from "convex-helpers/validators";
import { defineTable, } from "convex/server";
import { v, } from "convex/values";
// We only generate embeddings for non-tool, non-system messages
const embeddings = {
    model: v.string(),
    // What table it's stored in. (usually messages or memories)
    table: v.string(),
    userId: v.optional(v.string()),
    threadId: v.optional(v.string()),
    // not set for private threads
    model_table_userId: v.optional(v.array(v.string())),
    model_table_threadId: v.optional(v.array(v.string())),
    vector: v.array(v.number()),
};
export const vEmbeddingsWithoutDenormalizedFields = v.object(omit(embeddings, ["model_table_userId", "model_table_threadId"]));
function table(dimensions) {
    return defineTable(embeddings)
        .vectorIndex("vector", {
        vectorField: "vector",
        dimensions,
        filterFields: ["model_table_userId", "model_table_threadId"],
    })
        .index("model_table_threadId", ["model", "table", "threadId"]);
}
export const VectorDimensions = [
    128, 256, 512, 768, 1024, 1408, 1536, 2048, 3072, 4096,
];
export function validateVectorDimension(dimension) {
    if (!VectorDimensions.includes(dimension)) {
        throw new Error(`Unsupported vector dimension${dimension}. Supported: ${VectorDimensions.join(", ")}`);
    }
}
export const VectorTableNames = VectorDimensions.map((d) => `embeddings_${d}`);
export const vVectorDimension = literals(...VectorDimensions);
export const vVectorTableName = literals(...VectorTableNames);
export const vVectorId = v.union(...VectorTableNames.map((name) => v.id(name)));
export function getVectorTableName(dimension) {
    return `embeddings_${dimension}`;
}
export function getVectorIdInfo(ctx, id) {
    for (const dimension of VectorDimensions) {
        const tableName = getVectorTableName(dimension);
        if (ctx.db.normalizeId(tableName, id)) {
            return { tableName, dimension };
        }
    }
    throw new Error(`Unknown vector table id: ${id}`);
}
const tables = Object.fromEntries(VectorDimensions.map((dimensions) => [
    `embeddings_${dimensions}`,
    table(dimensions),
]));
export default tables;
//# sourceMappingURL=tables.js.map