import { defineTheme, type ThemeConfig } from "../configs";

/**
 * Typedoc theme that mimics GitHub style
 * @see https://github.com/JulianWowra/typedoc-github-theme
 */
const github: ThemeConfig = defineTheme({
	plugin: ["typedoc-github-theme"],
});

export default github;
