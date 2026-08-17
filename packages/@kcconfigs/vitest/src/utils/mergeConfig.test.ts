import { describe, expect, test } from "vitest";
import type { UserConfig } from "../models";
import mergeConfig from "./mergeConfig";

describe("mergeConfig", () => {
	test("should return the base config when no overrides are provided", () => {
		const base: UserConfig = { test: { environment: "node" } };

		expect(mergeConfig(base)).toBe(base);
	});

	test("should merge nested config values", () => {
		const base: UserConfig = {
			test: { environment: "node", restoreMocks: true },
		};
		const result = mergeConfig(base, {
			test: { clearMocks: true },
		});

		expect(result.test).toMatchObject({
			environment: "node",
			restoreMocks: true,
			clearMocks: true,
		});
	});

	test("should apply overrides from left to right", () => {
		const base: UserConfig = { test: { environment: "node" } };
		const result = mergeConfig(
			base,
			{ test: { environment: "jsdom" } },
			{ test: { environment: "happy-dom" } },
		);

		expect(result.test?.environment).toBe("happy-dom");
	});

	test("should ignore undefined overrides", () => {
		const base: UserConfig = { test: { environment: "node" } };
		const result = mergeConfig(base, undefined, {
			test: { restoreMocks: true },
		});

		expect(result.test).toMatchObject({
			environment: "node",
			restoreMocks: true,
		});
	});
});
