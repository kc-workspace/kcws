import type { UserConfig } from "../models/config";
import type { AnyRule, RuleConfig, RuleRule } from "../models/rule";

export const defineConfig = <RS extends AnyRule[]>(
	...inputs: RS
): UserConfig<RS> => {
	type Filters = UserConfig<RS>["filters"];
	type Rules = UserConfig<RS>["rules"];
	type RulesConfig = UserConfig<RS>["rulesConfig"];

	const filters = {} as Filters;
	const rules = {} as Rules;
	const rulesConfig = {} as RulesConfig;

	for (const input of inputs) {
		if (input.config === false) continue;

		switch (input.type) {
			case "filter": {
				type Name = keyof Filters;
				type Config = Filters[Name];
				filters[input.name as Name] = input.config as Config;
				break;
			}
			case "rule": {
				const rule = input as RuleRule<string, RuleConfig>;
				type Name = keyof Rules;
				type Config = RuleConfig[Name];
				rules[rule.name as Name] = rule.module;
				rulesConfig[rule.name as Name] = rule.config as Config;
				break;
			}
		}
	}

	return {
		filters,
		rules,
		rulesConfig,
	};
};
