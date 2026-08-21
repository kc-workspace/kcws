import type { Adapter, RawConfig, TransformFn } from "#types";
import { applyTransform } from "#utils/transforms";

/**
 * Creates an adapter from an already available raw configuration object.
 *
 * @param config - configuration values to return
 * @param transform - optional transform applied to each leaf
 * @returns adapter suitable for {@link loadConfig} and {@link loadConfigSync}
 */
const staticAdapter = (
	config: RawConfig,
	transform?: TransformFn,
): Adapter => ({
	name: "static",
	load: async () => applyTransform(config, transform),
	loadSync: () => applyTransform(config, transform),
});

export default staticAdapter;
