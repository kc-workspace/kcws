import { vol } from "@kcconfigs/vitest/mocks";
import { afterEach, describe, expect, test } from "vitest";
import { z } from "zod";
import { loadConfigSync } from "../../core";
import { ZconfigAdapterError } from "../../utils/errors";
import yamlAdapter from ".";

describe("yamlAdapter", () => {
	afterEach(() => {
		vol.reset();
	});

	test("parses nested YAML values", () => {
		vol.fromJSON(
			{ "config.yaml": "database:\n  host: localhost\n  port: 5432\n" },
			process.cwd(),
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
			process.cwd(),
		);

		expect(yamlAdapter().loadSync()).toEqual({ source: "yml" });
	});

	test("loads an explicit file asynchronously", async () => {
		vol.fromJSON({ "config/app.yaml": "debug: true\n" }, process.cwd());

		const adapter = yamlAdapter({ path: "config/app.yaml" });
		expect(adapter.name).toBe("yaml");
		expect(await adapter.load()).toEqual({ debug: true });
	});

	test("returns an empty object when optional input is missing", () => {
		expect(yamlAdapter({ optional: true }).loadSync()).toEqual({});
	});

	test("throws a typed error for malformed input", () => {
		vol.fromJSON({ "config.yaml": "database: [\n" }, process.cwd());

		expect(() => yamlAdapter().loadSync()).toThrow(ZconfigAdapterError);
	});

	test("does not allow a YAML __proto__ key to pollute Object.prototype", () => {
		delete (Object.prototype as { polluted?: boolean }).polluted;
		vol.fromJSON(
			{ "config.yaml": "__proto__:\n  polluted: true\n" },
			process.cwd(),
		);

		const config = loadConfigSync(z.object({}), [yamlAdapter()]);
		expect(config).toEqual({});
		expect(Object.prototype).not.toHaveProperty("polluted");
	});

	test("applies a leaf transform", () => {
		vol.fromJSON({ "config.yaml": "snake_key: value\n" }, process.cwd());

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
