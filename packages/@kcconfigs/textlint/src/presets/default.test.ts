import terminologyModule from "textlint-rule-terminology";
import { describe, expect, test } from "vitest";
import defaultPreset from "./default";

describe("default preset", () => {
	test("should expose the terminology rule preset", () => {
		expect(defaultPreset).toEqual({
			type: "preset",
			name: "@kcconfigs/textlint/preset-default",
			rules: {
				terminology: terminologyModule,
			},
			rulesConfig: {
				terminology: true,
			},
		});
	});
});
