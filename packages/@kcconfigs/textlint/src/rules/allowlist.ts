import type { FilterRule } from "../models/rule";

export interface AllowListConfig {
	allow: string[];
	allowlistConfigPaths: string[];
}

export type AllowListRule = FilterRule<"allowlist", AllowListConfig>;

export const allowlist = (config?: AllowListConfig): AllowListRule => {
	if (!config) {
		return {
			type: "filter",
			name: "allowlist",
			config: false,
		};
	}

	return {
		type: "filter",
		name: "allowlist",
		config: {
			allow: config.allow,
			allowlistConfigPaths: config.allowlistConfigPaths,
		},
	};
};
