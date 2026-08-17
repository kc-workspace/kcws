import { describe, expect, test } from "vitest";
import formatPlugin from "./format";

describe("formatPlugin", () => {
	test("should have correct plugin name", () => {
		const plugin = formatPlugin({});
		expect(plugin.name).toBe("format");
	});

	test.each(["esm", "cjs", "iife", "umd"] as const)(
		"should apply the %s array format",
		(format) => {
			const plugin = formatPlugin([format]);
			const result = plugin.applyConfig?.({});

			expect(result?.format).toEqual([format]);
		},
	);

	test("should preserve the order of multiple array formats", () => {
		const plugin = formatPlugin(["umd", "esm", "cjs", "iife"]);
		const result = plugin.applyConfig?.({});

		expect(result?.format).toEqual(["umd", "esm", "cjs", "iife"]);
	});

	test("should replace an existing format array", () => {
		const plugin = formatPlugin(["esm", "cjs"]);
		const result = plugin.applyConfig?.({ format: ["iife"] });

		expect(result?.format).toEqual(["esm", "cjs"]);
	});

	test("should replace an existing format array with an empty array", () => {
		const plugin = formatPlugin([]);
		const result = plugin.applyConfig?.({ format: ["esm"] });

		expect(result?.format).toEqual([]);
	});

	test("should apply configuration for every object format", () => {
		const format = {
			esm: { sourcemap: false } as const,
			cjs: { minify: true } as const,
			iife: { clean: ["*.js"] },
			umd: { dts: false } as const,
		};
		const plugin = formatPlugin(format);
		const result = plugin.applyConfig?.({});

		expect(result?.format).toEqual(format);
	});

	test("should deeply merge object formats with the existing config", () => {
		const plugin = formatPlugin({
			esm: {
				sourcemap: false,
				outputOptions: { banner: "new banner" },
			},
		});
		const result = plugin.applyConfig?.({
			format: {
				cjs: { minify: false },
				esm: {
					sourcemap: true,
					outputOptions: {
						banner: "old banner",
						footer: "existing footer",
					},
				},
			},
		});

		expect(result?.format).toEqual({
			cjs: { minify: false },
			esm: {
				sourcemap: false,
				outputOptions: {
					banner: "new banner",
					footer: "existing footer",
				},
			},
		});
	});

	test("should preserve an existing object format for an empty object", () => {
		const plugin = formatPlugin({});
		const result = plugin.applyConfig?.({
			format: { esm: { sourcemap: true } },
		});

		expect(result?.format).toEqual({ esm: { sourcemap: true } });
	});

	test("should preserve unrelated base config", () => {
		const plugin = formatPlugin(["esm"]);
		const result = plugin.applyConfig?.({
			entry: ["./src/index.ts"],
			minify: false,
		});

		expect(result).toMatchObject({
			entry: ["./src/index.ts"],
			format: ["esm"],
			minify: false,
		});
	});
});
