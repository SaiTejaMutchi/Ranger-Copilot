import { type GenericDataModel, type GenericMutationCtx, type GenericQueryCtx } from "convex/server";
import { type Infer } from "convex/values";
export declare const onEmailEvent: import("convex/values").VObject<{
    fnHandle: string;
}, {
    fnHandle: import("convex/values").VString<string, "required">;
}, "required", "fnHandle">;
export declare const vStatus: import("convex/values").VUnion<"waiting" | "queued" | "cancelled" | "sent" | "delivered" | "delivery_delayed" | "bounced" | "failed", [import("convex/values").VLiteral<"waiting", "required">, import("convex/values").VLiteral<"queued", "required">, import("convex/values").VLiteral<"cancelled", "required">, import("convex/values").VLiteral<"sent", "required">, import("convex/values").VLiteral<"delivered", "required">, import("convex/values").VLiteral<"delivery_delayed", "required">, import("convex/values").VLiteral<"bounced", "required">, import("convex/values").VLiteral<"failed", "required">], "required", never>;
export type Status = Infer<typeof vStatus>;
export declare const vOptions: import("convex/values").VObject<{
    onEmailEvent?: {
        fnHandle: string;
    } | undefined;
    initialBackoffMs: number;
    retryAttempts: number;
    apiKey: string;
    testMode: boolean;
}, {
    initialBackoffMs: import("convex/values").VFloat64<number, "required">;
    retryAttempts: import("convex/values").VFloat64<number, "required">;
    apiKey: import("convex/values").VString<string, "required">;
    testMode: import("convex/values").VBoolean<boolean, "required">;
    onEmailEvent: import("convex/values").VObject<{
        fnHandle: string;
    } | undefined, {
        fnHandle: import("convex/values").VString<string, "required">;
    }, "optional", "fnHandle">;
}, "required", "initialBackoffMs" | "retryAttempts" | "apiKey" | "testMode" | "onEmailEvent" | "onEmailEvent.fnHandle">;
export type RuntimeConfig = Infer<typeof vOptions>;
export declare const vEmailEvent: import("convex/values").VUnion<{
    type: "email.sent";
    created_at: string;
    data: {
        broadcast_id?: string | undefined;
        cc?: string | string[] | undefined;
        bcc?: string | string[] | undefined;
        reply_to?: string | string[] | undefined;
        headers?: {
            name: string;
            value: string;
        }[] | undefined;
        tags?: Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined;
        created_at: string;
        email_id: string;
        from: string | string[];
        to: string | string[];
        subject: string;
    };
} | {
    type: "email.delivered";
    created_at: string;
    data: {
        broadcast_id?: string | undefined;
        cc?: string | string[] | undefined;
        bcc?: string | string[] | undefined;
        reply_to?: string | string[] | undefined;
        headers?: {
            name: string;
            value: string;
        }[] | undefined;
        tags?: Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined;
        created_at: string;
        email_id: string;
        from: string | string[];
        to: string | string[];
        subject: string;
    };
} | {
    type: "email.delivery_delayed";
    created_at: string;
    data: {
        broadcast_id?: string | undefined;
        cc?: string | string[] | undefined;
        bcc?: string | string[] | undefined;
        reply_to?: string | string[] | undefined;
        headers?: {
            name: string;
            value: string;
        }[] | undefined;
        tags?: Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined;
        created_at: string;
        email_id: string;
        from: string | string[];
        to: string | string[];
        subject: string;
    };
} | {
    type: "email.complained";
    created_at: string;
    data: {
        broadcast_id?: string | undefined;
        cc?: string | string[] | undefined;
        bcc?: string | string[] | undefined;
        reply_to?: string | string[] | undefined;
        headers?: {
            name: string;
            value: string;
        }[] | undefined;
        tags?: Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined;
        created_at: string;
        email_id: string;
        from: string | string[];
        to: string | string[];
        subject: string;
    };
} | {
    type: "email.bounced";
    created_at: string;
    data: {
        broadcast_id?: string | undefined;
        cc?: string | string[] | undefined;
        bcc?: string | string[] | undefined;
        reply_to?: string | string[] | undefined;
        headers?: {
            name: string;
            value: string;
        }[] | undefined;
        tags?: Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined;
        created_at: string;
        email_id: string;
        from: string | string[];
        to: string | string[];
        subject: string;
        bounce: {
            type: string;
            message: string;
            subType: string;
        };
    };
} | {
    type: "email.opened";
    created_at: string;
    data: {
        broadcast_id?: string | undefined;
        cc?: string | string[] | undefined;
        bcc?: string | string[] | undefined;
        reply_to?: string | string[] | undefined;
        headers?: {
            name: string;
            value: string;
        }[] | undefined;
        tags?: Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined;
        created_at: string;
        email_id: string;
        from: string | string[];
        to: string | string[];
        subject: string;
        open: {
            ipAddress: string;
            timestamp: string;
            userAgent: string;
        };
    };
} | {
    type: "email.clicked";
    created_at: string;
    data: {
        broadcast_id?: string | undefined;
        cc?: string | string[] | undefined;
        bcc?: string | string[] | undefined;
        reply_to?: string | string[] | undefined;
        headers?: {
            name: string;
            value: string;
        }[] | undefined;
        tags?: Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined;
        created_at: string;
        email_id: string;
        from: string | string[];
        to: string | string[];
        subject: string;
        click: {
            ipAddress: string;
            timestamp: string;
            userAgent: string;
            link: string;
        };
    };
} | {
    type: "email.failed";
    created_at: string;
    data: {
        broadcast_id?: string | undefined;
        cc?: string | string[] | undefined;
        bcc?: string | string[] | undefined;
        reply_to?: string | string[] | undefined;
        headers?: {
            name: string;
            value: string;
        }[] | undefined;
        tags?: Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined;
        failed: {
            reason: string;
        };
        created_at: string;
        email_id: string;
        from: string | string[];
        to: string | string[];
        subject: string;
    };
}, [import("convex/values").VObject<{
    type: "email.sent";
    created_at: string;
    data: {
        broadcast_id?: string | undefined;
        cc?: string | string[] | undefined;
        bcc?: string | string[] | undefined;
        reply_to?: string | string[] | undefined;
        headers?: {
            name: string;
            value: string;
        }[] | undefined;
        tags?: Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined;
        created_at: string;
        email_id: string;
        from: string | string[];
        to: string | string[];
        subject: string;
    };
}, {
    type: import("convex/values").VLiteral<"email.sent", "required">;
    created_at: import("convex/values").VString<string, "required">;
    data: import("convex/values").VObject<{
        broadcast_id?: string | undefined;
        cc?: string | string[] | undefined;
        bcc?: string | string[] | undefined;
        reply_to?: string | string[] | undefined;
        headers?: {
            name: string;
            value: string;
        }[] | undefined;
        tags?: Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined;
        created_at: string;
        email_id: string;
        from: string | string[];
        to: string | string[];
        subject: string;
    }, {
        broadcast_id: import("convex/values").VString<string | undefined, "optional">;
        created_at: import("convex/values").VString<string, "required">;
        email_id: import("convex/values").VString<string, "required">;
        from: import("convex/values").VUnion<string | string[], [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "required", never>;
        to: import("convex/values").VUnion<string | string[], [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "required", never>;
        cc: import("convex/values").VUnion<string | string[] | undefined, [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "optional", never>;
        bcc: import("convex/values").VUnion<string | string[] | undefined, [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "optional", never>;
        reply_to: import("convex/values").VUnion<string | string[] | undefined, [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "optional", never>;
        headers: import("convex/values").VArray<{
            name: string;
            value: string;
        }[] | undefined, import("convex/values").VObject<{
            name: string;
            value: string;
        }, {
            name: import("convex/values").VString<string, "required">;
            value: import("convex/values").VString<string, "required">;
        }, "required", "name" | "value">, "optional">;
        subject: import("convex/values").VString<string, "required">;
        tags: import("convex/values").VUnion<Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined, [import("convex/values").VRecord<Record<string, string>, import("convex/values").VString<string, "required">, import("convex/values").VString<string, "required">, "required", string>, import("convex/values").VArray<{
            name: string;
            value: string;
        }[], import("convex/values").VObject<{
            name: string;
            value: string;
        }, {
            name: import("convex/values").VString<string, "required">;
            value: import("convex/values").VString<string, "required">;
        }, "required", "name" | "value">, "required">], "optional", string>;
    }, "required", "created_at" | "broadcast_id" | "email_id" | "from" | "to" | "cc" | "bcc" | "reply_to" | "headers" | "subject" | "tags" | `tags.${string}`>;
}, "required", "type" | "created_at" | "data" | "data.created_at" | "data.broadcast_id" | "data.email_id" | "data.from" | "data.to" | "data.cc" | "data.bcc" | "data.reply_to" | "data.headers" | "data.subject" | "data.tags" | `data.tags.${string}`>, import("convex/values").VObject<{
    type: "email.delivered";
    created_at: string;
    data: {
        broadcast_id?: string | undefined;
        cc?: string | string[] | undefined;
        bcc?: string | string[] | undefined;
        reply_to?: string | string[] | undefined;
        headers?: {
            name: string;
            value: string;
        }[] | undefined;
        tags?: Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined;
        created_at: string;
        email_id: string;
        from: string | string[];
        to: string | string[];
        subject: string;
    };
}, {
    type: import("convex/values").VLiteral<"email.delivered", "required">;
    created_at: import("convex/values").VString<string, "required">;
    data: import("convex/values").VObject<{
        broadcast_id?: string | undefined;
        cc?: string | string[] | undefined;
        bcc?: string | string[] | undefined;
        reply_to?: string | string[] | undefined;
        headers?: {
            name: string;
            value: string;
        }[] | undefined;
        tags?: Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined;
        created_at: string;
        email_id: string;
        from: string | string[];
        to: string | string[];
        subject: string;
    }, {
        broadcast_id: import("convex/values").VString<string | undefined, "optional">;
        created_at: import("convex/values").VString<string, "required">;
        email_id: import("convex/values").VString<string, "required">;
        from: import("convex/values").VUnion<string | string[], [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "required", never>;
        to: import("convex/values").VUnion<string | string[], [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "required", never>;
        cc: import("convex/values").VUnion<string | string[] | undefined, [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "optional", never>;
        bcc: import("convex/values").VUnion<string | string[] | undefined, [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "optional", never>;
        reply_to: import("convex/values").VUnion<string | string[] | undefined, [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "optional", never>;
        headers: import("convex/values").VArray<{
            name: string;
            value: string;
        }[] | undefined, import("convex/values").VObject<{
            name: string;
            value: string;
        }, {
            name: import("convex/values").VString<string, "required">;
            value: import("convex/values").VString<string, "required">;
        }, "required", "name" | "value">, "optional">;
        subject: import("convex/values").VString<string, "required">;
        tags: import("convex/values").VUnion<Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined, [import("convex/values").VRecord<Record<string, string>, import("convex/values").VString<string, "required">, import("convex/values").VString<string, "required">, "required", string>, import("convex/values").VArray<{
            name: string;
            value: string;
        }[], import("convex/values").VObject<{
            name: string;
            value: string;
        }, {
            name: import("convex/values").VString<string, "required">;
            value: import("convex/values").VString<string, "required">;
        }, "required", "name" | "value">, "required">], "optional", string>;
    }, "required", "created_at" | "broadcast_id" | "email_id" | "from" | "to" | "cc" | "bcc" | "reply_to" | "headers" | "subject" | "tags" | `tags.${string}`>;
}, "required", "type" | "created_at" | "data" | "data.created_at" | "data.broadcast_id" | "data.email_id" | "data.from" | "data.to" | "data.cc" | "data.bcc" | "data.reply_to" | "data.headers" | "data.subject" | "data.tags" | `data.tags.${string}`>, import("convex/values").VObject<{
    type: "email.delivery_delayed";
    created_at: string;
    data: {
        broadcast_id?: string | undefined;
        cc?: string | string[] | undefined;
        bcc?: string | string[] | undefined;
        reply_to?: string | string[] | undefined;
        headers?: {
            name: string;
            value: string;
        }[] | undefined;
        tags?: Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined;
        created_at: string;
        email_id: string;
        from: string | string[];
        to: string | string[];
        subject: string;
    };
}, {
    type: import("convex/values").VLiteral<"email.delivery_delayed", "required">;
    created_at: import("convex/values").VString<string, "required">;
    data: import("convex/values").VObject<{
        broadcast_id?: string | undefined;
        cc?: string | string[] | undefined;
        bcc?: string | string[] | undefined;
        reply_to?: string | string[] | undefined;
        headers?: {
            name: string;
            value: string;
        }[] | undefined;
        tags?: Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined;
        created_at: string;
        email_id: string;
        from: string | string[];
        to: string | string[];
        subject: string;
    }, {
        broadcast_id: import("convex/values").VString<string | undefined, "optional">;
        created_at: import("convex/values").VString<string, "required">;
        email_id: import("convex/values").VString<string, "required">;
        from: import("convex/values").VUnion<string | string[], [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "required", never>;
        to: import("convex/values").VUnion<string | string[], [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "required", never>;
        cc: import("convex/values").VUnion<string | string[] | undefined, [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "optional", never>;
        bcc: import("convex/values").VUnion<string | string[] | undefined, [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "optional", never>;
        reply_to: import("convex/values").VUnion<string | string[] | undefined, [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "optional", never>;
        headers: import("convex/values").VArray<{
            name: string;
            value: string;
        }[] | undefined, import("convex/values").VObject<{
            name: string;
            value: string;
        }, {
            name: import("convex/values").VString<string, "required">;
            value: import("convex/values").VString<string, "required">;
        }, "required", "name" | "value">, "optional">;
        subject: import("convex/values").VString<string, "required">;
        tags: import("convex/values").VUnion<Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined, [import("convex/values").VRecord<Record<string, string>, import("convex/values").VString<string, "required">, import("convex/values").VString<string, "required">, "required", string>, import("convex/values").VArray<{
            name: string;
            value: string;
        }[], import("convex/values").VObject<{
            name: string;
            value: string;
        }, {
            name: import("convex/values").VString<string, "required">;
            value: import("convex/values").VString<string, "required">;
        }, "required", "name" | "value">, "required">], "optional", string>;
    }, "required", "created_at" | "broadcast_id" | "email_id" | "from" | "to" | "cc" | "bcc" | "reply_to" | "headers" | "subject" | "tags" | `tags.${string}`>;
}, "required", "type" | "created_at" | "data" | "data.created_at" | "data.broadcast_id" | "data.email_id" | "data.from" | "data.to" | "data.cc" | "data.bcc" | "data.reply_to" | "data.headers" | "data.subject" | "data.tags" | `data.tags.${string}`>, import("convex/values").VObject<{
    type: "email.complained";
    created_at: string;
    data: {
        broadcast_id?: string | undefined;
        cc?: string | string[] | undefined;
        bcc?: string | string[] | undefined;
        reply_to?: string | string[] | undefined;
        headers?: {
            name: string;
            value: string;
        }[] | undefined;
        tags?: Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined;
        created_at: string;
        email_id: string;
        from: string | string[];
        to: string | string[];
        subject: string;
    };
}, {
    type: import("convex/values").VLiteral<"email.complained", "required">;
    created_at: import("convex/values").VString<string, "required">;
    data: import("convex/values").VObject<{
        broadcast_id?: string | undefined;
        cc?: string | string[] | undefined;
        bcc?: string | string[] | undefined;
        reply_to?: string | string[] | undefined;
        headers?: {
            name: string;
            value: string;
        }[] | undefined;
        tags?: Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined;
        created_at: string;
        email_id: string;
        from: string | string[];
        to: string | string[];
        subject: string;
    }, {
        broadcast_id: import("convex/values").VString<string | undefined, "optional">;
        created_at: import("convex/values").VString<string, "required">;
        email_id: import("convex/values").VString<string, "required">;
        from: import("convex/values").VUnion<string | string[], [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "required", never>;
        to: import("convex/values").VUnion<string | string[], [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "required", never>;
        cc: import("convex/values").VUnion<string | string[] | undefined, [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "optional", never>;
        bcc: import("convex/values").VUnion<string | string[] | undefined, [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "optional", never>;
        reply_to: import("convex/values").VUnion<string | string[] | undefined, [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "optional", never>;
        headers: import("convex/values").VArray<{
            name: string;
            value: string;
        }[] | undefined, import("convex/values").VObject<{
            name: string;
            value: string;
        }, {
            name: import("convex/values").VString<string, "required">;
            value: import("convex/values").VString<string, "required">;
        }, "required", "name" | "value">, "optional">;
        subject: import("convex/values").VString<string, "required">;
        tags: import("convex/values").VUnion<Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined, [import("convex/values").VRecord<Record<string, string>, import("convex/values").VString<string, "required">, import("convex/values").VString<string, "required">, "required", string>, import("convex/values").VArray<{
            name: string;
            value: string;
        }[], import("convex/values").VObject<{
            name: string;
            value: string;
        }, {
            name: import("convex/values").VString<string, "required">;
            value: import("convex/values").VString<string, "required">;
        }, "required", "name" | "value">, "required">], "optional", string>;
    }, "required", "created_at" | "broadcast_id" | "email_id" | "from" | "to" | "cc" | "bcc" | "reply_to" | "headers" | "subject" | "tags" | `tags.${string}`>;
}, "required", "type" | "created_at" | "data" | "data.created_at" | "data.broadcast_id" | "data.email_id" | "data.from" | "data.to" | "data.cc" | "data.bcc" | "data.reply_to" | "data.headers" | "data.subject" | "data.tags" | `data.tags.${string}`>, import("convex/values").VObject<{
    type: "email.bounced";
    created_at: string;
    data: {
        broadcast_id?: string | undefined;
        cc?: string | string[] | undefined;
        bcc?: string | string[] | undefined;
        reply_to?: string | string[] | undefined;
        headers?: {
            name: string;
            value: string;
        }[] | undefined;
        tags?: Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined;
        created_at: string;
        email_id: string;
        from: string | string[];
        to: string | string[];
        subject: string;
        bounce: {
            type: string;
            message: string;
            subType: string;
        };
    };
}, {
    type: import("convex/values").VLiteral<"email.bounced", "required">;
    created_at: import("convex/values").VString<string, "required">;
    data: import("convex/values").VObject<{
        broadcast_id?: string | undefined;
        cc?: string | string[] | undefined;
        bcc?: string | string[] | undefined;
        reply_to?: string | string[] | undefined;
        headers?: {
            name: string;
            value: string;
        }[] | undefined;
        tags?: Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined;
        created_at: string;
        email_id: string;
        from: string | string[];
        to: string | string[];
        subject: string;
        bounce: {
            type: string;
            message: string;
            subType: string;
        };
    }, {
        bounce: import("convex/values").VObject<{
            type: string;
            message: string;
            subType: string;
        }, {
            message: import("convex/values").VString<string, "required">;
            subType: import("convex/values").VString<string, "required">;
            type: import("convex/values").VString<string, "required">;
        }, "required", "type" | "message" | "subType">;
        broadcast_id: import("convex/values").VString<string | undefined, "optional">;
        created_at: import("convex/values").VString<string, "required">;
        email_id: import("convex/values").VString<string, "required">;
        from: import("convex/values").VUnion<string | string[], [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "required", never>;
        to: import("convex/values").VUnion<string | string[], [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "required", never>;
        cc: import("convex/values").VUnion<string | string[] | undefined, [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "optional", never>;
        bcc: import("convex/values").VUnion<string | string[] | undefined, [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "optional", never>;
        reply_to: import("convex/values").VUnion<string | string[] | undefined, [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "optional", never>;
        headers: import("convex/values").VArray<{
            name: string;
            value: string;
        }[] | undefined, import("convex/values").VObject<{
            name: string;
            value: string;
        }, {
            name: import("convex/values").VString<string, "required">;
            value: import("convex/values").VString<string, "required">;
        }, "required", "name" | "value">, "optional">;
        subject: import("convex/values").VString<string, "required">;
        tags: import("convex/values").VUnion<Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined, [import("convex/values").VRecord<Record<string, string>, import("convex/values").VString<string, "required">, import("convex/values").VString<string, "required">, "required", string>, import("convex/values").VArray<{
            name: string;
            value: string;
        }[], import("convex/values").VObject<{
            name: string;
            value: string;
        }, {
            name: import("convex/values").VString<string, "required">;
            value: import("convex/values").VString<string, "required">;
        }, "required", "name" | "value">, "required">], "optional", string>;
    }, "required", "created_at" | "broadcast_id" | "email_id" | "from" | "to" | "cc" | "bcc" | "reply_to" | "headers" | "subject" | "tags" | `tags.${string}` | "bounce" | "bounce.type" | "bounce.message" | "bounce.subType">;
}, "required", "type" | "created_at" | "data" | "data.created_at" | "data.broadcast_id" | "data.email_id" | "data.from" | "data.to" | "data.cc" | "data.bcc" | "data.reply_to" | "data.headers" | "data.subject" | "data.tags" | `data.tags.${string}` | "data.bounce" | "data.bounce.type" | "data.bounce.message" | "data.bounce.subType">, import("convex/values").VObject<{
    type: "email.opened";
    created_at: string;
    data: {
        broadcast_id?: string | undefined;
        cc?: string | string[] | undefined;
        bcc?: string | string[] | undefined;
        reply_to?: string | string[] | undefined;
        headers?: {
            name: string;
            value: string;
        }[] | undefined;
        tags?: Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined;
        created_at: string;
        email_id: string;
        from: string | string[];
        to: string | string[];
        subject: string;
        open: {
            ipAddress: string;
            timestamp: string;
            userAgent: string;
        };
    };
}, {
    type: import("convex/values").VLiteral<"email.opened", "required">;
    created_at: import("convex/values").VString<string, "required">;
    data: import("convex/values").VObject<{
        broadcast_id?: string | undefined;
        cc?: string | string[] | undefined;
        bcc?: string | string[] | undefined;
        reply_to?: string | string[] | undefined;
        headers?: {
            name: string;
            value: string;
        }[] | undefined;
        tags?: Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined;
        created_at: string;
        email_id: string;
        from: string | string[];
        to: string | string[];
        subject: string;
        open: {
            ipAddress: string;
            timestamp: string;
            userAgent: string;
        };
    }, {
        open: import("convex/values").VObject<{
            ipAddress: string;
            timestamp: string;
            userAgent: string;
        }, {
            ipAddress: import("convex/values").VString<string, "required">;
            timestamp: import("convex/values").VString<string, "required">;
            userAgent: import("convex/values").VString<string, "required">;
        }, "required", "ipAddress" | "timestamp" | "userAgent">;
        broadcast_id: import("convex/values").VString<string | undefined, "optional">;
        created_at: import("convex/values").VString<string, "required">;
        email_id: import("convex/values").VString<string, "required">;
        from: import("convex/values").VUnion<string | string[], [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "required", never>;
        to: import("convex/values").VUnion<string | string[], [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "required", never>;
        cc: import("convex/values").VUnion<string | string[] | undefined, [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "optional", never>;
        bcc: import("convex/values").VUnion<string | string[] | undefined, [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "optional", never>;
        reply_to: import("convex/values").VUnion<string | string[] | undefined, [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "optional", never>;
        headers: import("convex/values").VArray<{
            name: string;
            value: string;
        }[] | undefined, import("convex/values").VObject<{
            name: string;
            value: string;
        }, {
            name: import("convex/values").VString<string, "required">;
            value: import("convex/values").VString<string, "required">;
        }, "required", "name" | "value">, "optional">;
        subject: import("convex/values").VString<string, "required">;
        tags: import("convex/values").VUnion<Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined, [import("convex/values").VRecord<Record<string, string>, import("convex/values").VString<string, "required">, import("convex/values").VString<string, "required">, "required", string>, import("convex/values").VArray<{
            name: string;
            value: string;
        }[], import("convex/values").VObject<{
            name: string;
            value: string;
        }, {
            name: import("convex/values").VString<string, "required">;
            value: import("convex/values").VString<string, "required">;
        }, "required", "name" | "value">, "required">], "optional", string>;
    }, "required", "created_at" | "broadcast_id" | "email_id" | "from" | "to" | "cc" | "bcc" | "reply_to" | "headers" | "subject" | "tags" | `tags.${string}` | "open" | "open.ipAddress" | "open.timestamp" | "open.userAgent">;
}, "required", "type" | "created_at" | "data" | "data.created_at" | "data.broadcast_id" | "data.email_id" | "data.from" | "data.to" | "data.cc" | "data.bcc" | "data.reply_to" | "data.headers" | "data.subject" | "data.tags" | `data.tags.${string}` | "data.open" | "data.open.ipAddress" | "data.open.timestamp" | "data.open.userAgent">, import("convex/values").VObject<{
    type: "email.clicked";
    created_at: string;
    data: {
        broadcast_id?: string | undefined;
        cc?: string | string[] | undefined;
        bcc?: string | string[] | undefined;
        reply_to?: string | string[] | undefined;
        headers?: {
            name: string;
            value: string;
        }[] | undefined;
        tags?: Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined;
        created_at: string;
        email_id: string;
        from: string | string[];
        to: string | string[];
        subject: string;
        click: {
            ipAddress: string;
            timestamp: string;
            userAgent: string;
            link: string;
        };
    };
}, {
    type: import("convex/values").VLiteral<"email.clicked", "required">;
    created_at: import("convex/values").VString<string, "required">;
    data: import("convex/values").VObject<{
        broadcast_id?: string | undefined;
        cc?: string | string[] | undefined;
        bcc?: string | string[] | undefined;
        reply_to?: string | string[] | undefined;
        headers?: {
            name: string;
            value: string;
        }[] | undefined;
        tags?: Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined;
        created_at: string;
        email_id: string;
        from: string | string[];
        to: string | string[];
        subject: string;
        click: {
            ipAddress: string;
            timestamp: string;
            userAgent: string;
            link: string;
        };
    }, {
        click: import("convex/values").VObject<{
            ipAddress: string;
            timestamp: string;
            userAgent: string;
            link: string;
        }, {
            ipAddress: import("convex/values").VString<string, "required">;
            link: import("convex/values").VString<string, "required">;
            timestamp: import("convex/values").VString<string, "required">;
            userAgent: import("convex/values").VString<string, "required">;
        }, "required", "ipAddress" | "timestamp" | "userAgent" | "link">;
        broadcast_id: import("convex/values").VString<string | undefined, "optional">;
        created_at: import("convex/values").VString<string, "required">;
        email_id: import("convex/values").VString<string, "required">;
        from: import("convex/values").VUnion<string | string[], [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "required", never>;
        to: import("convex/values").VUnion<string | string[], [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "required", never>;
        cc: import("convex/values").VUnion<string | string[] | undefined, [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "optional", never>;
        bcc: import("convex/values").VUnion<string | string[] | undefined, [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "optional", never>;
        reply_to: import("convex/values").VUnion<string | string[] | undefined, [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "optional", never>;
        headers: import("convex/values").VArray<{
            name: string;
            value: string;
        }[] | undefined, import("convex/values").VObject<{
            name: string;
            value: string;
        }, {
            name: import("convex/values").VString<string, "required">;
            value: import("convex/values").VString<string, "required">;
        }, "required", "name" | "value">, "optional">;
        subject: import("convex/values").VString<string, "required">;
        tags: import("convex/values").VUnion<Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined, [import("convex/values").VRecord<Record<string, string>, import("convex/values").VString<string, "required">, import("convex/values").VString<string, "required">, "required", string>, import("convex/values").VArray<{
            name: string;
            value: string;
        }[], import("convex/values").VObject<{
            name: string;
            value: string;
        }, {
            name: import("convex/values").VString<string, "required">;
            value: import("convex/values").VString<string, "required">;
        }, "required", "name" | "value">, "required">], "optional", string>;
    }, "required", "created_at" | "broadcast_id" | "email_id" | "from" | "to" | "cc" | "bcc" | "reply_to" | "headers" | "subject" | "tags" | `tags.${string}` | "click" | "click.ipAddress" | "click.timestamp" | "click.userAgent" | "click.link">;
}, "required", "type" | "created_at" | "data" | "data.created_at" | "data.broadcast_id" | "data.email_id" | "data.from" | "data.to" | "data.cc" | "data.bcc" | "data.reply_to" | "data.headers" | "data.subject" | "data.tags" | `data.tags.${string}` | "data.click" | "data.click.ipAddress" | "data.click.timestamp" | "data.click.userAgent" | "data.click.link">, import("convex/values").VObject<{
    type: "email.failed";
    created_at: string;
    data: {
        broadcast_id?: string | undefined;
        cc?: string | string[] | undefined;
        bcc?: string | string[] | undefined;
        reply_to?: string | string[] | undefined;
        headers?: {
            name: string;
            value: string;
        }[] | undefined;
        tags?: Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined;
        failed: {
            reason: string;
        };
        created_at: string;
        email_id: string;
        from: string | string[];
        to: string | string[];
        subject: string;
    };
}, {
    type: import("convex/values").VLiteral<"email.failed", "required">;
    created_at: import("convex/values").VString<string, "required">;
    data: import("convex/values").VObject<{
        broadcast_id?: string | undefined;
        cc?: string | string[] | undefined;
        bcc?: string | string[] | undefined;
        reply_to?: string | string[] | undefined;
        headers?: {
            name: string;
            value: string;
        }[] | undefined;
        tags?: Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined;
        failed: {
            reason: string;
        };
        created_at: string;
        email_id: string;
        from: string | string[];
        to: string | string[];
        subject: string;
    }, {
        failed: import("convex/values").VObject<{
            reason: string;
        }, {
            reason: import("convex/values").VString<string, "required">;
        }, "required", "reason">;
        broadcast_id: import("convex/values").VString<string | undefined, "optional">;
        created_at: import("convex/values").VString<string, "required">;
        email_id: import("convex/values").VString<string, "required">;
        from: import("convex/values").VUnion<string | string[], [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "required", never>;
        to: import("convex/values").VUnion<string | string[], [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "required", never>;
        cc: import("convex/values").VUnion<string | string[] | undefined, [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "optional", never>;
        bcc: import("convex/values").VUnion<string | string[] | undefined, [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "optional", never>;
        reply_to: import("convex/values").VUnion<string | string[] | undefined, [import("convex/values").VString<string, "required">, import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">], "optional", never>;
        headers: import("convex/values").VArray<{
            name: string;
            value: string;
        }[] | undefined, import("convex/values").VObject<{
            name: string;
            value: string;
        }, {
            name: import("convex/values").VString<string, "required">;
            value: import("convex/values").VString<string, "required">;
        }, "required", "name" | "value">, "optional">;
        subject: import("convex/values").VString<string, "required">;
        tags: import("convex/values").VUnion<Record<string, string> | {
            name: string;
            value: string;
        }[] | undefined, [import("convex/values").VRecord<Record<string, string>, import("convex/values").VString<string, "required">, import("convex/values").VString<string, "required">, "required", string>, import("convex/values").VArray<{
            name: string;
            value: string;
        }[], import("convex/values").VObject<{
            name: string;
            value: string;
        }, {
            name: import("convex/values").VString<string, "required">;
            value: import("convex/values").VString<string, "required">;
        }, "required", "name" | "value">, "required">], "optional", string>;
    }, "required", "failed" | "created_at" | "broadcast_id" | "email_id" | "from" | "to" | "cc" | "bcc" | "reply_to" | "headers" | "subject" | "tags" | `tags.${string}` | "failed.reason">;
}, "required", "type" | "created_at" | "data" | "data.created_at" | "data.broadcast_id" | "data.email_id" | "data.from" | "data.to" | "data.cc" | "data.bcc" | "data.reply_to" | "data.headers" | "data.subject" | "data.tags" | `data.tags.${string}` | "data.failed" | "data.failed.reason">], "required", "type" | "created_at" | "data" | "data.created_at" | "data.broadcast_id" | "data.email_id" | "data.from" | "data.to" | "data.cc" | "data.bcc" | "data.reply_to" | "data.headers" | "data.subject" | "data.tags" | `data.tags.${string}` | "data.bounce" | "data.bounce.type" | "data.bounce.message" | "data.bounce.subType" | "data.open" | "data.open.ipAddress" | "data.open.timestamp" | "data.open.userAgent" | "data.click" | "data.click.ipAddress" | "data.click.timestamp" | "data.click.userAgent" | "data.click.link" | "data.failed" | "data.failed.reason">;
export type EmailEvent = Infer<typeof vEmailEvent>;
export type EventEventTypes = EmailEvent["type"];
export type EventEventOfType<T extends EventEventTypes> = Extract<EmailEvent, {
    type: T;
}>;
export type RunQueryCtx = {
    runQuery: GenericQueryCtx<GenericDataModel>["runQuery"];
};
export type RunMutationCtx = {
    runMutation: GenericMutationCtx<GenericDataModel>["runMutation"];
};
//# sourceMappingURL=shared.d.ts.map