import { getInput } from "@actions/core";
import { describe, expect, test, vi } from "vitest";
import { z } from "zod";

import { parseInput } from "./parseInput";

vi.mock("@actions/core", () => ({
	getInput: vi.fn(() => ""),
}));

const mockGetInput = (mapper: string | Record<string, string>) => {
	vi.mocked(getInput).mockImplementation((key, opt) => {
		if (typeof mapper === "string") return mapper;
		const output = mapper[key] ?? "";
		return opt?.trimWhitespace ? output.trim() : output;
	});
};

const getInputOption = {
	trimWhitespace: true,
	required: false,
};

describe(parseInput.name, () => {
	test("should support default value from schema", () => {
		const schema = z.object({
			key: z.string().default("default"),
		});

		const input = parseInput(schema);

		expect(input).toEqual({ key: "default" });
	});

	test("should call getInput for each key", () => {
		mockGetInput({ key: "mocked" });
		const schema = z.object({
			key: z.string(),
			value: z.string().optional(),
		});

		const input = parseInput(schema);

		expect(input).toEqual({ key: "mocked" });
		expect(getInput).toHaveBeenNthCalledWith(1, "key", getInputOption);
		expect(getInput).toHaveBeenNthCalledWith(2, "value", getInputOption);
	});

	test("env should override getInput", () => {
		mockGetInput({ key: "mocked" });
		const schema = z.object({
			key: z.string(),
		});
		const input = parseInput(schema, undefined, {
			INPUT__KEY: "env",
		});

		expect(input).toEqual({ key: "env" });
	});

	test("should read custom env prefix", () => {
		mockGetInput({ key: "mocked" });
		const schema = z.object({
			key: z.string(),
		});
		const input = parseInput(schema, "custom", {
			CUSTOM__KEY: "env",
		});

		expect(input).toEqual({ key: "env" });
	});

	type TestCase = [string, string | undefined, string | undefined];
	test.each([
		["", undefined, undefined] as TestCase,
		["", "", undefined] as TestCase,
		["i", undefined, "i"] as TestCase,
		["i", "", "i"] as TestCase,
		["", "e", "e"] as TestCase,
		["i", "e", "e"] as TestCase,
	])(
		"when input='%s' env='%s' should return '%s'",
		(inputValue, envValue, expected) => {
			mockGetInput({ key: inputValue });
			const schema = z.object({
				key: z.string().optional(),
			});
			const input = parseInput(schema, undefined, {
				INPUT__KEY: envValue,
			});

			expect(input).toEqual({ key: expected });
		},
	);

	test("should throw error if schema is not a ZodObject", () => {
		expect(() => parseInput(z.string())).toThrow("schema must be a ZodObject");
	});

	test("should throw error if schema is not a ZodObject", () => {
		const schema = z.object({
			key: z.string(),
		});
		expect(() => parseInput(schema)).not.toThrow(
			"Invalid option: expected string, received undefined",
		);
	});

	test("should throw error for invalid value", () => {
		mockGetInput({ key: "1" });
		const schema = z.object({
			key: z.enum(["true", "false"]),
		});

		expect(() => parseInput(schema)).toThrow("Invalid option: expected one of");
	});

	test("should trim whitespace from input values", () => {
		mockGetInput({ key: "  value  " });
		const schema = z.object({
			key: z.string(),
		});

		const input = parseInput(schema);

		expect(input).toEqual({ key: "value" });
	});

	test("should not trim whitespace from env values", () => {
		mockGetInput({ key: "  value  " });
		const schema = z.object({
			key: z.string(),
		});

		const input = parseInput(schema, undefined, {
			INPUT__KEY: "  env  ",
		});

		expect(input).toEqual({ key: "  env  " });
	});
});
