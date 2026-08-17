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

	test("should replace with enabled=true when option is true and replace is true", () => {
		const plugin = coveragePlugin(true, true);
		const result = plugin.applyConfig?.({
			test: {
				coverage: { enabled: true, provider: "v8" },
			},
		});
		expect(result?.test?.coverage).toEqual({ enabled: true });
	});

	test("should remove coverage when option is false", () => {
		const plugin = coveragePlugin(false);
		const result = plugin.applyConfig?.({
			test: { coverage: defaultCoverage },
		});
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
		const result = plugin.applyConfig?.({
			test: {
				coverage: { reporter: ["text"] },
			},
		});
		expect(result?.test?.coverage).toMatchObject(custom);
		expect(result?.test?.coverage).toMatchObject({ reporter: ["text"] });
	});

	test("should replace coverage object when replace is true", () => {
		const custom = { enabled: true, provider: "istanbul" as const };
		const plugin = coveragePlugin(custom, true);
		const result = plugin.applyConfig?.({
			test: {
				coverage: { reporter: ["text"] },
			},
		});
		expect(result?.test?.coverage).toEqual(custom);
	});

	test("should replace coverage when base test config is missing", () => {
		const custom = { enabled: true, provider: "v8" as const };
		const plugin = coveragePlugin(custom, true);
		const result = plugin.applyConfig?.({});
		expect(result?.test?.coverage).toEqual(custom);
	});
});
