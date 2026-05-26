import { createNumberArrayParser } from "./createArrayParser";

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
export const zNumberArray = createNumberArrayParser();
