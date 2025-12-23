import { describe, expect, test } from "vitest";
import { defineProject } from "./defineProject";

describe("defineProject", () => {
	test("should return a configuration object", () => {
		const config = defineProject();

		expect(config).toBeDefined();
		expect(typeof config).toBe("object");
	});

	test("should include base root configuration", () => {
		const config = defineProject();

		expect(config.test).toBeDefined();
		expect(config.test?.environment).toBe("node");
		expect(config.test?.restoreMocks).toBe(true);
	});

	test("should merge custom configuration", () => {
		const config = defineProject({
			test: {
				name: "my-project",
			},
		});

		expect(config.test?.name).toBe("my-project");
	});

	test("should preserve base configuration when merging", () => {
		const config = defineProject({
			test: {
				name: "my-project",
			},
		});

		expect(config.test?.restoreMocks).toBe(true);
		expect(config.test?.environment).toBe("node");
	});

	test("should handle multiple configuration overrides", () => {
		const config = defineProject(
			{
				test: {
					name: "my-project",
				},
			},
			{
				test: {
					environment: "jsdom",
				},
			},
		);

		expect(config.test?.name).toBe("my-project");
		expect(config.test?.environment).toBe("jsdom");
	});

	test("should handle undefined configuration", () => {
		const config = defineProject(undefined);

		expect(config).toBeDefined();
		expect(config.test?.environment).toBe("node");
	});

	test("should support root property for workspace project", () => {
		const config = defineProject({
			test: {
				root: "./packages/my-package",
			},
		});

		expect(config.test?.root).toBe("./packages/my-package");
	});

	test("should merge project-specific test configuration", () => {
		const config = defineProject({
			test: {
				name: "test-package",
				include: ["src/**/*.test.ts"],
			},
		});

		expect(config.test?.name).toBe("test-package");
		expect(config.test?.include).toEqual(["src/**/*.test.ts"]);
	});
});
