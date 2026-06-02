import { describe, expect, test } from "vitest";

import { getContext, getRepositoryUrl, getRunUrl } from ".";

describe("context urls", () => {
	test("should build repository and run urls", () => {
		const context = getContext({
			GITHUB_REPOSITORY: "kc-workspace/kcws",
			GITHUB_RUN_ID: "42",
			GITHUB_SERVER_URL: "https://github.com",
		});

		expect(getRepositoryUrl(context)).toBe(
			"https://github.com/kc-workspace/kcws",
		);
		expect(getRunUrl(context)).toBe(
			"https://github.com/kc-workspace/kcws/actions/runs/42",
		);
	});

	test("should return undefined urls when required values are missing", () => {
		expect(getRepositoryUrl(getContext({ GITHUB_REPOSITORY: "kc/kcws" }))).toBe(
			undefined,
		);
		expect(
			getRunUrl(getContext({ GITHUB_SERVER_URL: "https://github.com" })),
		).toBe(undefined);
		expect(
			getRunUrl(
				getContext({
					GITHUB_REPOSITORY: "kc/kcws",
					GITHUB_SERVER_URL: "https://github.com",
				}),
			),
		).toBe(undefined);
	});
});
