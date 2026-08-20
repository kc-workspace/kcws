import { vol } from "@kcconfigs/vitest/mocks";
import { afterEach, describe, expect, test, vi } from "vitest";
import envAdapter from ".";

describe("envAdapter", () => {
	afterEach(() => {
		vol.reset();
		vi.unstubAllEnvs();
	});

	test("reads prefixed variables into nested configuration", () => {
		vi.stubEnv("APP_DATABASE__HOST", "localhost");
		vi.stubEnv("APP_DATABASE__PORT", "5432");
		vi.stubEnv("OTHER_VALUE", "ignored");

		const adapter = envAdapter({ prefix: "APP", dotenv: false });

		expect(adapter.name).toBe("env");
		expect(adapter.loadSync()).toEqual({
			database: { host: "localhost", port: "5432" },
		});
	});

	test("supports custom path separators", () => {
		vi.stubEnv("APP_DATABASE.HOST", "localhost");

		expect(
			envAdapter({
				prefix: "APP",
				pathSeparator: ".",
				dotenv: false,
			}).loadSync(),
		).toEqual({ database: { host: "localhost" } });
	});

	test("applies a transform to decoded leaves", () => {
		vi.stubEnv("APP_DATABASE_HOST", "localhost");

		const result = envAdapter({
			prefix: "APP",
			dotenv: false,
			transform: (input) => ({
				key: input.key[0] === "databaseHost" ? ["database", "host"] : input.key,
				value: input.value,
			}),
		}).loadSync();

		expect(result).toEqual({ database: { host: "localhost" } });
	});

	test("loads .env by default without overriding process.env", () => {
		vol.fromJSON(
			{
				".env": "APP_DATABASE__HOST=dotenv-host\nAPP_DATABASE__PORT=1111\n",
			},
			process.cwd(),
		);
		vi.stubEnv("APP_DATABASE__PORT", "2222");

		expect(envAdapter({ prefix: "APP" }).loadSync()).toEqual({
			database: { host: "dotenv-host", port: "2222" },
		});
	});

	test("loads an explicit dotenv path", () => {
		vol.fromJSON({ "config/.env.test": "APP_DEBUG=true\n" }, process.cwd());

		expect(
			envAdapter({ prefix: "APP", dotenv: "config/.env.test" }).loadSync(),
		).toEqual({ debug: "true" });
	});

	test("skips dotenv when disabled", () => {
		vol.fromJSON({ ".env": "APP_DEBUG=true\n" }, process.cwd());

		expect(envAdapter({ prefix: "APP", dotenv: false }).loadSync()).toEqual({});
	});

	test("uses the same synchronous implementation for load", async () => {
		vi.stubEnv("APP_DEBUG", "true");
		const adapter = envAdapter({ prefix: "APP", dotenv: false });

		expect(await adapter.load()).toEqual(adapter.loadSync());
	});
});
