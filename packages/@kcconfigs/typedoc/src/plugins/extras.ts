import { definePlugin, type PluginConfig, type UserConfig } from "../configs";

interface ExtrasConfig extends UserConfig {
	customTitle?: string;
	customDescription?: string;
	footerTypedocVersion?: boolean;
	footerLastModified?: boolean;
}

/**
 * Typedoc plugin to add extra features
 * @see https://github.com/Drarig29/typedoc-plugin-extras
 */
const extras: PluginConfig<ExtrasConfig> = definePlugin<ExtrasConfig>({
	plugin: ["typedoc-plugin-extras"],

	// https://github.com/Drarig29/typedoc-plugin-extras#arguments
	footerTypedocVersion: true,
	footerLastModified: true,
});

export default extras;
