import { describe, expect, test } from "vitest";
import minifyPlugin from "../plugins/minify";
import outputPlugin from "../plugins/output";
import defineConfig from "./defineConfig";

describe("defineConfig", () => {
	test("should return a config with base defaults", () => {
		const config = defineConfig();
		expect(config).toBeDefined();
		expect(config.outDir).toBe("dist");
	});

	test("should not minify by default", () => {
		const config = defineConfig();
		expect(config.minify).toBe(false);
	});

	test("should minify when minifyPlugin is applied", () => {
		const config = defineConfig(minifyPlugin());
		expect(config.minify).toBe(true);
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
