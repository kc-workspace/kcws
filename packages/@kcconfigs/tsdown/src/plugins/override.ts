import { mergeConfig } from "tsdown";
import type { TsdownConfig, TsdownPlugin } from "../models";

const overridePlugin = (
	...overrides: TsdownConfig[]
): TsdownPlugin<"override"> => {
	return {
		name: "override",
		apply: (base) => {
			return mergeConfig(base, ...overrides);
		},
	};
};
export default overridePlugin;
