import { z } from "zod";

/**
 * Zod schema for parsing string input to boolean.
 * Follows YAML 1.2 Core Schema for boolean values.
 * Use `.optional()` for optional fields.
 *
 * Truthy values: "true", "True", "TRUE"
 * Falsy values: "false", "False", "FALSE"
 *
 * @see {@link https://yaml.org/spec/1.2.2/#10212-boolean | YAML 1.2 Boolean}
 *
 * @example
 * ```ts
 * const schema = z.object({ enabled: zBoolean });
 * schema.parse({ enabled: "true" }); // { enabled: true }
 * schema.parse({ enabled: "FALSE" }); // { enabled: false }
 * ```
 */
export const zBoolean: z.ZodPipe<z.ZodTransform, z.ZodBoolean> = z.preprocess(
	(val) => {
		if (val === "" || val === undefined || val === null) return undefined;
		if (typeof val === "boolean") return val;
		if (typeof val === "string") {
			const trimmed = val.trim();
			if (["true", "True", "TRUE"].includes(trimmed)) return true;
			if (["false", "False", "FALSE"].includes(trimmed)) return false;
		}
		return val;
	},
	z.boolean(),
);
