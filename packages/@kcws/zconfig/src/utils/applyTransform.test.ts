import { describe, expect, test, vi } from "vitest";
import applyTransform from "./applyTransform";
import type { TransformInput } from "./types";

describe("applyTransform", () => {
	test("should return the input untouched when no transform is given", () => {
		const config = { database: { host: "localhost" } };

		expect(applyTransform(config)).toBe(config);
	});

	test("should preserve structure under an identity transform", () => {
		const config = { database: { host: "localhost", port: 5432 }, debug: true };

		expect(applyTransform(config, (input) => input)).toEqual(config);
	});

	test("should visit every leaf with its full key path", () => {
		const seen: TransformInput[] = [];
		const transform = vi.fn((input: TransformInput) => {
			seen.push({ key: [...input.key], value: input.value });
			return input;
		});

		applyTransform({ a: { b: { c: 1 } }, d: 2 }, transform);

		expect(seen).toEqual([
			{ key: ["a", "b", "c"], value: 1 },
			{ key: ["d"], value: 2 },
		]);
	});

	test("should rename a leaf key", () => {
		const result = applyTransform({ database_host: "localhost" }, (input) => ({
			key: input.key.map((segment) => segment.replace("_host", "Host")),
			value: input.value,
		}));

		expect(result).toEqual({ databaseHost: "localhost" });
	});

	test("should relocate a leaf to a deeper path", () => {
		const result = applyTransform({ host: "localhost" }, (input) => ({
			key: ["database", ...input.key],
			value: input.value,
		}));

		expect(result).toEqual({ database: { host: "localhost" } });
	});

	test("should relocate a leaf to a shallower path", () => {
		const result = applyTransform(
			{ database: { host: "localhost" } },
			(input) =>
				input.key.length > 1
					? { key: input.key.slice(1), value: input.value }
					: input,
		);

		expect(result).toEqual({ host: "localhost" });
	});

	test("should rewrite a leaf value", () => {
		const result = applyTransform({ port: "5432" }, (input) => ({
			key: input.key,
			value: Number(input.value),
		}));

		expect(result).toEqual({ port: 5432 });
	});

	test("should drop a key when the transform returns undefined", () => {
		const result = applyTransform(
			{ keep: 1, secret: "shh", nested: { drop: 2, keep: 3 } },
			(input) => (input.key.at(-1) === "keep" ? input : undefined),
		);

		expect(result).toEqual({ keep: 1, nested: { keep: 3 } });
	});

	test("should treat an array as a leaf rather than walking its indices", () => {
		const seen: string[][] = [];
		const result = applyTransform({ hosts: ["a", "b"] }, (input) => {
			seen.push(input.key);
			return input;
		});

		expect(seen).toEqual([["hosts"]]);
		expect(result).toEqual({ hosts: ["a", "b"] });
	});

	test("should treat an empty object as a leaf so it survives the walk", () => {
		const seen: string[][] = [];
		const result = applyTransform({ empty: {} }, (input) => {
			seen.push(input.key);
			return input;
		});

		expect(seen).toEqual([["empty"]]);
		expect(result).toEqual({ empty: {} });
	});

	test("should treat a non-plain object as a leaf", () => {
		const date = new Date(0);
		const seen: string[][] = [];

		const result = applyTransform({ at: date }, (input) => {
			seen.push(input.key);
			return input;
		});

		expect(seen).toEqual([["at"]]);
		expect(result["at"]).toBe(date);
	});

	test("should let the later key win when two leaves collide", () => {
		const result = applyTransform({ a: 1, b: 2 }, (input) => ({
			key: ["merged"],
			value: input.value,
		}));

		expect(result).toEqual({ merged: 2 });
	});

	test("should overwrite a primitive when a later key nests beneath it", () => {
		const result = applyTransform({ a: 1, b: 2 }, (input) =>
			input.key.at(-1) === "a"
				? { key: ["x"], value: input.value }
				: { key: ["x", "deep"], value: input.value },
		);

		expect(result).toEqual({ x: { deep: 2 } });
	});

	test("should ignore a transform that returns an empty key path", () => {
		const result = applyTransform({ a: 1, b: 2 }, (input) =>
			input.key.at(-1) === "a" ? { key: [], value: input.value } : input,
		);

		expect(result).toEqual({ b: 2 });
	});

	test("should drop a dangerous key returned by a transform", () => {
		const result = applyTransform({ a: 1, b: 2, c: 3 }, (input) => {
			const last = input.key.at(-1);
			if (last === "a") return { key: ["__proto__"], value: input.value };
			if (last === "b")
				return { key: ["x", "constructor"], value: input.value };
			return input;
		});

		expect(result).toEqual({ c: 3 });
		expect(Object.prototype).not.toHaveProperty("a");
	});
});
