import { definePlugin } from "@kcinternals/config-builder";
import { mergeConfig } from "tsdown";
import type { TsdownConfigPlugin } from "../models";

/**
 * Minify plugin — toggles JavaScript and CSS minification.
 *
 * Minification is disabled by default because this config targets libraries;
 * readable output makes consumer debugging easier. Consumers that care
 * about size should minify in their own application build.
 *
 * @param minify - `true` to minify output, `false` to keep it readable.
 * @returns tsdown config plugin that sets `minify` and `css.minify`.
 */
const minifyPlugin = (minify: boolean = true): TsdownConfigPlugin<"minify"> =>
	definePlugin("minify", {
		applyConfig: (base) => {
			return mergeConfig(base, {
				minify,
				css: {
					minify,
				},
			});
		},
	});
export default minifyPlugin;
