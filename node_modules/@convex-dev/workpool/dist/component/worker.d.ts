export declare const runMutationWrapper: import("convex/server").RegisteredMutation<"internal", {
    logLevel: "DEBUG" | "TRACE" | "INFO" | "REPORT" | "WARN" | "ERROR";
    fnHandle: string;
    workId: import("convex/values").GenericId<"work">;
    fnType: "mutation" | "query";
    fnArgs: any;
    attempt: number;
}, Promise<void>>;
export declare const runActionWrapper: import("convex/server").RegisteredAction<"internal", {
    logLevel: "DEBUG" | "TRACE" | "INFO" | "REPORT" | "WARN" | "ERROR";
    fnHandle: string;
    workId: import("convex/values").GenericId<"work">;
    fnArgs: any;
    attempt: number;
}, Promise<void>>;
//# sourceMappingURL=worker.d.ts.map