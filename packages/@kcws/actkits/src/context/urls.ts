import { getContext } from "./getContext";
import type { GitHubContext } from "./types";

export const getRepositoryUrl = (
	context: GitHubContext = getContext(),
): string | undefined => {
	if (context.serverUrl == null || context.repository == null) {
		return undefined;
	}

	return `${context.serverUrl}/${context.repository}`;
};

export const getRunUrl = (
	context: GitHubContext = getContext(),
): string | undefined => {
	if (
		context.serverUrl == null ||
		context.repository == null ||
		context.runId == null
	) {
		return undefined;
	}

	return `${context.serverUrl}/${context.repository}/actions/runs/${context.runId}`;
};
