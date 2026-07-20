import type { z } from "zod";

import { createObjectParser } from "./createObjectParser";

/**
 * Zod schema for parsing JSON string input to object.
 * Use `.optional()` for optional fields.
 *
 * @example
 * ```ts
 * const schema = z.object({ config: zJsonObject });
 * schema.parse({ config: '{"key": "value"}' }); // { config: { key: "value" } }
 * ```
 */
export const zJsonObject: z.ZodPreprocess<
	z.ZodRecord<z.ZodString, z.ZodUnknown>
> = createObjectParser(JSON.parse);
