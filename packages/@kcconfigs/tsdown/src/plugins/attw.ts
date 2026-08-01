import { definePlugin } from "@kcinternals/config-builder";
import { type AttwOptions, mergeConfig, type WithEnabled } from "tsdown";
import type { TsdownConfigPlugin } from "../models";

const attwPlugin = (
	config: WithEnabled<AttwOptions>,
): TsdownConfigPlugin<"attw"> =>
	definePlugin("attw", {
		applyConfig: (base) => {
			return mergeConfig(base, {
				attw: config,
			});
		},
	});
export default attwPlugin;
