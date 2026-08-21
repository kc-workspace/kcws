import { describe, expect, test } from "vitest";
import { z } from "zod";
import { ZconfigValidationError } from "../errors";
import validateConfig from "./validateConfig";

const schema = z.object({
	database: z.object({ host: z.string(), port: z.number() }),
	debug: z.boolean().default(false),
});

describe("validateConfig", () => {
	test("should return the parsed configuration", () => {
		const config = validateConfig(schema, {
			database: { host: "localhost", port: 5432 },
		});

		expect(config).toEqual({
			database: { host: "localhost", port: 5432 },
			debug: false,
		});
	});

	test("should resolve schema defaults", () => {
		const config = validateConfig(schema, {
			database: { host: "localhost", port: 5432 },
		});

		expect(config.debug).toBe(false);
	});

	test("should accept a null prototype object as produced by deepMerge", () => {
		const merged: Record<string, unknown> = Object.create(null);
		merged["database"] = { host: "localhost", port: 5432 };

		expect(() => validateConfig(schema, merged)).not.toThrow();
	});

	test("should throw ZconfigValidationError when a field is missing", () => {
		expect(() =>
			validateConfig(schema, { database: { host: "localhost" } }),
		).toThrow(ZconfigValidationError);
	});

	test("should report the failing key path in issues", () => {
		try {
			validateConfig(schema, { database: { host: "localhost" } });
			expect.unreachable("validateConfig should have thrown");
		} catch (error) {
			const validationError = error as ZconfigValidationError;

			expect(
				validationError.issues.map((issue) => issue.path.join(".")),
			).toContain("database.port");
		}
	});

	test("should throw when the configuration is empty", () => {
		expect(() => validateConfig(schema, {})).toThrow(ZconfigValidationError);
	});
});
