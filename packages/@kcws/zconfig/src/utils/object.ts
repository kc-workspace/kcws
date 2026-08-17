import type { RawConfig } from "./types";

/**
 * Keys that must never be written into a configuration object.
 *
 * Config files are untrusted input, and both `JSON.parse` and YAML parsers can
 * produce a literal `__proto__` own property. Assigning it would walk the
 * prototype setter and pollute `Object.prototype` process-wide.
 *
 * @internal
 */
export const DANGEROUS_KEYS: ReadonlySet<string> = new Set([
	"__proto__",
	"constructor",
	"prototype",
]);

/**
 * Narrows to objects safe to recurse into.
 *
 * Anything carrying its own prototype — `Date`, `Map`, a class instance — is a
 * leaf, since merging or walking its internals would produce a broken
 * half-object. Arrays are leaves for the same reason.
 *
 * @internal
 */
export const isPlainObject = (value: unknown): value is RawConfig => {
	if (typeof value !== "object" || value === null) return false;
	if (Array.isArray(value)) return false;

	const proto = Object.getPrototypeOf(value) as unknown;
	return proto === null || proto === Object.prototype;
};
