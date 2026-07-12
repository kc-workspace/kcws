import {
	defineConfig as _defineConfig,
	type DefineOption,
} from "@kcinternals/config-builder";
import { baseConfig } from "../constants";
import attwNormalize from "../internals/attwNormalize";
import dtsNormalize from "../internals/dtsNormalize";
import formatNormalize from "../internals/formatNormalize";
import publintNormalize from "../internals/publintNormalize";
import type { TsdownConfig, TsdownPlugin } from "../models";

const defineConfig = (
	option?: DefineOption,
	...plugins: TsdownPlugin<string>[]
): TsdownConfig => {
	const _plugins = [
		...plugins,
		attwNormalize(),
		dtsNormalize(),
		formatNormalize(),
		publintNormalize(),
	];
	return _defineConfig(baseConfig, _plugins, option);
};

export default defineConfig;
