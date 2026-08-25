import { mockCwd, vol } from "@kcconfigs/vitest/mocks";
import { afterEach, describe, expect, test } from "vitest";
import { ZconfigAdapterError } from "#utils/errors";
import { autoAdapter } from ".";

describe("autoAdapter", () => {
	afterEach(() => {
		vol.reset();
	});

	test.each([
		{
			extension: "yaml",
			content: "database:\n  port: 5432\n",
			expected: { database: { port: 5432 } },
		},
		{
			extension: "yml",
			content: "database:\n  port: 5432\n",
			expected: { database: { port: 5432 } },
		},
		{
			extension: "json5",
			content: "{ database: { port: 5432, }, }",
			expected: { database: { port: 5432 } },
		},
		{
			extension: "jsonc",
			content: '{\n // comment\n "database": { "port": 5432 }\n}',
			expected: { database: { port: 5432 } },
		},
		{
			extension: "json",
			content: '{\n "database": { "port": 5432 }\n}',
			expected: { database: { port: 5432 } },
		},
		{
			extension: "toml",
			content: "[database]\nport = 5432\n",
			expected: { database: { port: 5432 } },
		},
	])(
		"parses .$extension with the matching standard parser",
		({ extension, content, expected }) => {
			vol.fromJSON({ [`config.${extension}`]: content }, mockCwd);

			expect(autoAdapter().loadSync()).toEqual(expected);
		},
	);

	test("uses strict JSON parsing for .json files", () => {
		vol.fromJSON(
			{
				"config.json":
					'{\n // comments are only supported by .jsonc\n "debug": true\n}',
			},
			mockCwd,
		);

		expect(() => autoAdapter().loadSync()).toThrow(ZconfigAdapterError);
	});

	test("loads an explicit file asynchronously", async () => {
		vol.fromJSON({ "config/app.yaml": "debug: true\n" }, mockCwd);

		const adapter = autoAdapter({ path: "config/app.yaml" });
		expect(adapter.name).toBe("auto");
		expect(await adapter.load()).toEqual({ debug: true });
	});

	test("returns an empty object when optional input is missing", () => {
		expect(autoAdapter({ optional: true }).loadSync()).toEqual({});
	});

	test("throws a typed error for malformed input", () => {
		vol.fromJSON({ "config.yaml": "database: [\n" }, mockCwd);

		expect(() => autoAdapter().loadSync()).toThrow(ZconfigAdapterError);
	});

	test("applies a leaf transform", () => {
		vol.fromJSON({ "config.yaml": "snake_key: value\n" }, mockCwd);

		expect(
			autoAdapter({
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
