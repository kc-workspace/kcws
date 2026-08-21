import type { RawConfig } from "#types";
import { mergeInto } from "./utils";

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
