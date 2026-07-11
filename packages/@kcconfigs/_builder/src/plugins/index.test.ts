import { describe, expect, test } from "vitest";
import { defineConfig } from "../index";
import { browserPlugin, nodePlugin } from "./index";

describe("nodePlugin", () => {
	test("should set platform to node", () => {
		const result = defineConfig({}, [nodePlugin]);
		expect(result).toEqual({ platform: "node" });
	});

	test("should preserve existing config", () => {
		const base = { key: "value" };
		const result = defineConfig(base, [nodePlugin]);
		expect(result).toEqual({ key: "value", platform: "node" });
	});
});

describe("browserPlugin", () => {
	test("should set platform to browser", () => {
		const result = defineConfig({}, [browserPlugin]);
		expect(result).toEqual({ platform: "browser" });
	});

	test("should preserve existing config", () => {
		const base = { key: "value" };
		const result = defineConfig(base, [browserPlugin]);
		expect(result).toEqual({ key: "value", platform: "browser" });
	});
});
