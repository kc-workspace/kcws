import { type DtsOptions, mergeConfig, type WithEnabled } from "tsdown";
import type { TsdownPlugin } from "../models";

const dtsPlugin = (config: WithEnabled<DtsOptions>): TsdownPlugin<"dts"> => {
	return {
		name: "dts",
		apply: (base) => {
			return mergeConfig(base, {
				dts: config,
			});
		},
	};
};
export default dtsPlugin;
