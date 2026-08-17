import type { DepsConfig } from "tsdown";
import { describe, expect, test } from "vitest";
import depsPlugin from "./deps";

describe("depsPlugin", () => {
	test("should have correct plugin name", () => {
		const plugin = depsPlugin({});
		expect(plugin.name).toBe("deps");
	});

	test("should apply neverBundle config", () => {
		const plugin = depsPlugin({ neverBundle: ["picocolors"] });
		const base = {};
		const result = plugin.applyConfig?.(base);
		expect(result?.deps).toEqual({ neverBundle: ["picocolors"] });
	});

	test("should apply onlyBundle config as false", () => {
		const plugin = depsPlugin({ onlyBundle: false });
		const base = {};
		const result = plugin.applyConfig?.(base);
		expect(result?.deps).toEqual({ onlyBundle: false });
	});

	test("should apply alwaysBundle config", () => {
		const plugin = depsPlugin({ alwaysBundle: ["lodash-es"] });
		const base = {};
		const result = plugin.applyConfig?.(base);
		expect(result?.deps).toEqual({ alwaysBundle: ["lodash-es"] });
	});

	test("should apply full deps config", () => {
		const depsConfig = {
			neverBundle: ["picocolors"],
			onlyBundle: false,
		} satisfies DepsConfig;
		const plugin = depsPlugin(depsConfig);
		const base = {};
		const result = plugin.applyConfig?.(base);
		expect(result?.deps).toEqual(depsConfig);
	});

	test("should preserve existing base config when applying", () => {
		const plugin = depsPlugin({ neverBundle: ["react"] });
		const base = { entry: ["./src/index.ts"] };
		const result = plugin.applyConfig?.(base);
		expect(result?.entry).toEqual(["./src/index.ts"]);
		expect(result?.deps).toEqual({ neverBundle: ["react"] });
	});
});
