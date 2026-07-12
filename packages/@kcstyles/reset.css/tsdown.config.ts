import { defineConfig, type TsdownConfig } from "@kcconfigs/tsdown";
import cssPlugin from "@kcconfigs/tsdown/plugins/css";

const config: TsdownConfig = defineConfig({}, cssPlugin({ lang: "scss" }));
export default config;
