import { defineConfig as _defineConfig } from "@kcinternals/config-builder";
import { baseConfig } from "../constants";
import autoScopePlugin from "../plugins/autoScope";
import typesPlugin from "../plugins/types";
import type {
	AnyCommitlintConfigPlugin,
	CommitlintConfig,
	CommitlintConfigPluginInput,
} from "../types";
import mergeConfig from "./mergeConfig";

/**
 * Creates a commitlint configuration by applying plugins to the base config.
 *
 * When no `types` plugin is given, standard conventional types are used.
 * When neither `scope` nor `autoScope` plugin is given, scopes are
 * auto-detected from the workspace in the current directory. The result is asynchronous because
 * scope detection reads the filesystem.
 *
 * @param plugins - Plugins, or promises of plugins, to apply
 * @returns The resolved commitlint configuration
 */
const defineConfig = async (
	...plugins: CommitlintConfigPluginInput[]
): Promise<CommitlintConfig> => {
	const resolved = await Promise.all(plugins);
	const names = new Set(resolved.map((plugin) => plugin.name));

	const defaults: AnyCommitlintConfigPlugin[] = [];
	if (!names.has("types")) defaults.push(typesPlugin());
	if (!names.has("scope") && !names.has("autoScope")) {
		defaults.push(await autoScopePlugin());
	}

	// copy so plugins can never mutate the shared base constant
	return _defineConfig(mergeConfig({}, baseConfig), ...defaults, ...resolved);
};
export default defineConfig;
