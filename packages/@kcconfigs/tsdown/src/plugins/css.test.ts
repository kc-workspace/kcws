import { describe, expect, test } from "vitest";
import cssPlugin from "./css";

describe("cssPlugin", () => {
	test("should have correct plugin name", () => {
		const plugin = cssPlugin();
		expect(plugin.name).toBe("css");
	});

	test("should set entry to ./src/index.css by default", () => {
		const plugin = cssPlugin();
		const base = { entry: undefined };
		const result = plugin.applyConfig?.(base);
		expect(result?.entry).toContain("./src/index.css");
	});

	test("should set entry to ./src/index.scss when lang is scss", () => {
		const plugin = cssPlugin({ lang: "scss" });
		const base = { entry: undefined };
		const result = plugin.applyConfig?.(base);
		expect(result?.entry).toContain("./src/index.scss");
	});

	test("should exclude test and example files", () => {
		const plugin = cssPlugin();
		const base = { entry: undefined };
		const result = plugin.applyConfig?.(base);
		expect(result?.entry).toContain("!./src/**/*.example.ts");
		expect(result?.entry).toContain("!./src/**/*.test.ts");
		expect(result?.entry).toContain("!./src/**/*.spec.ts");
		expect(result?.entry).toContain("!./src/**/*.test-d.ts");
		expect(result?.entry).toContain("!./src/**/*.spec-d.ts");
	});

	test("should preserve existing base config when applying", () => {
		const plugin = cssPlugin();
		const base = { outDir: "dist", entry: undefined };
		const result = plugin.applyConfig?.(base);
		expect(result?.outDir).toBe("dist");
		expect(result?.entry).toContain("./src/index.css");
	});
});
