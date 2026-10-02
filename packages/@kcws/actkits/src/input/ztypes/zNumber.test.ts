import { describe, expect, test } from "vitest";
import { z } from "zod";

import { zNumber } from "./zNumber";

describe("zNumber", () => {
	const schema = z.object({ count: zNumber });

	test.for([
		{ name: "numeric string", input: "42", expected: 42 },
		{ name: "negative number string", input: "-10", expected: -10 },
		{ name: "float string", input: "3.14", expected: 3.14 },
		{ name: "zero", input: "0", expected: 0 },
		{ name: "actual number", input: 42, expected: 42 },
	])("should parse $name", ({ input, expected }) => {
		expect(schema.parse({ count: input })).toEqual({ count: expected });
	});

	test.for([
		{ name: "empty string (required)", input: "" },
		{ name: "undefined (required)", input: undefined },
		{ name: "invalid number string", input: "abc" },
	])("should throw on $name", ({ input }) => {
		expect(() => schema.parse({ count: input })).toThrow();
	});

	test("should allow undefined with optional", () => {
		const optional = z.object({ count: zNumber.optional() });
		expect(optional.parse({ count: undefined })).toEqual({ count: undefined });
	});

	test("should allow missing field with optional", () => {
		const optional = z.object({ count: zNumber.optional() });
		expect(optional.parse({})).toEqual({});
	});
});
