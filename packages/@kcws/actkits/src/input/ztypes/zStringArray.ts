import { z } from "zod";

import { createArrayParser } from "./createArrayParser";

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
export const zStringArray: z.ZodPipe<
	z.ZodTransform,
	z.ZodArray<z.ZodString>
> = createArrayParser(z.string(), (val) => {
	if (Array.isArray(val)) return val;
	return undefined;
});
