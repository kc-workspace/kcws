/** biome-ignore-all lint/complexity/useLiteralKeys: Conflict with ts(4111) */

import { describe, expect, test } from "vitest";
import deepMerge from "./deepMerge";

describe("deepMerge", () => {
	test("should return an empty object when given no sources", () => {
		expect(deepMerge()).toEqual({});
	});

	test("should merge disjoint keys from every source", () => {
		const merged = deepMerge({ a: 1 }, { b: 2 }, { c: 3 });

		expect(merged).toEqual({ a: 1, b: 2, c: 3 });
	});

	test("should let a later source win on a conflicting key", () => {
		const merged = deepMerge({ host: "localhost" }, { host: "db.internal" });

		expect(merged).toEqual({ host: "db.internal" });
	});

	test("should merge nested plain objects recursively", () => {
		const merged = deepMerge(
			{ database: { host: "localhost", port: 5432 } },
			{ database: { host: "db.internal" } },
		);

		expect(merged).toEqual({
			database: { host: "db.internal", port: 5432 },
		});
	});

	test("should merge deeply nested branches independently", () => {
		const merged = deepMerge(
			{ a: { b: { c: 1, d: 2 } } },
			{ a: { b: { d: 3 } }, e: 4 },
		);

		expect(merged).toEqual({ a: { b: { c: 1, d: 3 } }, e: 4 });
	});

	test("should replace arrays wholesale rather than concatenating", () => {
		const merged = deepMerge({ hosts: ["a", "b", "c"] }, { hosts: ["d"] });

		expect(merged).toEqual({ hosts: ["d"] });
	});

	test("should allow a later source to clear a list", () => {
		const merged = deepMerge({ hosts: ["a", "b"] }, { hosts: [] });

		expect(merged).toEqual({ hosts: [] });
	});

	test("should replace an object with a primitive and vice versa", () => {
		expect(deepMerge({ a: { b: 1 } }, { a: "flat" })).toEqual({ a: "flat" });
		expect(deepMerge({ a: "flat" }, { a: { b: 1 } })).toEqual({ a: { b: 1 } });
	});

	test("should let null replace an earlier value", () => {
		const merged = deepMerge({ a: 1, b: { c: 2 } }, { a: null, b: null });

		expect(merged).toEqual({ a: null, b: null });
	});

	test("should skip undefined so it never overrides an earlier value", () => {
		const merged = deepMerge({ a: 1 }, { a: undefined });

		expect(merged).toEqual({ a: 1 });
	});

	test("should treat a non-plain object as a leaf and replace it", () => {
		const date = new Date(0);
		const map = new Map([["k", "v"]]);
		class Custom {
			readonly x = 1;
		}
		const instance = new Custom();

		expect(deepMerge({ a: { b: 1 } }, { a: date })["a"]).toBe(date);
		expect(deepMerge({ a: { b: 1 } }, { a: map })["a"]).toBe(map);
		expect(deepMerge({ a: { b: 1 } }, { a: instance })["a"]).toBe(instance);
	});

	test("should not mutate any source object", () => {
		const first = { database: { host: "localhost", port: 5432 } };
		const second = { database: { host: "db.internal" } };

		deepMerge(first, second);

		expect(first).toEqual({ database: { host: "localhost", port: 5432 } });
		expect(second).toEqual({ database: { host: "db.internal" } });
	});

	test("should build results with a null prototype", () => {
		const merged = deepMerge({ database: { host: "localhost" } });

		expect(Object.getPrototypeOf(merged)).toBeNull();
		expect(Object.getPrototypeOf(merged["database"])).toBeNull();
	});

	describe("prototype pollution", () => {
		test("should drop a __proto__ key parsed from JSON", () => {
			const payload = JSON.parse('{"__proto__":{"polluted":"yes"}}') as Record<
				string,
				unknown
			>;

			const merged = deepMerge(payload);

			expect(merged).toEqual({});
			expect(Object.prototype).not.toHaveProperty("polluted");
			expect(({} as Record<string, unknown>)["polluted"]).toBeUndefined();
		});

		test("should drop a nested __proto__ key", () => {
			const payload = JSON.parse(
				'{"database":{"__proto__":{"polluted":"yes"}}}',
			) as Record<string, unknown>;

			const merged = deepMerge(payload);

			expect(merged).toEqual({ database: {} });
			expect(Object.prototype).not.toHaveProperty("polluted");
		});

		test("should drop constructor and prototype keys", () => {
			const payload = JSON.parse(
				'{"constructor":{"evil":true},"prototype":{"evil":true},"keep":1}',
			) as Record<string, unknown>;

			const merged = deepMerge(payload);

			expect(merged).toEqual({ keep: 1 });
		});
	});
});
