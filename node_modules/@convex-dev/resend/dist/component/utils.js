import { parse } from "convex-helpers/validators";
export const assertExhaustive = (value) => {
    throw new Error(`Unhandled event type: ${value}`);
};
export const iife = (fn) => fn();
/**
 * Generic function to attempt parsing with proper TypeScript type narrowing
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function attemptToParse(validator, value) {
    try {
        return {
            kind: "success",
            data: parse(validator, value),
        };
    }
    catch (error) {
        return {
            kind: "error",
            error,
        };
    }
}
/**
 * This is one is intentionally kept simple and only allows - and _ as special characters
 * since Resend does not specify what pattern a label must follow, the documentation
 * only says "any string": https://resend.com/docs/dashboard/emails/send-test-emails#using-labels-effectively
 * and a full RFC-5322 compliant regex would be way too long.
 */
const RESEND_TEST_EMAIL_REGEX = /^(delivered|bounced|complained)(\+[a-zA-Z0-9_-]*)?@resend\.dev$/;
/**
 * Check if the given e-mail address is a valid test e-mail for Resend.
 * @param email
 */
export function isValidResendTestEmail(email) {
    return RESEND_TEST_EMAIL_REGEX.test(email);
}
//# sourceMappingURL=utils.js.map