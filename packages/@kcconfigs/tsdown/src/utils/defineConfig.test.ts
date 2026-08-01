import { describe, expect, test } from "vitest";
import outputPlugin from "../plugins/output";
import defineConfig from "./defineConfig";

describe("defineConfig", () => {
	test("should return a config with base defaults", () => {
		const config = defineConfig();
		expect(config).toBeDefined();
		expect(config.outDir).toBe("dist");
	});

	test("should include normalize plugins automatically", () => {
		const config = defineConfig();
		expect(config.attw).toBeDefined();
		expect(config.dts).toBeDefined();
	});

	test("should apply user plugins alongside built-in normalizers", () => {
		const config = defineConfig(outputPlugin("custom-dist"));
		expect(config.outDir).toBe("custom-dist");
		expect(config.attw).toBeDefined();
		expect(config.dts).toBeDefined();
	});
});
