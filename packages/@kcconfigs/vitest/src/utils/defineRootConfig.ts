import type { AnyVitestConfigPlugin, UserConfig } from "../models";
import { rootPlugin } from "../plugins";
import defineConfig from "./defineConfig";

const defineRootConfig = (
	projects: string[],
	...plugins: AnyVitestConfigPlugin<UserConfig>[]
): UserConfig => {
	return defineConfig(rootPlugin(projects), ...plugins);
};
export default defineRootConfig;
