import type { BaseConfig, BaseSetting } from "../types";

const defineBaseConfig = <C>(
	base: C,
	setting?: Partial<BaseSetting>,
): BaseConfig<C> => {
	return {
		config: base,
		setting: {
			debug: setting?.debug ?? false,
			verbose: setting?.verbose ?? false,
		},
	};
};

export default defineBaseConfig;
