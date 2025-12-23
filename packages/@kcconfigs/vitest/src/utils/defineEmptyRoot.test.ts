import { describe, expect, test } from "vitest";
import { defineEmptyRoot } from "./defineEmptyRoot";

describe("defineEmptyRoot", () => {
	test("should return an empty configuration", () => {
		const config = defineEmptyRoot();

		expect(config).toBeDefined();
		expect(typeof config).toBe("object");
	});

	test("should not include base root configuration", () => {
		const config = defineEmptyRoot();

		// Should not have default values from baseRootConfig
		expect(config.test?.environment).toBeUndefined();
		expect(config.test?.restoreMocks).toBeUndefined();
	});

	test("should merge custom configuration", () => {
		const config = defineEmptyRoot({
			test: {
				environment: "jsdom",
				globals: true,
			},
		});

		expect(config.test?.environment).toBe("jsdom");
		expect(config.test?.globals).toBe(true);
	});

	test("should handle multiple configuration objects", () => {
		const config = defineEmptyRoot(
			{
				test: {
					environment: "node",
				},
			},
			{
				test: {
					globals: true,
				},
			},
		);

		expect(config.test?.environment).toBe("node");
		expect(config.test?.globals).toBe(true);
	});

	test("should handle undefined configuration", () => {
		const config = defineEmptyRoot(undefined);

		expect(config).toBeDefined();
		expect(config.test).toBeUndefined();
	});

	test("should handle null configuration", () => {
		const config = defineEmptyRoot(null);

		expect(config).toBeDefined();
		expect(config.test).toBeUndefined();
	});

	test("should merge nested configurations", () => {
		const config = defineEmptyRoot({
			test: {
				coverage: {
					enabled: true,
					provider: "v8",
				},
			},
		});

		expect(config.test?.coverage?.enabled).toBe(true);
		expect(config.test?.coverage?.provider).toBe("v8");
	});

	test("should allow full custom configuration", () => {
		const customConfig = {
			test: {
				name: "custom-test",
				environment: "happy-dom",
				reporters: ["json"],
				coverage: {
					enabled: false,
				},
			},
		};

		const config = defineEmptyRoot(customConfig);

		expect(config.test?.name).toBe("custom-test");
		expect(config.test?.environment).toBe("happy-dom");
		expect(config.test?.reporters).toEqual(["json"]);
		expect(config.test?.coverage?.enabled).toBe(false);
	});
});
