import { definePlugin } from "@kcinternals/config-builder";
import type { ProjectConfig, UserConfig, VitestConfigPlugin } from "../models";

const debugPlugin = (): VitestConfigPlugin<
	"debug",
	UserConfig | ProjectConfig
> =>
	definePlugin("debug", {
		settingPriority: Number.NEGATIVE_INFINITY,
		applySetting: (base) => ({
			...base,
			debug: true,
		}),
	});
export default debugPlugin;
