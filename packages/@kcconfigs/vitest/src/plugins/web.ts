import { definePlugin } from "@kcinternals/config-builder";
import type { BuiltinEnvironment } from "vitest/node";
import type { AnyConfig, VitestConfigPlugin } from "../models";
import mergeConfig from "../utils/mergeConfig";

const webPlugin = (
	environment: Exclude<BuiltinEnvironment, "node"> = "jsdom",
): VitestConfigPlugin<"website", AnyConfig> =>
	definePlugin("website", {
		applyConfig: (base) => mergeConfig(base, { test: { environment } }),
	});
export default webPlugin;
