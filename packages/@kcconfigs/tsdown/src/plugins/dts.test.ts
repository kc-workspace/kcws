import { describe, expect, test } from "vitest";
import dtsPlugin from "./dts";

describe("dtsPlugin", () => {
	test("should have correct plugin name", () => {
		const plugin = dtsPlugin(true);
		expect(plugin.name).toBe("dts");
	});

	test("should apply dts config when true", () => {
		const plugin = dtsPlugin(true);
		const base = { dts: undefined };
		const result = plugin.applyConfig?.(base);
		expect(result?.dts).toBe(true);
	});

	test("should apply dts config when false", () => {
		const plugin = dtsPlugin(false);
		const base = { dts: undefined };
		const result = plugin.applyConfig?.(base);
		expect(result?.dts).toBe(false);
	});

	test("should apply dts config with object options", () => {
		const dtsConfig = { sourcemap: false, cjsReexport: true };
		const plugin = dtsPlugin(dtsConfig);
		const base = { dts: undefined };
		const result = plugin.applyConfig?.(base);
		expect(result?.dts).toEqual(dtsConfig);
	});

	test("should apply dts with enabled in object", () => {
		const dtsConfig = { enabled: true, sourcemap: true };
		const plugin = dtsPlugin(dtsConfig);
		const base = { dts: undefined };
		const result = plugin.applyConfig?.(base);
		expect(result?.dts).toEqual(dtsConfig);
	});

	test("should preserve existing base config when applying", () => {
		const plugin = dtsPlugin(true);
		const base = { entry: ["./src/index.ts"], dts: undefined };
		const result = plugin.applyConfig?.(base);
		expect(result?.entry).toEqual(["./src/index.ts"]);
		expect(result?.dts).toBe(true);
	});
});
