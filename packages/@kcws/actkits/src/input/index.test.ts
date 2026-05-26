import { describe, expect, test } from "vitest";

import * as inputModule from "./index";

describe("input module exports", () => {
	test("should export z from zod", () => {
		expect(inputModule.z).toBeDefined();
		expect(inputModule.z.object).toBeTypeOf("function");
		expect(inputModule.z.string).toBeTypeOf("function");
		expect(inputModule.z.enum).toBeTypeOf("function");
	});

	test("should export parseInput function", () => {
		expect(inputModule.parseInput).toBeDefined();
		expect(inputModule.parseInput).toBeTypeOf("function");
	});

	test("should not have unexpected exports", () => {
		const expectedExports = ["z", "parseInput"];
		const actualExports = Object.keys(inputModule);

		expect(actualExports.sort()).toEqual(expectedExports.sort());
	});
});
