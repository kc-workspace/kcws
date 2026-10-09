import { describe, expect, test } from "vitest";
import dtsNormalize from "./dtsNormalize";

describe("dtsNormalize", () => {
	test("should have correct plugin name", () => {
		const plugin = dtsNormalize();
		expect(plugin.name).toBe("dts");
	});

	test.for([
		{
			name: "should set default enabled=true with sourcemap when dts is undefined",
			input: { dts: undefined },
			expected: { enabled: true, sourcemap: true },
		},
		{
			name: "should set default enabled=true with sourcemap when dts is null",
			input: { dts: null },
			expected: { enabled: true, sourcemap: true },
		},
		{
			name: "should preserve sourcemap when dts is true",
			input: { dts: true },
			expected: { enabled: true, sourcemap: true },
		},
		{
			name: "should set enabled=false when dts is false",
			input: { dts: false },
			expected: { enabled: false },
		},
		{
			name: "should normalize string dts to enabled with sourcemap",
			input: { dts: "ci-only" },
			expected: { enabled: "ci-only", sourcemap: true },
		},
		{
			name: "should merge user options with defaults",
			input: { dts: { enabled: true, cjsReexport: true } },
			expected: { enabled: true, sourcemap: true, cjsReexport: true },
		},
		{
			name: "should allow overriding sourcemap",
			input: { dts: { enabled: true, sourcemap: false } },
			expected: { enabled: true, sourcemap: false },
		},
		{
			name: "should preserve other config properties",
			input: { entry: ["./src/index.ts"], dts: undefined },
			expected: { enabled: true, sourcemap: true },
		},
	])("$name", ({ input, expected }) => {
		const plugin = dtsNormalize();
		const result = plugin.applyConfig?.(input as any);
		expect(result?.dts).toEqual(expected);
		if ("entry" in input) {
			expect(result?.entry).toEqual(input.entry);
		}
	});
});
