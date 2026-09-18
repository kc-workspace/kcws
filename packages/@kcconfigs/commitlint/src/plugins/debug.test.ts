import { describe, expect, test } from "vitest";
import debugPlugin from "./debug";

describe("debugPlugin", () => {
	test("should have correct plugin name", () => {
		const plugin = debugPlugin();
		expect(plugin.name).toBe("debug");
	});

	test("should run before every other plugin", () => {
		const plugin = debugPlugin();
		expect(plugin.settingPriority).toBe(Number.NEGATIVE_INFINITY);
	});

	test("should enable debug setting", () => {
		const plugin = debugPlugin();
		const result = plugin.applySetting?.({});
		expect(result?.debug).toBe(true);
	});

	test("should enable verbose when requested", () => {
		const plugin = debugPlugin({ verbose: true });
		const result = plugin.applySetting?.({});
		expect(result?.verbose).toBe(true);
	});

	test("should inherit verbose from base setting when not specified", () => {
		const plugin = debugPlugin();
		const result = plugin.applySetting?.({ verbose: true });
		expect(result?.verbose).toBe(true);
	});

	test("should not change config", () => {
		const plugin = debugPlugin();
		expect(plugin.applyConfig).toBeUndefined();
	});
});
