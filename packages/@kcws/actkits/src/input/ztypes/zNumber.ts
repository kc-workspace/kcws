import { z } from "zod";

/**
 * Zod schema for parsing string input to number.
 * Use `.optional()` for optional fields.
 *
 * @example
 * ```ts
 * const schema = z.object({ count: zNumber, optional: zNumber.optional() });
 * schema.parse({ count: "42" }); // { count: 42 }
 * ```
 */
export const zNumber: z.ZodPreprocess<z.ZodNumber> = z.preprocess((val) => {
	if (val === "" || val === undefined || val === null) return undefined;
	const num = Number(val);
	return Number.isNaN(num) ? val : num;
}, z.number());
