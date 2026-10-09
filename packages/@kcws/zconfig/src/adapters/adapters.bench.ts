import { mockCwd, vol } from "@kcconfigs/vitest/mocks";
import { afterAll, beforeAll, expect, test } from "vitest";
import { jsonAdapter } from "./json";
import { json5Adapter } from "./json5";
import { tomlAdapter } from "./toml";
import { yamlAdapter } from "./yaml";

const expected = {
	database: { host: "localhost", port: 5432 },
	features: { cache: true, retries: 3 },
};

beforeAll(() => {
	vol.fromJSON(
		{
			"config.json": JSON.stringify(expected),
			"config.json5":
				"{ database: { host: 'localhost', port: 5432 }, features: { cache: true, retries: 3 } }",
			"config.yaml":
				"database:\n  host: localhost\n  port: 5432\nfeatures:\n  cache: true\n  retries: 3\n",
			"config.toml":
				'[database]\nhost = "localhost"\nport = 5432\n\n[features]\ncache = true\nretries = 3\n',
		},
		mockCwd,
	);
});

afterAll(() => {
	vol.reset();
});

test("compare file adapters loading the same config", async ({ bench }) => {
	const adapters = {
		json: jsonAdapter({ jsonc: false }),
		jsonc: jsonAdapter({ jsonc: true }),
		json5: json5Adapter(),
		yaml: yamlAdapter(),
		toml: tomlAdapter(),
	};

	for (const adapter of Object.values(adapters)) {
		expect(adapter.loadSync()).toEqual(expected);
	}

	const result = await bench.compare(
		...Object.entries(adapters).map(([name, adapter]) =>
			bench(name, () => {
				adapter.loadSync();
			}),
		),
	);

	expect(result.get("json")).toBeFasterThan(result.get("jsonc"));
});
