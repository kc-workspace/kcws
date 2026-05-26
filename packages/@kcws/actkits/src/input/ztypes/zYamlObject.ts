import { parse as parseYaml } from "yaml";
import { z } from "zod";

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
> = z.preprocess((val) => {
	if (val === "" || val === undefined || val === null) return undefined;
	if (typeof val === "object") return val;
	if (typeof val === "string") {
		try {
			return parseYaml(val);
		} catch {
			return val;
		}
	}
	return val;
}, z.record(z.unknown()));
