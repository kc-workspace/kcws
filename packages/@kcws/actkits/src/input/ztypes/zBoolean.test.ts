import { describe, expect, test } from "vitest";
import { z } from "zod";

import { zBoolean } from "./zBoolean";

describe("zBoolean", () => {
	const schema = z.object({ enabled: zBoolean });

	test.for([
		{ input: "true", expected: true },
		{ input: "True", expected: true },
		{ input: "TRUE", expected: true },
		{ input: "false", expected: false },
		{ input: "False", expected: false },
		{ input: "FALSE", expected: false },
		{ input: "  true  ", expected: true },
		{ input: true, expected: true },
		{ input: false, expected: false },
	])("should parse $input as $expected", ({ input, expected }) => {
		expect(schema.parse({ enabled: input })).toEqual({ enabled: expected });
	});

	test.for(["1", "yes", "YES", "on", "ON", "y", "Y"])(
		"should throw on YAML 1.1 truthy value '%s'",
		(input) => {
			expect(() => schema.parse({ enabled: input })).toThrow();
		},
	);

	test.for(["0", "no", "NO", "off", "OFF", "n", "N"])(
		"should throw on YAML 1.1 falsy value '%s'",
		(input) => {
			expect(() => schema.parse({ enabled: input })).toThrow();
		},
	);

	test.for([
		{ name: "empty string (required)", input: "" },
		{ name: "undefined (required)", input: undefined },
		{ name: "invalid boolean string", input: "maybe" },
		{ name: "number input", input: 42 },
		{ name: "object input", input: {} },
	])("should throw on $name", ({ input }) => {
		expect(() => schema.parse({ enabled: input })).toThrow();
	});

	test("should allow undefined with optional", () => {
		const optional = z.object({ enabled: zBoolean.optional() });
		expect(optional.parse({ enabled: undefined })).toEqual({
			enabled: undefined,
		});
	});

	test("should allow missing field with optional", () => {
		const optional = z.object({ enabled: zBoolean.optional() });
		expect(optional.parse({})).toEqual({});
	});
});
