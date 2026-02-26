export declare const issue: import("convex/server").RegisteredMutation<"public", {
    name?: string | undefined;
}, Promise<import("convex/values").GenericId<"apiKeys">>>;
export declare const validate: import("convex/server").RegisteredQuery<"public", {
    apiKey: import("convex/values").GenericId<"apiKeys">;
}, Promise<boolean>>;
export declare const destroy: import("convex/server").RegisteredMutation<"public", {
    name?: string | undefined;
    apiKey?: import("convex/values").GenericId<"apiKeys"> | undefined;
}, Promise<"missing" | "deleted" | "name mismatch" | "must provide either apiKey or name">>;
//# sourceMappingURL=apiKeys.d.ts.map