import { getInput } from "@actions/core";
import { z } from "zod";
import { type ActionEnv, getEnv } from "./env";

/**
 * Parses and validates GitHub Actions inputs against a Zod schema.
 *
 * For each key in the schema, the function attempts to read the value from:
 * 1. Environment variables (via {@link getEnv})
 * 2. GitHub Actions inputs (via `@actions/core` `getInput`)
 *
 * The first non-undefined value is used. Values are then validated and
 * transformed according to the provided Zod schema.
 *
 * @typeParam S - Zod schema type (typically `z.ZodObject`)
 * @param schema - Zod schema defining the expected input shape and validation rules
 * @param prefix - Optional prefix for environment variables (default: `"INPUT"`)
 * @param env - Optional environment object (default: `process.env`)
 * @returns Parsed and validated input object matching the schema type
 * @throws ZodError if validation fails
 *
 * @includeExample
 */
export const parseInput = <S extends z.ZodType>(
	schema: S,
	prefix?: string,
	env?: Readonly<ActionEnv>,
): z.infer<S> => {
	const data: ActionEnv = {};
	if (schema instanceof z.ZodObject) {
		const shape = schema.shape as Record<string, z.ZodSchema>;
		for (const [key] of Object.entries(shape)) {
			const envValue = getEnv(key, prefix, env);
			const inputValue = getInput(key, {
				trimWhitespace: true,
				required: false,
			});
			data[key] = envValue ?? inputValue ?? undefined;
		}
	}
	return schema.parse(data);
};
