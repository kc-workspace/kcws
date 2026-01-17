import type { AnyConfig, UserConfig } from "../models";

export const defineConfig = <C extends AnyConfig>(c: C): UserConfig<C> => {
	type Rules = NonNullable<UserConfig<C>["rules"]>;
	const config = {} as UserConfig<C>;
	if (c.plugins) config.plugins = c.plugins;
	if (c.filters) config.filters = c.filters;
	if (c.presets) {
		config.rules = c.presets.reduce(
			(acc, preset) => {
				return Object.assign(acc, preset.rulesConfig);
			},
			config.rules ?? ({} as Rules),
		);
	}
	if (c.rules) {
		config.rules = c.rules.reduce(
			(acc, rule) => {
				return Object.assign(acc, {
					[rule.name]: rule.config,
				});
			},
			config.rules ?? ({} as Rules),
		);
	}

	return config;
};
