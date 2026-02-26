import { type Expand, type FunctionReference, type FunctionVisibility, type GenericDataModel, type GenericMutationCtx } from "convex/server";
import { type GenericId, type VString } from "convex/values";
import type { api } from "../component/_generated/api.js";
import { type EmailEvent, type RunMutationCtx, type RunQueryCtx, type RuntimeConfig, type Status } from "../component/shared.js";
export type ResendComponent = UseApi<typeof api>;
export type EmailId = string & {
    __isEmailId: true;
};
export declare const vEmailId: VString<EmailId>;
export { vEmailEvent, vOptions, vStatus } from "../component/shared.js";
export type { EmailEvent, Status } from "../component/shared.js";
export declare const vOnEmailEventArgs: import("convex/values").VObject<{
    id: EmailId;
    event: {
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
    };
}, {
    id: VString<EmailId, "required">;
    event: import("convex/values").VUnion<{
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
        created_at: VString<string, "required">;
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
            broadcast_id: VString<string | undefined, "optional">;
            created_at: VString<string, "required">;
            email_id: VString<string, "required">;
            from: import("convex/values").VUnion<string | string[], [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "required", never>;
            to: import("convex/values").VUnion<string | string[], [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "required", never>;
            cc: import("convex/values").VUnion<string | string[] | undefined, [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "optional", never>;
            bcc: import("convex/values").VUnion<string | string[] | undefined, [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "optional", never>;
            reply_to: import("convex/values").VUnion<string | string[] | undefined, [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "optional", never>;
            headers: import("convex/values").VArray<{
                name: string;
                value: string;
            }[] | undefined, import("convex/values").VObject<{
                name: string;
                value: string;
            }, {
                name: VString<string, "required">;
                value: VString<string, "required">;
            }, "required", "name" | "value">, "optional">;
            subject: VString<string, "required">;
            tags: import("convex/values").VUnion<Record<string, string> | {
                name: string;
                value: string;
            }[] | undefined, [import("convex/values").VRecord<Record<string, string>, VString<string, "required">, VString<string, "required">, "required", string>, import("convex/values").VArray<{
                name: string;
                value: string;
            }[], import("convex/values").VObject<{
                name: string;
                value: string;
            }, {
                name: VString<string, "required">;
                value: VString<string, "required">;
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
        created_at: VString<string, "required">;
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
            broadcast_id: VString<string | undefined, "optional">;
            created_at: VString<string, "required">;
            email_id: VString<string, "required">;
            from: import("convex/values").VUnion<string | string[], [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "required", never>;
            to: import("convex/values").VUnion<string | string[], [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "required", never>;
            cc: import("convex/values").VUnion<string | string[] | undefined, [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "optional", never>;
            bcc: import("convex/values").VUnion<string | string[] | undefined, [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "optional", never>;
            reply_to: import("convex/values").VUnion<string | string[] | undefined, [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "optional", never>;
            headers: import("convex/values").VArray<{
                name: string;
                value: string;
            }[] | undefined, import("convex/values").VObject<{
                name: string;
                value: string;
            }, {
                name: VString<string, "required">;
                value: VString<string, "required">;
            }, "required", "name" | "value">, "optional">;
            subject: VString<string, "required">;
            tags: import("convex/values").VUnion<Record<string, string> | {
                name: string;
                value: string;
            }[] | undefined, [import("convex/values").VRecord<Record<string, string>, VString<string, "required">, VString<string, "required">, "required", string>, import("convex/values").VArray<{
                name: string;
                value: string;
            }[], import("convex/values").VObject<{
                name: string;
                value: string;
            }, {
                name: VString<string, "required">;
                value: VString<string, "required">;
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
        created_at: VString<string, "required">;
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
            broadcast_id: VString<string | undefined, "optional">;
            created_at: VString<string, "required">;
            email_id: VString<string, "required">;
            from: import("convex/values").VUnion<string | string[], [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "required", never>;
            to: import("convex/values").VUnion<string | string[], [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "required", never>;
            cc: import("convex/values").VUnion<string | string[] | undefined, [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "optional", never>;
            bcc: import("convex/values").VUnion<string | string[] | undefined, [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "optional", never>;
            reply_to: import("convex/values").VUnion<string | string[] | undefined, [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "optional", never>;
            headers: import("convex/values").VArray<{
                name: string;
                value: string;
            }[] | undefined, import("convex/values").VObject<{
                name: string;
                value: string;
            }, {
                name: VString<string, "required">;
                value: VString<string, "required">;
            }, "required", "name" | "value">, "optional">;
            subject: VString<string, "required">;
            tags: import("convex/values").VUnion<Record<string, string> | {
                name: string;
                value: string;
            }[] | undefined, [import("convex/values").VRecord<Record<string, string>, VString<string, "required">, VString<string, "required">, "required", string>, import("convex/values").VArray<{
                name: string;
                value: string;
            }[], import("convex/values").VObject<{
                name: string;
                value: string;
            }, {
                name: VString<string, "required">;
                value: VString<string, "required">;
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
        created_at: VString<string, "required">;
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
            broadcast_id: VString<string | undefined, "optional">;
            created_at: VString<string, "required">;
            email_id: VString<string, "required">;
            from: import("convex/values").VUnion<string | string[], [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "required", never>;
            to: import("convex/values").VUnion<string | string[], [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "required", never>;
            cc: import("convex/values").VUnion<string | string[] | undefined, [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "optional", never>;
            bcc: import("convex/values").VUnion<string | string[] | undefined, [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "optional", never>;
            reply_to: import("convex/values").VUnion<string | string[] | undefined, [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "optional", never>;
            headers: import("convex/values").VArray<{
                name: string;
                value: string;
            }[] | undefined, import("convex/values").VObject<{
                name: string;
                value: string;
            }, {
                name: VString<string, "required">;
                value: VString<string, "required">;
            }, "required", "name" | "value">, "optional">;
            subject: VString<string, "required">;
            tags: import("convex/values").VUnion<Record<string, string> | {
                name: string;
                value: string;
            }[] | undefined, [import("convex/values").VRecord<Record<string, string>, VString<string, "required">, VString<string, "required">, "required", string>, import("convex/values").VArray<{
                name: string;
                value: string;
            }[], import("convex/values").VObject<{
                name: string;
                value: string;
            }, {
                name: VString<string, "required">;
                value: VString<string, "required">;
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
        created_at: VString<string, "required">;
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
                message: VString<string, "required">;
                subType: VString<string, "required">;
                type: VString<string, "required">;
            }, "required", "type" | "message" | "subType">;
            broadcast_id: VString<string | undefined, "optional">;
            created_at: VString<string, "required">;
            email_id: VString<string, "required">;
            from: import("convex/values").VUnion<string | string[], [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "required", never>;
            to: import("convex/values").VUnion<string | string[], [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "required", never>;
            cc: import("convex/values").VUnion<string | string[] | undefined, [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "optional", never>;
            bcc: import("convex/values").VUnion<string | string[] | undefined, [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "optional", never>;
            reply_to: import("convex/values").VUnion<string | string[] | undefined, [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "optional", never>;
            headers: import("convex/values").VArray<{
                name: string;
                value: string;
            }[] | undefined, import("convex/values").VObject<{
                name: string;
                value: string;
            }, {
                name: VString<string, "required">;
                value: VString<string, "required">;
            }, "required", "name" | "value">, "optional">;
            subject: VString<string, "required">;
            tags: import("convex/values").VUnion<Record<string, string> | {
                name: string;
                value: string;
            }[] | undefined, [import("convex/values").VRecord<Record<string, string>, VString<string, "required">, VString<string, "required">, "required", string>, import("convex/values").VArray<{
                name: string;
                value: string;
            }[], import("convex/values").VObject<{
                name: string;
                value: string;
            }, {
                name: VString<string, "required">;
                value: VString<string, "required">;
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
        created_at: VString<string, "required">;
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
                ipAddress: VString<string, "required">;
                timestamp: VString<string, "required">;
                userAgent: VString<string, "required">;
            }, "required", "ipAddress" | "timestamp" | "userAgent">;
            broadcast_id: VString<string | undefined, "optional">;
            created_at: VString<string, "required">;
            email_id: VString<string, "required">;
            from: import("convex/values").VUnion<string | string[], [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "required", never>;
            to: import("convex/values").VUnion<string | string[], [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "required", never>;
            cc: import("convex/values").VUnion<string | string[] | undefined, [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "optional", never>;
            bcc: import("convex/values").VUnion<string | string[] | undefined, [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "optional", never>;
            reply_to: import("convex/values").VUnion<string | string[] | undefined, [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "optional", never>;
            headers: import("convex/values").VArray<{
                name: string;
                value: string;
            }[] | undefined, import("convex/values").VObject<{
                name: string;
                value: string;
            }, {
                name: VString<string, "required">;
                value: VString<string, "required">;
            }, "required", "name" | "value">, "optional">;
            subject: VString<string, "required">;
            tags: import("convex/values").VUnion<Record<string, string> | {
                name: string;
                value: string;
            }[] | undefined, [import("convex/values").VRecord<Record<string, string>, VString<string, "required">, VString<string, "required">, "required", string>, import("convex/values").VArray<{
                name: string;
                value: string;
            }[], import("convex/values").VObject<{
                name: string;
                value: string;
            }, {
                name: VString<string, "required">;
                value: VString<string, "required">;
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
        created_at: VString<string, "required">;
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
                ipAddress: VString<string, "required">;
                link: VString<string, "required">;
                timestamp: VString<string, "required">;
                userAgent: VString<string, "required">;
            }, "required", "ipAddress" | "timestamp" | "userAgent" | "link">;
            broadcast_id: VString<string | undefined, "optional">;
            created_at: VString<string, "required">;
            email_id: VString<string, "required">;
            from: import("convex/values").VUnion<string | string[], [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "required", never>;
            to: import("convex/values").VUnion<string | string[], [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "required", never>;
            cc: import("convex/values").VUnion<string | string[] | undefined, [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "optional", never>;
            bcc: import("convex/values").VUnion<string | string[] | undefined, [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "optional", never>;
            reply_to: import("convex/values").VUnion<string | string[] | undefined, [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "optional", never>;
            headers: import("convex/values").VArray<{
                name: string;
                value: string;
            }[] | undefined, import("convex/values").VObject<{
                name: string;
                value: string;
            }, {
                name: VString<string, "required">;
                value: VString<string, "required">;
            }, "required", "name" | "value">, "optional">;
            subject: VString<string, "required">;
            tags: import("convex/values").VUnion<Record<string, string> | {
                name: string;
                value: string;
            }[] | undefined, [import("convex/values").VRecord<Record<string, string>, VString<string, "required">, VString<string, "required">, "required", string>, import("convex/values").VArray<{
                name: string;
                value: string;
            }[], import("convex/values").VObject<{
                name: string;
                value: string;
            }, {
                name: VString<string, "required">;
                value: VString<string, "required">;
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
        created_at: VString<string, "required">;
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
                reason: VString<string, "required">;
            }, "required", "reason">;
            broadcast_id: VString<string | undefined, "optional">;
            created_at: VString<string, "required">;
            email_id: VString<string, "required">;
            from: import("convex/values").VUnion<string | string[], [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "required", never>;
            to: import("convex/values").VUnion<string | string[], [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "required", never>;
            cc: import("convex/values").VUnion<string | string[] | undefined, [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "optional", never>;
            bcc: import("convex/values").VUnion<string | string[] | undefined, [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "optional", never>;
            reply_to: import("convex/values").VUnion<string | string[] | undefined, [VString<string, "required">, import("convex/values").VArray<string[], VString<string, "required">, "required">], "optional", never>;
            headers: import("convex/values").VArray<{
                name: string;
                value: string;
            }[] | undefined, import("convex/values").VObject<{
                name: string;
                value: string;
            }, {
                name: VString<string, "required">;
                value: VString<string, "required">;
            }, "required", "name" | "value">, "optional">;
            subject: VString<string, "required">;
            tags: import("convex/values").VUnion<Record<string, string> | {
                name: string;
                value: string;
            }[] | undefined, [import("convex/values").VRecord<Record<string, string>, VString<string, "required">, VString<string, "required">, "required", string>, import("convex/values").VArray<{
                name: string;
                value: string;
            }[], import("convex/values").VObject<{
                name: string;
                value: string;
            }, {
                name: VString<string, "required">;
                value: VString<string, "required">;
            }, "required", "name" | "value">, "required">], "optional", string>;
        }, "required", "failed" | "created_at" | "broadcast_id" | "email_id" | "from" | "to" | "cc" | "bcc" | "reply_to" | "headers" | "subject" | "tags" | `tags.${string}` | "failed.reason">;
    }, "required", "type" | "created_at" | "data" | "data.created_at" | "data.broadcast_id" | "data.email_id" | "data.from" | "data.to" | "data.cc" | "data.bcc" | "data.reply_to" | "data.headers" | "data.subject" | "data.tags" | `data.tags.${string}` | "data.failed" | "data.failed.reason">], "required", "type" | "created_at" | "data" | "data.created_at" | "data.broadcast_id" | "data.email_id" | "data.from" | "data.to" | "data.cc" | "data.bcc" | "data.reply_to" | "data.headers" | "data.subject" | "data.tags" | `data.tags.${string}` | "data.bounce" | "data.bounce.type" | "data.bounce.message" | "data.bounce.subType" | "data.open" | "data.open.ipAddress" | "data.open.timestamp" | "data.open.userAgent" | "data.click" | "data.click.ipAddress" | "data.click.timestamp" | "data.click.userAgent" | "data.click.link" | "data.failed" | "data.failed.reason">;
}, "required", "id" | "event" | "event.type" | "event.created_at" | "event.data" | "event.data.created_at" | "event.data.broadcast_id" | "event.data.email_id" | "event.data.from" | "event.data.to" | "event.data.cc" | "event.data.bcc" | "event.data.reply_to" | "event.data.headers" | "event.data.subject" | "event.data.tags" | `event.data.tags.${string}` | "event.data.bounce" | "event.data.bounce.type" | "event.data.bounce.message" | "event.data.bounce.subType" | "event.data.open" | "event.data.open.ipAddress" | "event.data.open.timestamp" | "event.data.open.userAgent" | "event.data.click" | "event.data.click.ipAddress" | "event.data.click.timestamp" | "event.data.click.userAgent" | "event.data.click.link" | "event.data.failed" | "event.data.failed.reason">;
type Config = RuntimeConfig & {
    webhookSecret: string;
};
export type ResendOptions = {
    /**
     * The API key to use for the Resend API.
     * If not provided, the API key will be read from the environment variable RESEND_API_KEY.
     */
    apiKey?: string;
    /**
     * The secret to use for the Resend webhook.
     * If not provided, the webhook secret will be read from the environment variable RESEND_WEBHOOK_SECRET.
     */
    webhookSecret?: string;
    /**
     * The initial backoff to use for the Resend API.
     * If not provided, the initial backoff will be 30 seconds.
     */
    initialBackoffMs?: number;
    /**
     * The number of retry attempts to use for the Resend API.
     * If not provided, the number of retry attempts will be 5.
     */
    retryAttempts?: number;
    /**
     * Whether to run in test mode. In test mode, only emails to
     * resend-approved test email addresses will be sent.
     * If not provided, the test mode will be true. You need to opt
     * into production mode by setting testMode to false.
     */
    testMode?: boolean;
    /**
     * A mutation to run after an email event occurs.
     * The mutation will be passed the email id and the event.
     */
    onEmailEvent?: FunctionReference<"mutation", FunctionVisibility, {
        id: EmailId;
        event: EmailEvent;
    }> | null;
};
export type EmailStatus = {
    /**
     * The status of the email. It will be one of the following:
     * - `waiting`: The email has not yet been batched.
     * - `queued`: The email has been batched and is waiting to be sent.
     * - `cancelled`: The email has been cancelled.
     * - `sent`: The email has been sent to Resend, but we do not yet know its fate.
     * - `bounced`: The email bounced.
     * - `delivered`: The email was delivered successfully.
     * - `delivery_delayed`: Resend is having trouble delivering the email, but is still trying.
     */
    status: Status;
    /**
     * The error message of the email. Typically only set on bounces.
     */
    errorMessage: string | null;
    /**
     * Whether the email was marked as spam. This is only set on emails which are delivered.
     */
    complained: boolean;
    /**
     * If you're using open tracking, did Resend detect that the email was opened?
     */
    opened: boolean;
};
export type SendEmailOptions = {
    from: string;
    to: string;
    subject: string;
    html?: string;
    text?: string;
    replyTo?: string[];
    headers?: {
        name: string;
        value: string;
    }[];
};
export declare class Resend {
    component: UseApi<typeof api>;
    config: Config;
    onEmailEvent?: FunctionReference<"mutation", FunctionVisibility, {
        id: EmailId;
        event: EmailEvent;
    }> | null;
    /**
     * Creates a Resend component.
     *
     * @param component The component to use, like `components.resend` from
     * `./_generated/api.ts`.
     * @param options The {@link ResendOptions} to use for this component.
     */
    constructor(component: UseApi<typeof api>, options?: ResendOptions);
    /**
     * Sends an email
     *
     * Specifically, enqueues your email to be sent as part of efficient, durable email batches
     * managed by the component. The email will be sent as soon as possible, but the component
     * will manage rate limiting and batching for efficiency.
     *
     * This component utilizes idempotency keys to ensure the email is sent exactly once.
     *
     * @param ctx Any context that can run a mutation. You can enqueue an email from
     * either a mutation or an action.
     * @param options The {@link SendEmailOptions} object containing all email parameters.
     * @returns The id of the email within the component.
     */
    sendEmail(ctx: RunMutationCtx, options: SendEmailOptions): Promise<EmailId>;
    /**
     * Sends an email by providing individual arguments for `from`, `to`, `subject`, and optionally `html`, `text`, `replyTo`, and `headers`.
     *
     * Specifically, enqueues your email to be sent as part of efficient, durable email batches
     * managed by the component. The email will be sent as soon as possible, but the component
     * will manage rate limiting and batching for efficiency.
     *
     * This component utilizes idempotency keys to ensure the email is sent exactly once.
     *
     * @param ctx Any context that can run a mutation. You can enqueue an email from
     * either a mutation or an action.
     * @param from The email address to send from.
     * @param to The email address to send to.
     * @param subject The subject of the email.
     * @param html The HTML body of the email.
     * @param text The text body of the email.
     * @param replyTo Optionally, any extra reply to addresses to include in the email.
     * @param headers Extra email headers your want included.
     * @returns The id of the email within the component.
     */
    sendEmail(ctx: RunMutationCtx, from: string, to: string, subject: string, html?: string, text?: string, replyTo?: string[], headers?: {
        name: string;
        value: string;
    }[]): Promise<EmailId>;
    sendEmailManually(ctx: RunMutationCtx, options: Omit<SendEmailOptions, "html" | "text">, sendCallback: (emailId: EmailId) => Promise<string>): Promise<EmailId>;
    /**
     * Cancels an email.
     *
     * This will mark the email as cancelled if it has no already been send to Resend.
     *
     * @param ctx Any context that can run a mutation. You can cancel an email from
     * either a mutation or an action.
     * @param emailId The id of the email to cancel. This was returned from {@link sendEmail}.
     */
    cancelEmail(ctx: RunMutationCtx, emailId: EmailId): Promise<void>;
    /**
     * Gets the status of an email.
     *
     * @param ctx Any context that can run a query. You can get the status of an email from
     * an action, mutation, or query.
     * @param emailId The id of the email to get the status of. This was returned from {@link sendEmail}.
     * @returns {@link EmailStatus} The status of the email.
     */
    status(ctx: RunQueryCtx, emailId: EmailId): Promise<EmailStatus | null>;
    /**
     * Gets a full email.
     *
     * @param ctx Any context that can run a query. You can get an email from
     * an action, mutation, or query.
     * @param emailId The id of the email to get. This was returned from {@link sendEmail}.
     * @returns The email, or null if the email does not exist.
     */
    get(ctx: RunQueryCtx, emailId: EmailId): Promise<{
        from: string;
        to: string;
        subject: string;
        replyTo: string[];
        headers?: {
            name: string;
            value: string;
        }[];
        status: Status;
        errorMessage?: string;
        complained: boolean;
        opened: boolean;
        resendId?: string;
        finalizedAt: number;
        createdAt: number;
        html?: string;
        text?: string;
    } | null>;
    /**
     * Handles a Resend event webhook.
     *
     * This will update emails in the component with the status of the email as detected by Resend,
     * and call your `onEmailEvent` mutation if it is set.
     *
     * @param ctx Any context that can run a mutation.
     * @param req The request to handle from Resend.
     * @returns A response to send back to Resend.
     */
    handleResendEventWebhook(ctx: RunMutationCtx, req: Request): Promise<Response>;
    /**
     * Defines a mutation to run after an email event occurs.
     *
     * It is probably simpler to just define your mutation as a `internalMutation`
     * and pass the `vOnEmailEventArgs` as the args than use this.
     * See the example in the README for more.
     *
     * @param handler The handler to run after an email event occurs.
     * @returns The mutation to run after an email event occurs.
     */
    defineOnEmailEvent<DataModel extends GenericDataModel>(handler: (ctx: GenericMutationCtx<DataModel>, args: {
        id: EmailId;
        event: EmailEvent;
    }) => Promise<void>): import("convex/server").RegisteredMutation<"internal", {
        id: EmailId;
        event: EmailEvent;
    }, Promise<void>>;
}
export type OpaqueIds<T> = T extends GenericId<infer _T> ? string : T extends (infer U)[] ? OpaqueIds<U>[] : T extends ArrayBuffer ? ArrayBuffer : T extends object ? {
    [K in keyof T]: OpaqueIds<T[K]>;
} : T;
export type UseApi<API> = Expand<{
    [mod in keyof API]: API[mod] extends FunctionReference<infer FType, "public", infer FArgs, infer FReturnType, infer FComponentPath> ? FunctionReference<FType, "internal", OpaqueIds<FArgs>, OpaqueIds<FReturnType>, FComponentPath> : UseApi<API[mod]>;
}>;
//# sourceMappingURL=index.d.ts.map