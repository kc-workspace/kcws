import { RuleConfigSeverity as Severity } from "@commitlint/types";
import { definePlugin } from "@kcinternals/config-builder";
import { MINIMAL_TYPES, STANDARD_TYPES } from "../constants";
import type { CommitlintConfigPlugin, TypeMode, TypeObject } from "../types";
import mergeConfig from "../utils/mergeConfig";

/**
 * Resolves commit types from a {@link TypeMode}.
 *
 * @param mode - `"standard"`, `"minimal"`, a list of type names, or a custom type map
 * @returns Map of commit type name to prompt metadata
 */
const getTypes = (mode: TypeMode): TypeObject => {
	if (Array.isArray(mode)) {
		return mode.reduce((acc, type) => {
			acc[type] = {};
			return acc;
		}, {} as TypeObject);
	}
	if (typeof mode !== "string") {
		return mode;
	}

	switch (mode) {
		case "standard":
			return STANDARD_TYPES;
		case "minimal":
			return MINIMAL_TYPES;
	}
};

/**
 * Types plugin — sets the `type-enum` rule and the prompt `type` question.
 *
 * Both values are replaced, not merged, so the last types plugin wins.
 *
 * @param mode - Commit types to allow; defaults to `"standard"`
 * @returns commitlint config plugin
 */
const typesPlugin = (
	mode: TypeMode = "standard",
): CommitlintConfigPlugin<"types"> =>
	definePlugin("types", {
		applyConfig: (base) => {
			const types = getTypes(mode);
			const merged = mergeConfig(base, {
				rules: {
					"type-enum": [Severity.Error, "always", Object.keys(types)],
				},
			});
			// enum must replace, not merge, so earlier types do not leak through
			return {
				...merged,
				prompt: {
					...merged.prompt,
					questions: {
						...merged.prompt?.questions,
						type: { ...merged.prompt?.questions?.type, enum: types },
					},
				},
			};
		},
	});
export default typesPlugin;
