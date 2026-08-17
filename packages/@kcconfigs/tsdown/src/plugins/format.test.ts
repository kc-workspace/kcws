import { describe, expect, test } from "vitest";
import formatPlugin from "./format";

describe("formatPlugin", () => {
	test("should have correct plugin name", () => {
		const plugin = formatPlugin({});
		expect(plugin.name).toBe("format");
	});

	test("should apply esm format when provided", () => {
		const plugin = formatPlugin(["esm"]);
		const base = {};
		const result = plugin.applyConfig?.(base);
		expect(result?.format).toEqual(["esm"]);
	});

	test("should apply cjs format when provided", () => {
		const plugin = formatPlugin(["cjs"]);
		const base = {};
		const result = plugin.applyConfig?.(base);
		expect(result?.format).toEqual(["cjs"]);
	});

	test("should apply multiple formats", () => {
		const plugin = formatPlugin(["esm", "cjs"]);
		const base = {};
		const result = plugin.applyConfig?.(base);
		expect(result?.format).toEqual(["esm", "cjs"]);
	});

	test("should apply iife format when provided", () => {
		const plugin = formatPlugin(["iife"]);
		const base = {};
		const result = plugin.applyConfig?.(base);
		expect(result?.format).toEqual(["iife"]);
	});

	test("should apply umd format when provided", () => {
		const plugin = formatPlugin(["umd"]);
		const base = {};
		const result = plugin.applyConfig?.(base);
		expect(result?.format).toEqual(["umd"]);
	});

	test("should pass through format values as objects", () => {
		const customFormat = {
			esm: { sourcemap: false } as const,
			cjs: { minify: true } as const,
		};
		const plugin = formatPlugin(customFormat);
		const base = {};
		const result = plugin.applyConfig?.(base);
		expect(result?.format).toEqual(customFormat);
	});

	test("should preserve existing base config when applying", () => {
		const plugin = formatPlugin(["esm"]);
		const base = { entry: ["./src/index.ts"] };
		const result = plugin.applyConfig?.(base);
		expect(result?.entry).toEqual(["./src/index.ts"]);
		expect(result?.format).toEqual(["esm"]);
	});
});
