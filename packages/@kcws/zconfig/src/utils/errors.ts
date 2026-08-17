import type { core, ZodError } from "zod";

/**
 * Removes the error constructor itself from the reported stack trace, so the
 * top frame is the caller rather than this module. No-op outside V8.
 */
const trimConstructorFrame = (
	error: Error,
	// biome-ignore lint/complexity/noBannedTypes: Error.captureStackTrace expects a bare Function
	ctor: Function,
): void => {
	Error.captureStackTrace?.(error, ctor);
};

/**
 * Thrown when the supplied schema itself violates the key naming rules.
 *
 * Raised before any adapter runs, so no I/O has occurred when this surfaces.
 * The fix is always to rename the offending schema key.
 *
 * @see {@link https://github.com/kc-workspace/kcws/blob/main/packages/@kcws/zconfig/DESIGN.md | Key Naming Rules}
 */
export class ZconfigSchemaError extends Error {
	override readonly name = "ZconfigSchemaError";

	/** Path of the offending key, e.g. `["database", "host_name"]`. */
	readonly key: string[];

	/** Human readable explanation of the violated rule. */
	readonly reason: string;

	constructor(key: string[], reason: string) {
		super(`Invalid schema key "${key.join(".")}": ${reason}`);

		this.key = key;
		this.reason = reason;
		trimConstructorFrame(this, ZconfigSchemaError);
	}
}

/**
 * Thrown when an adapter fails to produce a configuration object.
 *
 * Covers a missing file on a non-optional adapter, a parse failure, an absent
 * optional peer format library, and any unexpected internal adapter error.
 */
export class ZconfigAdapterError extends Error {
	override readonly name = "ZconfigAdapterError";

	/** Name of the adapter that failed, e.g. `"json"` or `"env"`. */
	readonly adapter: string;

	constructor(adapter: string, message: string, cause?: unknown) {
		super(`[${adapter}] ${message}`, { cause });

		this.adapter = adapter;
		trimConstructorFrame(this, ZconfigAdapterError);
	}
}

/**
 * Thrown when the merged configuration fails schema validation.
 *
 * Issues are exposed directly so callers can render their own report without
 * unwrapping {@link ZconfigValidationError.cause}.
 */
export class ZconfigValidationError extends Error {
	override readonly name = "ZconfigValidationError";

	/** Every issue reported by Zod, in the order Zod produced them. */
	readonly issues: core.$ZodIssue[];

	/** The original {@link ZodError}. */
	override readonly cause: ZodError;

	constructor(cause: ZodError) {
		super(`Configuration validation failed: ${summarise(cause)}`);

		this.issues = cause.issues;
		this.cause = cause;
		trimConstructorFrame(this, ZconfigValidationError);
	}
}

/** Renders a compact `path: message` list for the error message. */
const summarise = (error: ZodError): string =>
	error.issues
		.map((issue) => {
			const path = issue.path.join(".");
			return path === "" ? issue.message : `${path}: ${issue.message}`;
		})
		.join("; ");
