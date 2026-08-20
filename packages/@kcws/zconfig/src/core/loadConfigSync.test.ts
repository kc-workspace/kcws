import { vol } from "@kcconfigs/vitest/mocks";
import { describe, expect, expectTypeOf, test, vi } from "vitest";
import { z } from "zod";
import { envAdapter, yamlAdapter } from "../adapters";
import type { Adapter, RawConfig } from "../types";
import {
	ZconfigAdapterError,
	ZconfigSchemaError,
	ZconfigValidationError,
} from "../utils/errors";
import { loadConfig, loadConfigSync } from ".";

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

const schema = z.object({
	database: z.object({ host: z.string(), port: z.number() }),
	debug: z.boolean().default(false),
});

const base: RawConfig = { database: { host: "localhost", port: 5432 } };

describe("loadConfigSync", () => {
	test("should validate a single adapter and return the parsed config", () => {
		expect(loadConfigSync(schema, [stub("json", base)])).toEqual({
			database: { host: "localhost", port: 5432 },
			debug: false,
		});
	});

	test("should use loadSync rather than load", () => {
		const adapter = stub("json", base);
		const load = vi.spyOn(adapter, "load");

		loadConfigSync(schema, [adapter]);

		expect(load).not.toHaveBeenCalled();
	});

	test("should throw ZconfigValidationError when the merged config is invalid", () => {
		expect(() => loadConfigSync(schema, [stub("json", {})])).toThrow(
			ZconfigValidationError,
		);
	});
});

describe("schema validation ordering", () => {
	const invalidSchema = z.object({ database_host: z.string() });

	test("should throw ZconfigSchemaError before any adapter runs when sync", () => {
		const adapter = stub("json", base);
		const loadSync = vi.spyOn(adapter, "loadSync");

		expect(() => loadConfigSync(invalidSchema, [adapter])).toThrow(
			ZconfigSchemaError,
		);
		expect(loadSync).not.toHaveBeenCalled();
	});
});

describe("adapter error handling", () => {
	test("should wrap a raw adapter error when sync", () => {
		const cause = new Error("ENOENT: no such file");

		try {
			loadConfigSync(schema, [failing("toml", cause)]);
			expect.unreachable("loadConfigSync should have thrown");
		} catch (thrown) {
			expect(thrown).toBeInstanceOf(ZconfigAdapterError);
			expect((thrown as ZconfigAdapterError).adapter).toBe("toml");
		}
	});
});

describe("sync and async parity", () => {
	test("should produce identical results across a multi adapter fixture", async () => {
		const adapters = (): Adapter[] => [
			stub("yaml", { database: { host: "localhost", port: 5432 } }),
			stub("json", { database: { port: 6543 }, debug: true }),
			stub("env", { database: { host: "db.internal" } }),
		];

		const asyncConfig = await loadConfig(schema, adapters());
		const syncConfig = loadConfigSync(schema, adapters());

		expect(syncConfig).toEqual(asyncConfig);
		expect(syncConfig).toEqual({
			database: { host: "db.internal", port: 6543 },
			debug: true,
		});
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

	test("should keep sync and async results equal across YAML and environment", async () => {
		vol.fromJSON(
			{ "config.yaml": "database:\n  host: yaml.internal\n  port: 5432\n" },
			process.cwd(),
		);
		vi.stubEnv("APP_DATABASE__HOST", "env.internal");
		vi.stubEnv("APP_DATABASE__PORT", "6543");
		vi.stubEnv("APP_DEBUG", "true");

		const adapters = [yamlAdapter(), envAdapter({ prefix: "APP" })];
		const asyncConfig = await loadConfig(integrationSchema, adapters);
		const syncConfig = loadConfigSync(integrationSchema, adapters);

		expect(syncConfig).toEqual(asyncConfig);
		expect(syncConfig).toEqual({
			database: { host: "env.internal", port: 6543 },
			debug: true,
		});
	});
});

describe("types", () => {
	test("should return the schema output type when sync", () => {
		const config = loadConfigSync(schema, [stub("json", base)]);

		expectTypeOf(config).toEqualTypeOf<{
			database: { host: string; port: number };
			debug: boolean;
		}>();
	});
});
