import type { AnnotationProperties as CoreAnnotationProperties } from "@actions/core";
import type { NS_SEP } from "./namespace";

/**
 * Properties for GitHub Actions workflow annotations.
 * Re-exported from `@actions/core`.
 *
 * @see {@link https://docs.github.com/en/actions/reference/workflow-commands-for-github-actions#setting-a-notice-message | GitHub Actions Annotations}
 */
export type AnnotationProperties = CoreAnnotationProperties;

export type ExtendNamespace<
	NS extends string,
	SS extends string[] = [],
> = SS extends [infer F, ...infer R]
	? R extends string[]
		? ExtendNamespace<`${NS}${typeof NS_SEP}${F & string}`, R>
		: `${NS}${typeof NS_SEP}${F & string}`
	: NS;

export type Getter<TValue> = () => TValue;
export type Log = (msg: string, properties?: AnnotationProperties) => void;
