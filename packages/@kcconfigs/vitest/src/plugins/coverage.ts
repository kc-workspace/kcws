import { definePlugin, type WithEnabled } from "@kcinternals/config-builder";
import { mergeConfig } from "vitest/config";
import type { CoverageOptions } from "vitest/node";
import { defaultCoverage } from "../constants/config";
import type { UserConfig, VitestConfigPlugin } from "../models";

export type CoverageOption = WithEnabled<CoverageOptions>;

const coveragePlugin = (
	opt: CoverageOption,
): VitestConfigPlugin<"website", UserConfig> =>
	definePlugin("website", {
		applyConfig: (base) => {
			if (opt === false) {
				if (base.test?.coverage) delete base.test.coverage;
				return base;
			} else if (opt === true) {
				return mergeConfig(base, {
					test: { coverage: defaultCoverage },
				});
			}

			return mergeConfig(base, { test: { coverage: opt } });
		},
	});
export default coveragePlugin;
