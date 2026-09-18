import { RuleConfigSeverity as Severity } from "@commitlint/types";
import { DEFAULT_SCOPES } from "../constants";
import type { CommitlintConfig } from "../types";
import mergeConfig from "./mergeConfig";

/**
 * Sets the `scope-enum` rule and the prompt `scope` question.
 *
 * Both values are replaced, not merged, so earlier scopes never leak
 * through. An empty list falls back to {@link DEFAULT_SCOPES}.
 *
 * @param base - Config to apply scopes to
 * @param scopes - Scopes to allow
 * @returns A new config with the scopes applied
 */
export const applyScopes = (
	base: CommitlintConfig,
	scopes: readonly string[],
): CommitlintConfig => {
	const resolved = scopes.length > 0 ? [...scopes] : [...DEFAULT_SCOPES];
	const merged = mergeConfig(base, {
		rules: {
			"scope-enum": () => [Severity.Error, "always", resolved],
		},
	});
	return {
		...merged,
		prompt: {
			...merged.prompt,
			questions: {
				...merged.prompt?.questions,
				scope: {
					...merged.prompt?.questions?.scope,
					enum: Object.fromEntries(resolved.map((s) => [s, {}])),
				},
			},
		},
	};
};
