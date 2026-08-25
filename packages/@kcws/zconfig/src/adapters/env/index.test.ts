import { mockCwd, vol } from "@kcconfigs/vitest/mocks";
import { afterEach, describe, expect, test, vi } from "vitest";
import { envAdapter } from ".";

describe("envAdapter", () => {
	afterEach(() => {
		vol.reset();
		vi.unstubAllEnvs();
	});

	test("reads prefixed variables into nested configuration", () => {
		vi.stubEnv("APP_DATABASE__HOST", "localhost");
		vi.stubEnv("APP_DATABASE__PORT", "5432");
		vi.stubEnv("OTHER_VALUE", "ignored");

		const adapter = envAdapter({ prefix: "APP" });

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
			}).loadSync(),
		).toEqual({ database: { host: "localhost" } });
	});

	test("applies a transform to decoded leaves", () => {
		vi.stubEnv("APP_DATABASE_HOST", "localhost");

		const result = envAdapter({
			prefix: "APP",
			transform: (input) => ({
				key: input.key[0] === "databaseHost" ? ["database", "host"] : input.key,
				value: input.value,
			}),
		}).loadSync();

		expect(result).toEqual({ database: { host: "localhost" } });
	});

	test("reads only process environment values", () => {
		vol.fromJSON({ ".env": "APP_DEBUG=true\n" }, mockCwd);
		vi.stubEnv("APP_DEBUG", "false");

		expect(envAdapter({ prefix: "APP" }).loadSync()).toEqual({
			debug: "false",
		});
	});

	test("uses the same synchronous implementation for load", async () => {
		vi.stubEnv("APP_DEBUG", "true");
		const adapter = envAdapter({ prefix: "APP" });

		expect(await adapter.load()).toEqual(adapter.loadSync());
	});
});
