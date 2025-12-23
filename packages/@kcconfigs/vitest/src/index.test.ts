import { describe, expect, test } from "vitest";
import {
	defineEmptyProject,
	defineEmptyRoot,
	defineProject,
	defineProjectOrRoot,
	defineRoot,
	mergeConfig,
	setupMocks,
} from "./index";

describe("Main Exports", () => {
	test("should export defineRoot", () => {
		expect(defineRoot).toBeDefined();
		expect(typeof defineRoot).toBe("function");
	});

	test("should export defineProject", () => {
		expect(defineProject).toBeDefined();
		expect(typeof defineProject).toBe("function");
	});

	test("should export defineEmptyRoot", () => {
		expect(defineEmptyRoot).toBeDefined();
		expect(typeof defineEmptyRoot).toBe("function");
	});

	test("should export defineEmptyProject", () => {
		expect(defineEmptyProject).toBeDefined();
		expect(typeof defineEmptyProject).toBe("function");
	});

	test("should export defineProjectOrRoot", () => {
		expect(defineProjectOrRoot).toBeDefined();
		expect(typeof defineProjectOrRoot).toBe("function");
	});

	test("should export mergeConfig", () => {
		expect(mergeConfig).toBeDefined();
		expect(typeof mergeConfig).toBe("function");
	});

	test("should export setupMocks", () => {
		expect(setupMocks).toBeDefined();
		expect(typeof setupMocks).toBe("function");
	});
});
