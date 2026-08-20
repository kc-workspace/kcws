import { env as pEnv } from "node:process";
import type { RawConfig } from "#types";
import { applyTransform } from "../../utils/transforms";
import type { EnvAdapterOptions, EnvObject } from "./types";

/**
 * Encodes a camelCase key path into an env name.
 * @param key key path
 * @param prefix env prefix
 * @param sep  separator used in the environment variable name
 * @returns encoded env name
 */
export const encodeEnvKey = (
	key: string[],
	prefix: string | undefined,
	sep: string,
): string => {
	const prefixVal = getPrefixVal(prefix);
	if (prefixVal === undefined) {
		return convertCamelToSnake(key.join(sep));
	} else {
		return `${prefixVal}${convertCamelToSnake(key.join(sep))}`;
	}
};

/**
 * Decodes an env name into a camelCase key path.
 * @param key env name
 * @param prefix env prefix
 * @param sep separator used in the environment variable name
 * @returns camelCase key path or undefined if the key does not match the prefix
 */
export const decodeEnvKey = (
	key: string,
	prefix: string | undefined,
	sep: string,
): string[] | undefined => {
	const prefixVal = getPrefixVal(prefix);
	const encoded =
		prefixVal === undefined
			? key
			: key.startsWith(prefixVal)
				? key.slice(prefixVal.length)
				: undefined;
	if (encoded === undefined) return undefined;

	const segments = encoded.split(sep);
	if (
		segments.some(
			(segment) =>
				segment.length === 0 ||
				segment.startsWith("_") ||
				segment.endsWith("_"),
		)
	) {
		return undefined;
	}

	return segments.map(convertSnakeToCamel);
};

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

/**
 * Decodes a flat env object into a nested configuration object, using the
 * prefix and path separator to decode env names into camelCase key paths.
 * Shared by {@link envAdapter} and the dotenv adapter so both decode keys
 * identically.
 * @param env - the env object to decode
 * @param prefix - env prefix
 * @param pathSeparator - separator used in the environment variable name
 * @returns a config object with the decoded keys
 */
export const decodeEnvObject = (
	env: EnvObject,
	prefix: string | undefined,
	pathSeparator: string,
): RawConfig => {
	const config: RawConfig = Object.create(null);
	for (const [name, value] of Object.entries(env)) {
		const key = decodeEnvKey(name, prefix, pathSeparator);
		if (key !== undefined) setPath(config, key, value);
	}
	return config;
};

/**
 * Create a config object from an env object, applying the prefix and path separator
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

/** Set a value at the specified path in the target object */
const setPath = (target: RawConfig, path: string[], value: string): void => {
	let cursor = target;
	for (const [index, segment] of path.entries()) {
		if (index === path.length - 1) {
			cursor[segment] = value;
			return;
		}

		const existing = cursor[segment];
		if (
			existing !== null &&
			typeof existing === "object" &&
			!Array.isArray(existing)
		) {
			cursor = existing as RawConfig;
		} else {
			const next: RawConfig = Object.create(null);
			cursor[segment] = next;
			cursor = next;
		}
	}
};

const getPrefixVal = (prefix: string | undefined): string | undefined => {
	if (prefix === undefined || prefix === "") return undefined;
	else if (prefix.endsWith("_")) return prefix;
	else return `${prefix}_`;
};

const convertCamelToSnake = (str: string): string =>
	str.replace(/([A-Z])/g, "_$1").toUpperCase();

const convertSnakeToCamel = (str: string): string =>
	str.toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
