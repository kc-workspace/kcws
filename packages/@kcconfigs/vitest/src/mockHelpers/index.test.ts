import { describe, expect, test } from "vitest";
import { vol } from "./index";

describe("Mock Helpers", () => {
	test("should export vol from memfs", () => {
		expect(vol).toBeDefined();
		expect(typeof vol).toBe("object");
	});

	test("vol should have fromJSON method", () => {
		expect(vol.fromJSON).toBeDefined();
		expect(typeof vol.fromJSON).toBe("function");
	});

	test("vol should have reset method", () => {
		expect(vol.reset).toBeDefined();
		expect(typeof vol.reset).toBe("function");
	});

	test("vol should have toJSON method", () => {
		expect(vol.toJSON).toBeDefined();
		expect(typeof vol.toJSON).toBe("function");
	});
});
