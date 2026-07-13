import { describe, expect, test } from "vitest";
import dtsNormalize from "./dtsNormalize";

describe("dtsNormalize", () => {
	test("should have correct plugin name", () => {
		const plugin = dtsNormalize();
		expect(plugin.name).toBe("dts");
	});

	test.each([
		[
			"should set default enabled=true with sourcemap when dts is undefined",
			{ dts: undefined },
			{ enabled: true, sourcemap: true },
		],
		[
			"should set default enabled=true with sourcemap when dts is null",
			{ dts: null },
			{ enabled: true, sourcemap: true },
		],
		[
			"should preserve sourcemap when dts is true",
			{ dts: true },
			{ enabled: true, sourcemap: true },
		],
		[
			"should set enabled=false when dts is false",
			{ dts: false },
			{ enabled: false },
		],
		[
			"should normalize string dts to enabled with sourcemap",
			{ dts: "ci-only" },
			{ enabled: "ci-only", sourcemap: true },
		],
		[
			"should merge user options with defaults",
			{ dts: { enabled: true, cjsReexport: true } },
			{ enabled: true, sourcemap: true, cjsReexport: true },
		],
		[
			"should allow overriding sourcemap",
			{ dts: { enabled: true, sourcemap: false } },
			{ enabled: true, sourcemap: false },
		],
		[
			"should preserve other config properties",
			{ entry: ["./src/index.ts"], dts: undefined },
			{ enabled: true, sourcemap: true },
		],
	])("%s", (_name, input, expected) => {
		const plugin = dtsNormalize();
		const result = plugin.normalize?.(input as any, {});
		expect(result?.dts).toEqual(expected);
		if ("entry" in input) {
			expect(result?.entry).toEqual(input.entry);
		}
	});
});
