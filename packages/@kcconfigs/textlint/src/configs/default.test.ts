import { describe, expect, test } from "vitest";
import defaultConfig from "./default";

describe("default config", () => {
	test("should compose the package default textlint config", () => {
		expect(defaultConfig).toEqual({
			plugins: [],
			filters: [
				{
					type: "filter",
					name: "comments",
					config: true,
				},
				{
					type: "filter",
					name: "allowlist",
					config: {
						allow: [""],
					},
				},
			],
			rules: {
				terminology: true,
			},
		});
	});
});
