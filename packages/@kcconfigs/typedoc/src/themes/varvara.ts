import { defineTheme, type ThemeConfig } from "../configs";

/**
 * Typedoc theme that use Varvara CSS framework
 * @see https://github.com/marcmarine/varvara-js/tree/main/packages/typedoc-theme
 */
const varvara: ThemeConfig = defineTheme({
	plugin: ["varvara-typedoc-theme"],
	theme: "varvara-css",
});

export default varvara;
