import type { ZodError } from "zod";

/**
 * Removes the error constructor itself from the reported stack trace, so the
 * top frame is the caller rather than this module. No-op outside V8.
 *
 * @internal
 */
export const trimConstructorFrame = (
	error: Error,
	// biome-ignore lint/complexity/noBannedTypes: Error.captureStackTrace expects a bare Function
	ctor: Function,
): void => {
	Error.captureStackTrace?.(error, ctor);
};

/**
 * Renders a compact `path: message` list for a validation error message.
 *
 * A root level issue carries an empty path, so its message stands alone rather
 * than being prefixed with a stray separator.
 *
 * @internal
 */
export const summarise = (error: ZodError): string =>
	error.issues
		.map((issue) => {
			const path = issue.path.join(".");
			return path === "" ? issue.message : `${path}: ${issue.message}`;
		})
		.join("; ");
