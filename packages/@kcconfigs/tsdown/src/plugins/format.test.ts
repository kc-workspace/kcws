import { describe, expect, test } from "vitest";
import formatPlugin from "./format";

describe("formatPlugin", () => {
	test("should have correct plugin name", () => {
		const plugin = formatPlugin({});
		expect(plugin.name).toBe("format");
	});

	test("should apply esm format when provided", () => {
		const plugin = formatPlugin({ esm: true });
		const base = { format: undefined };
		const result = plugin.applyConfig?.(base);
		expect(result?.format).toEqual({ esm: true });
	});

	test("should apply cjs format when provided", () => {
		const plugin = formatPlugin({ cjs: true });
		const base = { format: undefined };
		const result = plugin.applyConfig?.(base);
		expect(result?.format).toEqual({ cjs: true });
	});

	test("should apply multiple formats", () => {
		const plugin = formatPlugin({ esm: true, cjs: true });
		const base = { format: undefined };
		const result = plugin.applyConfig?.(base);
		expect(result?.format).toEqual({ esm: true, cjs: true });
	});

	test("should handle iife format with true value", () => {
		const plugin = formatPlugin({ iife: true });
		const base = { format: undefined };
		const result = plugin.applyConfig?.(base);
		expect(result?.format).toEqual({ iife: true });
	});

	test("should handle umd format with true value", () => {
		const plugin = formatPlugin({ umd: true });
		const base = { format: undefined };
		const result = plugin.applyConfig?.(base);
		expect(result?.format).toEqual({ umd: true });
	});

	test("should skip formats set to false", () => {
		const plugin = formatPlugin({
			esm: true,
			cjs: false,
		});
		const base = { format: undefined };
		const result = plugin.applyConfig?.(base);
		expect(result?.format).toEqual({ esm: true, cjs: false });
	});

	test("should skip undefined formats", () => {
		const plugin = formatPlugin({
			esm: true,
			cjs: undefined,
		});
		const base = { format: undefined };
		const result = plugin.applyConfig?.(base);
		expect(result?.format).toEqual({ esm: true, cjs: undefined });
	});

	test("should pass through format values as objects", () => {
		const customFormat = {
			esm: { sourcemap: false } as const,
			cjs: { minify: true } as const,
		};
		const plugin = formatPlugin(customFormat);
		const base = { format: undefined };
		const result = plugin.applyConfig?.(base);
		expect(result?.format).toEqual(customFormat);
	});

	test("should preserve existing base config when applying", () => {
		const plugin = formatPlugin({ esm: true });
		const base = { entry: ["./src/index.ts"], format: undefined };
		const result = plugin.applyConfig?.(base);
		expect(result?.entry).toEqual(["./src/index.ts"]);
		expect(result?.format).toEqual({ esm: true });
	});
});
