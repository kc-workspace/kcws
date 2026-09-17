import { definePlugin } from "@kcinternals/config-builder";
import { mergeConfig } from "tsdown";
import { debugPriority } from "../constants";
import type { TsdownConfigPlugin } from "../models";

interface DebugPluginOption {
	/** Enable verbose debug log too */
	verbose?: true;
}

/**
 * Debug plugin — enables debug setting and injects debug env flags.
 *
 * Minification is already off by default; use `minifyPlugin(false)` to
 * force it off when another plugin turned it on.
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
				env: {
					DEBUG: true,
					NODE_ENV: "debug",
				},
			});
		},
	});
export default debugPlugin;
