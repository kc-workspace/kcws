import type { ConfigPlugin } from "../models/plugin";

export const browserPlugin: ConfigPlugin<"browser", Record<string, unknown>> = {
	name: "browser",
	apply: (config) => ({ ...config, platform: "browser" }),
};
