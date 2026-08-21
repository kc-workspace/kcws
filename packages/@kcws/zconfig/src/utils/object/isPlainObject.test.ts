import { describe, expect, test } from "vitest";
import isPlainObject from "./isPlainObject";

describe("isPlainObject", () => {
	test("should accept an object literal", () => {
		expect(isPlainObject({})).toBe(true);
		expect(isPlainObject({ a: 1 })).toBe(true);
	});

	test("should accept a null prototype object", () => {
		expect(isPlainObject(Object.create(null))).toBe(true);
	});

	test("should reject null and undefined", () => {
		expect(isPlainObject(null)).toBe(false);
		expect(isPlainObject(undefined)).toBe(false);
	});

	test("should reject primitives", () => {
		expect(isPlainObject("text")).toBe(false);
		expect(isPlainObject(42)).toBe(false);
		expect(isPlainObject(true)).toBe(false);
		expect(isPlainObject(Symbol("s"))).toBe(false);
	});

	test("should reject arrays", () => {
		expect(isPlainObject([])).toBe(false);
		expect(isPlainObject([1, 2])).toBe(false);
	});

	test("should reject objects carrying their own prototype", () => {
		class Custom {
			readonly x = 1;
		}

		expect(isPlainObject(new Date(0))).toBe(false);
		expect(isPlainObject(new Map())).toBe(false);
		expect(isPlainObject(new Set())).toBe(false);
		expect(isPlainObject(new Custom())).toBe(false);
		expect(isPlainObject(() => undefined)).toBe(false);
	});
});
