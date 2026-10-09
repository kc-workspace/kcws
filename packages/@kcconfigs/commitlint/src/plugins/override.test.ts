import { RuleConfigSeverity as Severity } from "@commitlint/types";
import { describe, expect, test } from "vitest";
import overridePlugin from "./override";

describe("overridePlugin", () => {
	test("should have correct plugin name", () => {
		const plugin = overridePlugin();
		expect(plugin.name).toBe("override");
	});

	test("should run after built-in plugins", () => {
		const plugin = overridePlugin();
		expect(plugin.configPriority).toBe(1000);
	});

	test("should apply single override", async () => {
		const plugin = overridePlugin({ helpUrl: "custom" });
		const result = await plugin.applyConfig?.({ helpUrl: "base" });
		expect(result?.helpUrl).toBe("custom");
	});

	test("should apply multiple overrides left to right", async () => {
		const plugin = overridePlugin(
			{ helpUrl: "first" },
			{ helpUrl: "second", parserPreset: "preset" },
		);
		const result = await plugin.applyConfig?.({ helpUrl: "base" });
		expect(result?.helpUrl).toBe("second");
		expect(result?.parserPreset).toBe("preset");
	});

	test("should deep merge rules", async () => {
		const plugin = overridePlugin({
			rules: { "header-max-length": [Severity.Error, "always", 100] },
		});
		const result = await plugin.applyConfig?.({
			rules: { "subject-max-length": [Severity.Warning, "always", 80] },
		});
		expect(result?.rules).toEqual({
			"subject-max-length": [Severity.Warning, "always", 80],
			"header-max-length": [Severity.Error, "always", 100],
		});
	});

	test("should work with empty overrides", async () => {
		const plugin = overridePlugin();
		const result = await plugin.applyConfig?.({ helpUrl: "base" });
		expect(result).toEqual({ helpUrl: "base" });
	});
});
