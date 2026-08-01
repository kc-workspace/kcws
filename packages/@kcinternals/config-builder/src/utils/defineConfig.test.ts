import { describe, expect, test, vi } from "vitest";
import defineConfig from "./defineConfig";
import definePlugin from "./definePlugin";

describe(defineConfig.name, () => {
	test("should define config correctly", () => {
		const base = { key: "value" };
		const plugin = definePlugin<"testPlugin", typeof base>("testPlugin", {
			apply: (base) => ({
				...base,
				config: { ...base.config, added: true },
			}),
		});

		const result = defineConfig(base, plugin);
		expect(result).toEqual({ key: "value", added: true });
	});

	test("should write debug log when provides", () => {
		const debugFn = vi.fn();
		const base = { key: "value" };
		const plugins = [
			definePlugin<"testPlugin", typeof base>("testPlugin", {
				priority: 1,
				// enables debug for subsequent steps via returned setting
				apply: (config) => ({
					setting: { ...config.setting, debug: debugFn },
					config: { key: `new ${config.config.key}` },
				}),
			}),
			definePlugin<"", typeof base>("", {
				apply: (config) => ({
					...config,
					config: { ...config.config, value: true },
				}),
			}),
		];
		const result = defineConfig(base, ...plugins);
		expect(result).toEqual({ key: "new value", value: true });

		expect(debugFn).toHaveBeenCalledWith("applying plugin:  (0)");
		expect(debugFn).toHaveBeenCalledWith(
			expect.stringContaining("all plugins applied"),
		);
	});
});
