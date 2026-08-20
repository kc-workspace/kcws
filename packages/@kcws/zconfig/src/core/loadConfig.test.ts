import { vol } from "@kcconfigs/vitest/mocks";
import { describe, expect, expectTypeOf, test, vi } from "vitest";
import { z } from "zod";
import { dotenvAdapter, envAdapter, yamlAdapter } from "../adapters";
import type { Adapter, RawConfig } from "../types";
import {
	ZconfigAdapterError,
	ZconfigSchemaError,
	ZconfigValidationError,
} from "../utils/errors";
import { loadConfig } from ".";

/** Adapter returning a fixed payload from both entry points. */
const stub = (name: string, value: RawConfig): Adapter => ({
	name,
	load: () => Promise.resolve(value),
	loadSync: () => value,
});

/** Adapter that fails the same way from both entry points. */
const failing = (name: string, error: unknown): Adapter => ({
	name,
	load: () => Promise.reject(error),
	loadSync: () => {
		throw error;
	},
});

/**
 * Awaits a promise expected to reject and returns the thrown value.
 *
 * Catching inline instead would type the result as a union with the resolved
 * config, hiding the error's own members behind a narrowing step.
 */
const rejection = async <T>(promise: Promise<unknown>): Promise<T> => {
	let caught: unknown;
	let rejected = false;

	try {
		await promise;
	} catch (error) {
		caught = error;
		rejected = true;
	}

	if (!rejected) expect.unreachable("promise should have rejected");
	return caught as T;
};

const schema = z.object({
	database: z.object({ host: z.string(), port: z.number() }),
	debug: z.boolean().default(false),
});

const base: RawConfig = { database: { host: "localhost", port: 5432 } };

describe("loadConfig", () => {
	test("should validate a single adapter and return the parsed config", async () => {
		await expect(loadConfig(schema, [stub("json", base)])).resolves.toEqual({
			database: { host: "localhost", port: 5432 },
			debug: false,
		});
	});

	test("should deep merge adapters with the later one winning", async () => {
		const config = await loadConfig(schema, [
			stub("yaml", base),
			stub("env", { database: { host: "db.internal" } }),
		]);

		expect(config.database).toEqual({ host: "db.internal", port: 5432 });
	});

	test("should load adapters in the declared order", async () => {
		const order: string[] = [];
		const record = (name: string, value: RawConfig): Adapter => ({
			name,
			load: () => {
				order.push(name);
				return Promise.resolve(value);
			},
			loadSync: () => value,
		});

		await loadConfig(schema, [
			record("first", base),
			record("second", {}),
			record("third", {}),
		]);

		expect(order).toEqual(["first", "second", "third"]);
	});

	test("should apply schema defaults to the merged result", async () => {
		const config = await loadConfig(schema, [stub("json", base)]);

		expect(config.debug).toBe(false);
	});

	test("should use load rather than loadSync", async () => {
		const adapter = stub("json", base);
		const loadSync = vi.spyOn(adapter, "loadSync");

		await loadConfig(schema, [adapter]);

		expect(loadSync).not.toHaveBeenCalled();
	});

	test("should reject with ZconfigValidationError when the merged config is invalid", async () => {
		await expect(
			loadConfig(schema, [
				stub("json", { database: { host: 1, port: "bad" } }),
			]),
		).rejects.toBeInstanceOf(ZconfigValidationError);
	});

	test("should populate issues on the validation error", async () => {
		const error = await rejection<ZconfigValidationError>(
			loadConfig(schema, [stub("json", { database: { host: "localhost" } })]),
		);

		expect(error.issues.length).toBeGreaterThan(0);
		expect(error.issues.map((issue) => issue.path.join("."))).toContain(
			"database.port",
		);
	});
});

describe("schema validation ordering", () => {
	const invalidSchema = z.object({ database_host: z.string() });

	test("should throw ZconfigSchemaError before any adapter runs", async () => {
		const adapter = stub("json", base);
		const load = vi.spyOn(adapter, "load");

		await expect(loadConfig(invalidSchema, [adapter])).rejects.toBeInstanceOf(
			ZconfigSchemaError,
		);
		expect(load).not.toHaveBeenCalled();
	});
});

describe("adapter error handling", () => {
	test("should wrap a raw adapter error and name the adapter", async () => {
		const cause = new Error("ENOENT: no such file");

		const error = await rejection<ZconfigAdapterError>(
			loadConfig(schema, [failing("yaml", cause)]),
		);

		expect(error).toBeInstanceOf(ZconfigAdapterError);
		expect(error.adapter).toBe("yaml");
		expect(error.cause).toBe(cause);
	});

	test("should wrap a non-Error thrown value", async () => {
		const error = await rejection<ZconfigAdapterError>(
			loadConfig(schema, [failing("env", "just a string")]),
		);

		expect(error).toBeInstanceOf(ZconfigAdapterError);
		expect(error.cause).toBe("just a string");
	});

	test("should pass an adapter's own ZconfigAdapterError through unchanged", async () => {
		const original = new ZconfigAdapterError("json", 'cannot resolve "json5"');

		const error = await rejection<ZconfigAdapterError>(
			loadConfig(schema, [failing("json", original)]),
		);

		expect(error).toBe(original);
	});

	test("should stop at the first failing adapter", async () => {
		const later = stub("env", base);
		const load = vi.spyOn(later, "load");

		await loadConfig(schema, [failing("json", new Error("boom")), later]).catch(
			() => undefined,
		);

		expect(load).not.toHaveBeenCalled();
	});
});

describe("integration", () => {
	const integrationSchema = z.object({
		database: z.object({
			host: z.string(),
			port: z.coerce.number(),
		}),
		debug: z.union([z.boolean(), z.stringbool()]).default(false),
	});

	test("should apply environment values after YAML values", async () => {
		vol.fromJSON(
			{
				"config.yaml":
					"database:\n  host: yaml.internal\n  port: 5432\ndebug: true\n",
				".env":
					"APP_DATABASE__HOST=dotenv.internal\nAPP_DATABASE__PORT=5433\nAPP_DEBUG=true\n",
			},
			process.cwd(),
		);
		vi.stubEnv("APP_DATABASE__HOST", "env.internal");
		vi.stubEnv("APP_DATABASE__PORT", "6543");
		vi.stubEnv("APP_DEBUG", "false");

		await expect(
			loadConfig(integrationSchema, [
				yamlAdapter(),
				dotenvAdapter({ prefix: "APP" }),
				envAdapter({ prefix: "APP" }),
			]),
		).resolves.toEqual({
			database: { host: "env.internal", port: 6543 },
			debug: false,
		});
	});

	test("should accept real YAML numbers and string environment values", async () => {
		vol.fromJSON(
			{ "config.yaml": "database:\n  host: yaml.internal\n  port: 5432\n" },
			process.cwd(),
		);

		const yamlConfig = await loadConfig(integrationSchema, [yamlAdapter()]);

		vi.stubEnv("APP_DATABASE__HOST", "env.internal");
		vi.stubEnv("APP_DATABASE__PORT", "6543");

		const envConfig = await loadConfig(integrationSchema, [
			envAdapter({ prefix: "APP" }),
		]);

		expect(yamlConfig.database.port).toBe(5432);
		expect(envConfig.database.port).toBe(6543);
	});

	test("should expose schema issue paths in validation errors", async () => {
		vol.fromJSON(
			{ "config.yaml": "database:\n  host: yaml.internal\n  port: invalid\n" },
			process.cwd(),
		);

		const error = await rejection<ZconfigValidationError>(
			loadConfig(integrationSchema, [yamlAdapter()]),
		);

		expect(error.issues.map((issue) => issue.path.join("."))).toContain(
			"database.port",
		);
	});
});

describe("types", () => {
	test("should return the schema output type, with defaults resolved", async () => {
		const config = await loadConfig(schema, [stub("json", base)]);

		expectTypeOf(config).toEqualTypeOf<{
			database: { host: string; port: number };
			debug: boolean;
		}>();
		// `debug` is optional on input and required on output, so this asserts the
		// return type follows z.output rather than z.input.
		expectTypeOf(config.debug).toEqualTypeOf<boolean>();
	});
});
