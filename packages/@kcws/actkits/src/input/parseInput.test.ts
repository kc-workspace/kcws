import { describe, expect, test, vi } from "vitest";
import { z } from "zod";

import { parseInput } from "./parseInput";

vi.mock("@actions/core", () => ({
	getInput: vi.fn(() => ""),
}));

describe("parseInput", () => {
	describe("basic parsing", () => {
		test("should parse simple schema from env", () => {
			const schema = z.object({
				mode: z.enum(["warn", "fail"]),
				token: z.string(),
			});

			const result = parseInput(schema, undefined, {
				INPUT__MODE: "warn",
				INPUT__TOKEN: "secret-token",
			});

			expect(result).toEqual({
				mode: "warn",
				token: "secret-token",
			});
		});

		test("should parse schema with transformations", () => {
			const schema = z.object({
				count: z.string().transform((val) => Number.parseInt(val, 10)),
				enabled: z.enum(["true", "false"]).transform((val) => val === "true"),
			});

			const result = parseInput(schema, undefined, {
				INPUT__COUNT: "42",
				INPUT__ENABLED: "true",
			});

			expect(result).toEqual({
				count: 42,
				enabled: true,
			});
		});

		test("should parse schema with default values when env is provided", () => {
			const schema = z.object({
				mode: z.string().default("default-mode"),
				value: z.string(),
			});

			const result = parseInput(schema, undefined, {
				INPUT__MODE: "custom-mode",
				INPUT__VALUE: "provided",
			});

			expect(result).toEqual({
				mode: "custom-mode",
				value: "provided",
			});
		});
	});

	describe("with custom prefix", () => {
		test("should parse with dot notation prefix", () => {
			const schema = z.object({
				mode: z.enum(["warn", "fail"]),
				token: z.string(),
			});

			const result = parseInput(schema, "my.action", {
				MY__ACTION__MODE: "fail",
				MY__ACTION__TOKEN: "custom-token",
			});

			expect(result).toEqual({
				mode: "fail",
				token: "custom-token",
			});
		});

		test("should parse with path notation prefix", () => {
			const schema = z.object({
				mode: z.enum(["warn", "fail"]),
				token: z.string(),
			});

			const result = parseInput(schema, "org/abc", {
				ORG__ABC__MODE: "fail",
				ORG__ABC__TOKEN: "custom-token",
			});

			expect(result).toEqual({
				mode: "fail",
				token: "custom-token",
			});
		});
	});

	describe("validation errors", () => {
		test("should throw error for invalid enum value", () => {
			const schema = z.object({
				mode: z.enum(["warn", "fail"]),
			});

			expect(() =>
				parseInput(schema, undefined, {
					INPUT__MODE: "invalid",
				}),
			).toThrow();
		});

		test("should throw error for missing required field", () => {
			const schema = z.object({
				required: z.string().min(1),
			});

			expect(() => parseInput(schema, undefined, {})).toThrow();
		});
	});

	describe("edge cases", () => {
		test("should handle empty env object with fallback to getInput", () => {
			const schema = z.object({
				optional: z.string().optional(),
			});

			// When env is empty, getInput mock returns empty string
			const result = parseInput(schema, undefined, {});

			expect(result).toEqual({
				optional: "",
			});
		});

		test("should handle schema with optional fields", () => {
			const schema = z.object({
				optional: z.string().optional(),
				required: z.string(),
			});

			// When env value is missing, getInput mock returns empty string
			const result = parseInput(schema, undefined, {
				INPUT__REQUIRED: "value",
			});

			expect(result).toEqual({
				optional: "",
				required: "value",
			});
		});

		test("should handle whitespace in values", () => {
			const schema = z.object({
				value: z.string(),
			});

			const result = parseInput(schema, undefined, {
				INPUT__VALUE: "  trimmed  ",
			});

			expect(result).toEqual({
				value: "  trimmed  ",
			});
		});
	});
});
