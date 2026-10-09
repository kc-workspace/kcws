import { definePluginSync } from "@kcinternals/config-builder";
import type { BuiltinEnvironment } from "vitest/node";
import type { AnyConfig, VitestConfigPlugin } from "../types";
import mergeConfig from "../utils/mergeConfig";

const webPlugin = (
	environment: Exclude<BuiltinEnvironment, "node"> = "jsdom",
): VitestConfigPlugin<"website", AnyConfig> =>
	definePluginSync("website", {
		applyConfig: (base) => mergeConfig(base, { test: { environment } }),
	});
export default webPlugin;
