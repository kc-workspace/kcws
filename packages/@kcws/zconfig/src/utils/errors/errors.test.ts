import { describe, expect, test } from "vitest";
import { z } from "zod";
import { ZconfigValidationError } from ".";
import { ZconfigAdapterError, ZconfigSchemaError } from "./errors";

describe("errors", () => {
	describe("ZconfigAdapterError", () => {
		test("should expose the adapter name", () => {
			const error = new ZconfigAdapterError("json", "cannot read file");

			expect(error.adapter).toBe("json");
			expect(error.message).toContain("json");
			expect(error.message).toContain("cannot read file");
		});

		test("should retain the underlying cause", () => {
			const cause = new Error("ENOENT");
			const error = new ZconfigAdapterError("yaml", "cannot read file", cause);

			expect(error.cause).toBe(cause);
		});

		test("should leave cause undefined when none is given", () => {
			const error = new ZconfigAdapterError("env", "boom");

			expect(error.cause).toBeUndefined();
		});

		test("should be an Error with a stable name", () => {
			const error = new ZconfigAdapterError("toml", "boom");

			expect(error).toBeInstanceOf(Error);
			expect(error).toBeInstanceOf(ZconfigAdapterError);
			expect(error.name).toBe("ZconfigAdapterError");
		});
	});

	describe("ZconfigSchemaError", () => {
		test("should expose the offending key path and reason", () => {
			const error = new ZconfigSchemaError(
				["database", "host_name"],
				"key must be camelCase",
			);

			expect(error.key).toStrictEqual(["database", "host_name"]);
			expect(error.reason).toBe("key must be camelCase");
		});

		test("should render the key path in the message", () => {
			const error = new ZconfigSchemaError(["a", "b"], "boom");

			expect(error.message).toContain("a.b");
			expect(error.message).toContain("boom");
		});

		test("should be an Error with a stable name", () => {
			const error = new ZconfigSchemaError(["a"], "boom");

			expect(error).toBeInstanceOf(Error);
			expect(error).toBeInstanceOf(ZconfigSchemaError);
			expect(error.name).toBe("ZconfigSchemaError");
		});

		test("should keep the constructor out of the stack trace", () => {
			const error = new ZconfigSchemaError(["a"], "boom");

			expect(error.stack).toBeDefined();
			expect(error.stack).not.toContain("new ZconfigSchemaError");
		});
	});

	describe("ZconfigValidationError", () => {
		const buildZodError = () => {
			const schema = z.object({ port: z.number() });
			const result = schema.safeParse({ port: "not-a-number" });
			if (result.success) throw new Error("fixture should not parse");
			return result.error;
		};

		test("should expose the zod issues", () => {
			const zodError = buildZodError();
			const error = new ZconfigValidationError(zodError);

			expect(error.issues).toStrictEqual(zodError.issues);
			expect(error.issues.length).toBeGreaterThan(0);
			expect(error.issues[0]?.path).toStrictEqual(["port"]);
		});

		test("should retain the original ZodError as cause", () => {
			const zodError = buildZodError();
			const error = new ZconfigValidationError(zodError);

			expect(error.cause).toBe(zodError);
		});

		test("should be an Error with a stable name", () => {
			const error = new ZconfigValidationError(buildZodError());

			expect(error).toBeInstanceOf(Error);
			expect(error).toBeInstanceOf(ZconfigValidationError);
			expect(error.name).toBe("ZconfigValidationError");
		});

		test("should summarise the failing paths in the message", () => {
			const error = new ZconfigValidationError(buildZodError());

			expect(error.message).toContain("port");
		});

		test("should summarise a root level issue without a path prefix", () => {
			const result = z.object({ port: z.number() }).safeParse("not-an-object");
			if (result.success) throw new Error("fixture should not parse");

			const error = new ZconfigValidationError(result.error);

			expect(error.issues[0]?.path).toStrictEqual([]);
			expect(error.message).not.toContain(": :");
			expect(error.message).toContain(result.error.issues[0]?.message ?? "");
		});
	});
});
