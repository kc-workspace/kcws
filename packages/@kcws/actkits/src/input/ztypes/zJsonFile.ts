import { readFileSync } from "node:fs";
import type { z } from "zod";
import { createObjectParser } from "./createObjectParser";

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
> = createObjectParser((file) => JSON.parse(readFileSync(file, "utf-8")));
