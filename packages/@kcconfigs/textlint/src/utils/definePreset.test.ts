import { describe, expect, test } from "vitest";
import { definePreset } from "./definePreset";
import { defineRule } from "./defineRule";

describe(definePreset.name, () => {
	test("should map rule modules and rule configs by name", () => {
		const alphaModule = { lint: "alpha" };
		const betaModule = { lint: "beta" };
		const alpha = defineRule({
			name: "alpha",
			module: alphaModule,
			config: { enabled: true },
		});
		const beta = defineRule({
			name: "beta",
			module: betaModule,
			config: false,
		});

		expect(definePreset("example", alpha, beta)).toEqual({
			type: "preset",
			name: "example",
			rules: {
				alpha: alphaModule,
				beta: betaModule,
			},
			rulesConfig: {
				alpha: { enabled: true },
				beta: false,
			},
		});
	});
});
