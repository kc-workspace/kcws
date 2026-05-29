import { defineTheme, type ThemeConfig } from "../configs";

/**
 * Typedoc theme that use Material Design style
 * @see https://github.com/dmnsgn/typedoc-material-theme
 */
const material: ThemeConfig = defineTheme({
	plugin: ["typedoc-material-theme"],
});

export default material;
