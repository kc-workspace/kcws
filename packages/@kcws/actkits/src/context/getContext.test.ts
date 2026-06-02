import { describe, expect, test } from "vitest";

import { getContext } from ".";

describe("getContext", () => {
	test("should create a normalized GitHub context snapshot", () => {
		const context = getContext({
			GITHUB_ACTIONS: "true",
			GITHUB_ACTOR: "dependabot[bot]",
			GITHUB_EVENT_NAME: "pull_request_target",
			GITHUB_REF: "refs/heads/main",
			GITHUB_REF_NAME: "main",
			GITHUB_REF_TYPE: "branch",
			GITHUB_REPOSITORY: "kc-workspace/kcws",
			GITHUB_RUN_ID: "42",
			GITHUB_SERVER_URL: "https://github.com",
		});

		expect(context.isGitHubActions).toBe(true);
		expect(context.runId).toBe(42);
		expect(context.actor).toBe("dependabot[bot]");
		expect(context.eventName).toBe("pull_request_target");
		expect(context.repository).toBe("kc-workspace/kcws");
		expect(context.serverUrl).toBe("https://github.com");
	});

	test("should parse numeric fields and coerce invalid values to undefined", () => {
		const context = getContext({
			GITHUB_RUN_ATTEMPT: "",
			GITHUB_RUN_ID: "abc",
			GITHUB_RUN_NUMBER: "7",
		});

		expect(context.runAttempt).toBeUndefined();
		expect(context.runId).toBeUndefined();
		expect(context.runNumber).toBe(7);
	});
});
