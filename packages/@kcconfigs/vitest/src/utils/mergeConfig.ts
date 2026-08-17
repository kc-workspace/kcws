import { mergeConfig as _mergeConfig } from "vitest/config";
import type { UserConfig } from "../models";

/**
 * Merges Vitest configuration overrides into a base configuration in order.
 *
 * Undefined overrides are ignored, allowing optional configurations to be
 * passed directly.
 *
 * @typeParam C - Vitest configuration type being merged.
 * @param base - Initial configuration to merge into.
 * @param overrides - Configurations to merge from left to right.
 * @returns The merged Vitest configuration.
 */
const mergeConfig = <C extends UserConfig>(
	base: C,
	...overrides: (C | undefined)[]
): C => {
	return overrides
		.filter((o) => o !== undefined)
		.reduce((acc, override) => {
			return _mergeConfig(acc, override as AnyRecord);
		}, base as AnyRecord) as C;
};
export default mergeConfig;
