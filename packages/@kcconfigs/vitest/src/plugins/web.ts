import { definePlugin } from "@kcinternals/config-builder";
import { mergeConfig } from "vitest/config";
import type { BuiltinEnvironment } from "vitest/node";
import type { AnyConfig, VitestConfigPlugin } from "../models";

const webPlugin = (
	environment: Exclude<BuiltinEnvironment, "node"> = "jsdom",
): VitestConfigPlugin<"website", AnyConfig> =>
	definePlugin("website", {
		applyConfig: (base) => mergeConfig(base, { test: { environment } }),
	});
export default webPlugin;
