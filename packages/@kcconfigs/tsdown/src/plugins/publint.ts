import { definePlugin } from "@kcinternals/config-builder";
import { mergeConfig, type PublintOptions, type WithEnabled } from "tsdown";
import type { TsdownConfigPlugin } from "../models";

const publintPlugin = (
	config: WithEnabled<PublintOptions>,
): TsdownConfigPlugin<"publint"> =>
	definePlugin("publint", {
		applyConfig: (base) => {
			return mergeConfig(base, {
				publint: config,
			});
		},
	});
export default publintPlugin;
