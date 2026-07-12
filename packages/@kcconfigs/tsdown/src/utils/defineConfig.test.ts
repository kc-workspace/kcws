import { describe, expect, test } from "vitest";
import type { TsdownConfig } from "../models";
import defineConfig from "./defineConfig";

describe("defineConfig", () => {
	test("should return a config with base defaults", () => {
		const config = defineConfig();
		expect(config).toBeDefined();
		// base defaults
		expect(config.entry).toBeDefined();
		expect(config.platform).toBe("neutral");
		expect(config.outDir).toBe("dist");
	});

	test("should include normalize plugins automatically", () => {
		const config = defineConfig();
		// attwNormalize runs during defineConfig, setting default attw
		expect(config.attw).toBeDefined();
		// dtsNormalize runs during defineConfig, setting default dts
		expect(config.dts).toBeDefined();
	});

	test("should apply user plugins alongside built-in normalizers", () => {
		const plugin = {
			name: "testPlugin",
			apply: (c: TsdownConfig) => ({
				...c,
				outDir: `${c.outDir}/override`,
			}),
		};
		const config = defineConfig({}, plugin);
		expect(config.outDir).toBe("dist/override");
		// normalize plugins should also have run
		expect(config.attw).toBeDefined();
		expect(config.dts).toBeDefined();
	});
});
