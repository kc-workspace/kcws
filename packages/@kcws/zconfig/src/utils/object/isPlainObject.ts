import type { RawConfig } from "#types";

/**
 * Narrows to objects safe to recurse into.
 *
 * Anything carrying its own prototype — `Date`, `Map`, a class instance — is a
 * leaf, since merging or walking its internals would produce a broken
 * half-object. Arrays are leaves for the same reason.
 *
 * @internal
 */
const isPlainObject = (value: unknown): value is RawConfig => {
	if (typeof value !== "object" || value === null) return false;
	if (Array.isArray(value)) return false;

	const proto = Object.getPrototypeOf(value) as unknown;
	return proto === null || proto === Object.prototype;
};

export default isPlainObject;
