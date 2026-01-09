import { defineTheme, type ThemeConfig } from "../configs";

/**
 * Typedoc theme looks just like rustdoc
 * @see https://github.com/balthild/typedoc-theme-oxide
 */
const oxide: ThemeConfig = defineTheme({
	plugin: ["typedoc-theme-oxide"],
});

export = oxide;
