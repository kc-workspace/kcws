import { getContext } from "./getContext";
import type { GitHubContext } from "./types";

const PULL_REQUEST_EVENT_PREFIX = "pull_request";

export const isGitHubActions = (
	context: GitHubContext = getContext(),
): boolean => {
	return context.isGitHubActions;
};

export const isPullRequestEvent = (
	context: GitHubContext = getContext(),
): boolean => {
	return context.eventName?.startsWith(PULL_REQUEST_EVENT_PREFIX) ?? false;
};

export const isPushEvent = (context: GitHubContext = getContext()): boolean => {
	return context.eventName === "push";
};

export const isReleaseEvent = (
	context: GitHubContext = getContext(),
): boolean => {
	return context.eventName === "release";
};

export const isWorkflowDispatchEvent = (
	context: GitHubContext = getContext(),
): boolean => {
	return context.eventName === "workflow_dispatch";
};

export const isBranchRef = (context: GitHubContext = getContext()): boolean => {
	return (
		context.refType === "branch" ||
		context.ref?.startsWith("refs/heads/") === true
	);
};

export const isTagRef = (context: GitHubContext = getContext()): boolean => {
	return (
		context.refType === "tag" || context.ref?.startsWith("refs/tags/") === true
	);
};

export const isDependabotActor = (
	context: GitHubContext = getContext(),
): boolean => {
	return context.actor === "dependabot[bot]";
};
