import { mergeConfig as _mergeConfig } from "vitest/config";
import type { AnyConfig } from "../models";

/**
 * Merges multiple configuration objects into a single configuration.
 * later addons taking precedence over earlier ones.
 *
 * No object will be mutated during this process.
 *
 * @template C - The configuration object type that extends a Record with string keys
 * @param defaults - The default configuration object
 * @param addons - One or more configuration objects to merge into the defaults
 * @returns The merged configuration object
 */
export const mergeConfig = <C extends AnyConfig>(
	defaults: C,
	...addons: Optional<C>[]
): C => {
	return addons
		.filter((addon) => addon !== undefined && addon !== null)
		.reduce(
			(merged, addon) =>
				_mergeConfig(
					merged as Record<string, unknown>,
					addon as Record<string, unknown>,
				) as C,
			defaults,
		);
};
