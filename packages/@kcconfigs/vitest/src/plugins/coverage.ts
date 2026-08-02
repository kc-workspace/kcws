import { definePlugin, type WithEnabled } from "@kcinternals/config-builder";
import type { CoverageOptions } from "vitest/node";
import { defaultCoverage } from "../constants/config";
import type { UserConfig, VitestConfigPlugin } from "../models";
import mergeConfig from "../utils/mergeConfig";

/**
 * Coverage plugin input.
 *
 * - `true`: enable coverage using default shared coverage settings.
 * - `false`: remove coverage from config.
 * - `CoverageOptions`: apply custom coverage settings.
 */
export type CoverageOption = WithEnabled<CoverageOptions>;

const replaceCoverage = (
	base: UserConfig,
	coverage: CoverageOptions,
): UserConfig => {
	return {
		...base,
		test: {
			...(base.test ?? {}),
			coverage,
		},
	};
};

/**
 * Create a plugin that configures `test.coverage`.
 *
 * Behavior matrix:
 * - `(true, true)`: replace with `{ enabled: true }`.
 * - `(true, false)` or `(true)`: merge `defaultCoverage`.
 * - `(false, any)`: delete coverage if it exists.
 * - `({}, true)`: replace coverage with the provided object.
 * - `({}, false)`: merge the provided object with existing coverage.
 *
 * @param opt Coverage input option.
 * @param replace Whether to replace the coverage object instead of merging.
 */
const coveragePlugin = (
	opt: CoverageOption,
	replace = false,
): VitestConfigPlugin<"website", UserConfig> =>
	definePlugin("website", {
		applyConfig: (base) => {
			if (opt === false) {
				if (base.test?.coverage) delete base.test.coverage;
				return base;
			} else if (opt === true) {
				if (replace) {
					return replaceCoverage(base, { enabled: true });
				}

				return mergeConfig(base, {
					test: { coverage: defaultCoverage },
				});
			}

			if (replace) {
				return replaceCoverage(base, opt);
			}

			return mergeConfig(base, { test: { coverage: opt } });
		},
	});
export default coveragePlugin;
