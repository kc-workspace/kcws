import baseConfig from "@commitlint/config-conventional";
import {
	RuleConfigSeverity as Severity,
	type UserConfig,
} from "@commitlint/types";

import { getScopes } from "./apis/scopes";
import { getTypes, type TypeMode } from "./apis/types";

export interface DefineConfigParams {
	/**
	 * Commit types configuration
	 * - `"standard"`: Use standard conventional commit types
	 * - `string[]`: Use custom types
	 * @default "standard"
	 */
	types?: TypeMode;
	/**
	 * Automatically gather scopes from pnpm workspaces
	 * @default true
	 */
	autoScopes?: boolean;
	/**
	 * Provide additional scopes; or override if `autoScopes` is false
	 */
	scopes?: string[];
}

/**
 * Defines a commitlint configuration with automatic workspace scope detection and customizable commit types.
 *
 * @param params - Configuration options
 * @returns A commitlint configuration object
 */
export const defineConfig = async (
	params?: DefineConfigParams,
): Promise<UserConfig> => {
	const {
		parserPreset,
		prompt: {
			questions: { type, scope, ...questions },
			...prompt
		},
		rules,
	} = baseConfig;

	const types = getTypes(params?.types ?? "standard");
	const scopes = await getScopes(params?.autoScopes ?? true, params?.scopes);

	return {
		helpUrl: "use 'pnpm commit' to create commit instead",
		parserPreset,
		rules: {
			...rules,
			"type-enum": [Severity.Error, "always", Object.keys(types)],
			"scope-enum": () => [Severity.Error, "always", scopes],
			"subject-max-length": [Severity.Warning, "always", 80],
			"body-max-line-length": [Severity.Warning, "always", 300],
		},
		prompt: {
			...prompt,
			questions: {
				...questions,
				type: {
					...type,
					enum: types,
				},
				scope: {
					...scope,
					enum: Object.fromEntries(scopes.map((s) => [s, {}])),
				},
			},
			settings: {
				enableMultipleScopes: false,
			},
		},
	};
};

export type { UserConfig };
export { Severity };
