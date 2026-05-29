import { definePlugin, type PluginConfig } from "../configs";

/**
 * Typedoc plugin to include code examples from *.example.ts files
 * @see https://github.com/ferdodo/typedoc-plugin-include-example
 */
const includeExample: PluginConfig = definePlugin({
	plugin: ["typedoc-plugin-include-example"],
	blockTags: ["@includeExample"],
	packageOptions: {
		blockTags: ["@includeExample"],
	},
});

export default includeExample;
