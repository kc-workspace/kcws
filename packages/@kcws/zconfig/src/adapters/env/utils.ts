import { env as pEnv } from "node:process";
import type { EnvObject, RawConfig } from "#types";
import { decodeEnvObject } from "#utils/env";
import { applyTransform } from "#utils/transforms";
import type { EnvAdapterOptions } from "./types";

/**
 * Normalizes the options for the env adapter, providing default values for missing options.
 *
 * @param options - the options to normalize
 * @returns the normalized options
 */
export const normalizeOptions = (
	options: Partial<EnvAdapterOptions>,
): EnvAdapterOptions => {
	const output: EnvAdapterOptions = {
		pathSeparator: options.pathSeparator ?? "__",
		processEnv: options.processEnv ?? (pEnv as EnvObject),
	};
	if (options.transform) output.transform = options.transform;
	if (options.prefix) output.prefix = options.prefix;
	return output;
};

/** Create a config object from an env object, applying the prefix and path separator
 * to decode the env names into a nested config object. The transform function is
 * applied to each leaf of the config object.
 * @param env - the env object to load the config from, or `false` for an empty source
 * @param options - the options for the env adapter
 * @returns a config object with the decoded keys and transformed values
 */
export const createConfig = (
	env: EnvObject | false,
	options: EnvAdapterOptions,
): RawConfig => {
	const config =
		env === false
			? Object.create(null)
			: decodeEnvObject(env, options.prefix, options.pathSeparator);

	return applyTransform(config, options.transform);
};
