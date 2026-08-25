import { mockCwd, vol } from "@kcconfigs/vitest/mocks";
import { afterEach, describe, expect, test } from "vitest";
import { ZconfigAdapterError } from "#utils/errors";
import { jsonAdapter } from ".";

describe("jsonAdapter", () => {
	afterEach(() => {
		vol.reset();
	});

	test("parses JSONC with comments by default", () => {
		vol.fromJSON(
			{ "config.json": '{\n // comment\n "database": { "port": 5432 }\n}' },
			mockCwd,
		);

		expect(jsonAdapter().loadSync()).toEqual({ database: { port: 5432 } });
	});

	test("parses JSONC with comments when jsonc is true", () => {
		vol.fromJSON({ "config.json": '{\n  // comment\n  "value": 1}' }, mockCwd);

		expect(jsonAdapter({ jsonc: true }).loadSync()).toEqual({ value: 1 });
	});

	test("parses nested values from an explicit path", async () => {
		vol.fromJSON(
			{ "config/app.json": '{"database":{"host":"localhost"}}' },
			mockCwd,
		);

		const adapter = jsonAdapter({ path: "config/app.json" });
		expect(adapter.name).toBe("json");
		expect(await adapter.load()).toEqual({
			database: { host: "localhost" },
		});
	});

	test("rejects comments in strict JSON mode", () => {
		vol.fromJSON({ "config.json": '{"value": 1, // comment\n}' }, mockCwd);

		expect(() => jsonAdapter({ jsonc: false }).loadSync()).toThrow(
			ZconfigAdapterError,
		);
	});

	test("surfaces JSONC diagnostics for malformed content", () => {
		vol.fromJSON({ "config.json": '{"value": }' }, mockCwd);

		expect(() => jsonAdapter().loadSync()).toThrow(/parse/);
	});

	test("returns an empty object when optional input is missing", () => {
		expect(jsonAdapter({ optional: true }).loadSync()).toEqual({});
	});

	test("throws a typed error when required input is missing", () => {
		expect(() => jsonAdapter({ optional: false }).loadSync()).toThrow(
			ZconfigAdapterError,
		);
	});

	test("applies a leaf transform", () => {
		vol.fromJSON({ "config.json": '{"snake_key":"value"}' }, mockCwd);

		expect(
			jsonAdapter({
				transform: (input) => ({
					key: input.key.map((segment) =>
						segment === "snake_key" ? "snakeKey" : segment,
					),
					value: input.value,
				}),
			}).loadSync(),
		).toEqual({ snakeKey: "value" });
	});
});
