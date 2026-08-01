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
		const result = plugin.applyConfig?.(base);
		expect(result?.minify).toBe(false);
	});

	test("should override existing minify config", () => {
		const plugin = debugPlugin();
		const base = { minify: true };
		const result = plugin.applyConfig?.(base);
		expect(result?.minify).toBe(false);
	});

	test("should preserve existing base config when applying", () => {
		const plugin = debugPlugin();
		const base = { entry: ["./src/index.ts"] };
		const result = plugin.applyConfig?.(base);
		expect(result?.entry).toEqual(["./src/index.ts"]);
		expect(result?.minify).toBe(false);
	});

	test("should set debug flag in applySetting", () => {
		const plugin = debugPlugin();
		const result = plugin.applySetting?.({});
		expect(result?.debug).toBe(true);
	});

	test("should set verbose to true when verbose option is provided", () => {
		const plugin = debugPlugin({ verbose: true });
		const result = plugin.applySetting?.({});
		expect(result?.verbose).toBe(true);
	});

	test("should inherit verbose from base setting when not specified", () => {
		const plugin = debugPlugin();
		const result = plugin.applySetting?.({ verbose: true });
		expect(result?.verbose).toBe(true);
	});
});
