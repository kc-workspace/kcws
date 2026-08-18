import type { RawConfig } from "../../types";
import { DANGEROUS_KEYS, isPlainObject } from "../object";

/**
 * Folds one source into a merge target, in place.
 *
 * Recursion only ever descends into objects this function created, so no source
 * object is mutated and no reference is shared with the result.
 *
 * @internal
 */
export const mergeInto = (target: RawConfig, source: RawConfig): void => {
	for (const key of Object.keys(source)) {
		if (DANGEROUS_KEYS.has(key)) continue;

		const value = source[key];
		// A source that omits a key must not clear what an earlier source set.
		if (value === undefined) continue;

		if (!isPlainObject(value)) {
			target[key] = value;
			continue;
		}

		const existing = target[key];
		const next: RawConfig = isPlainObject(existing)
			? existing
			: Object.create(null);

		mergeInto(next, value);
		target[key] = next;
	}
};
