import { describe, expect, test, vi } from "vitest";
import defineConfig from "./defineConfig";
import definePlugin from "./definePlugin";

interface MockConfig {
	value: number;
}

describe(defineConfig.name, () => {
	test("should define config correctly", () => {
		const base: MockConfig = { value: 123 };
		const plugin = definePlugin<"testPlugin", MockConfig>("testPlugin", {
			applyConfig: (config) => ({ ...config, added: true }),
		});

		const result = defineConfig(base, plugin);
		expect(result).toEqual({ value: 123, added: true });
	});

	test("should write debug & verbose log when provides", () => {
		const debugFn = vi.fn();
		const verboseFn = vi.fn();

		const base: MockConfig = { value: 1 };

		const plugin = definePlugin<"testPlugin", MockConfig>("testPlugin", {
			settingPriority: 1,
			configPriority: 1,
			// enables debug for subsequent steps via returned setting
			applySetting: (_) => ({ debug: debugFn, verbose: verboseFn }),
			applyConfig: (config) => ({ value: config.value + 1 }),
		});

		const plugins = [plugin];

		const result = defineConfig(base, ...plugins);
		expect(result).toEqual({ value: 2 });

		expect(debugFn).toHaveBeenCalledTimes(3);
		expect(debugFn).toHaveBeenNthCalledWith(
			1,
			"applying setting: testPlugin (1)",
		);
		expect(debugFn).toHaveBeenNthCalledWith(
			2,
			"applying config: testPlugin (1)",
		);
		expect(debugFn).toHaveBeenNthCalledWith(
			3,
			expect.stringContaining("all plugins applied"),
		);

		expect(verboseFn).toHaveBeenCalledTimes(4);
		expect(verboseFn).toHaveBeenNthCalledWith(
			1,
			expect.stringContaining("before setting: "),
		);
		expect(verboseFn).toHaveBeenNthCalledWith(
			2,
			expect.stringContaining("after setting: "),
		);
		expect(verboseFn).toHaveBeenNthCalledWith(
			3,
			expect.stringContaining("before config: { value: 1 }"),
		);
		expect(verboseFn).toHaveBeenNthCalledWith(
			4,
			expect.stringContaining("after config: { value: 2 }"),
		);
	});

	test("should keep config unchanged when plugin has no applyConfig", () => {
		const base = { key: "value" };
		const plugin = definePlugin<"noop", typeof base>("noop", {});

		const result = defineConfig(base, plugin);
		expect(result).toEqual(base);
	});

	test("should apply plugins in configPriority order (lowest first)", () => {
		const mockPlugin = <N extends string>(name: N, configPriority: number) =>
			definePlugin<N, string[]>(name, {
				configPriority,
				applyConfig: (config) => {
					config.push(name);
					return config;
				},
			});

		const plugins = [
			mockPlugin("low", 0),
			mockPlugin("high", 10),
			mockPlugin("pos_inf", Number.POSITIVE_INFINITY),
			mockPlugin("neg_inf", Number.NEGATIVE_INFINITY),
			mockPlugin("medium", 5),
			mockPlugin("nan", Number.NaN),
		];

		const config = defineConfig([], ...plugins);
		expect(config).toEqual([
			"neg_inf",
			"low",
			"medium",
			"high",
			"pos_inf",
			"nan", // NaN compare is unordered and effectively remains in insertion order
		]);
	});

	test("should apply all settings before any configs", () => {
		const order: string[] = [];
		const mk = <N extends string>(
			name: N,
			settingPriority: number,
			configPriority: number,
		) =>
			definePlugin<N, { steps: string[] }>(name, {
				settingPriority,
				configPriority,
				applySetting: (setting) => {
					order.push(`setting:${name}`);
					return setting;
				},
				applyConfig: (config) => {
					order.push(`config:${name}`);
					config.steps.push(name);
					return config;
				},
			});

		const result = defineConfig(
			{ steps: [] as string[] },
			mk("a", 100, 0),
			mk("b", 0, 100),
		);

		expect(result.steps).toEqual(["a", "b"]);
		expect(order).toEqual(["setting:b", "setting:a", "config:a", "config:b"]);
	});

	test("should use setting pass output for all config plugins", () => {
		const execution: string[] = [];
		const debugFn = (msg: string) => execution.push(`debug:${msg}`);

		const enableDebug = definePlugin<"enableDebug", { value: number }>(
			"enableDebug",
			{
				settingPriority: 0,
				applySetting: (_) => ({ debug: debugFn }),
			},
		);

		const configA = definePlugin<"configA", { value: number }>("configA", {
			configPriority: 0,
			applyConfig: (config) => ({ value: config.value + 1 }),
		});

		const configB = definePlugin<"configB", { value: number }>("configB", {
			configPriority: 1,
			applyConfig: (config) => ({ value: config.value + 1 }),
		});

		const result = defineConfig({ value: 1 }, enableDebug, configA, configB);

		expect(result).toEqual({ value: 3 });
		expect(execution).toEqual(
			expect.arrayContaining([
				"debug:applying config: configA (0)",
				"debug:applying config: configB (1)",
			]),
		);
	});
});
