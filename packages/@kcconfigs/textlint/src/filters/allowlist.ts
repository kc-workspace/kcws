import type { Filter } from "../models";
import { defineFilter } from "../utils/defineFilter";

export interface AllowListConfig {
	allow?: string[];
	allowlistConfigPaths?: string[];
}

export const DEFAULT_ALLOWLIST: string[] = [
	"editorconfig",
	"url",
	"html",
	"api",
	"apis",
	"github",
	"typescript",
	"json",
];

export type AllowListRule = Filter<"allowlist", AllowListConfig>;

export const allowlist = (config?: AllowListConfig): AllowListRule => {
	const name = "allowlist";
	if (!config) {
		return defineFilter({
			name,
			config: false,
		});
	}

	if (!config.allow) config.allow = DEFAULT_ALLOWLIST;
	return defineFilter({
		name,
		config,
	});
};
