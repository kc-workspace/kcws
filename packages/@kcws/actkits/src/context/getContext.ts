/** biome-ignore-all lint/complexity/useLiteralKeys: Conflict with ts(4111) */
import { env as dEnv } from "node:process";
import type { ActionEnv } from "../input/env";
import type { GitHubContext } from "./types";

const GITHUB_ACTIONS_TRUE = "true";

const parseNumber = (value: string | undefined): number | undefined => {
	if (value == null || value.length === 0) {
		return undefined;
	}

	const parsed = Number.parseInt(value, 10);
	return Number.isNaN(parsed) ? undefined : parsed;
};

export const getContext = (env: ActionEnv = dEnv): GitHubContext => {
	return {
		action: env["GITHUB_ACTION"],
		actor: env["GITHUB_ACTOR"],
		apiUrl: env["GITHUB_API_URL"],
		eventName: env["GITHUB_EVENT_NAME"],
		graphqlUrl: env["GITHUB_GRAPHQL_URL"],
		isGitHubActions: env["GITHUB_ACTIONS"] === GITHUB_ACTIONS_TRUE,
		job: env["GITHUB_JOB"],
		ref: env["GITHUB_REF"],
		refName: env["GITHUB_REF_NAME"],
		refType: env["GITHUB_REF_TYPE"],
		repository: env["GITHUB_REPOSITORY"],
		repositoryOwner: env["GITHUB_REPOSITORY_OWNER"],
		runAttempt: parseNumber(env["GITHUB_RUN_ATTEMPT"]),
		runId: parseNumber(env["GITHUB_RUN_ID"]),
		runNumber: parseNumber(env["GITHUB_RUN_NUMBER"]),
		serverUrl: env["GITHUB_SERVER_URL"],
		sha: env["GITHUB_SHA"],
		workflow: env["GITHUB_WORKFLOW"],
		workspace: env["GITHUB_WORKSPACE"],
	};
};
