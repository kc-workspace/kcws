import { definePlugin } from "@kcinternals/config-builder";
import { mergeConfig } from "tsdown";
import type { TsdownConfigPlugin } from "../models";

const nodePlugin = (): TsdownConfigPlugin<"node"> =>
	definePlugin("node", {
		applyConfig: (base) => {
			return mergeConfig(base, { platform: "node" });
		},
	});
export default nodePlugin;
