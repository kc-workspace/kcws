import { describe, expect, test } from "vitest";
import minifyPlugin from "./minify";

describe("minifyPlugin", () => {
	test("should have correct plugin name", () => {
		const plugin = minifyPlugin();
		expect(plugin.name).toBe("minify");
	});

	test("should enable minify by default", () => {
		const plugin = minifyPlugin();
		const base = {};
		const result = plugin.applyConfig?.(base);
		expect(result?.minify).toBe(true);
		expect(result?.css?.minify).toBe(true);
	});

	test("should disable minify when false is given", () => {
		const plugin = minifyPlugin(false);
		const base = { minify: true, css: { minify: true } };
		const result = plugin.applyConfig?.(base);
		expect(result?.minify).toBe(false);
		expect(result?.css?.minify).toBe(false);
	});

	test("should override existing minify config", () => {
		const plugin = minifyPlugin(true);
		const base = { minify: false };
		const result = plugin.applyConfig?.(base);
		expect(result?.minify).toBe(true);
	});

	test("should preserve existing base config when applying", () => {
		const plugin = minifyPlugin();
		const base = {
			entry: ["./src/index.ts"],
			css: { fileName: "index.css" },
		};
		const result = plugin.applyConfig?.(base);
		expect(result?.entry).toEqual(["./src/index.ts"]);
		expect(result?.css?.fileName).toBe("index.css");
		expect(result?.css?.minify).toBe(true);
	});
});
