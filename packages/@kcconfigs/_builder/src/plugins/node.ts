import type { ConfigPlugin } from "../models/plugin";

export const nodePlugin: ConfigPlugin<"node", Record<string, unknown>> = {
	name: "node",
	apply: (config) => ({ ...config, platform: "node" }),
};
