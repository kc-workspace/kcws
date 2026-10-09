import type { BaseConfigPlugin } from "../types";

export const sortPlugins = <PS extends BaseConfigPlugin<string>[]>(
	plugins: PS,
	key: "settingPriority" | "configPriority",
): PS => {
	return plugins.toSorted((a, b) => a[key] - b[key]) as PS;
};
