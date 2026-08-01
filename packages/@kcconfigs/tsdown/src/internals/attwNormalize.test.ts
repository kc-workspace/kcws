import { describe, expect, test } from "vitest";
import attwNormalize from "./attwNormalize";

describe("attwNormalize", () => {
	test("should have correct plugin name", () => {
		const plugin = attwNormalize();
		expect(plugin.name).toBe("attw");
	});

	test.each([
		[
			"should use esm-only profile when format is 'esm'",
			{ attw: undefined, format: "esm" },
			{ enabled: true, profile: "esm-only" },
		],
		[
			"should use node16 profile when format is undefined",
			{ attw: undefined, format: undefined },
			{ enabled: true, profile: "node16" },
		],
		[
			"should use esm-only profile when format is 'es'",
			{ attw: undefined, format: "es" },
			{ enabled: true, profile: "esm-only" },
		],
		[
			"should disable attw when explicitly false",
			{ attw: false, format: "esm" },
			{ enabled: false },
		],
		[
			"should use esm-only profile when format is 'module'",
			{ attw: undefined, format: "module" },
			{ enabled: true, profile: "esm-only" },
		],
		[
			"should use node16 profile when format is 'cjs'",
			{ attw: undefined, format: "cjs" },
			{ enabled: true, profile: "node16" },
		],
		[
			"should use node16 profile when format is object",
			{ attw: undefined, format: {} },
			{ enabled: true, profile: "node16" },
		],
		[
			"should merge user options with auto-detected profile",
			{ attw: { enabled: true, summary: true }, format: "esm" },
			{ enabled: true, profile: "esm-only", summary: true },
		],
		[
			"should not override user-provided profile",
			{
				attw: { enabled: true, profile: "node16" },
				format: "esm" as const,
			},
			{ enabled: true, profile: "node16" },
		],
		[
			"should handle string CIOption attw",
			{ attw: "ci-only" as const, format: "esm" },
			{ enabled: "ci-only", profile: "esm-only" },
		],
		[
			"should use esm-only profile when format array contains esm",
			{ attw: undefined, format: ["esm", "cjs"] },
			{ enabled: true, profile: "esm-only" },
		],
		[
			"should use node16 profile when format array contains no esm",
			{ attw: undefined, format: ["cjs"] },
			{ enabled: true, profile: "node16" },
		],
	])("%s", (_, input, expected) => {
		const plugin = attwNormalize();
		const result = plugin.applyConfig?.(input as any);
		expect(result?.attw).toEqual(expected);
	});
});
