import { definePlugin } from "@kcinternals/config-builder";
import { mergeConfig } from "tsdown";
import { defaultIgnoreEntry } from "../constants";
import type { TsdownConfigPlugin } from "../models";

export interface CssPluginOption {
	/**
	 * @default "css"
	 */
	lang?: "css" | "scss";
	/**
	 * @default "index.css"
	 */
	output?: string;
}

const cssPlugin = (option?: CssPluginOption): TsdownConfigPlugin<"css"> =>
	definePlugin("css", {
		applyConfig: (base) => {
			return mergeConfig(base, {
				entry: [`./src/index.${option?.lang ?? "css"}`, ...defaultIgnoreEntry],
				css: {
					fileName: option?.output ?? "index.css",
					splitting: false,
					minify: true,
				},
				format: "esm",
				publint: false,
				attw: false,
			});
		},
	});
export default cssPlugin;
