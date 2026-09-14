import { describe, expect, test } from "vitest";
import { multiply } from ".";

describe(multiply.name, () => {
	test("should multiply two numbers correctly", () => {
		expect(multiply(3, 4)).toBe(12);
	});

	test("should handle negative numbers", () => {
		expect(multiply(-2, 5)).toBe(-10);
	});

	test("should handle zero", () => {
		expect(multiply(0, 5)).toBe(0);
		expect(multiply(10, 0)).toBe(0);
	});

	test("should handle decimal numbers", () => {
		expect(multiply(2.5, 4)).toBe(10);
		expect(multiply(1.5, 2.5)).toBe(3.75);
	});

	test("should handle both negative numbers", () => {
		expect(multiply(-3, -4)).toBe(12);
	});

	test("should handle multiplication by one", () => {
		expect(multiply(7, 1)).toBe(7);
		expect(multiply(1, 7)).toBe(7);
	});

	test("should handle large numbers", () => {
		expect(multiply(1000, 1000)).toBe(1000000);
	});
});
