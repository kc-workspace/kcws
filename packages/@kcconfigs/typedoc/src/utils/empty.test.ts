import { describe, expect, test } from "vitest";
import { isEmpty } from "./empty";

describe("empty utilities", () => {
	describe("isEmpty", () => {
		test("should return true for undefined", () => {
			expect(isEmpty(undefined)).toBe(true);
		});

		test("should return true for null", () => {
			expect(isEmpty(null)).toBe(true);
		});

		test("should return false for other values", () => {
			expect(isEmpty(0)).toBe(false);
			expect(isEmpty("")).toBe(false);
			expect(isEmpty(false)).toBe(false);
			expect(isEmpty([])).toBe(false);
			expect(isEmpty({})).toBe(false);
		});
	});
});
