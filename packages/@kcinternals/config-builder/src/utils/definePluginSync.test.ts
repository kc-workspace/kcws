import { describe, expect, test, vi } from "vitest";
import definePluginSync from "./definePluginSync";

describe(definePluginSync.name, () => {
	test("defaults priorities to zero", () => {
		expect(definePluginSync("plugin", {})).toEqual({
			name: "plugin",
			settingPriority: 0,
			applySetting: undefined,
			configPriority: 0,
			applyConfig: undefined,
		});
	});

	test("preserves priorities and apply callbacks", () => {
		const applySetting = vi.fn();
		const applyConfig = vi.fn();
		const plugin = definePluginSync("plugin", {
			settingPriority: 2,
			configPriority: 3,
			applySetting,
			applyConfig,
		});

		expect(plugin).toEqual({
			name: "plugin",
			settingPriority: 2,
			applySetting,
			configPriority: 3,
			applyConfig,
		});
	});
});
