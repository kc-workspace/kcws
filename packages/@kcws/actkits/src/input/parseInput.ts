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
		const shape = schema.shape as Record<string, z.ZodType>;
		for (const [key] of Object.entries(shape)) {
			const envValue = getEnv(key, prefix, env);
			// inputValue is always returns a string
			const inputValue = getInput(key, {
				trimWhitespace: true,
				required: false,
			});

			if ((envValue?.length ?? 0) > 0) data[key] = envValue;
			else if (inputValue.length > 0) data[key] = inputValue;
			else data[key] = undefined;
		}
	} else {
		const msg = `schema must be a ZodObject, got ${schema.constructor.name}`;
		throw new Error(msg);
	}
	return schema.parse(data);
};
