import { mergeConfig, type UnusedOptions, type WithEnabled } from "tsdown";
import type { TsdownPlugin } from "../models";

const unusedPlugin = (
	config: WithEnabled<UnusedOptions>,
): TsdownPlugin<"unused"> => {
	return {
		name: "unused",
		apply: (base) => {
			return mergeConfig(base, {
				unused: config,
			});
		},
	};
};
export default unusedPlugin;
