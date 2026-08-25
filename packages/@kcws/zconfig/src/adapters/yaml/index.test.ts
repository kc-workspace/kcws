import { mockCwd, vol } from "@kcconfigs/vitest/mocks";
import { afterEach, describe, expect, test } from "vitest";
import { ZconfigAdapterError } from "#utils/errors";
import { yamlAdapter } from ".";

describe("yamlAdapter", () => {
	afterEach(() => {
		vol.reset();
	});

	test("parses nested YAML values", () => {
		vol.fromJSON(
			{ "config.yaml": "database:\n  host: localhost\n  port: 5432\n" },
			mockCwd,
		);

		expect(yamlAdapter().loadSync()).toEqual({
			database: { host: "localhost", port: 5432 },
		});
	});

	test("prefers yaml over yml and rc/config candidates", () => {
		vol.fromJSON(
			{
				"config.yml": "source: yml\n",
				".configrc.yaml": "source: rc\n",
				"config/config.yaml": "source: config\n",
			},
			mockCwd,
		);

		expect(yamlAdapter().loadSync()).toEqual({ source: "yml" });
	});

	test("loads an explicit file asynchronously", async () => {
		vol.fromJSON({ "config/app.yaml": "debug: true\n" }, mockCwd);

		const adapter = yamlAdapter({ path: "config/app.yaml" });
		expect(adapter.name).toBe("yaml");
		expect(await adapter.load()).toEqual({ debug: true });
	});

	test("returns an empty object when optional input is missing", () => {
		expect(yamlAdapter({ optional: true }).loadSync()).toEqual({});
	});

	test("throws a typed error for malformed input", () => {
		vol.fromJSON({ "config.yaml": "database: [\n" }, mockCwd);

		expect(() => yamlAdapter().loadSync()).toThrow(ZconfigAdapterError);
	});

	test("applies a leaf transform", () => {
		vol.fromJSON({ "config.yaml": "snake_key: value\n" }, mockCwd);

		expect(
			yamlAdapter({
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
