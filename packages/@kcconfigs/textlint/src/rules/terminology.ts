import terminologyModule from "textlint-rule-terminology";
import type { RuleRule } from "../models/rule";

export interface TerminologyConfig {
	defaultTerms?: boolean;
	skip?: string[];
	terms?: string[];
	exclude?: string[];
}

export type TerminologyRule = RuleRule<"terminology", TerminologyConfig>;

export const terminology = (config?: TerminologyConfig): TerminologyRule => {
	return {
		type: "rule",
		name: "terminology",
		module: terminologyModule,
		config: {
			defaultTerms: true,
			...config,
		},
	};
};
