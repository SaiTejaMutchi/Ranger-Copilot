import type { Id } from "./_generated/dataModel.js";
export declare const enqueue: import("convex/server").RegisteredMutation<"public", {
    onComplete?: {
        context?: any;
        fnHandle: string;
    } | undefined;
    retryBehavior?: {
        maxAttempts: number;
        initialBackoffMs: number;
        base: number;
    } | undefined;
    fnHandle: string;
    fnType: "action" | "mutation" | "query";
    fnName: string;
    fnArgs: any;
    runAt: number;
    config: {
        maxParallelism: number;
        logLevel: "DEBUG" | "TRACE" | "INFO" | "REPORT" | "WARN" | "ERROR";
    };
}, Promise<import("convex/values").GenericId<"work">>>;
export declare const enqueueBatch: import("convex/server").RegisteredMutation<"public", {
    config: {
        maxParallelism: number;
        logLevel: "DEBUG" | "TRACE" | "INFO" | "REPORT" | "WARN" | "ERROR";
    };
    items: {
        onComplete?: {
            context?: any;
            fnHandle: string;
        } | undefined;
        retryBehavior?: {
            maxAttempts: number;
            initialBackoffMs: number;
            base: number;
        } | undefined;
        fnHandle: string;
        fnType: "action" | "mutation" | "query";
        fnName: string;
        fnArgs: any;
        runAt: number;
    }[];
}, Promise<(string & {
    __tableName: "work";
})[]>>;
export declare const cancel: import("convex/server").RegisteredMutation<"public", {
    id: import("convex/values").GenericId<"work">;
    logLevel: "DEBUG" | "TRACE" | "INFO" | "REPORT" | "WARN" | "ERROR";
}, Promise<void>>;
export declare const cancelAll: import("convex/server").RegisteredMutation<"public", {
    before?: number | undefined;
    limit?: number | undefined;
    logLevel: "DEBUG" | "TRACE" | "INFO" | "REPORT" | "WARN" | "ERROR";
}, Promise<void>>;
export declare const status: import("convex/server").RegisteredQuery<"public", {
    id: Id<"work">;
}, Promise<{
    readonly state: "finished";
    readonly previousAttempts?: undefined;
} | {
    readonly state: "pending";
    readonly previousAttempts: number;
} | {
    readonly state: "running";
    readonly previousAttempts: number;
}>>;
export declare const statusBatch: import("convex/server").RegisteredQuery<"public", {
    ids: import("convex/values").GenericId<"work">[];
}, Promise<({
    readonly state: "finished";
    readonly previousAttempts?: undefined;
} | {
    readonly state: "pending";
    readonly previousAttempts: number;
} | {
    readonly state: "running";
    readonly previousAttempts: number;
})[]>>;
//# sourceMappingURL=lib.d.ts.map