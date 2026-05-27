import { mergeConfig, type PluginConfig } from "../configs";
import github from "../themes/github";
import dtLinks from "./dtLinks";
import extras from "./extras";
import includeExample from "./includeExample";
import mdnLinks from "./mdnLinks";
import missingExports from "./missingExports";

const all: PluginConfig = mergeConfig(
	github,
	missingExports,
	includeExample,
	extras,
	dtLinks,
	mdnLinks,
);

export default all;
