import { definePlugin } from "@kcinternals/config-builder";
import { mergeConfig } from "tsdown";
import type { TsdownPlugin } from "../models";

/**
 * Debug plugin — disables minification for easier debugging.
 */
const debugPlugin = (): TsdownPlugin<"debug"> =>
	definePlugin({
		name: "debug",
		apply: (base) => {
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
