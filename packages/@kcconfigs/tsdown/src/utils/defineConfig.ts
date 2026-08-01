import { defineConfig as _defineConfig } from "@kcinternals/config-builder";
import { baseConfig } from "../constants";
import attwNormalize from "../internals/attwNormalize";
import dtsNormalize from "../internals/dtsNormalize";
import formatNormalize from "../internals/formatNormalize";
import publintNormalize from "../internals/publintNormalize";
import type { TsdownConfig, TsdownConfigPlugin } from "../models";

const defineConfig = (
	...plugins: TsdownConfigPlugin<string>[]
): TsdownConfig => {
	return _defineConfig(
		baseConfig,
		...plugins,
		attwNormalize(),
		dtsNormalize(),
		formatNormalize(),
		publintNormalize(),
	);
};

export default defineConfig;
