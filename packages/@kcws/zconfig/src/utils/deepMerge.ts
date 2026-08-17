import { DANGEROUS_KEYS, isPlainObject } from "./object";
import type { RawConfig } from "./types";

const mergeInto = (target: RawConfig, source: RawConfig): void => {
	for (const key of Object.keys(source)) {
		if (DANGEROUS_KEYS.has(key)) continue;

		const value = source[key];
		// A source that omits a key must not clear what an earlier source set.
		if (value === undefined) continue;

		if (!isPlainObject(value)) {
			target[key] = value;
			continue;
		}

		// Only ever recurse into an object this function created, so no source
		// object is mutated and no reference is shared with the result.
		const existing = target[key];
		const next: RawConfig = isPlainObject(existing)
			? existing
			: Object.create(null);

		mergeInto(next, value);
		target[key] = next;
	}
};

/**
 * Combines configuration objects in order, with later sources winning.
 *
 * Plain objects merge recursively. Arrays, primitives, `null`, and non-plain
 * objects replace wholesale — concatenating arrays would make it impossible for
 * a later source to shrink or clear a list. `undefined` is skipped entirely.
 *
 * Results are built on `Object.create(null)`, so a merged object carries no
 * inherited members even if a source somehow smuggled one through.
 *
 * @internal
 */
const deepMerge = (...sources: RawConfig[]): RawConfig => {
	const result: RawConfig = Object.create(null);
	for (const source of sources) mergeInto(result, source);
	return result;
};

export default deepMerge;
