import { describe, expect, test } from "vitest";
import debugPlugin from "./debug";

describe("debugPlugin", () => {
	test("should return plugin named 'debug'", () => {
		const plugin = debugPlugin();
		expect(plugin.name).toBe("debug");
	});

	test("should have NEGATIVE_INFINITY settingPriority", () => {
		const plugin = debugPlugin();
		expect(plugin.settingPriority).toBe(Number.NEGATIVE_INFINITY);
	});

	test("should set debug to true in settings", () => {
		const plugin = debugPlugin();
		const result = plugin.applySetting?.({});
		expect(result?.debug).toBe(true);
	});

	test("should preserve existing settings when applying", () => {
		const plugin = debugPlugin();
		const result = plugin.applySetting?.({ verbose: true });
		expect(result?.verbose).toBe(true);
		expect(result?.debug).toBe(true);
	});
});
