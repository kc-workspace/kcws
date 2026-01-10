import { describe, expect, test } from "vitest";
import { isObject, mergeObject, normalizeObject } from "./object";

describe("object utilities", () => {
	describe("isObject", () => {
		test("should return true for plain objects", () => {
			expect(isObject({})).toBe(true);
			expect(isObject({ key: "value" })).toBe(true);
		});

		test("should return false for arrays", () => {
			expect(isObject([])).toBe(false);
			expect(isObject([1, 2, 3])).toBe(false);
		});

		test("should return false for null", () => {
			expect(isObject(null)).toBe(false);
		});

		test("should return false for primitives", () => {
			expect(isObject("string")).toBe(false);
			expect(isObject(123)).toBe(false);
			expect(isObject(true)).toBe(false);
			expect(isObject(undefined)).toBe(false);
		});
	});

	describe("mergeObject", () => {
		test("should merge two objects", () => {
			const base: Record<string, number> = { a: 1 };
			const obj: Record<string, number> = { b: 2 };
			const result = mergeObject(base, obj);

			expect(result.a).toBe(1);
			expect(result.b).toBe(2);
		});

		test("should override existing properties", () => {
			const base = { a: 1, b: 2 };
			const obj = { b: 3 };
			const result = mergeObject(base, obj);

			expect(result.a).toBe(1);
			expect(result.b).toBe(3);
		});

		test("should handle empty objects", () => {
			const base = { a: 1 };
			const result = mergeObject(base, {});

			expect(result.a).toBe(1);
		});

		test("should handle nested objects", () => {
			const base: Record<string, unknown> = { nested: { a: 1 } };
			const obj: Record<string, unknown> = { nested: { b: 2 } };
			const result = mergeObject(base, obj);

			const nested = result.nested as Record<string, unknown>;
			expect(nested.a).toBe(1);
			expect(nested.b).toBe(2);
		});

		test("should handle arrays in objects", () => {
			const base: Record<string, unknown> = { items: [1, 2] };
			const obj: Record<string, unknown> = { items: [3] };
			const result = mergeObject(base, obj);

			expect(Array.isArray(result.items)).toBe(true);
		});

		test("should handle null base", () => {
			const base = null as unknown as Record<string, number>;
			const obj = { a: 1, b: 2 };
			const result = mergeObject(base, obj);

			expect(result.a).toBe(1);
			expect(result.b).toBe(2);
		});

		test("should handle undefined base", () => {
			const base = undefined as unknown as Record<string, number>;
			const obj = { a: 1 };
			const result = mergeObject(base, obj);

			expect(result.a).toBe(1);
		});

		test("should handle null obj", () => {
			const base = { a: 1 };
			const obj = null as unknown as Record<string, number>;
			const result = mergeObject(base, obj);

			expect(result.a).toBe(1);
		});

		test("should handle deeply nested objects", () => {
			const base: Record<string, unknown> = {
				level1: { level2: { level3: { value: 1 } } },
			};
			const obj: Record<string, unknown> = {
				level1: { level2: { level3: { newValue: 2 } } },
			};
			const result = mergeObject(base, obj);

			const level1 = result.level1 as Record<string, unknown>;
			const level2 = level1.level2 as Record<string, unknown>;
			const level3 = level2.level3 as Record<string, unknown>;

			expect(level3.value).toBe(1);
			expect(level3.newValue).toBe(2);
		});

		test("should use custom merge function when provided", () => {
			const base = { a: 1, b: 2 };
			const obj = { b: 3, c: 4 };
			const customFn = <K extends keyof typeof base>(
				base: typeof base,
				key: K,
				value: (typeof base)[K],
			): [boolean, (typeof base)[K]] => {
				if (key === "b") {
					return [
						true,
						((base[key] as number) + (value as number)) as (typeof base)[K],
					];
				}
				return [false, value];
			};
			const result = mergeObject(base, obj, customFn);

			expect(result.a).toBe(1);
			expect(result.b).toBe(5); // 2 + 3
			expect(result.c).toBe(4);
		});

		test("should handle arrays merging in nested objects", () => {
			const base: Record<string, unknown> = {
				config: { plugins: ["a", "b"] },
			};
			const obj: Record<string, unknown> = {
				config: { plugins: ["c"] },
			};
			const result = mergeObject(base, obj);

			const config = result.config as Record<string, unknown>;
			const plugins = config.plugins as string[];

			expect(plugins).toEqual(["a", "b", "c"]);
		});
	});

	describe("normalizeObject", () => {
		test("should return normalized object", () => {
			const obj = { a: 1, b: "value" };
			const result = normalizeObject(obj);

			expect(result.a).toBe(1);
			expect(result.b).toBe("value");
		});

		test("should handle nested objects", () => {
			const obj: Record<string, unknown> = { nested: { a: 1 } };
			const result = normalizeObject(obj);

			expect(result).toBeDefined();
			expect(typeof result).toBe("object");
		});

		test("should handle empty objects", () => {
			const obj = {};
			const result = normalizeObject(obj);

			expect(result).toEqual({});
		});

		test("should remove null and undefined values", () => {
			const obj: Record<string, unknown> = {
				a: 1,
				b: null,
				c: undefined,
				d: "value",
			};
			const result = normalizeObject(obj);

			expect(result.a).toBe(1);
			expect(result.d).toBe("value");
			expect("b" in result).toBe(false);
			expect("c" in result).toBe(false);
		});

		test("should normalize nested arrays", () => {
			const obj: Record<string, unknown> = {
				items: [1, null, 2, undefined, 3],
			};
			const result = normalizeObject(obj);

			const items = result.items as number[];
			expect(items).toEqual([1, 2, 3]);
		});

		test("should normalize deeply nested objects", () => {
			const obj: Record<string, unknown> = {
				level1: {
					a: null,
					b: 1,
					level2: {
						c: undefined,
						d: 2,
					},
				},
			};
			const result = normalizeObject(obj);

			const level1 = result.level1 as Record<string, unknown>;
			const level2 = level1.level2 as Record<string, unknown>;

			expect("a" in level1).toBe(false);
			expect(level1.b).toBe(1);
			expect("c" in level2).toBe(false);
			expect(level2.d).toBe(2);
		});

		test("should preserve zero, false, and empty string", () => {
			const obj: Record<string, unknown> = {
				zero: 0,
				falsy: false,
				empty: "",
				nullVal: null,
			};
			const result = normalizeObject(obj);

			expect(result.zero).toBe(0);
			expect(result.falsy).toBe(false);
			expect(result.empty).toBe("");
			expect("nullVal" in result).toBe(false);
		});

		test("should handle object with mixed types in arrays", () => {
			const obj: Record<string, unknown> = {
				mixed: [1, "two", null, { three: 3 }, undefined, false],
			};
			const result = normalizeObject(obj);

			const mixed = result.mixed as unknown[];
			expect(mixed).toHaveLength(4);
			expect(mixed).toContain(1);
			expect(mixed).toContain("two");
			expect(mixed).toContain(false);
		});
	});
});
