import { describe, expect, test } from "vitest";
import type { AnyUserConfig } from "../models";
import { defineConfig } from "./defineConfig";
import { defineFilter } from "./defineFilter";
import { definePreset } from "./definePreset";
import { defineRule } from "./defineRule";

describe(defineConfig.name, () => {
	test("should return an empty object when no inputs are provided", () => {
		expect(defineConfig({})).toEqual({});
	});

	test("should keep plugins and filters while merging preset and rule configs", () => {
		const alpha = defineRule({
			name: "alpha",
			module: { lint: "alpha" },
			config: { source: "preset" },
		});
		const beta = defineRule({
			name: "beta",
			module: { lint: "beta" },
			config: false,
		});
		const override = defineRule({
			name: "alpha",
			module: { lint: "override" },
			config: { source: "rule" },
		});
		const filters = [
			defineFilter({
				name: "comments",
				config: true,
			}),
		];
		const plugins = [{ pluginId: "markdown" }] as AnyUserConfig["plugins"];

		expect(
			defineConfig({
				plugins,
				filters,
				presets: [definePreset("preset-a", alpha)],
				rules: [beta, override],
			}),
		).toEqual({
			plugins,
			filters,
			rules: {
				alpha: { source: "rule" },
				beta: false,
			},
		});
	});
});
