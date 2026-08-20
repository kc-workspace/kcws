import { describe, expect, test } from "vitest";
import { decodeEnvKey, encodeEnvKey } from "./utils";

describe("encodeEnvKey", () => {
	test("keeps nested keys distinct from a combined camelCase key", () => {
		expect(encodeEnvKey(["database", "host"], "APP", "__")).toBe(
			"APP_DATABASE__HOST",
		);
		expect(encodeEnvKey(["databaseHost"], "APP", "__")).toBe(
			"APP_DATABASE_HOST",
		);
	});

	test("encodes acronyms and digits without special casing", () => {
		expect(encodeEnvKey(["dbURL"], undefined, "__")).toBe("DB_U_R_L");
		expect(encodeEnvKey(["db2Host"], undefined, "__")).toBe("DB2_HOST");
	});
});

describe("decodeEnvKey", () => {
	test("decodes prefixed nested and combined paths", () => {
		expect(decodeEnvKey("APP_DATABASE__HOST", "APP", "__")).toEqual([
			"database",
			"host",
		]);
		expect(decodeEnvKey("APP_DATABASE_HOST", "APP", "__")).toEqual([
			"databaseHost",
		]);
	});

	test("round-trips acronym and digit segments", () => {
		expect(decodeEnvKey("DB_U_R_L", undefined, "__")).toEqual(["dbURL"]);
		expect(decodeEnvKey("DB2_HOST", undefined, "__")).toEqual(["db2Host"]);
	});

	test("ignores non-matching prefixes and malformed paths", () => {
		expect(decodeEnvKey("OTHER_VALUE", "APP", "__")).toBeUndefined();
		expect(decodeEnvKey("APP__VALUE", "APP", "__")).toBeUndefined();
		expect(decodeEnvKey("APP_VALUE__", "APP", "__")).toBeUndefined();
	});

	test("supports a custom path separator", () => {
		expect(encodeEnvKey(["database", "hostName"], "APP", ".")).toBe(
			"APP_DATABASE.HOST_NAME",
		);
		expect(decodeEnvKey("APP_DATABASE.HOST_NAME", "APP", ".")).toEqual([
			"database",
			"hostName",
		]);
	});

	test("round-trips a generated set of valid camelCase paths without collisions", () => {
		const segments = [
			"a",
			"b2",
			"database",
			"host",
			"hostName",
			"databaseHost",
			"dbURL",
		];
		const paths = Array.from({ length: 21 }, (_, index) => {
			const depth = (index % 3) + 1;
			return Array.from(
				{ length: depth },
				(_, segmentIndex) =>
					segments[(index + segmentIndex * 3) % segments.length]!,
			);
		});
		const encoded = paths.map((path) => encodeEnvKey(path, undefined, "__"));

		for (const [index, path] of paths.entries()) {
			expect(decodeEnvKey(encoded[index]!, undefined, "__")).toEqual(path);
		}
		expect(new Set(encoded).size).toBe(paths.length);
	});
});
