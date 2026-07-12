import { definePlugin } from "@kcinternals/config-builder";
import { mergeConfig, type PublintOptions, type WithEnabled } from "tsdown";
import type { TsdownPlugin } from "../models";

const publintPlugin = (
	config: WithEnabled<PublintOptions>,
): TsdownPlugin<"publint"> =>
	definePlugin({
		name: "publint",
		apply: (base) => {
			return mergeConfig(base, {
				publint: config,
			});
		},
	});
export default publintPlugin;
