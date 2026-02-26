import { createFunctionHandle, internalMutationGeneric, } from "convex/server";
import { v } from "convex/values";
import { Webhook } from "svix";
import { vEmailEvent, } from "../component/shared.js";
export const vEmailId = v.string();
export { vEmailEvent, vOptions, vStatus } from "../component/shared.js";
export const vOnEmailEventArgs = v.object({
    id: vEmailId,
    event: vEmailEvent,
});
function getDefaultConfig() {
    return {
        apiKey: process.env.RESEND_API_KEY ?? "",
        webhookSecret: process.env.RESEND_WEBHOOK_SECRET ?? "",
        initialBackoffMs: 30000,
        retryAttempts: 5,
        testMode: true,
    };
}
async function configToRuntimeConfig(config, onEmailEvent) {
    return {
        apiKey: config.apiKey,
        initialBackoffMs: config.initialBackoffMs,
        retryAttempts: config.retryAttempts,
        testMode: config.testMode,
        onEmailEvent: onEmailEvent
            ? { fnHandle: await createFunctionHandle(onEmailEvent) }
            : undefined,
    };
}
export class Resend {
    component;
    config;
    onEmailEvent;
    /**
     * Creates a Resend component.
     *
     * @param component The component to use, like `components.resend` from
     * `./_generated/api.ts`.
     * @param options The {@link ResendOptions} to use for this component.
     */
    constructor(component, options) {
        this.component = component;
        const defaultConfig = getDefaultConfig();
        this.config = {
            apiKey: options?.apiKey ?? defaultConfig.apiKey,
            webhookSecret: options?.webhookSecret ?? defaultConfig.webhookSecret,
            initialBackoffMs: options?.initialBackoffMs ?? defaultConfig.initialBackoffMs,
            retryAttempts: options?.retryAttempts ?? defaultConfig.retryAttempts,
            testMode: options?.testMode ?? defaultConfig.testMode,
        };
        if (options?.onEmailEvent) {
            this.onEmailEvent = options.onEmailEvent;
        }
    }
    /** @deprecated Use the object format e.g. `{ from, to, subject, html }` */
    async sendEmail(ctx, fromOrOptions, to, subject, html, text, replyTo, headers) {
        const sendEmailArgs = typeof fromOrOptions === "string"
            ? {
                from: fromOrOptions,
                to: to,
                subject: subject,
                html,
                text,
                replyTo,
                headers,
            }
            : fromOrOptions;
        if (this.config.apiKey === "")
            throw new Error("API key is not set");
        const id = await ctx.runMutation(this.component.lib.sendEmail, {
            options: await configToRuntimeConfig(this.config, this.onEmailEvent),
            ...sendEmailArgs,
        });
        return id;
    }
    async sendEmailManually(ctx, options, sendCallback) {
        const emailId = (await ctx.runMutation(this.component.lib.createManualEmail, {
            from: options.from,
            to: options.to,
            subject: options.subject,
            replyTo: options.replyTo,
            headers: options.headers,
        }));
        try {
            const resendId = await sendCallback(emailId);
            await ctx.runMutation(this.component.lib.updateManualEmail, {
                emailId,
                status: "sent",
                resendId,
            });
        }
        catch (error) {
            await ctx.runMutation(this.component.lib.updateManualEmail, {
                emailId,
                status: "failed",
                errorMessage: error instanceof Error ? error.message : String(error),
                resendId: typeof error === "object" && error !== null && "resendId" in error
                    ? typeof error.resendId === "string"
                        ? error.resendId
                        : undefined
                    : undefined,
            });
            throw error;
        }
        return emailId;
    }
    /**
     * Cancels an email.
     *
     * This will mark the email as cancelled if it has no already been send to Resend.
     *
     * @param ctx Any context that can run a mutation. You can cancel an email from
     * either a mutation or an action.
     * @param emailId The id of the email to cancel. This was returned from {@link sendEmail}.
     */
    async cancelEmail(ctx, emailId) {
        await ctx.runMutation(this.component.lib.cancelEmail, {
            emailId,
        });
    }
    /**
     * Gets the status of an email.
     *
     * @param ctx Any context that can run a query. You can get the status of an email from
     * an action, mutation, or query.
     * @param emailId The id of the email to get the status of. This was returned from {@link sendEmail}.
     * @returns {@link EmailStatus} The status of the email.
     */
    async status(ctx, emailId) {
        return await ctx.runQuery(this.component.lib.getStatus, {
            emailId,
        });
    }
    /**
     * Gets a full email.
     *
     * @param ctx Any context that can run a query. You can get an email from
     * an action, mutation, or query.
     * @param emailId The id of the email to get. This was returned from {@link sendEmail}.
     * @returns The email, or null if the email does not exist.
     */
    async get(ctx, emailId) {
        return await ctx.runQuery(this.component.lib.get, {
            emailId,
        });
    }
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
    async handleResendEventWebhook(ctx, req) {
        if (this.config.webhookSecret === "") {
            throw new Error("Webhook secret is not set");
        }
        const webhook = new Webhook(this.config.webhookSecret);
        const raw = await req.text();
        const svix_id = req.headers.get("svix-id") ?? "";
        const svix_timestamp = req.headers.get("svix-timestamp") ?? "";
        const svix_signature = req.headers.get("svix-signature") ?? "";
        const payload = webhook.verify(raw, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        });
        const event = payload;
        await ctx.runMutation(this.component.lib.handleEmailEvent, {
            event,
        });
        return new Response(null, {
            status: 201,
        });
    }
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
    defineOnEmailEvent(handler) {
        return internalMutationGeneric({
            args: {
                id: vEmailId,
                event: vEmailEvent,
            },
            handler,
        });
    }
}
//# sourceMappingURL=index.js.map