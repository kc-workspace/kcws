import { mergeConfig } from "./mergeConfig";
import type { UserConfig } from "./model";

export const defineBaseConfig = (config?: UserConfig): UserConfig => {
	const baseConfig: UserConfig = {
		// Input: https://typedoc.org/documents/Options.Input.html
		entryPointStrategy: "resolve",
		includeVersion: true,
		exclude: ["**/*+.(index|e2e).ts"],

		// Output: https://typedoc.org/documents/Options.Output.html
		emit: "docs",
		sourceLinkExternal: true,
		markdownLinkExternal: true,
		cleanOutputDir: true,
		searchInDocuments: true,
		searchInComments: true,
		navigation: {
			includeCategories: true,
			includeGroups: true,
			includeFolders: false,
		},
		visibilityFilters: {
			protected: true,
			private: false,
			external: true,
			"@internal": true,
			"@beta": true,
			"@alpha": false,
		},
		ignoredHighlightLanguages: ["use"],

		// Comments: https://typedoc.org/documents/Options.Comments.html
		useTsLinkResolution: true,

		// Organization: https://typedoc.org/documents/Options.Organization.html
		categorizeByGroup: true,

		// Validation: https://typedoc.org/documents/Options.Validation.html
		validation: {
			notExported: true,
			invalidLink: true,
			invalidPath: true,
			rewrittenLink: true,
			notDocumented: false,
			unusedMergeModuleWith: true,
		},
		treatWarningsAsErrors: false,
		treatValidationWarningsAsErrors: false,

		// Other: https://typedoc.org/documents/Options.Other.html
	};

	return mergeConfig(baseConfig, config) as UserConfig;
};
