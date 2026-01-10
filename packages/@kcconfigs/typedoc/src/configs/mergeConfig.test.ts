import { describe, expect, test } from "vitest";
import { mergeConfig } from "./mergeConfig";
import type { UserConfig } from "./model";

describe("mergeConfig", () => {
	test("should merge base config with no overrides", () => {
		const base: UserConfig = {};
		const result = mergeConfig(base);
		expect(result).toBeDefined();
		expect(typeof result).toBe("object");
	});

	test("should apply single override", () => {
		const base: UserConfig = {};
		const override: UserConfig = { sort: ["visibility"] };
		const result = mergeConfig(base, override);

		expect(result.sort).toEqual(["visibility"]);
	});

	test("should apply multiple overrides in order", () => {
		const base: UserConfig = { sort: ["visibility"] };
		const override1: UserConfig = { sort: ["alphabetical"] };
		const override2: UserConfig = { sort: ["static-first"] };
		const result = mergeConfig(base, override1, override2);

		expect(result.sort).toContain("static-first");
	});

	test("should skip undefined overrides", () => {
		const base: UserConfig = { sort: ["visibility"] };
		const result = mergeConfig(base, undefined);

		expect(result).toBeDefined();
	});

	test("should merge multiple overrides without base config", () => {
		const override1: UserConfig = {};
		const override2: UserConfig = { sort: ["alphabetical"] };
		const result = mergeConfig(override1, override2);

		expect(result).toBeDefined();
		expect(result.sort).toEqual(["alphabetical"]);
	});

	test("should merge multiple configurations", () => {
		const base: UserConfig = {};
		const override: UserConfig = {};
		const result = mergeConfig(base, override);

		expect(result).toBeDefined();
	});
});
