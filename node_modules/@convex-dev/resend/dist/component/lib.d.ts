import { type Id } from "./_generated/dataModel.js";
export declare const sendEmail: import("convex/server").RegisteredMutation<"public", {
    headers?: {
        name: string;
        value: string;
    }[] | undefined;
    replyTo?: string[] | undefined;
    html?: string | undefined;
    text?: string | undefined;
    from: string;
    to: string;
    subject: string;
    options: {
        onEmailEvent?: {
            fnHandle: string;
        } | undefined;
        initialBackoffMs: number;
        retryAttempts: number;
        apiKey: string;
        testMode: boolean;
    };
}, Promise<import("convex/values").GenericId<"emails">>>;
export declare const createManualEmail: import("convex/server").RegisteredMutation<"public", {
    headers?: {
        name: string;
        value: string;
    }[] | undefined;
    replyTo?: string[] | undefined;
    from: string;
    to: string;
    subject: string;
}, Promise<import("convex/values").GenericId<"emails">>>;
export declare const updateManualEmail: import("convex/server").RegisteredMutation<"public", {
    errorMessage?: string | undefined;
    resendId?: string | undefined;
    status: "waiting" | "queued" | "cancelled" | "sent" | "delivered" | "delivery_delayed" | "bounced" | "failed";
    emailId: import("convex/values").GenericId<"emails">;
}, Promise<void>>;
export declare const cancelEmail: import("convex/server").RegisteredMutation<"public", {
    emailId: import("convex/values").GenericId<"emails">;
}, Promise<void>>;
export declare const getStatus: import("convex/server").RegisteredQuery<"public", {
    emailId: import("convex/values").GenericId<"emails">;
}, Promise<{
    status: "waiting" | "queued" | "cancelled" | "sent" | "delivered" | "delivery_delayed" | "bounced" | "failed";
    errorMessage: string | null;
    complained: boolean;
    opened: boolean;
} | null>>;
export declare const get: import("convex/server").RegisteredQuery<"public", {
    emailId: import("convex/values").GenericId<"emails">;
}, Promise<{
    createdAt: number;
    html: string | undefined;
    text: string | undefined;
    headers?: {
        name: string;
        value: string;
    }[] | undefined;
    errorMessage?: string | undefined;
    resendId?: string | undefined;
    from: string;
    to: string;
    subject: string;
    status: "waiting" | "queued" | "cancelled" | "sent" | "delivered" | "delivery_delayed" | "bounced" | "failed";
    replyTo: string[];
    complained: boolean;
    opened: boolean;
    segment: number;
    finalizedAt: number;
} | null>>;
export declare const makeBatch: import("convex/server").RegisteredMutation<"internal", {
    segment: number;
    reloop: boolean;
}, Promise<void>>;
export declare const callResendAPIWithBatch: import("convex/server").RegisteredAction<"internal", {
    apiKey: string;
    emails: import("convex/values").GenericId<"emails">[];
}, Promise<{
    emailIds: Id<"emails">[];
    resendIds: any;
} | undefined>>;
export declare const markEmailsFailed: import("convex/server").RegisteredMutation<"internal", {
    emailIds: Id<"emails">[];
    errorMessage: string;
}, Promise<void>>;
export declare const onEmailComplete: import("convex/server").RegisteredMutation<"internal", import("@convex-dev/workpool").OnCompleteArgs, null>;
export declare const getAllContentByIds: import("convex/server").RegisteredQuery<"internal", {
    contentIds: import("convex/values").GenericId<"content">[];
}, Promise<{
    id: import("convex/values").GenericId<"content">;
    content: string;
}[]>>;
export declare const getEmailsByIds: import("convex/server").RegisteredQuery<"internal", {
    emailIds: import("convex/values").GenericId<"emails">[];
}, Promise<{
    _id: import("convex/values").GenericId<"emails">;
    _creationTime: number;
    headers?: {
        name: string;
        value: string;
    }[] | undefined;
    html?: import("convex/values").GenericId<"content"> | undefined;
    text?: import("convex/values").GenericId<"content"> | undefined;
    errorMessage?: string | undefined;
    resendId?: string | undefined;
    from: string;
    to: string;
    subject: string;
    status: "waiting" | "queued" | "cancelled" | "sent" | "delivered" | "delivery_delayed" | "bounced" | "failed";
    replyTo: string[];
    complained: boolean;
    opened: boolean;
    segment: number;
    finalizedAt: number;
}[]>>;
export declare const getEmailByResendId: import("convex/server").RegisteredQuery<"internal", {
    resendId: string;
}, Promise<{
    _id: import("convex/values").GenericId<"emails">;
    _creationTime: number;
    headers?: {
        name: string;
        value: string;
    }[] | undefined;
    html?: import("convex/values").GenericId<"content"> | undefined;
    text?: import("convex/values").GenericId<"content"> | undefined;
    errorMessage?: string | undefined;
    resendId?: string | undefined;
    from: string;
    to: string;
    subject: string;
    status: "waiting" | "queued" | "cancelled" | "sent" | "delivered" | "delivery_delayed" | "bounced" | "failed";
    replyTo: string[];
    complained: boolean;
    opened: boolean;
    segment: number;
    finalizedAt: number;
}>>;
export declare const handleEmailEvent: import("convex/server").RegisteredMutation<"public", {
    event: any;
}, Promise<void>>;
export declare const cleanupOldEmails: import("convex/server").RegisteredMutation<"public", {
    olderThan?: number | undefined;
}, Promise<void>>;
export declare const cleanupAbandonedEmails: import("convex/server").RegisteredMutation<"public", {
    olderThan?: number | undefined;
}, Promise<void>>;
//# sourceMappingURL=lib.d.ts.map