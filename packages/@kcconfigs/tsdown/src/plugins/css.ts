import { mergeConfig } from "tsdown";
import type { TsdownPlugin } from "../models";

export interface CssPluginOption {
	/**
	 * @default "css"
	 */
	lang?: "css" | "scss";
}

const cssPlugin = (option?: CssPluginOption): TsdownPlugin<"css"> => {
	return {
		name: "css",
		apply: (base) => {
			return mergeConfig(base, {
				entry: [
					`./src/index.${option?.lang ?? "css"}`,
					"!./src/**/*.example.ts",
					"!./src/**/*.test.ts",
					"!./src/**/*.spec.ts",
					"!./src/**/*.test-d.ts",
					"!./src/**/*.spec-d.ts",
				],
			});
		},
	};
};
export default cssPlugin;
