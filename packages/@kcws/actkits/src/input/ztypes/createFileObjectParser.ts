import { readFileSync } from "node:fs";

import { z } from "zod";

/**
 * Creates a Zod schema for parsing file path input to object using a custom parser.
 *
 * @param parser - Function to parse file content to object (e.g., JSON.parse, yaml.parse)
 * @returns Zod schema that parses file path input to Record<string, unknown>
 * @internal
 */
export const createFileObjectParser = (
	parser: (value: string) => unknown,
): z.ZodPreprocess<z.ZodRecord<z.ZodString, z.ZodUnknown>> =>
	z.preprocess(
		(val) => {
			if (val === "" || val === undefined || val === null) return undefined;
			if (typeof val === "object") return val;
			if (typeof val === "string") {
				try {
					const content = readFileSync(val, "utf8");
					return parser(content);
				} catch {
					return val;
				}
			}
			return val;
		},
		z.record(z.string(), z.unknown()),
	);
