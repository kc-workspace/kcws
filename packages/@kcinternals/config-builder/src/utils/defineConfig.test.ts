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
			priority: 1,
			// enables debug for subsequent steps via returned setting
			applySetting: (_) => ({ debug: debugFn, verbose: verboseFn }),
			applyConfig: (config) => ({ value: config.value + 1 }),
		});

		const plugins = [plugin];

		const result = defineConfig(base, ...plugins);
		expect(result).toEqual({ value: 2 });

		expect(debugFn).toHaveBeenCalledTimes(2);
		expect(debugFn).toHaveBeenNthCalledWith(
			1,
			"applying plugin: testPlugin (1)",
		);
		expect(debugFn).toHaveBeenNthCalledWith(
			2,
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

	test("should apply plugins in priority order (highest first)", () => {
		const mockPlugin = <N extends string>(name: N, priority: number) =>
			definePlugin<N, string[]>(name, {
				priority,
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
			"nan", // NaN always treats as highest priority, so it will be applied last
		]);
	});
});
