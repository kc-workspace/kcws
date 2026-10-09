import { describe, expect, test } from "vitest";
import attwNormalize from "./attwNormalize";

describe("attwNormalize", () => {
	test("should have correct plugin name", () => {
		const plugin = attwNormalize();
		expect(plugin.name).toBe("attw");
	});

	test.for([
		{
			name: "should use esm-only profile when format is 'esm'",
			input: { attw: undefined, format: "esm" },
			expected: { enabled: true, profile: "esm-only" },
		},
		{
			name: "should use node16 profile when format is undefined",
			input: { attw: undefined, format: undefined },
			expected: { enabled: true, profile: "node16" },
		},
		{
			name: "should use esm-only profile when format is 'es'",
			input: { attw: undefined, format: "es" },
			expected: { enabled: true, profile: "esm-only" },
		},
		{
			name: "should disable attw when explicitly false",
			input: { attw: false, format: "esm" },
			expected: { enabled: false },
		},
		{
			name: "should use esm-only profile when format is 'module'",
			input: { attw: undefined, format: "module" },
			expected: { enabled: true, profile: "esm-only" },
		},
		{
			name: "should use node16 profile when format is 'cjs'",
			input: { attw: undefined, format: "cjs" },
			expected: { enabled: true, profile: "node16" },
		},
		{
			name: "should use node16 profile when format is object",
			input: { attw: undefined, format: {} },
			expected: { enabled: true, profile: "node16" },
		},
		{
			name: "should merge user options with auto-detected profile",
			input: { attw: { enabled: true, summary: true }, format: "esm" },
			expected: { enabled: true, profile: "esm-only", summary: true },
		},
		{
			name: "should not override user-provided profile",
			input: {
				attw: { enabled: true, profile: "node16" },
				format: "esm" as const,
			},
			expected: { enabled: true, profile: "node16" },
		},
		{
			name: "should handle string CIOption attw",
			input: { attw: "ci-only" as const, format: "esm" },
			expected: { enabled: "ci-only", profile: "esm-only" },
		},
		{
			name: "should use esm-only profile when format array contains esm",
			input: { attw: undefined, format: ["esm", "cjs"] },
			expected: { enabled: true, profile: "esm-only" },
		},
		{
			name: "should use node16 profile when format array contains no esm",
			input: { attw: undefined, format: ["cjs"] },
			expected: { enabled: true, profile: "node16" },
		},
	])("$name", ({ input, expected }) => {
		const plugin = attwNormalize();
		const result = plugin.applyConfig?.(input as any);
		expect(result?.attw).toEqual(expected);
	});
});
