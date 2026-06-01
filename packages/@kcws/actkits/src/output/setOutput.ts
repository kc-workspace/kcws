import { setOutput as coreSetOutput } from "@actions/core";

/**
 * Serializes a value to a string representation for GitHub Actions output.
 * @internal
 *
 * @param value - The value to serialize
 * @returns String representation of the value
 *
 * @example
 * ```ts
 * serializeOutput(true);   // "true"
 * serializeOutput(42);     // "42"
 * serializeOutput({ a: 1 }); // '{"a":1}'
 * serializeOutput(null);   // ""
 * ```
 */
const serializeOutput = (value: unknown): string => {
	if (value == null) {
		return "";
	}

	if (
		typeof value === "string" ||
		typeof value === "number" ||
		typeof value === "boolean" ||
		typeof value === "bigint"
	) {
		return String(value);
	}

	return JSON.stringify(value);
};

/**
 * Sets a single output value for GitHub Actions.
 *
 * Writes the output to the `GITHUB_OUTPUT` file using `@actions/core`
 * and returns the serialized value.
 *
 * @param name - The output name
 * @param value - The output value
 * @returns The serialized output value
 *
 * @example
 * ```ts
 * // In a GitHub Action environment
 * const version = setOutput("version", "1.0.0");
 * // Writes "version=1.0.0\n" to $GITHUB_OUTPUT
 * // Returns "1.0.0"
 * ```
 */
export const setOutput = (name: string, value: unknown): string => {
	const serialized = serializeOutput(value);
	coreSetOutput(name, serialized);
	return serialized;
};
