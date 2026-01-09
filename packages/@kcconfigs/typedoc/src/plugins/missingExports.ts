import { definePlugin, type PluginConfig, type UserConfig } from "../configs";

interface MissingExportsConfig extends UserConfig {
	internalModule?: string;
	collapseInternalModule?: boolean;
	includeDocCommentReferences?: boolean;
	placeInternalsInOwningModule?: boolean;
}

/**
 * Typedoc plugin to include missing exports in the documentation
 * @see https://github.com/Gerrit0/typedoc-plugin-missing-exports
 */
const missingExports: PluginConfig<MissingExportsConfig> =
	definePlugin<MissingExportsConfig>({
		plugin: ["typedoc-plugin-missing-exports"],

		// https://github.com/Gerrit0/typedoc-plugin-missing-exports#options
		internalModule: "[internal]",
		collapseInternalModule: true,
		includeDocCommentReferences: true,
		placeInternalsInOwningModule: false,
	});

export = missingExports;
