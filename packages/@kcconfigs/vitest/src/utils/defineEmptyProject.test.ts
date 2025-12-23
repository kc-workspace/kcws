import { describe, expect, test } from "vitest";
import { defineEmptyProject } from "./defineEmptyProject";

describe("defineEmptyProject", () => {
	test("should return an empty configuration", () => {
		const config = defineEmptyProject();

		expect(config).toBeDefined();
		expect(typeof config).toBe("object");
	});

	test("should not include base configuration", () => {
		const config = defineEmptyProject();

		// Should not have default values
		expect(config.test?.environment).toBeUndefined();
		expect(config.test?.restoreMocks).toBeUndefined();
	});

	test("should merge custom configuration", () => {
		const config = defineEmptyProject({
			test: {
				name: "my-project",
				environment: "jsdom",
			},
		});

		expect(config.test?.name).toBe("my-project");
		expect(config.test?.environment).toBe("jsdom");
	});

	test("should handle multiple configuration objects", () => {
		const config = defineEmptyProject(
			{
				test: {
					name: "project-1",
				},
			},
			{
				test: {
					environment: "node",
				},
			},
		);

		expect(config.test?.name).toBe("project-1");
		expect(config.test?.environment).toBe("node");
	});

	test("should handle undefined configuration", () => {
		const config = defineEmptyProject(undefined);

		expect(config).toBeDefined();
		expect(config.test).toBeUndefined();
	});

	test("should allow project-specific configuration", () => {
		const config = defineEmptyProject({
			test: {
				name: "test-package",
				root: "./packages/test-package",
				include: ["src/**/*.test.ts"],
			},
		});

		expect(config.test?.name).toBe("test-package");
		expect(config.test?.root).toBe("./packages/test-package");
		expect(config.test?.include).toEqual(["src/**/*.test.ts"]);
	});
});
