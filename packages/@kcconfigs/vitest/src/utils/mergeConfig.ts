import { mergeConfig as _mergeConfig } from "vitest/config";
import type { UserConfig } from "../models";

const mergeConfig = <C extends UserConfig>(
	base: C,
	...overrides: (C | undefined)[]
): C => {
	return overrides
		.filter((o) => o !== undefined)
		.reduce((acc, override) => {
			return _mergeConfig(acc, override as AnyRecord);
		}, base as AnyRecord) as C;
};
export default mergeConfig;
