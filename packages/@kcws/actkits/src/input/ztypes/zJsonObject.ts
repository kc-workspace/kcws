import { z } from "zod";

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
export const zJsonObject: z.ZodEffects<
	z.ZodRecord<z.ZodString, z.ZodUnknown>,
	Record<string, unknown>,
	unknown
> = z.preprocess((val) => {
	if (val === "" || val === undefined || val === null) return undefined;
	if (typeof val === "object") return val;
	if (typeof val === "string") {
		try {
			return JSON.parse(val);
		} catch {
			return val;
		}
	}
	return val;
}, z.record(z.unknown()));
