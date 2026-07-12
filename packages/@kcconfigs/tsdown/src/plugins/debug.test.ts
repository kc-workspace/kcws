import { describe, expect, test } from "vitest";
import debugPlugin from "./debug";

describe("debugPlugin", () => {
	test("should have correct plugin name", () => {
		const plugin = debugPlugin();
		expect(plugin.name).toBe("debug");
	});

	test("should disable minify", () => {
		const plugin = debugPlugin();
		const base = {};
		const result = plugin.apply?.(base, {});
		expect(result?.minify).toBe(false);
	});

	test("should override existing minify config", () => {
		const plugin = debugPlugin();
		const base = { minify: true };
		const result = plugin.apply?.(base, {});
		expect(result?.minify).toBe(false);
	});

	test("should preserve existing base config when applying", () => {
		const plugin = debugPlugin();
		const base = { entry: ["./src/index.ts"] };
		const result = plugin.apply?.(base, {});
		expect(result?.entry).toEqual(["./src/index.ts"]);
		expect(result?.minify).toBe(false);
	});
});
