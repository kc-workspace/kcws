export interface GitHubContext {
	readonly action?: string | undefined;
	readonly actor?: string | undefined;
	readonly apiUrl?: string | undefined;
	readonly eventName?: string | undefined;
	readonly graphqlUrl?: string | undefined;
	readonly isGitHubActions: boolean;
	readonly job?: string | undefined;
	readonly ref?: string | undefined;
	readonly refName?: string | undefined;
	readonly refType?: string | undefined;
	readonly repository?: string | undefined;
	readonly repositoryOwner?: string | undefined;
	readonly runAttempt?: number | undefined;
	readonly runId?: number | undefined;
	readonly runNumber?: number | undefined;
	readonly serverUrl?: string | undefined;
	readonly sha?: string | undefined;
	readonly workflow?: string | undefined;
	readonly workspace?: string | undefined;
}
