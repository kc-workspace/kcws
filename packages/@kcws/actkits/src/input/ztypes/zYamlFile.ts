import { readFileSync } from "node:fs";
import { parse as parseYaml } from "yaml";
import type { z } from "zod";
import { createObjectParser } from "./createObjectParser";

/**
 * Zod schema for parsing YAML file path input to object.
 * Use `.optional()` for optional fields.
 *
 * @example
 * ```ts
 * const schema = z.object({ config: zYamlFile });
 * schema.parse({ config: "./config.yaml" }); // { config: { key: "value" } }
 * ```
 */
export const zYamlFile: z.ZodPreprocess<
	z.ZodRecord<z.ZodString, z.ZodUnknown>
> = createObjectParser((file) => parseYaml(readFileSync(file, "utf-8")));
