import { resolve } from "node:path";
import { env as pEnv } from "node:process";
import type { RawConfig } from "#types";
import { applyTransform } from "../../utils/transforms";
import type {
	DotenvFlag,
	DotenvModule,
	EnvAdapterOptions,
	EnvObject,
} from "./types";

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
		dotenv: options.dotenv ?? true,
		customEnv: options.customEnv ?? false,
		processEnv: options.processEnv ?? (pEnv as EnvObject),
	};
	if (options.transform) output.transform = options.transform;
	if (options.prefix) output.prefix = options.prefix;
	return output;
};

/**
 * Load env from 3 places: custom object, dotenv file, and process.env
 * process.env is always the last source, so it will override any previous values
 * @param mod - the dotenv module
 * @param options - the options for the env adapter
 * @returns an object containing the merged env values
 */
export const loadEnv = (
	mod: DotenvModule,
	{ processEnv, customEnv, dotenv }: EnvAdapterOptions,
): EnvObject => {
	const envs: EnvObject = Object.create(null);
	// Load order: process.env > dotenv file > custom object
	if (customEnv !== false) {
		for (const [key, value] of Object.entries(customEnv)) {
			if (value !== undefined) envs[key] = value;
		}
	}
	if (dotenv !== false) {
		const [required, dotenvPath] = getDotenvPath(dotenv);
		if (dotenvPath) {
			const result = mod.config({
				path: dotenvPath,
				encoding: "utf8",
				processEnv: envs,
				override: true,
				debug: false,
			});
			if (required && result.error) throw result.error;
		}
	}
	if (processEnv !== false) {
		for (const [key, value] of Object.entries(processEnv)) {
			if (value !== undefined) envs[key] = value;
		}
	}
	return envs;
};

/**
 * Create a config object from an env object, applying the prefix and path separator
 * to decode the env names into a nested config object. The transform function is
 * applied to each leaf of the config object.
 * @param env - the env object to load the config from
 * @param options - the options for the env adapter
 * @returns a config object with the decoded keys and transformed values
 */
export const createConfig = (
	env: EnvObject,
	options: EnvAdapterOptions,
): RawConfig => {
	const config: RawConfig = Object.create(null);
	const pathSeparator = options.pathSeparator;
	for (const [name, value] of Object.entries(env)) {
		const key = decodeEnvKey(name, options.prefix, pathSeparator);
		if (key !== undefined) setPath(config, key, value);
	}

	return applyTransform(config, options.transform);
};

/** Get the path to the dotenv file based on input dotenv option */
const getDotenvPath = (
	dotenv: DotenvFlag,
): [boolean, string | string[] | undefined] => {
	if (dotenv === false) {
		return [false, undefined];
	} else if (dotenv === true || dotenv === undefined) {
		return [false, resolve(process.cwd(), ".env")];
	} else if (typeof dotenv === "string") {
		return [true, resolve(process.cwd(), dotenv)];
	} else {
		return [false, dotenv];
	}
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
