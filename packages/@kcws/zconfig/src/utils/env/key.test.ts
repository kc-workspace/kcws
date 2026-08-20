import { describe, expect, test } from "vitest";
import { decodeEnvKey, encodeEnvKey } from "./key";

describe("encodeEnvKey", () => {
	test.each`
		keys                    | prefix       | expected
		${["database", "host"]} | ${"APP"}     | ${"APP_DATABASE__HOST"}
		${["database", "host"]} | ${"apP"}     | ${"APP_DATABASE__HOST"}
		${["databaseHost"]}     | ${"APP"}     | ${"APP_DATABASE_HOST"}
		${["database-host"]}    | ${"APP"}     | ${"APP_DATABASE_HOST"}
		${["databaseName"]}     | ${"M_"}      | ${"M_DATABASE_NAME"}
		${["databaseName"]}     | ${"M.N"}     | ${"M_N_DATABASE_NAME"}
		${["databasePort"]}     | ${"_M__"}    | ${"_M__DATABASE_PORT"}
		${["dbURL"]}            | ${undefined} | ${"DB_U_R_L"}
		${["db2Host"]}          | ${undefined} | ${"DB2_HOST"}
	`(
		"encodeEnvKey($keys, $prefix) -> $expected",
		({ keys, prefix, expected }) => {
			expect(encodeEnvKey(keys, prefix, "__")).toBe(expected);
		},
	);

	test.each`
		keys                    | keySep  | expected
		${["database", "host"]} | ${"__"} | ${"DATABASE__HOST"}
		${["database", "host"]} | ${"--"} | ${"DATABASE--HOST"}
		${["database", "host"]} | ${"++"} | ${"DATABASE++HOST"}
	`(
		"encodeEnvKey($keys, undefined, $keySep) -> $expected",
		({ keys, keySep, expected }) => {
			expect(encodeEnvKey(keys, undefined, keySep)).toBe(expected);
		},
	);

	test("throws an error if keySep is '_'", () => {
		expect(() => encodeEnvKey(["database", "host"], "APP", "_")).toThrow(
			'keySep cannot be "_"',
		);
	});
});

describe("decodeEnvKey", () => {
	test.each`
		name                    | prefix       | expected
		${"APP_DATABASE__HOST"} | ${"APP"}     | ${["database", "host"]}
		${"APP_DATABASE_HOST"}  | ${"APP"}     | ${["databaseHost"]}
		${"DB_U_R_L"}           | ${undefined} | ${["dbURL"]}
		${"DB2_HOST"}           | ${undefined} | ${["db2Host"]}
		${"OTHER_VALUE"}        | ${"APP"}     | ${undefined}
		${"APP__VALUE"}         | ${"APP"}     | ${undefined}
		${"APP_VALUE__"}        | ${"APP"}     | ${undefined}
	`(
		"decodeEnvKey($name, $prefix) -> $expected",
		({ name, prefix, expected }) => {
			expect(decodeEnvKey(name, prefix, "__")).toEqual(expected);
		},
	);

	test.each`
		name                 | keySep  | expected
		${"DATABASE.HOST"}   | ${"."}  | ${["database", "host"]}
		${"DATABASE:::HOST"} | ${"::"} | ${["database", ":host"]}
	`(
		"decodeEnvKey($name, $keySep) -> $expected",
		({ name, keySep, expected }) => {
			expect(decodeEnvKey(name, undefined, keySep)).toEqual(expected);
		},
	);

	test.each`
		keys                    | name                   | prefix   | keySep
		${["database", "host"]} | ${"APP_DATABASE.HOST"} | ${"APP"} | ${"."}
	`(
		"round-trips '$keys' <-> '$name' should be reversable",
		({ keys, name, prefix, keySep }) => {
			const actualName = encodeEnvKey(keys, prefix, keySep);
			expect(actualName).toBe(name);
			const expectedKeys = decodeEnvKey(actualName, prefix, keySep);
			expect(expectedKeys).toEqual(keys);
		},
	);

	test("throws an error if keySep is '_'", () => {
		expect(() => decodeEnvKey("APP_DATABASE__HOST", "APP", "_")).toThrow(
			'keySep cannot be "_"',
		);
	});
});
