import { describe, expect, test } from "vitest";
import webPlugin from "./web";

describe("webPlugin", () => {
	test("should return plugin named 'website'", () => {
		const plugin = webPlugin();
		expect(plugin.name).toBe("website");
	});

	test("should default to jsdom environment", () => {
		const plugin = webPlugin();
		const result = plugin.applyConfig?.({ test: {} });
		expect(result?.test?.environment).toBe("jsdom");
	});

	test("should set happy-dom environment when specified", () => {
		const plugin = webPlugin("happy-dom");
		const result = plugin.applyConfig?.({ test: {} });
		expect(result?.test?.environment).toBe("happy-dom");
	});

	test("should preserve existing test config", () => {
		const plugin = webPlugin("jsdom");
		const result = plugin.applyConfig?.({ test: { timeout: 3000 } });
		expect(result?.test?.timeout).toBe(3000);
		expect(result?.test?.environment).toBe("jsdom");
	});
});
