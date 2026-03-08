import { describe, expect, test } from "vitest";
import * as exports from "./index";

describe("index exports", () => {
	test("should export filter factories", () => {
		expect(exports.allowlist).toBeDefined();
		expect(typeof exports.allowlist).toBe("function");
		expect(exports.comments).toBeDefined();
		expect(typeof exports.comments).toBe("function");
	});

	test("should export rule factories", () => {
		expect(exports.terminology).toBeDefined();
		expect(typeof exports.terminology).toBe("function");
	});

	test("should export helper factories", () => {
		expect(exports.defineFilter).toBeDefined();
		expect(typeof exports.defineFilter).toBe("function");
		expect(exports.definePreset).toBeDefined();
		expect(typeof exports.definePreset).toBe("function");
		expect(exports.defineRule).toBeDefined();
		expect(typeof exports.defineRule).toBe("function");
	});
});
