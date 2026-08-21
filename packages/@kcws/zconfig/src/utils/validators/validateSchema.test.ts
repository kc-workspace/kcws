import { describe, expect, test } from "vitest";
import { z } from "zod";
import { ZconfigSchemaError } from "../errors";
import validateSchema from "./validateSchema";

/** Runs the validator and returns the thrown error, failing if none is thrown. */
const expectRejected = (schema: z.ZodType): ZconfigSchemaError => {
	try {
		validateSchema(schema);
	} catch (error) {
		expect(error).toBeInstanceOf(ZconfigSchemaError);
		return error as ZconfigSchemaError;
	}

	expect.unreachable("validateSchema should have thrown");
	throw new Error("unreachable");
};

describe("validateSchema", () => {
	describe("accepted keys", () => {
		test("should accept a flat camelCase schema", () => {
			expect(() =>
				validateSchema(z.object({ host: z.string(), maxRetries: z.number() })),
			).not.toThrow();
		});

		test("should accept nested camelCase objects", () => {
			expect(() =>
				validateSchema(
					z.object({
						database: z.object({ host: z.string(), hostName: z.string() }),
					}),
				),
			).not.toThrow();
		});

		test("should accept digits inside and at the end of a key", () => {
			expect(() =>
				validateSchema(z.object({ db2Host: z.string(), ipv6: z.boolean() })),
			).not.toThrow();
		});

		test("should accept a non-object root", () => {
			expect(() => validateSchema(z.string())).not.toThrow();
		});
	});

	describe("rejected keys", () => {
		test("should reject a key containing an underscore", () => {
			const error = expectRejected(z.object({ database_host: z.string() }));

			expect(error.key).toStrictEqual(["database_host"]);
			expect(error.reason).toContain("underscore");
		});

		test("should reject a key starting with an uppercase letter", () => {
			const error = expectRejected(z.object({ Database: z.string() }));

			expect(error.key).toStrictEqual(["Database"]);
			expect(error.reason).toContain("lowercase");
		});

		test("should reject a SCREAMING_CASE key", () => {
			expect(() => validateSchema(z.object({ DATABASE: z.string() }))).toThrow(
				ZconfigSchemaError,
			);
		});

		test("should reject a key containing a dash", () => {
			const error = expectRejected(z.object({ "max-retries": z.number() }));

			expect(error.key).toStrictEqual(["max-retries"]);
			expect(error.reason).toContain("letters and digits");
		});

		test("should reject a key starting with a digit", () => {
			expect(() => validateSchema(z.object({ "2fa": z.boolean() }))).toThrow(
				ZconfigSchemaError,
			);
		});

		test("should report the full path of a nested offender", () => {
			const error = expectRejected(
				z.object({
					database: z.object({ pool: z.object({ max_size: z.number() }) }),
				}),
			);

			expect(error.key).toStrictEqual(["database", "pool", "max_size"]);
			expect(error.message).toContain("database.pool.max_size");
		});
	});

	describe("wrapper unwrapping", () => {
		test("should descend through optional", () => {
			expect(() =>
				validateSchema(
					z.object({ a: z.object({ b_c: z.string() }).optional() }),
				),
			).toThrow(ZconfigSchemaError);
		});

		test("should descend through default", () => {
			expect(() =>
				validateSchema(
					z.object({ a: z.object({ b_c: z.string() }).default({ b_c: "x" }) }),
				),
			).toThrow(ZconfigSchemaError);
		});

		test("should descend through nullable", () => {
			expect(() =>
				validateSchema(
					z.object({ a: z.object({ b_c: z.string() }).nullable() }),
				),
			).toThrow(ZconfigSchemaError);
		});

		test("should descend through catch", () => {
			expect(() =>
				validateSchema(
					z.object({ a: z.object({ b_c: z.string() }).catch({ b_c: "x" }) }),
				),
			).toThrow(ZconfigSchemaError);
		});

		test("should descend through readonly", () => {
			expect(() =>
				validateSchema(
					z.object({ a: z.object({ b_c: z.string() }).readonly() }),
				),
			).toThrow(ZconfigSchemaError);
		});
	});

	describe("containers", () => {
		test("should descend into array elements", () => {
			expect(() =>
				validateSchema(
					z.object({ items: z.array(z.object({ a_b: z.string() })) }),
				),
			).toThrow(ZconfigSchemaError);
		});

		test("should descend into every union member", () => {
			expect(() =>
				validateSchema(
					z.object({
						either: z.union([
							z.object({ good: z.string() }),
							z.object({ bad_key: z.string() }),
						]),
					}),
				),
			).toThrow(ZconfigSchemaError);
		});

		test("should accept a union whose members are all valid", () => {
			expect(() =>
				validateSchema(
					z.object({
						either: z.union([
							z.object({ host: z.string() }),
							z.object({ hostName: z.string() }),
						]),
					}),
				),
			).not.toThrow();
		});

		test("should descend into a discriminated union", () => {
			expect(() =>
				validateSchema(
					z.discriminatedUnion("kind", [
						z.object({ kind: z.literal("a"), good: z.string() }),
						z.object({ kind: z.literal("b"), bad_key: z.string() }),
					]),
				),
			).toThrow(ZconfigSchemaError);
		});

		test("should descend into both sides of an intersection", () => {
			expect(() =>
				validateSchema(
					z.intersection(
						z.object({ good: z.string() }),
						z.object({ bad_key: z.string() }),
					),
				),
			).toThrow(ZconfigSchemaError);
		});

		test("should descend into set values", () => {
			expect(() =>
				validateSchema(
					z.object({ tags: z.set(z.object({ bad_key: z.string() })) }),
				),
			).toThrow(ZconfigSchemaError);
		});

		test("should descend into a tuple rest element", () => {
			expect(() =>
				validateSchema(
					z.object({
						row: z.tuple([z.string()], z.object({ bad_key: z.string() })),
					}),
				),
			).toThrow(ZconfigSchemaError);
		});

		test("should descend into tuple items", () => {
			expect(() =>
				validateSchema(
					z.object({ pair: z.tuple([z.object({ bad_key: z.string() })]) }),
				),
			).toThrow(ZconfigSchemaError);
		});

		test("should descend through a pipe such as z.stringbool", () => {
			expect(() =>
				validateSchema(z.object({ debug: z.stringbool() })),
			).not.toThrow();
		});
	});

	describe("records", () => {
		test("should accept a record because its keys only exist at runtime", () => {
			expect(() =>
				validateSchema(z.object({ labels: z.record(z.string(), z.string()) })),
			).not.toThrow();
		});

		test("should still check the static shape of a record value", () => {
			const error = expectRejected(
				z.object({
					pools: z.record(z.string(), z.object({ max_size: z.number() })),
				}),
			);

			expect(error.key).toStrictEqual(["pools", "*", "max_size"]);
		});

		test("should accept an object catchall", () => {
			expect(() =>
				validateSchema(z.object({ a: z.string() }).catchall(z.string())),
			).not.toThrow();
		});
	});

	describe("cycles", () => {
		test("should terminate on a self-referencing lazy schema", () => {
			type Node = { name: string; child?: Node | undefined };
			const node: z.ZodType<Node> = z.lazy(() =>
				z.object({ name: z.string(), child: node.optional() }),
			);

			expect(() => validateSchema(node)).not.toThrow();
		});

		test("should still report an offender inside a lazy schema", () => {
			type Node = { bad_name: string; child?: Node | undefined };
			const node: z.ZodType<Node> = z.lazy(() =>
				z.object({ bad_name: z.string(), child: node.optional() }),
			);

			expect(() => validateSchema(node)).toThrow(ZconfigSchemaError);
		});

		test("should terminate when a lazy getter builds a fresh schema per call", () => {
			// The schema-level guard cannot help here: every call yields a new
			// ZodLazy instance, so only tracking the getter itself terminates.
			const build: () => z.ZodType = () => z.lazy(build);

			expect(() => validateSchema(build())).not.toThrow();
		});

		test("should terminate when the same schema is reused at many paths", () => {
			const shared = z.object({ host: z.string() });

			expect(() =>
				validateSchema(z.object({ a: shared, b: shared, c: shared })),
			).not.toThrow();
		});
	});
});
