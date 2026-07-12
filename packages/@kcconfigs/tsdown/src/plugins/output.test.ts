import { describe, expect, test } from "vitest";
import outputPlugin from "./output";

describe("outputPlugin", () => {
	test("should have correct plugin name", () => {
		const plugin = outputPlugin("dist");
		expect(plugin.name).toBe("output");
	});

	test("should set outDir to the given value", () => {
		const plugin = outputPlugin("dist.tsdown");
		const base = { outDir: undefined as string | undefined };
		const result = plugin.apply?.(base, {});
		expect(result?.outDir).toBe("dist.tsdown");
	});

	test("should override existing outDir", () => {
		const plugin = outputPlugin("build");
		const base = { outDir: "dist" };
		const result = plugin.apply?.(base, {});
		expect(result?.outDir).toBe("build");
	});

	test("should preserve existing base config when applying", () => {
		const plugin = outputPlugin("dist");
		const base = { entry: ["./src/index.ts"], outDir: undefined as string | undefined };
		const result = plugin.apply?.(base, {});
		expect(result?.entry).toEqual(["./src/index.ts"]);
		expect(result?.outDir).toBe("dist");
	});
});
