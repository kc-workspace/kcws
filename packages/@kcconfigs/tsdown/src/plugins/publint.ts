import { mergeConfig, type PublintOptions, type WithEnabled } from "tsdown";
import type { TsdownPlugin } from "../models";

const publintPlugin = (
	config: WithEnabled<PublintOptions>,
): TsdownPlugin<"publint"> => {
	return {
		name: "publint",
		apply: (base) => {
			return mergeConfig(base, {
				publint: config,
			});
		},
	};
};
export default publintPlugin;
