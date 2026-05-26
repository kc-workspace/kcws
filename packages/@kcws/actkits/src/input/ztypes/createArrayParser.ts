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
 * Creates a Zod schema for parsing comma/newline-separated string to array of strings.
 *
 * @returns Zod schema that parses string input to string[]
 * @internal
 */
export const createStringArrayParser = (): z.ZodEffects<
	z.ZodArray<z.ZodString>,
	string[],
	unknown
> =>
	z.preprocess((val) => {
		if (val === "" || val === undefined || val === null) return undefined;
		if (Array.isArray(val)) return val;
		if (typeof val === "string") return splitString(val);
		return val;
	}, z.array(z.string()));

/**
 * Creates a Zod schema for parsing comma/newline-separated string to array of numbers.
 *
 * @returns Zod schema that parses string input to number[]
 * @internal
 */
export const createNumberArrayParser = (): z.ZodEffects<
	z.ZodArray<z.ZodNumber>,
	number[],
	unknown
> =>
	z.preprocess((val) => {
		if (val === "" || val === undefined || val === null) return undefined;

		const toNumber = (v: unknown): unknown => {
			const num = Number(v);
			return Number.isNaN(num) ? v : num;
		};

		if (Array.isArray(val)) return val.map(toNumber);
		if (typeof val === "string") return splitString(val).map(toNumber);
		return val;
	}, z.array(z.number()));
