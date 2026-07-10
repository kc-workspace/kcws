import { describe, expect, test } from "vitest";
import { z } from "zod";

import { zBoolean } from "./zBoolean";

describe("zBoolean", () => {
	describe("YAML 1.2 truthy values", () => {
		test.each([
			"true",
			"True",
			"TRUE",
		])("should parse '%s' as true", (value) => {
			const schema = z.object({ enabled: zBoolean });
			expect(schema.parse({ enabled: value })).toEqual({ enabled: true });
		});
	});

	describe("YAML 1.2 falsy values", () => {
		test.each([
			"false",
			"False",
			"FALSE",
		])("should parse '%s' as false", (value) => {
			const schema = z.object({ enabled: zBoolean });
			expect(schema.parse({ enabled: value })).toEqual({ enabled: false });
		});
	});

	describe("YAML 1.1 values (not supported in 1.2)", () => {
		test.each([
			"1",
			"yes",
			"YES",
			"on",
			"ON",
			"y",
			"Y",
		])("should throw on '%s' (not valid in YAML 1.2)", (value) => {
			const schema = z.object({ enabled: zBoolean });
			expect(() => schema.parse({ enabled: value })).toThrow();
		});

		test.each([
			"0",
			"no",
			"NO",
			"off",
			"OFF",
			"n",
			"N",
		])("should throw on '%s' (not valid in YAML 1.2)", (value) => {
			const schema = z.object({ enabled: zBoolean });
			expect(() => schema.parse({ enabled: value })).toThrow();
		});
	});

	test("should pass through actual boolean true", () => {
		const schema = z.object({ enabled: zBoolean });
		expect(schema.parse({ enabled: true })).toEqual({ enabled: true });
	});

	test("should pass through actual boolean false", () => {
		const schema = z.object({ enabled: zBoolean });
		expect(schema.parse({ enabled: false })).toEqual({ enabled: false });
	});

	test("should throw on empty string (required)", () => {
		const schema = z.object({ enabled: zBoolean });
		expect(() => schema.parse({ enabled: "" })).toThrow();
	});

	test("should throw on undefined (required)", () => {
		const schema = z.object({ enabled: zBoolean });
		expect(() => schema.parse({ enabled: undefined })).toThrow();
	});

	test("should throw on invalid boolean string", () => {
		const schema = z.object({ enabled: zBoolean });
		expect(() => schema.parse({ enabled: "maybe" })).toThrow();
	});

	test("should allow undefined with optional", () => {
		const schema = z.object({ enabled: zBoolean.optional() });
		expect(schema.parse({ enabled: undefined })).toEqual({
			enabled: undefined,
		});
	});

	test("should allow missing field with optional", () => {
		const schema = z.object({ enabled: zBoolean.optional() });
		expect(schema.parse({})).toEqual({});
	});

	test("should handle whitespace around value", () => {
		const schema = z.object({ enabled: zBoolean });
		expect(schema.parse({ enabled: "  true  " })).toEqual({ enabled: true });
	});

	test("should throw on non-string non-boolean input (number)", () => {
		const schema = z.object({ enabled: zBoolean });
		expect(() => schema.parse({ enabled: 42 })).toThrow();
	});

	test("should throw on non-string non-boolean input (object)", () => {
		const schema = z.object({ enabled: zBoolean });
		expect(() => schema.parse({ enabled: {} })).toThrow();
	});
});
