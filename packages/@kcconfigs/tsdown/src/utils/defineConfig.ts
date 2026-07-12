import { defineConfig as _defineConfig } from "@kcinternals/config-builder";
import { baseConfig } from "../constants";
import attwNormalize from "../internals/attwNormalize";
import dtsNormalize from "../internals/dtsNormalize";
import formatNormalize from "../internals/formatNormalize";
import type { TsdownConfig, TsdownPlugin } from "../models";

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
