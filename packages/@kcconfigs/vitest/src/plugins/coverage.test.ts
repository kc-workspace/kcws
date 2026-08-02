import { describe, expect, test } from "vitest";
import { defaultCoverage } from "../constants/config";
import coveragePlugin from "./coverage";

describe("coveragePlugin", () => {
	test("should return plugin named 'website'", () => {
		const plugin = coveragePlugin(true);
		expect(plugin.name).toBe("website");
	});

	test("should apply defaultCoverage when option is true", () => {
		const plugin = coveragePlugin(true);
		const result = plugin.applyConfig?.({ test: {} });
		expect(result?.test?.coverage).toEqual(defaultCoverage);
	});

	test("should remove coverage when option is false", () => {
		const plugin = coveragePlugin(false);
		const result = plugin.applyConfig?.({ test: { coverage: defaultCoverage } });
		expect(result?.test?.coverage).toBeUndefined();
	});

	test("should not fail when option is false and no coverage exists", () => {
		const plugin = coveragePlugin(false);
		const result = plugin.applyConfig?.({ test: {} });
		expect(result?.test?.coverage).toBeUndefined();
	});

	test("should merge custom coverage options", () => {
		const custom = { enabled: true, provider: "istanbul" as const };
		const plugin = coveragePlugin(custom);
		const result = plugin.applyConfig?.({ test: {} });
		expect(result?.test?.coverage).toMatchObject(custom);
	});
});
