import { expect, test } from "vitest";
import type { AnyConfigPlugin } from "../models";
import defineConfig from "./defineConfig";
import definePlugin from "./definePlugin";

interface BenchConfig {
	values: number[];
}

const createPlugins = (count: number): AnyConfigPlugin<BenchConfig>[] =>
	Array.from({ length: count }, (_, index) =>
		definePlugin<string, BenchConfig>(`plugin-${index}`, {
			settingPriority: count - index,
			configPriority: index % 3,
			applyConfig: (config) => {
				config.values.push(index);
				return config;
			},
		}),
	);

test("defineConfig scales with plugin count", async ({ bench }) => {
	const small = createPlugins(5);
	const large = createPlugins(50);

	expect(defineConfig({ values: [] }, ...large).values).toHaveLength(50);

	await bench.compare(
		bench("5 plugins", () => {
			defineConfig({ values: [] }, ...small);
		}),
		bench("50 plugins", () => {
			defineConfig({ values: [] }, ...large);
		}),
	);
});

test("defineConfig cost of debug and verbose logging", async ({ bench }) => {
	const plugins = createPlugins(10);
	const noop = (): void => {};
	const logging = definePlugin<"logging", BenchConfig>("logging", {
		settingPriority: Number.NEGATIVE_INFINITY,
		applySetting: () => ({ debug: noop, verbose: noop }),
	});

	await bench.compare(
		bench("logging disabled", () => {
			defineConfig({ values: [] }, ...plugins);
		}),
		bench("logging enabled", () => {
			defineConfig({ values: [] }, logging, ...plugins);
		}),
	);
});
