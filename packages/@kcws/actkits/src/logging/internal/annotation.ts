import type { AnnotationProperties } from "./types";

const validKeys = new Set([
	"title",
	"file",
	"startLine",
	"endLine",
	"startColumn",
	"endColumn",
]);

/**
 * Checks if the last argument is an AnnotationProperties object.
 * @internal
 */
export const isAnnotationProps = (
	value: unknown,
): value is AnnotationProperties => {
	if (typeof value !== "object" || value === null) return false;
	const keys = Object.keys(value);
	return keys.length > 0 && keys.every((k) => validKeys.has(k));
};
