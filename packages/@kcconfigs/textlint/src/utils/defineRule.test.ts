import { describe, expect, test } from "vitest";
import { defineRule } from "./defineRule";

describe(defineRule.name, () => {
	test("should add the rule type to the returned object", () => {
		const module = { lint: true };

		expect(
			defineRule({
				name: "terminology",
				module,
				config: true,
			}),
		).toEqual({
			type: "rule",
			name: "terminology",
			module,
			config: true,
		});
	});
});
