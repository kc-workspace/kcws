import { z } from "zod";

/**
 * Splits a string by newline (if present) or comma, trims each item,
 * and filters out empty items.
 *
 * @param val - String to split
 * @returns Array of trimmed non-empty strings
 * @internal
 */
const splitString = (val: string): string[] => {
	const separator = val.includes("\n") ? "\n" : ",";
	return val
		.split(separator)
		.map((s) => s.trim())
		.filter((s) => s.length > 0);
};

/**
 * Creates a Zod schema for parsing string to array.
 *
 * @returns Zod schema that parses string input to array
 * @internal
 */
export const createArrayParser = <T extends z.ZodType>(
	type: T,
	parser: (val: string | string[]) => z.input<z.ZodOptional<z.ZodArray<T>>>,
): z.ZodPipe<
	z.ZodTransform<ReturnType<typeof parser>, Parameters<typeof parser>[0]>,
	z.ZodArray<T>
> =>
	z.preprocess((val) => {
		if (val === "" || val === undefined || val === null) return undefined;
		if (typeof val === "string") return parser(splitString(val));
		return parser(val);
	}, z.array(type));
