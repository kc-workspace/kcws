import { z } from "zod";

/**
 * Zod schema for parsing comma/newline-separated string to array of numbers.
 * Supports both comma-separated and newline-separated values.
 * Use `.optional()` for optional fields.
 *
 * @example
 * ```ts
 * const schema = z.object({ ids: zNumberArray });
 * schema.parse({ ids: "1,2,3" }); // { ids: [1, 2, 3] }
 * schema.parse({ ids: "1\n2\n3" }); // { ids: [1, 2, 3] }
 * ```
 */
export const zNumberArray: z.ZodEffects<
	z.ZodArray<z.ZodNumber>,
	number[],
	unknown
> = z.preprocess((val) => {
	if (val === "" || val === undefined || val === null) return undefined;
	if (Array.isArray(val)) {
		return val.map((v) => {
			const num = Number(v);
			return Number.isNaN(num) ? v : num;
		});
	}
	if (typeof val === "string") {
		const separator = val.includes("\n") ? "\n" : ",";
		return val
			.split(separator)
			.map((s) => s.trim())
			.filter((s) => s.length > 0)
			.map((s) => {
				const num = Number(s);
				return Number.isNaN(num) ? s : num;
			});
	}
	return val;
}, z.array(z.number()));
