import { type AttwOptions, mergeConfig, type WithEnabled } from "tsdown";
import type { TsdownPlugin } from "../models";

const attwPlugin = (config: WithEnabled<AttwOptions>): TsdownPlugin<"attw"> => {
	return {
		name: "attw",
		apply: (base) => {
			return mergeConfig(base, {
				attw: config,
			});
		},
	};
};
export default attwPlugin;
