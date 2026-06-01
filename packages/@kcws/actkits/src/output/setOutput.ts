import { setOutput as coreSetOutput } from "@actions/core";

import type { OutputMap } from "./types";

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

/**
 * Sets multiple output values for GitHub Actions.
 *
 * @param outputs - A record of output names to values
 * @returns A record of output names to their serialized string values
 *
 * @example
 * ```ts
 * const results = setOutputs({
 *   name: "my-package",
 *   version: "1.0.0",
 *   published: true
 * });
 * // Returns { name: "my-package", version: "1.0.0", published: "true" }
 * ```
 */
export const setOutputs = <TOutputs extends OutputMap>(
	outputs: TOutputs,
): { [K in keyof TOutputs]: string } => {
	const serialized = {} as { [K in keyof TOutputs]: string };
	for (const [name, value] of Object.entries(outputs)) {
		serialized[name as keyof TOutputs] = setOutput(name, value);
	}

	return serialized;
};
