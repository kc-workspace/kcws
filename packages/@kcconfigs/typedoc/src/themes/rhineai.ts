import { defineTheme, type ThemeConfig } from "../configs";

/**
 * Typedoc theme that mimics GitHub style
 * @see https://github.com/RhineAI/typedoc-rhineai-theme
 */
const rhineai: ThemeConfig = defineTheme({
	plugin: ["typedoc-rhineai-theme"],
});

export = rhineai;
