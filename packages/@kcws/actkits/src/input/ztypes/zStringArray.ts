import { z } from "zod";

/**
 * Zod schema for parsing comma/newline-separated string to array of strings.
 * Supports both comma-separated and newline-separated values.
 * Use `.optional()` for optional fields.
 *
 * @example
 * ```ts
 * const schema = z.object({ tags: zStringArray });
 * schema.parse({ tags: "a,b,c" }); // { tags: ["a", "b", "c"] }
 * schema.parse({ tags: "a\nb\nc" }); // { tags: ["a", "b", "c"] }
 * ```
 */
export const zStringArray: z.ZodEffects<
	z.ZodArray<z.ZodString>,
	string[],
	unknown
> = z.preprocess((val) => {
	if (val === "" || val === undefined || val === null) return undefined;
	if (Array.isArray(val)) return val;
	if (typeof val === "string") {
		const separator = val.includes("\n") ? "\n" : ",";
		return val
			.split(separator)
			.map((s) => s.trim())
			.filter((s) => s.length > 0);
	}
	return val;
}, z.array(z.string()));
