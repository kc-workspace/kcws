import type {
	AnyVitestConfigPlugin,
	ProjectConfig,
	UserConfig,
} from "../models";
import { projectPlugin, rootPlugin } from "../plugins";
import defineConfig from "./defineConfig";
import type defineRootConfig from "./defineRootConfig";

/**
 * Creates a Vitest project configuration.
 * This is intended for both projects in monorepos and standalone repositories.
 *
 * @param plugins - Additional plugins to apply after the built-in plugins.
 * @returns The resolved Vitest project configuration.
 *
 * @see {@link defineRootConfig} for creating on root monorepos
 */
const defineProjectConfig = (
	...plugins: AnyVitestConfigPlugin<UserConfig>[]
): ProjectConfig => {
	return defineConfig(rootPlugin(), projectPlugin(), ...plugins);
};
export default defineProjectConfig;
