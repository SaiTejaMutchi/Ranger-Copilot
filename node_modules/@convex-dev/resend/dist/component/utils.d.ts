import type { Validator, Infer } from "convex/values";
export declare const assertExhaustive: (value: never) => never;
export declare const iife: <T>(fn: () => T) => T;
/**
 * Generic function to attempt parsing with proper TypeScript type narrowing
 */
export declare function attemptToParse<T extends Validator<any, any, any>>(validator: T, value: unknown): {
    kind: "success";
    data: Infer<T>;
} | {
    kind: "error";
    error: unknown;
};
/**
 * Check if the given e-mail address is a valid test e-mail for Resend.
 * @param email
 */
export declare function isValidResendTestEmail(email: string): boolean;
//# sourceMappingURL=utils.d.ts.map