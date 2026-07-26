import type { z } from "zod";

import { createFileObjectParser } from "./createFileObjectParser";

/**
 * Zod schema for parsing JSON file path input to object.
 * Use `.optional()` for optional fields.
 *
 * @example
 * ```ts
 * const schema = z.object({ config: zJsonFile });
 * schema.parse({ config: "./config.json" }); // { config: { key: "value" } }
 * ```
 */
export const zJsonFile: z.ZodPreprocess<
	z.ZodRecord<z.ZodString, z.ZodUnknown>
> = createFileObjectParser(JSON.parse);
