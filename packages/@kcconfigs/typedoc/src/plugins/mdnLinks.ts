import { definePlugin, type PluginConfig, type UserConfig } from "../configs";

interface MdnLinksConfig extends UserConfig {
	resolveUtilityTypes?: boolean;
	additionalModuleSources?: string[];
}

/**
 * Typedoc plugin to linking references to mdn web docs
 * @see https://github.com/Gerrit0/typedoc-plugin-mdn-links
 */
const mdnLinks: PluginConfig<MdnLinksConfig> = definePlugin<MdnLinksConfig>({
	plugin: ["typedoc-plugin-mdn-links"],

	// https://github.com/Gerrit0/typedoc-plugin-mdn-links#options
	resolveUtilityTypes: true,
});

export = mdnLinks;
