import { definePlugin } from "@kcinternals/config-builder";
import { mergeConfig, type UnusedOptions, type WithEnabled } from "tsdown";
import type { TsdownConfigPlugin } from "../models";

const unusedPlugin = (
	config: WithEnabled<UnusedOptions>,
): TsdownConfigPlugin<"unused"> =>
	definePlugin("unused", {
		applyConfig: (base) => {
			return mergeConfig(base, {
				unused: config,
			});
		},
	});
export default unusedPlugin;
