import terminologyModule from "textlint-rule-terminology";
import { describe, expect, test } from "vitest";
import { terminology } from "./terminology";

describe(terminology.name, () => {
	test("should enable the rule with the default module", () => {
		expect(terminology()).toEqual({
			type: "rule",
			name: "terminology",
			module: terminologyModule,
			config: true,
		});
	});

	test("should preserve a custom rule config", () => {
		expect(
			terminology({
				skip: ["HTTP"],
				terms: ["GitHub"],
			}),
		).toEqual({
			type: "rule",
			name: "terminology",
			module: terminologyModule,
			config: {
				skip: ["HTTP"],
				terms: ["GitHub"],
			},
		});
	});
});
