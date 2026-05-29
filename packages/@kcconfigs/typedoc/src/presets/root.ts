import { defineConfig, type UserConfig } from "../configs";
import all from "../plugins/all";
import github from "../themes/github";

const config: UserConfig = defineConfig(github, all, {
	entryPointStrategy: "packages",
	highlightLanguages: ["http"],
});
export default config;
