import { describe, expect, test } from "vitest";
import * as exports from "./index";

describe("index exports", () => {
	test("should export defineConfig", () => {
		expect(exports.defineConfig).toBeDefined();
		expect(typeof exports.defineConfig).toBe("function");
	});

	test("should export defineBaseConfig", () => {
		expect(exports.defineBaseConfig).toBeDefined();
		expect(typeof exports.defineBaseConfig).toBe("function");
	});

	test("should export definePlugin", () => {
		expect(exports.definePlugin).toBeDefined();
		expect(typeof exports.definePlugin).toBe("function");
	});

	test("should export defineTheme", () => {
		expect(exports.defineTheme).toBeDefined();
		expect(typeof exports.defineTheme).toBe("function");
	});

	test("should export mergeConfig", () => {
		expect(exports.mergeConfig).toBeDefined();
		expect(typeof exports.mergeConfig).toBe("function");
	});

	test("should export normalizeConfig", () => {
		expect(exports.normalizeConfig).toBeDefined();
		expect(typeof exports.normalizeConfig).toBe("function");
	});

	test("should export defaults", () => {
		expect(exports.defaultSort).toBeDefined();
		expect(Array.isArray(exports.defaultSort)).toBe(true);
		expect(exports.defaultKindSortOrder).toBeDefined();
		expect(Array.isArray(exports.defaultKindSortOrder)).toBe(true);
	});
});
