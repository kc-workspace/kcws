import { parse as parseYaml } from "yaml";
import type { z } from "zod";

import { createObjectParser } from "./createObjectParser";

/**
 * Zod schema for parsing YAML string input to object.
 * Use `.optional()` for optional fields.
 *
 * @example
 * ```ts
 * const schema = z.object({ config: zYamlObject });
 * schema.parse({ config: "key: value" }); // { config: { key: "value" } }
 * ```
 */
export const zYamlObject: z.ZodEffects<
	z.ZodRecord<z.ZodString, z.ZodUnknown>,
	Record<string, unknown>,
	unknown
> = createObjectParser(parseYaml);
