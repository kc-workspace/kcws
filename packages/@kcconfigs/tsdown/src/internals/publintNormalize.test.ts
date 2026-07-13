import { describe, expect, test } from "vitest";
import publintNormalize from "./publintNormalize";

describe("publintNormalize", () => {
	test("should have correct plugin name", () => {
		const plugin = publintNormalize();
		expect(plugin.name).toBe("publint");
	});

	test.each([
		[
			"should set default enabled=true with level warning when publint is undefined",
			{ publint: undefined },
			{ enabled: true, level: "warning" },
		],
		[
			"should set default enabled=true with level warning when publint is null",
			{ publint: null },
			{ enabled: true, level: "warning" },
		],
		[
			"should preserve level warning when publint is true",
			{ publint: true },
			{ enabled: true, level: "warning" },
		],
		[
			"should set enabled=false when publint is false",
			{ publint: false },
			{ enabled: false },
		],
		[
			"should normalize string publint to enabled with level warning",
			{ publint: "ci-only" },
			{ enabled: "ci-only", level: "warning" },
		],
		[
			"should merge user options with defaults",
			{ publint: { enabled: true, strict: true } },
			{ enabled: true, level: "warning", strict: true },
		],
		[
			"should allow overriding level",
			{ publint: { enabled: true, level: "error" } },
			{ enabled: true, level: "error" },
		],
		[
			"should preserve other config properties",
			{ entry: ["./src/index.ts"], publint: undefined },
			{ enabled: true, level: "warning" },
		],
	])("%s", (_name, input, expected) => {
		const plugin = publintNormalize();
		const result = plugin.normalize?.(input as any, {});
		expect(result?.publint).toEqual(expected);
		if ("entry" in input) {
			expect(result?.entry).toEqual(input.entry);
		}
	});
});
