import terminologyModule from "textlint-rule-terminology";
import type { Rule } from "../models";
import { defineRule } from "../utils/defineRule";

export interface TerminologyConfig {
	defaultTerms?: boolean;
	skip?: string[];
	terms?: string[];
	exclude?: string[];
}

export type TerminologyRule = Rule<"terminology", TerminologyConfig>;

export const terminology = (config?: TerminologyConfig): TerminologyRule => {
	return defineRule({
		name: "terminology",
		module: terminologyModule,
		config: config ?? true,
	});
};
