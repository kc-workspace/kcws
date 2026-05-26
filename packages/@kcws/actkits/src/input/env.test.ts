import { describe, expect, test } from "vitest";

import { getEnv } from "./env";

describe("getEnv", () => {
	describe("with default INPUT prefix", () => {
		test("should return value for simple key", () => {
			const result = getEnv("token", undefined, {
				INPUT__TOKEN: "secret-token",
			});
			expect(result).toBe("secret-token");
		});

		test("should return undefined when key not found", () => {
			const result = getEnv("missing", undefined, {});
			expect(result).toBeUndefined();
		});

		test("should handle key with dot notation", () => {
			const result = getEnv("config.path", undefined, {
				INPUT__CONFIG__PATH: "/path/to/config",
			});
			expect(result).toBe("/path/to/config");
		});

		test("should handle key with slash notation", () => {
			const result = getEnv("api/endpoint", undefined, {
				INPUT__API__ENDPOINT: "https://api.example.com",
			});
			expect(result).toBe("https://api.example.com");
		});

		test("should handle key with dash (replaced with underscore)", () => {
			const result = getEnv("my-key", undefined, {
				INPUT__MY_KEY: "value",
			});
			expect(result).toBe("value");
		});

		test("should handle key with space (replaced with underscore)", () => {
			const result = getEnv("my key", undefined, {
				INPUT__MY_KEY: "value",
			});
			expect(result).toBe("value");
		});

		test("should convert key to uppercase", () => {
			const result = getEnv("MyKey", undefined, {
				INPUT__MYKEY: "value",
			});
			expect(result).toBe("value");
		});
	});

	describe("with custom prefix", () => {
		test("should use dot notation prefix", () => {
			const result = getEnv("mode", "my.action", {
				MY__ACTION__MODE: "warn",
			});
			expect(result).toBe("warn");
		});

		test("should use slash notation prefix", () => {
			const result = getEnv("token", "org/abc", {
				ORG__ABC__TOKEN: "custom-token",
			});
			expect(result).toBe("custom-token");
		});

		test("should handle prefix with dash", () => {
			const result = getEnv("key", "my-prefix", {
				MY_PREFIX__KEY: "value",
			});
			expect(result).toBe("value");
		});

		test("should handle prefix with space", () => {
			const result = getEnv("key", "my prefix", {
				MY_PREFIX__KEY: "value",
			});
			expect(result).toBe("value");
		});
	});

	describe("with empty prefix", () => {
		test("should use only the key without prefix", () => {
			const result = getEnv("debug", "", {
				DEBUG: "true",
			});
			expect(result).toBe("true");
		});

		test("should handle key with dot notation", () => {
			const result = getEnv("config.value", "", {
				CONFIG__VALUE: "test",
			});
			expect(result).toBe("test");
		});
	});

	describe("validation errors", () => {
		test("should throw error for empty key", () => {
			expect(() => getEnv("", undefined, {})).toThrow("Key must not be empty");
		});

		test("should throw error for key with invalid characters", () => {
			expect(() => getEnv("key@value", undefined, {})).toThrow(
				"Invalid key: contains invalid characters",
			);
		});

		test("should throw error for prefix with invalid characters", () => {
			expect(() => getEnv("key", "prefix@value", {})).toThrow(
				"Invalid prefix: contains invalid characters",
			);
		});

		test("should throw error for consecutive separators in key", () => {
			expect(() => getEnv("key..value", undefined, {})).toThrow(
				"Invalid key: consecutive separator characters",
			);
		});

		test("should throw error for consecutive separators in prefix", () => {
			expect(() => getEnv("key", "prefix//value", {})).toThrow(
				"Invalid prefix: consecutive separator characters",
			);
		});

		test("should throw error for key starting with separator", () => {
			expect(() => getEnv(".key", undefined, {})).toThrow(
				"Invalid key: cannot start with a separator character",
			);
		});

		test("should throw error for key ending with separator", () => {
			expect(() => getEnv("key.", undefined, {})).toThrow(
				"Invalid key: cannot end with a separator character",
			);
		});

		test("should throw error for prefix starting with separator", () => {
			expect(() => getEnv("key", "/prefix", {})).toThrow(
				"Invalid prefix: cannot start with a separator character",
			);
		});

		test("should throw error for prefix ending with separator", () => {
			expect(() => getEnv("key", "prefix-", {})).toThrow(
				"Invalid prefix: cannot end with a separator character",
			);
		});

		test("should throw error for env key exceeding max length", () => {
			const longKey = "a".repeat(130);
			expect(() => getEnv(longKey, undefined, {})).toThrow(
				"Environment variable name exceeds maximum length of 128 characters",
			);
		});
	});

	describe("complex scenarios", () => {
		test("should handle deeply nested keys", () => {
			const result = getEnv("level1.level2.level3", "app", {
				APP__LEVEL1__LEVEL2__LEVEL3: "deep-value",
			});
			expect(result).toBe("deep-value");
		});

		test("should handle mixed separators in key", () => {
			const result = getEnv("api/v1.endpoint", undefined, {
				INPUT__API__V1__ENDPOINT: "value",
			});
			expect(result).toBe("value");
		});

		test("should handle mixed separators in prefix", () => {
			const result = getEnv("key", "org/team.project", {
				ORG__TEAM__PROJECT__KEY: "value",
			});
			expect(result).toBe("value");
		});

		test("should return undefined for empty string value", () => {
			const result = getEnv("key", undefined, {
				INPUT__KEY: "",
			});
			expect(result).toBe("");
		});
	});
});
