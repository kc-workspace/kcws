import { describe, expect, test } from "vitest";
import { z } from "zod";

import { zNumber } from "./zNumber";

describe("zNumber", () => {
	test("should parse numeric string to number", () => {
		const schema = z.object({ count: zNumber });
		expect(schema.parse({ count: "42" })).toEqual({ count: 42 });
	});

	test("should parse negative number string", () => {
		const schema = z.object({ count: zNumber });
		expect(schema.parse({ count: "-10" })).toEqual({ count: -10 });
	});

	test("should parse float string", () => {
		const schema = z.object({ count: zNumber });
		expect(schema.parse({ count: "3.14" })).toEqual({ count: 3.14 });
	});

	test("should parse zero", () => {
		const schema = z.object({ count: zNumber });
		expect(schema.parse({ count: "0" })).toEqual({ count: 0 });
	});

	test("should pass through actual number", () => {
		const schema = z.object({ count: zNumber });
		expect(schema.parse({ count: 42 })).toEqual({ count: 42 });
	});

	test("should throw on empty string (required)", () => {
		const schema = z.object({ count: zNumber });
		expect(() => schema.parse({ count: "" })).toThrow();
	});

	test("should throw on undefined (required)", () => {
		const schema = z.object({ count: zNumber });
		expect(() => schema.parse({ count: undefined })).toThrow();
	});

	test("should throw on invalid number string", () => {
		const schema = z.object({ count: zNumber });
		expect(() => schema.parse({ count: "abc" })).toThrow();
	});

	test("should allow undefined with optional", () => {
		const schema = z.object({ count: zNumber.optional() });
		expect(schema.parse({ count: undefined })).toEqual({ count: undefined });
	});

	test("should allow missing field with optional", () => {
		const schema = z.object({ count: zNumber.optional() });
		expect(schema.parse({})).toEqual({});
	});
});
