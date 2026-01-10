import { describe, expect, test } from "vitest";
import {
	appendArray,
	asArray,
	isArray,
	mergeArray,
	normalizeArray,
	uniqueArray,
} from "./array";

describe("array utilities", () => {
	describe("isArray", () => {
		test("should return true for arrays", () => {
			expect(isArray([])).toBe(true);
			expect(isArray([1, 2, 3])).toBe(true);
			expect(isArray(["a", "b"])).toBe(true);
		});

		test("should return false for non-arrays", () => {
			expect(isArray("string")).toBe(false);
			expect(isArray(123)).toBe(false);
			expect(isArray({ key: "value" })).toBe(false);
			expect(isArray(null)).toBe(false);
			expect(isArray(undefined)).toBe(false);
		});
	});

	describe("asArray", () => {
		test("should return array as-is", () => {
			const arr = [1, 2, 3];
			expect(asArray(arr)).toBe(arr);
		});

		test("should wrap single value in array", () => {
			expect(asArray(5)).toEqual([5]);
			expect(asArray("value")).toEqual(["value"]);
		});

		test("should return empty array for empty values", () => {
			expect(asArray(undefined)).toEqual([]);
			expect(asArray(null)).toEqual([]);
		});

		test("should wrap objects in array", () => {
			const obj = { key: "value" };
			expect(asArray(obj)).toEqual([obj]);
		});

		test("should wrap boolean values in array", () => {
			expect(asArray(true)).toEqual([true]);
			expect(asArray(false)).toEqual([false]);
		});

		test("should wrap zero in array", () => {
			expect(asArray(0)).toEqual([0]);
		});

		test("should wrap empty string in array", () => {
			expect(asArray("")).toEqual([""]);
		});
	});

	describe("mergeArray", () => {
		test("should merge two arrays", () => {
			const result = mergeArray([1, 2], [3, 4]);
			expect(result).toEqual([1, 2, 3, 4]);
		});

		test("should handle single values", () => {
			const result = mergeArray(1, [2, 3]);
			expect(result).toEqual([1, 2, 3]);
		});

		test("should handle empty arrays", () => {
			expect(mergeArray([], [1, 2])).toEqual([1, 2]);
			expect(mergeArray([1, 2], [])).toEqual([1, 2]);
		});

		test("should handle undefined values", () => {
			expect(mergeArray(undefined, [1, 2])).toEqual([1, 2]);
			expect(mergeArray([1, 2], undefined)).toEqual([1, 2]);
		});

		test("should handle both values empty", () => {
			expect(mergeArray(undefined, undefined)).toEqual([]);
			expect(mergeArray(null, null)).toEqual([]);
			expect(mergeArray(undefined, null)).toEqual([]);
		});

		test("should handle single value merge", () => {
			const result1 = mergeArray("a", "b");
			expect(result1).toEqual(["a", "b"]);

			const result2 = mergeArray(["a"], "b");
			expect(result2).toEqual(["a", "b"]);
		});

		test("should handle readonly arrays", () => {
			const readonlyA = [1, 2] as const;
			const readonlyB = [3, 4] as const;
			const result = mergeArray(readonlyA, readonlyB);
			expect(result).toEqual([1, 2, 3, 4]);
		});

		test("should use custom merge function", () => {
			const result = mergeArray([1, 2], [2, 3], (a, b) => [
				...new Set([...a, ...b]),
			]);
			expect(result).toEqual([1, 2, 3]);
		});

		test("should use custom merge function with empty arrays", () => {
			const customMerge = <T>(a: T[], b: T[]) => {
				return [...a, ...b].filter((n) => n > 0) as T[];
			};
			const result = mergeArray([-1, 2], [3, -4], customMerge);
			expect(result).toEqual([2, 3]);
		});
	});

	describe("appendArray", () => {
		test("should append values to defaults", () => {
			const result = appendArray([1, 2], [3, 4]);
			expect(result).toEqual([1, 2, 3, 4]);
		});

		test("should return defaults when values is empty", () => {
			const result = appendArray([1, 2], undefined);
			expect(result).toEqual([]);
		});

		test("should return empty when values is null", () => {
			const result = appendArray([1, 2], null as unknown as number);
			expect(result).toEqual([]);
		});

		test("should append single value", () => {
			const result = appendArray([1, 2], 3);
			expect(result).toEqual([1, 2, 3]);
		});

		test("should work with readonly arrays", () => {
			const defaults = [1, 2] as const;
			const result = appendArray(defaults, 3);
			expect(result).toEqual([1, 2, 3]);
		});

		test("should work with empty defaults", () => {
			const result = appendArray([], [1, 2]);
			expect(result).toEqual([1, 2]);
		});
	});

	describe("uniqueArray", () => {
		test("should remove duplicates", () => {
			const result = uniqueArray([1, 2, 2, 3, 3, 3] as number[]);
			expect(result).toEqual([1, 2, 3]);
		});

		test("should preserve order", () => {
			const result = uniqueArray([3, 1, 2, 1, 3] as number[]);
			expect(result[0]).toBe(3);
			expect(result[1]).toBe(1);
			expect(result[2]).toBe(2);
		});

		test("should handle empty arrays", () => {
			const result = uniqueArray([] as number[]);
			expect(result).toEqual([]);
		});

		test("should work with string arrays", () => {
			const result = uniqueArray(["a", "b", "a", "c", "b"] as string[]);
			expect(result).toEqual(["a", "b", "c"]);
		});

		test("should handle array with single element", () => {
			const result = uniqueArray([1] as number[]);
			expect(result).toEqual([1]);
		});

		test("should handle array with no duplicates", () => {
			const result = uniqueArray([1, 2, 3, 4] as number[]);
			expect(result).toEqual([1, 2, 3, 4]);
		});
	});

	describe("normalizeArray", () => {
		test("should filter out empty values", () => {
			const result = normalizeArray([1, undefined, 2, null, 3]);
			expect(result).toEqual([1, 2, 3]);
		});

		test("should preserve all non-empty values", () => {
			const result = normalizeArray([0, "", false, [], {}]);
			expect(result).toEqual([0, "", false, [], {}]);
		});

		test("should handle empty arrays", () => {
			const result = normalizeArray([]);
			expect(result).toEqual([]);
		});

		test("should handle array with only null/undefined", () => {
			const result = normalizeArray([null, undefined, null, undefined]);
			expect(result).toEqual([]);
		});

		test("should preserve nested structures", () => {
			const obj = { nested: { value: 1 } };
			const arr = [1, 2, 3];
			const result = normalizeArray([obj, undefined, arr, null]);
			expect(result).toEqual([obj, arr]);
		});

		test("should handle mixed types", () => {
			const result = normalizeArray(["string", 123, true, null, {}, undefined]);
			expect(result).toEqual(["string", 123, true, {}]);
		});
	});
});
