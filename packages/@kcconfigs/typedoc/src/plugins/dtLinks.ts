import { definePlugin, type PluginConfig } from "../configs";

/**
 * Typedoc plugin to linking references to types declared on `@types` packages
 * @see https://github.com/Gerrit0/typedoc-plugin-dt-links
 */
const dtLinks: PluginConfig = definePlugin({
	plugin: ["typedoc-plugin-dt-links"],
});

export = dtLinks;
