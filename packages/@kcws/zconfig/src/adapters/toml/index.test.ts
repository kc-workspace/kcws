import { mockCwd, vol } from "@kcconfigs/vitest/mocks";
import { afterEach, describe, expect, test } from "vitest";
import { ZconfigAdapterError } from "#utils/errors";
import { tomlAdapter } from ".";

describe("tomlAdapter", () => {
	afterEach(() => {
		vol.reset();
	});

	test("parses nested TOML tables", () => {
		vol.fromJSON(
			{
				"config.toml": '[database]\nhost = "localhost"\nport = 5432\n',
			},
			mockCwd,
		);

		expect(tomlAdapter().loadSync()).toEqual({
			database: { host: "localhost", port: 5432 },
		});
	});

	test("loads an explicit file asynchronously", async () => {
		vol.fromJSON({ "config/app.toml": "debug = true\n" }, mockCwd);

		const adapter = tomlAdapter({ path: "config/app.toml" });
		expect(adapter.name).toBe("toml");
		expect(await adapter.load()).toEqual({ debug: true });
	});

	test("returns an empty object when optional input is missing", () => {
		expect(tomlAdapter({ optional: true }).loadSync()).toEqual({});
	});

	test("throws a typed error for malformed input", () => {
		vol.fromJSON({ "config.toml": "[database\nhost = true" }, mockCwd);

		expect(() => tomlAdapter().loadSync()).toThrow(ZconfigAdapterError);
	});

	test("renames snake_case TOML keys through a transform", () => {
		vol.fromJSON({ "config.toml": "[database]\nmax_size = 10\n" }, mockCwd);

		expect(
			tomlAdapter({
				transform: (input) => ({
					key: input.key.map((segment) =>
						segment === "max_size" ? "maxSize" : segment,
					),
					value: input.value,
				}),
			}).loadSync(),
		).toEqual({ database: { maxSize: 10 } });
	});
});
