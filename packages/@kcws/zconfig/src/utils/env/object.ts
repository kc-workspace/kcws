import type { EnvObject, RawConfig } from "#types";
import { decodeEnvKey } from "./key";

/**
 * Decodes a flat env object into a nested configuration object, using the
 * prefix and path separator to decode env names into camelCase key paths.
 * Shared by {@link envAdapter} and the dotenv adapter so both decode keys
 * identically.
 * @param env the env object to decode
 * @param prefix env prefix
 * @param pathSeparator separator used in the environment variable name
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

/** Set a value at the specified path in the target object. */
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
