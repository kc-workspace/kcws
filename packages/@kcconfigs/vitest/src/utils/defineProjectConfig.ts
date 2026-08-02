import type {
	AnyVitestConfigPlugin,
	ProjectConfig,
	UserConfig,
} from "../models";
import { projectPlugin, rootPlugin } from "../plugins";
import defineConfig from "./defineConfig";

const defineProjectConfig = (
	...plugins: AnyVitestConfigPlugin<UserConfig>[]
): ProjectConfig => {
	return defineConfig(rootPlugin(), projectPlugin(), ...plugins);
};
export default defineProjectConfig;
