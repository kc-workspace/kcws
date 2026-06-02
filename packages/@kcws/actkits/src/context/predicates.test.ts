import { describe, expect, test } from "vitest";

import {
	getContext,
	isBranchRef,
	isDependabotActor,
	isGitHubActions,
	isPullRequestEvent,
	isPushEvent,
	isReleaseEvent,
	isTagRef,
	isWorkflowDispatchEvent,
} from ".";

describe("context predicates", () => {
	test("should detect pull request, branch ref, tag ref and dependabot actor", () => {
		const context = getContext({
			GITHUB_ACTOR: "dependabot[bot]",
			GITHUB_EVENT_NAME: "pull_request_target",
			GITHUB_REF: "refs/heads/main",
			GITHUB_REF_TYPE: "branch",
		});

		expect(isPullRequestEvent(context)).toBe(true);
		expect(isBranchRef(context)).toBe(true);
		expect(isTagRef(context)).toBe(false);
		expect(isDependabotActor(context)).toBe(true);
	});

	test("should detect release and dispatch events", () => {
		expect(isReleaseEvent(getContext({ GITHUB_EVENT_NAME: "release" }))).toBe(
			true,
		);
		expect(
			isWorkflowDispatchEvent(
				getContext({ GITHUB_EVENT_NAME: "workflow_dispatch" }),
			),
		).toBe(true);
	});

	test("should detect push and github actions flags", () => {
		const context = getContext({
			GITHUB_ACTIONS: "true",
			GITHUB_EVENT_NAME: "push",
		});

		expect(isGitHubActions(context)).toBe(true);
		expect(isPushEvent(context)).toBe(true);
		expect(isReleaseEvent(context)).toBe(false);
		expect(isWorkflowDispatchEvent(context)).toBe(false);
	});

	test("should detect non pull request event and non dependabot actor", () => {
		const context = getContext({
			GITHUB_ACTOR: "octocat",
			GITHUB_EVENT_NAME: "schedule",
		});

		expect(isPullRequestEvent(context)).toBe(false);
		expect(isDependabotActor(context)).toBe(false);
	});

	test("should infer branch and tag from refs when refType is absent", () => {
		const branchContext = getContext({ GITHUB_REF: "refs/heads/feature-x" });
		const tagContext = getContext({ GITHUB_REF: "refs/tags/v1.2.3" });

		expect(isBranchRef(branchContext)).toBe(true);
		expect(isTagRef(branchContext)).toBe(false);
		expect(isTagRef(tagContext)).toBe(true);
		expect(isBranchRef(tagContext)).toBe(false);
	});
});
