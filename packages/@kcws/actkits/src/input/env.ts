import { env as dEnv } from "node:process";

const DEFAULT_INPUT_NS_SEP = "__";
const DEFAULT_INPUT_KY_SEP = "_";
const DEFAULT_INPUT_PREFIX = "INPUT";
const MAX_ENV_KEY_LENGTH = 128;

/** Characters that act as separators (split into segments or replaced) */
const SEPARATOR_CHARS = /[./ -]/;
/** Valid characters: alphanumeric, dot, slash, dash, space, underscore */
const VALID_CHARS = /^[a-zA-Z0-9./ _-]*$/;
/** Two or more separator characters in a row */
const CONSECUTIVE_SEPARATORS = /[./ -]{2,}/;

/**
 * Validates a key or prefix string for environment variable conversion.
 * @throws Error if the value contains invalid patterns
 */
const validateEnvPart = (value: string, name: "key" | "prefix"): void => {
	if (name === "key" && value === "") throw new Error("Key must not be empty");

	if (value !== "" && !VALID_CHARS.test(value)) {
		throw new Error(
			`Invalid ${name}: contains invalid characters. Only alphanumeric, dot, slash, dash, space, and underscore are allowed`,
		);
	}

	if (CONSECUTIVE_SEPARATORS.test(value)) {
		throw new Error(
			`Invalid ${name}: consecutive separator characters (., /, -, space) are not allowed`,
		);
	}

	if (value !== "" && SEPARATOR_CHARS.test(value.at(0) ?? "")) {
		throw new Error(
			`Invalid ${name}: cannot start with a separator character (., /, -, space)`,
		);
	}

	if (value !== "" && SEPARATOR_CHARS.test(value.at(-1) ?? "")) {
		throw new Error(
			`Invalid ${name}: cannot end with a separator character (., /, -, space)`,
		);
	}
};

const getEnvKey = (
	key: string,
	prefix: string = DEFAULT_INPUT_PREFIX,
): string => {
	validateEnvPart(key, "key");
	validateEnvPart(prefix, "prefix");

	const result = (prefix === "" ? [] : prefix.split(/[./]/))
		.concat(key.split(/[./]/))
		.join(DEFAULT_INPUT_NS_SEP)
		.replaceAll(/[ -]/g, DEFAULT_INPUT_KY_SEP)
		.toUpperCase();

	if (result.length > MAX_ENV_KEY_LENGTH) {
		throw new Error(
			`Environment variable name exceeds maximum length of ${MAX_ENV_KEY_LENGTH} characters (got ${result.length})`,
		);
	}

	return result;
};

/**
 * Retrieves an environment variable value using GitHub Actions input naming conventions.
 *
 * The key and optional prefix are transformed into an environment variable name:
 * - Dots (`.`) and slashes (`/`) split segments joined by `__` (namespace separator)
 * - Dashes (`-`) and spaces are replaced with `_` (key separator)
 * - The entire name is converted to uppercase
 *
 * @param key - The input key name (e.g., `"token"`, `"config.path"`, `"api/endpoint"`)
 * @param prefix - Optional prefix for the environment variable (default: `"INPUT"`)
 *   - Use empty string `""` for no prefix
 *   - Supports dot/slash notation (e.g., `"my.action"`, `"org/repo"`)
 * @param env - Environment object to read from (default: `process.env`)
 * @returns The environment variable value, or `undefined` if not found
 * @throws Error if key is empty or contains invalid characters
 * @throws Error if key/prefix has consecutive separators or starts/ends with separator
 * @throws Error if resulting env key exceeds 128 characters
 *
 * @includeExample
 */
export const getEnv = (
	key: string,
	prefix?: string,
	env: Readonly<ActionEnv> = dEnv,
): string | undefined => {
	const envKey = getEnvKey(key, prefix);
	return env[envKey];
};

/**
 * Environment object type compatible with `process.env`.
 * Maps string keys to optional string values.
 */
export type ActionEnv = Record<string, string | undefined>;
