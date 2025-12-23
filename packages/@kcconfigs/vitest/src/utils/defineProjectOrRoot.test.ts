import { describe, expect, test } from "vitest";
import { defineProjectOrRoot } from "./defineProjectOrRoot";

describe("defineProjectOrRoot", () => {
	test("should return a configuration object", () => {
		const config = defineProjectOrRoot();

		expect(config).toBeDefined();
		expect(typeof config).toBe("object");
	});

	test("should include base root configuration", () => {
		const config = defineProjectOrRoot();

		expect(config.test).toBeDefined();
		expect(config.test?.environment).toBe("node");
		expect(config.test?.restoreMocks).toBe(true);
	});

	test("should merge custom configuration", () => {
		const config = defineProjectOrRoot({
			test: {
				name: "my-config",
			},
		});

		expect(config.test?.name).toBe("my-config");
	});

	test("should preserve base configuration when merging", () => {
		const config = defineProjectOrRoot({
			test: {
				name: "my-config",
			},
		});

		expect(config.test?.restoreMocks).toBe(true);
		expect(config.test?.environment).toBe("node");
	});

	test("should handle multiple configuration overrides", () => {
		const config = defineProjectOrRoot(
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
	});

	test("should work as root configuration", () => {
		const config = defineProjectOrRoot({
			test: {
				projects: ["packages/**/vitest.config.ts"],
			},
		});

		expect(config.test?.projects).toEqual(["packages/**/vitest.config.ts"]);
		expect(config.test?.environment).toBe("node");
	});

	test("should work as project configuration", () => {
		const config = defineProjectOrRoot({
			test: {
				name: "my-project",
				root: "./packages/my-project",
			},
		});

		expect(config.test?.name).toBe("my-project");
		expect(config.test?.root).toBe("./packages/my-project");
	});

	test("should handle undefined configuration", () => {
		const config = defineProjectOrRoot(undefined);

		expect(config).toBeDefined();
		expect(config.test?.environment).toBe("node");
	});
});
