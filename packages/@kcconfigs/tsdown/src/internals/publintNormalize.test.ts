import { describe, expect, test } from "vitest";
import publintNormalize from "./publintNormalize";

describe("publintNormalize", () => {
	test("should have correct plugin name", () => {
		const plugin = publintNormalize();
		expect(plugin.name).toBe("publint");
	});

	test.for([
		{
			name: "should set default enabled=true with level warning when publint is undefined",
			input: { publint: undefined },
			expected: { enabled: true, level: "warning" },
		},
		{
			name: "should set default enabled=true with level warning when publint is null",
			input: { publint: null },
			expected: { enabled: true, level: "warning" },
		},
		{
			name: "should preserve level warning when publint is true",
			input: { publint: true },
			expected: { enabled: true, level: "warning" },
		},
		{
			name: "should set enabled=false when publint is false",
			input: { publint: false },
			expected: { enabled: false },
		},
		{
			name: "should normalize string publint to enabled with level warning",
			input: { publint: "ci-only" },
			expected: { enabled: "ci-only", level: "warning" },
		},
		{
			name: "should merge user options with defaults",
			input: { publint: { enabled: true, strict: true } },
			expected: { enabled: true, level: "warning", strict: true },
		},
		{
			name: "should allow overriding level",
			input: { publint: { enabled: true, level: "error" } },
			expected: { enabled: true, level: "error" },
		},
		{
			name: "should preserve other config properties",
			input: { entry: ["./src/index.ts"], publint: undefined },
			expected: { enabled: true, level: "warning" },
		},
	])("$name", ({ input, expected }) => {
		const plugin = publintNormalize();
		const result = plugin.applyConfig?.(input as any);
		expect(result?.publint).toEqual(expected);
		if ("entry" in input) {
			expect(result?.entry).toEqual(input.entry);
		}
	});
});
