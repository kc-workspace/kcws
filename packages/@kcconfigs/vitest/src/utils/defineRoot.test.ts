/** biome-ignore-all lint/complexity/useLiteralKeys: Conflict with ts(4111) */

import { describe, expect, test } from "vitest";
import { defineRoot } from "./defineRoot";

describe("defineRoot", () => {
	test("should return a configuration object", () => {
		const config = defineRoot();

		expect(config).toBeDefined();
		expect(typeof config).toBe("object");
	});

	test("should include base root configuration", () => {
		const config = defineRoot();

		expect(config.test).toBeDefined();
		expect(config.test?.environment).toBe("node");
		expect(config.test?.restoreMocks).toBe(true);
		expect(config.test?.mockReset).toBe(true);
		expect(config.test?.clearMocks).toBe(true);
	});

	test("should merge custom configuration", () => {
		const config = defineRoot({
			test: {
				environment: "jsdom",
			},
		});

		expect(config.test?.environment).toBe("jsdom");
	});

	test("should preserve base configuration when merging", () => {
		const config = defineRoot({
			test: {
				environment: "jsdom",
			},
		});

		expect(config.test?.restoreMocks).toBe(true);
		expect(config.test?.mockReset).toBe(true);
	});

	test("should handle multiple configuration overrides", () => {
		const config = defineRoot(
			{
				test: {
					environment: "jsdom",
				},
			},
			{
				test: {
					globals: true,
				},
			},
		);

		expect(config.test?.environment).toBe("jsdom");
		expect(config.test?.globals).toBe(true);
		expect(config.test?.restoreMocks).toBe(true);
	});

	test("should include coverage configuration", () => {
		const config = defineRoot();

		expect(config.test?.coverage).toBeDefined();
		expect(config.test?.coverage?.enabled).toBe(true);
		expect(config.test?.coverage?.provider).toBe("v8");
	});

	test("should include reporter configuration", () => {
		const config = defineRoot();

		expect(config.test?.reporters).toBeDefined();
		expect(config.test?.reporters).toContain("default");
		expect(config.test?.reporters).toContain("html");
		expect(config.test?.reporters).toContain("junit");
	});

	test("should include output file configuration", () => {
		const config = defineRoot();

		expect(config.test?.outputFile).toBeDefined();
		if (typeof config.test?.outputFile !== "string") {
			expect(config.test?.outputFile?.["html"]).toContain(
				"reports/test-results",
			);
			expect(config.test?.outputFile?.["junit"]).toContain(
				"reports/test-results",
			);
		}
	});

	test("should handle undefined configuration", () => {
		const config = defineRoot(undefined);

		expect(config).toBeDefined();
		expect(config.test?.environment).toBe("node");
	});

	test("should override coverage settings", () => {
		const config = defineRoot({
			test: {
				coverage: {
					enabled: false,
				},
			},
		});

		expect(config.test?.coverage?.enabled).toBe(false);
		expect(config.test?.coverage?.provider).toBe("v8");
	});
});
