import { defineConfig as _defineConfig } from "@kcconfigs/_builder";
import { baseConfig } from "../constants";
import type { TsdownConfig, TsdownPlugin } from "../models";
import attwNormalize from "../plugins/attwNormalize";
import dtsNormalize from "../plugins/dtsNormalize";
import formatNormalize from "../plugins/formatNormalize";

const defineConfig = (...plugins: TsdownPlugin<string>[]): TsdownConfig => {
	const _plugins = [
		...plugins,
		attwNormalize(),
		dtsNormalize(),
		formatNormalize(),
	];
	return _defineConfig(baseConfig, _plugins);
};

export default defineConfig;
