import { definePlugin } from "@kcinternals/config-builder";
import { mergeConfig } from "tsdown";
import type { TsdownPlugin } from "../models";

const nodePlugin = (): TsdownPlugin<"node"> =>
	definePlugin({
		name: "node",
		apply: (base) => {
			return mergeConfig(base, { platform: "node" });
		},
	});
export default nodePlugin;
