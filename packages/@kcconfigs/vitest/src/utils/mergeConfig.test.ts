import { describe, expect, test } from "vitest";
import type { AnyConfig, UserConfig } from "../models";
import { mergeConfig } from "./mergeConfig";

describe("mergeConfig", () => {
	test("should merge two simple configurations", () => {
		const defaults: AnyConfig = { a: 1, b: 2 };
		const addon: AnyConfig = { b: 3, c: 4 };

		const result = mergeConfig(defaults, addon);

		expect(result).toEqual({ a: 1, b: 3, c: 4 });
	});

	test("should merge multiple configurations", () => {
		const defaults: AnyConfig = { a: 1, b: 2 };
		const addon1: AnyConfig = { b: 3, c: 4 };
		const addon2: AnyConfig = { c: 5, d: 6 };

		const result = mergeConfig(defaults, addon1, addon2);

		expect(result).toEqual({ a: 1, b: 3, c: 5, d: 6 });
	});

	test("should handle nested configurations", () => {
		const defaults = { test: { timeout: 1000, retry: 0 } };
		const addon = { test: { timeout: 5000 } };

		const result = mergeConfig(defaults, addon);

		expect(result).toEqual({
			test: { timeout: 5000, retry: 0 },
		});
	});

	test("should filter out undefined addons", () => {
		const defaults: AnyConfig = { a: 1, b: 2 };
		const addon1: AnyConfig = { b: 3 };
		const addon2 = undefined;
		const addon3: AnyConfig = { c: 4 };

		const result = mergeConfig(defaults, addon1, addon2, addon3);

		expect(result).toEqual({ a: 1, b: 3, c: 4 });
	});

	test("should filter out null addons", () => {
		const defaults: AnyConfig = { a: 1, b: 2 };
		const addon1: AnyConfig = { b: 3 };
		const addon2 = null;
		const addon3: AnyConfig = { c: 4 };

		const result = mergeConfig(defaults, addon1, addon2, addon3);

		expect(result).toEqual({ a: 1, b: 3, c: 4 });
	});

	test("should not mutate original configurations", () => {
		const defaults: AnyConfig = { a: 1, b: 2 };
		const addon: AnyConfig = { b: 3, c: 4 };

		mergeConfig(defaults, addon);

		expect(defaults).toEqual({ a: 1, b: 2 });
		expect(addon).toEqual({ b: 3, c: 4 });
	});

	test("should handle empty defaults", () => {
		const defaults: AnyConfig = {};
		const addon: AnyConfig = { a: 1, b: 2 };

		const result = mergeConfig(defaults, addon);

		expect(result).toEqual({ a: 1, b: 2 });
	});

	test("should handle empty addons", () => {
		const defaults: AnyConfig = { a: 1, b: 2 };

		const result = mergeConfig(defaults);

		expect(result).toEqual({ a: 1, b: 2 });
	});

	test("should merge array values", () => {
		const defaults: UserConfig = { test: { reporters: ["default"] } };
		const addon: AnyConfig = { test: { reporters: ["html", "junit"] } };

		const result = mergeConfig<UserConfig>(defaults, addon);

		expect(result.test?.reporters).toEqual(["default", "html", "junit"]);
	});

	test("should handle complex vitest configuration", () => {
		const defaults: AnyConfig = {
			test: {
				environment: "node",
				coverage: {
					enabled: true,
					provider: "v8",
				},
			},
		};
		const addon: AnyConfig = {
			test: {
				environment: "jsdom",
				coverage: {
					reporter: ["text", "html"],
				},
			},
		};

		const result = mergeConfig(defaults, addon);

		expect(result).toEqual({
			test: {
				environment: "jsdom",
				coverage: {
					enabled: true,
					provider: "v8",
					reporter: ["text", "html"],
				},
			},
		});
	});
});
