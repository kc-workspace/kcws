import { definePlugin } from "@kcinternals/config-builder";
import { overridePriority } from "../constants";
import type { CommitlintConfig, CommitlintConfigPlugin } from "../types";
import mergeConfig from "../utils/mergeConfig";

/**
 * Override plugin — deep merges raw commitlint config on top of everything else.
 *
 * Runs with a high config priority so it applies after the built-in plugins.
 *
 * @param overrides - commitlint configs merged from left to right
 * @returns commitlint config plugin
 */
const overridePlugin = (
	...overrides: CommitlintConfig[]
): CommitlintConfigPlugin<"override"> =>
	definePlugin("override", {
		configPriority: overridePriority,
		applyConfig: (base) => mergeConfig(base, ...overrides),
	});
export default overridePlugin;
