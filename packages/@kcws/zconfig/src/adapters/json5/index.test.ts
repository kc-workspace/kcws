import { mockCwd, vol } from "@kcconfigs/vitest/mocks";
import { afterEach, describe, expect, test } from "vitest";
import { ZconfigAdapterError } from "#utils/errors";
import { json5Adapter } from ".";

describe("json5Adapter", () => {
	afterEach(() => {
		vol.reset();
	});

	test("parses JSON5 comments, trailing commas, and unquoted keys", () => {
		vol.fromJSON(
			{ "config.json5": "{ database: { host: 'localhost', }, }" },
			mockCwd,
		);

		expect(json5Adapter().loadSync()).toEqual({
			database: { host: "localhost" },
		});
	});

	test("loads an explicit file asynchronously", async () => {
		vol.fromJSON({ "config/app.json5": "{debug: true}" }, mockCwd);

		const adapter = json5Adapter({ path: "config/app.json5" });
		expect(adapter.name).toBe("json5");
		expect(await adapter.load()).toEqual({ debug: true });
	});

	test("returns an empty object when optional input is missing", () => {
		expect(json5Adapter({ optional: true }).loadSync()).toEqual({});
	});

	test("throws a typed error for malformed input", () => {
		vol.fromJSON({ "config.json5": "{debug:" }, mockCwd);

		expect(() => json5Adapter().loadSync()).toThrow(ZconfigAdapterError);
	});

	test("applies a leaf transform", () => {
		vol.fromJSON({ "config.json5": "{snake_key: 'value'}" }, mockCwd);

		expect(
			json5Adapter({
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
