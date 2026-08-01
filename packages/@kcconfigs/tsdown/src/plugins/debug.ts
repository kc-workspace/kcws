import { definePlugin } from "@kcinternals/config-builder";
import { mergeConfig } from "tsdown";
import { debugPriority } from "../constants";
import type { TsdownConfigPlugin } from "../models";

interface DebugPluginOption {
	/** Enable verbose debug log too */
	verbose?: true;
}

/**
 * Debug plugin — disables minification for easier debugging.
 */
const debugPlugin = (opt?: DebugPluginOption): TsdownConfigPlugin<"debug"> =>
	definePlugin("debug", {
		settingPriority: debugPriority,
		applySetting: (base) => ({
			debug: true,
			verbose: opt?.verbose ?? base.verbose,
		}),
		applyConfig: (base) => {
			return mergeConfig(base, {
				minify: false,
				css: {
					minify: false,
				},
				env: {
					DEBUG: true,
					NODE_ENV: "debug",
				},
			});
		},
	});
export default debugPlugin;
