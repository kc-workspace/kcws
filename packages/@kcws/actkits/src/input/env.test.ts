import { describe, expect, test } from "vitest";

import { getEnv } from "./env";

describe("getEnv", () => {
	describe("with default INPUT prefix", () => {
		test.for([
			{
				name: "simple key",
				key: "token",
				env: { INPUT__TOKEN: "secret-token" },
				expected: "secret-token",
			},
			{
				name: "missing key",
				key: "missing",
				env: {},
				expected: undefined,
			},
			{
				name: "key with dot notation",
				key: "config.path",
				env: { INPUT__CONFIG__PATH: "/path/to/config" },
				expected: "/path/to/config",
			},
			{
				name: "key with slash notation",
				key: "api/endpoint",
				env: { INPUT__API__ENDPOINT: "https://api.example.com" },
				expected: "https://api.example.com",
			},
			{
				name: "key with dash (replaced with underscore)",
				key: "my-key",
				env: { INPUT__MY_KEY: "value" },
				expected: "value",
			},
			{
				name: "key with space (replaced with underscore)",
				key: "my key",
				env: { INPUT__MY_KEY: "value" },
				expected: "value",
			},
			{
				name: "key converted to uppercase",
				key: "MyKey",
				env: { INPUT__MYKEY: "value" },
				expected: "value",
			},
		])("should handle $name", ({ key, env, expected }) => {
			expect(getEnv(key, undefined, env)).toBe(expected);
		});
	});

	describe("with custom prefix", () => {
		test.for([
			{
				name: "dot notation prefix",
				key: "mode",
				prefix: "my.action",
				env: { MY__ACTION__MODE: "warn" },
				expected: "warn",
			},
			{
				name: "slash notation prefix",
				key: "token",
				prefix: "org/abc",
				env: { ORG__ABC__TOKEN: "custom-token" },
				expected: "custom-token",
			},
			{
				name: "prefix with dash",
				key: "key",
				prefix: "my-prefix",
				env: { MY_PREFIX__KEY: "value" },
				expected: "value",
			},
			{
				name: "prefix with space",
				key: "key",
				prefix: "my prefix",
				env: { MY_PREFIX__KEY: "value" },
				expected: "value",
			},
		])("should handle $name", ({ key, prefix, env, expected }) => {
			expect(getEnv(key, prefix, env)).toBe(expected);
		});
	});

	describe("with empty prefix", () => {
		test.for([
			{
				name: "key without prefix",
				key: "debug",
				env: { DEBUG: "true" },
				expected: "true",
			},
			{
				name: "key with dot notation",
				key: "config.value",
				env: { CONFIG__VALUE: "test" },
				expected: "test",
			},
		])("should handle $name", ({ key, env, expected }) => {
			expect(getEnv(key, "", env)).toBe(expected);
		});
	});

	describe("validation errors", () => {
		test.for([
			{
				name: "empty key",
				key: "",
				prefix: undefined,
				error: "Key must not be empty",
			},
			{
				name: "key with invalid characters",
				key: "key@value",
				prefix: undefined,
				error: "Invalid key: contains invalid characters",
			},
			{
				name: "prefix with invalid characters",
				key: "key",
				prefix: "prefix@value",
				error: "Invalid prefix: contains invalid characters",
			},
			{
				name: "consecutive separators in key",
				key: "key..value",
				prefix: undefined,
				error: "Invalid key: consecutive separator characters",
			},
			{
				name: "consecutive separators in prefix",
				key: "key",
				prefix: "prefix//value",
				error: "Invalid prefix: consecutive separator characters",
			},
			{
				name: "key starting with separator",
				key: ".key",
				prefix: undefined,
				error: "Invalid key: cannot start with a separator character",
			},
			{
				name: "key ending with separator",
				key: "key.",
				prefix: undefined,
				error: "Invalid key: cannot end with a separator character",
			},
			{
				name: "prefix starting with separator",
				key: "key",
				prefix: "/prefix",
				error: "Invalid prefix: cannot start with a separator character",
			},
			{
				name: "prefix ending with separator",
				key: "key",
				prefix: "prefix-",
				error: "Invalid prefix: cannot end with a separator character",
			},
			{
				name: "env key exceeding max length",
				key: "a".repeat(130),
				prefix: undefined,
				error:
					"Environment variable name exceeds maximum length of 128 characters",
			},
		])("should throw error for $name", ({ key, prefix, error }) => {
			expect(() => getEnv(key, prefix, {})).toThrow(error);
		});
	});

	describe("complex scenarios", () => {
		test.for([
			{
				name: "deeply nested keys",
				key: "level1.level2.level3",
				prefix: "app",
				env: { APP__LEVEL1__LEVEL2__LEVEL3: "deep-value" },
				expected: "deep-value",
			},
			{
				name: "mixed separators in key",
				key: "api/v1.endpoint",
				prefix: undefined,
				env: { INPUT__API__V1__ENDPOINT: "value" },
				expected: "value",
			},
			{
				name: "mixed separators in prefix",
				key: "key",
				prefix: "org/team.project",
				env: { ORG__TEAM__PROJECT__KEY: "value" },
				expected: "value",
			},
			{
				name: "empty string value",
				key: "key",
				prefix: undefined,
				env: { INPUT__KEY: "" },
				expected: "",
			},
		])("should handle $name", ({ key, prefix, env, expected }) => {
			expect(getEnv(key, prefix, env)).toBe(expected);
		});
	});
});
