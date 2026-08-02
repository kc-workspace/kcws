import type { AnyVitestConfigPlugin, UserConfig } from "../models";
import { rootPlugin } from "../plugins";
import defineConfig from "./defineConfig";

const defineRootConfig = (
	...plugins: AnyVitestConfigPlugin<UserConfig>[]
): UserConfig => {
	return defineConfig(rootPlugin(), ...plugins);
};
export default defineRootConfig;
