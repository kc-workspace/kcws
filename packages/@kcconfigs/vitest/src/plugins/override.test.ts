import { describe, expect, test } from "vitest";
import overridePlugin from "./override";

describe("overridePlugin", () => {
	test("should return plugin named 'override'", () => {
		const plugin = overridePlugin({});
		expect(plugin.name).toBe("override");
	});

	test("should have configPriority of 1000", () => {
		const plugin = overridePlugin({});
		expect(plugin.configPriority).toBe(1000);
	});

	test("should merge provided config into base", () => {
		const plugin = overridePlugin({ environment: "jsdom" });
		const result = plugin.applyConfig?.({ test: {} });
		expect(result?.test?.environment).toBe("jsdom");
	});

	test("should deep merge config without discarding existing keys", () => {
		const plugin = overridePlugin({ timeout: 5000 });
		const result = plugin.applyConfig?.({ test: { environment: "node" } });
		expect(result?.test?.environment).toBe("node");
		expect(result?.test?.timeout).toBe(5000);
	});
});
