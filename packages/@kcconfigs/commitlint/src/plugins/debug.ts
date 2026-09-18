import { definePlugin } from "@kcinternals/config-builder";
import { debugPriority } from "../constants";
import type { CommitlintConfigPlugin } from "../types";

/**
 * Options for {@link debugPlugin}.
 */
export interface DebugPluginOption {
	/** Enable verbose debug log too */
	verbose?: true;
}

/**
 * Debug plugin — enables config-builder debug logging while plugins apply.
 *
 * Runs first so every other plugin is logged. The commitlint config itself is untouched.
 *
 * @param opt - Debug options
 * @returns commitlint config plugin
 */
const debugPlugin = (
	opt?: DebugPluginOption,
): CommitlintConfigPlugin<"debug"> =>
	definePlugin("debug", {
		settingPriority: debugPriority,
		applySetting: (base) => ({
			debug: true,
			verbose: opt?.verbose ?? base.verbose,
		}),
	});
export default debugPlugin;
