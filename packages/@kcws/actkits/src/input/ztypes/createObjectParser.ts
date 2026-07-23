import { z } from "zod";

/**
 * Creates a Zod schema for parsing string input to object using a custom parser.
 *
 * @param parser - Function to parse string to object (e.g., JSON.parse, yaml.parse)
 * @returns Zod schema that parses string input to Record<string, unknown>
 * @internal
 */
export const createObjectParser = (
	parser: (value: string) => unknown,
): z.ZodPreprocess<z.ZodRecord<z.ZodString, z.ZodUnknown>> =>
	z.preprocess(
		(val) => {
			if (val === "" || val === undefined || val === null) return undefined;
			if (typeof val === "object") return val;
			if (typeof val === "string") {
				try {
					return parser(val);
				} catch {
					return val;
				}
			}
			return val;
		},
		z.record(z.string(), z.unknown()),
	);
