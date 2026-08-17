import { describe, expect, test } from "vitest";
import type { TsdownConfig } from "../models";
import overridePlugin from "./override";

describe("overridePlugin", () => {
	test("should have correct plugin name", () => {
		const plugin = overridePlugin();
		expect(plugin.name).toBe("override");
	});

	test("should apply single override", () => {
		const plugin = overridePlugin({ outDir: "custom-dist" });
		const base = { outDir: "dist" };
		const result = plugin.applyConfig?.(base);
		expect(result?.outDir).toBe("custom-dist");
	});

	test("should apply multiple overrides", () => {
		const plugin = overridePlugin({ outDir: "custom-dist" }, { minify: false });
		const base = { outDir: "dist", minify: true };
		const result = plugin.applyConfig?.(base);
		expect(result?.outDir).toBe("custom-dist");
		expect(result?.minify).toBe(false);
	});

	test("should override existing config properties", () => {
		const plugin = overridePlugin({ platform: "neutral" });
		const base = { platform: "node" } as TsdownConfig;
		const result = plugin.applyConfig?.(base);
		expect(result?.platform).toBe("neutral");
	});

	test("should add new config properties", () => {
		const plugin = overridePlugin({ failOnWarn: true });
		const base = { outDir: "dist" };
		const result = plugin.applyConfig?.(base);
		expect(result?.outDir).toBe("dist");
		expect(result?.failOnWarn).toBe(true);
	});

	test("should work with empty overrides", () => {
		const plugin = overridePlugin();
		const base = { outDir: "dist" };
		const result = plugin.applyConfig?.(base);
		expect(result?.outDir).toBe("dist");
	});
});
