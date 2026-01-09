import type { AnyObject, ThemeConfig } from "./model";

export const defineTheme = <C extends AnyObject>(
	config: ThemeConfig<C>,
): ThemeConfig<C> => {
	return config;
};
