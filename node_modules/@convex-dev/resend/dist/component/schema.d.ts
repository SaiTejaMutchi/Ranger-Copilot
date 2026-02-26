declare const _default: import("convex/server").SchemaDefinition<{
    content: import("convex/server").TableDefinition<import("convex/values").VObject<{
        filename?: string | undefined;
        path?: string | undefined;
        content: ArrayBuffer;
        mimeType: string;
    }, {
        content: import("convex/values").VBytes<ArrayBuffer, "required">;
        mimeType: import("convex/values").VString<string, "required">;
        filename: import("convex/values").VString<string | undefined, "optional">;
        path: import("convex/values").VString<string | undefined, "optional">;
    }, "required", "content" | "mimeType" | "filename" | "path">, {}, {}, {}>;
    nextBatchRun: import("convex/server").TableDefinition<import("convex/values").VObject<{
        runId: import("convex/values").GenericId<"_scheduled_functions">;
    }, {
        runId: import("convex/values").VId<import("convex/values").GenericId<"_scheduled_functions">, "required">;
    }, "required", "runId">, {}, {}, {}>;
    lastOptions: import("convex/server").TableDefinition<import("convex/values").VObject<{
        options: {
            onEmailEvent?: {
                fnHandle: string;
            } | undefined;
            initialBackoffMs: number;
            retryAttempts: number;
            apiKey: string;
            testMode: boolean;
        };
    }, {
        options: import("convex/values").VObject<{
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
    }, "required", "options" | "options.initialBackoffMs" | "options.retryAttempts" | "options.apiKey" | "options.testMode" | "options.onEmailEvent" | "options.onEmailEvent.fnHandle">, {}, {}, {}>;
    emails: import("convex/server").TableDefinition<import("convex/values").VObject<{
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
    }, {
        from: import("convex/values").VString<string, "required">;
        to: import("convex/values").VString<string, "required">;
        subject: import("convex/values").VString<string, "required">;
        replyTo: import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">;
        html: import("convex/values").VId<import("convex/values").GenericId<"content"> | undefined, "optional">;
        text: import("convex/values").VId<import("convex/values").GenericId<"content"> | undefined, "optional">;
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
        status: import("convex/values").VUnion<"waiting" | "queued" | "cancelled" | "sent" | "delivered" | "delivery_delayed" | "bounced" | "failed", [import("convex/values").VLiteral<"waiting", "required">, import("convex/values").VLiteral<"queued", "required">, import("convex/values").VLiteral<"cancelled", "required">, import("convex/values").VLiteral<"sent", "required">, import("convex/values").VLiteral<"delivered", "required">, import("convex/values").VLiteral<"delivery_delayed", "required">, import("convex/values").VLiteral<"bounced", "required">, import("convex/values").VLiteral<"failed", "required">], "required", never>;
        errorMessage: import("convex/values").VString<string | undefined, "optional">;
        complained: import("convex/values").VBoolean<boolean, "required">;
        opened: import("convex/values").VBoolean<boolean, "required">;
        resendId: import("convex/values").VString<string | undefined, "optional">;
        segment: import("convex/values").VFloat64<number, "required">;
        finalizedAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "from" | "to" | "headers" | "subject" | "status" | "replyTo" | "html" | "text" | "errorMessage" | "complained" | "opened" | "resendId" | "segment" | "finalizedAt">, {
        by_status_segment: ["status", "segment", "_creationTime"];
        by_resendId: ["resendId", "_creationTime"];
        by_finalizedAt: ["finalizedAt", "_creationTime"];
    }, {}, {}>;
}, true>;
export default _default;
//# sourceMappingURL=schema.d.ts.map