import type { AnyVitestConfigPlugin, UserConfig } from "../models";
import { projectPlugin, rootPlugin } from "../plugins";
import defineConfig from "./defineConfig";

const defineProjectConfig = (
	...plugins: AnyVitestConfigPlugin<UserConfig>[]
): UserConfig => {
	return defineConfig(rootPlugin(), projectPlugin(), ...plugins);
};
export default defineProjectConfig;
