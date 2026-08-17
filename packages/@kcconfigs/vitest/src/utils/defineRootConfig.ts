import type { AnyVitestConfigPlugin, UserConfig } from "../models";
import { rootPlugin } from "../plugins";
import defineConfig from "./defineConfig";
import type defineProjectConfig from "./defineProjectConfig";

/**
 * Creates a root Vitest configuration.
 * This is intended for the root of a monorepo only.
 *
 * @param projects - Project paths or glob patterns included in the workspace.
 * @param plugins - Additional plugins to apply after the built-in root plugin.
 * @returns The resolved root Vitest configuration.
 *
 * @see {@link defineProjectConfig} for creating project configurations.
 */
const defineRootConfig = (
	projects: string[],
	...plugins: AnyVitestConfigPlugin<UserConfig>[]
): UserConfig => {
	return defineConfig(rootPlugin(projects), ...plugins);
};
export default defineRootConfig;
