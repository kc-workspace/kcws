import { vol } from "@kcconfigs/vitest/mocks";
import { afterEach, describe, expect, test } from "vitest";
import { ZconfigAdapterError } from "../../utils/errors";
import { dotenvAdapter } from ".";

describe("dotenvAdapter", () => {
	afterEach(() => {
		vol.reset();
	});

	test("reads an explicit dotenv file with a prefix", () => {
		vol.fromJSON(
			{ "config/.env": "APP_DATABASE__HOST=localhost\n" },
			process.cwd(),
		);

		const adapter = dotenvAdapter({ path: "config/.env", prefix: "APP" });

		expect(adapter.name).toBe("dotenv");
		expect(adapter.loadSync()).toEqual({ database: { host: "localhost" } });
	});

	test("returns an empty object for a missing optional dotenv file", () => {
		expect(dotenvAdapter({ optional: true }).loadSync()).toEqual({});
	});

	test("keeps async and sync output equal", async () => {
		vol.fromJSON({ ".env": "APP_DEBUG=true\n" }, process.cwd());
		const adapter = dotenvAdapter({ prefix: "APP" });

		expect(await adapter.load()).toEqual(adapter.loadSync());
	});

	test("supports a custom path separator", () => {
		vol.fromJSON({ ".env": "APP_DATABASE.HOST=localhost\n" }, process.cwd());

		expect(
			dotenvAdapter({ prefix: "APP", pathSeparator: "." }).loadSync(),
		).toEqual({ database: { host: "localhost" } });
	});

	test("applies a leaf transform", () => {
		vol.fromJSON({ ".env": "APP_DATABASE_HOST=localhost\n" }, process.cwd());

		const result = dotenvAdapter({
			prefix: "APP",
			transform: (input) => ({
				key: input.key[0] === "databaseHost" ? ["database", "host"] : input.key,
				value: input.value,
			}),
		}).loadSync();

		expect(result).toEqual({ database: { host: "localhost" } });
	});

	test("throws a typed error when a required dotenv file is missing", () => {
		expect(() => dotenvAdapter({ optional: false }).loadSync()).toThrow(
			ZconfigAdapterError,
		);
	});
});
