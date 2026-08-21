import { describe, expect, test } from "vitest";
import { staticAdapter } from ".";

describe("staticAdapter", () => {
	test("returns the supplied raw config", async () => {
		const config = { database: { port: 5432 } };
		const adapter = staticAdapter(config);

		expect(adapter.name).toBe("static");
		expect(adapter.loadSync()).toBe(config);
		expect(await adapter.load()).toBe(config);
	});

	test("applies a leaf transform without env decoding", async () => {
		const adapter = staticAdapter({ database_host: "localhost" }, (input) => ({
			key: input.key.map((segment) =>
				segment === "database_host" ? "databaseHost" : segment,
			),
			value: input.value,
		}));

		const expected = { databaseHost: "localhost" };
		expect(adapter.loadSync()).toEqual(expected);
		expect(await adapter.load()).toEqual(expected);
	});

	test("uses the same implementation for load and loadSync", async () => {
		const adapter = staticAdapter({ debug: true });

		expect(await adapter.load()).toBe(adapter.loadSync());
	});
});
