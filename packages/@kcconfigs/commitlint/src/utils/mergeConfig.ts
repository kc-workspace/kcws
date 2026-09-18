import type { CommitlintConfig } from "../types";

const isPlainObject = (value: unknown): value is AnyRecord =>
	typeof value === "object" &&
	value !== null &&
	!Array.isArray(value) &&
	Object.getPrototypeOf(value) === Object.prototype;

const deepMerge = (base: AnyRecord, override: AnyRecord): AnyRecord => {
	const result: AnyRecord = { ...base };
	for (const [key, value] of Object.entries(override)) {
		if (value === undefined) continue;
		const current = result[key];
		result[key] =
			isPlainObject(current) && isPlainObject(value)
				? deepMerge(current, value)
				: value;
	}
	return result;
};

/**
 * Merges commitlint configuration overrides into a base configuration in order.
 *
 * Plain objects are merged recursively; arrays, functions and primitives
 * replace the base value. Undefined overrides are ignored and the base
 * configuration is never mutated.
 *
 * @param base - Initial configuration to merge into.
 * @param overrides - Configurations to merge from left to right.
 * @returns A new merged commitlint configuration.
 */
const mergeConfig = (
	base: CommitlintConfig,
	...overrides: (CommitlintConfig | undefined)[]
): CommitlintConfig => {
	return overrides
		.filter((o) => o !== undefined)
		.reduce<AnyRecord>(
			(acc, override) => deepMerge(acc, override as AnyRecord),
			base as AnyRecord,
		) as CommitlintConfig;
};
export default mergeConfig;
