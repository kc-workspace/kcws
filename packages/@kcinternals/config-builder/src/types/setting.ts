/**
 * A type that can either be a boolean or a specific type `T`.
 */
export type WithEnabled<T> = boolean | T;

/**
 * Extracts the type `T` from `WithEnabled<T>`.
 * If `T` is not wrapped in `WithEnabled`, it will return `never`.
 */
export type WithoutEnabled<T> = T extends WithEnabled<infer U> ? U : never;

/**
 * Represents the base settings for a configuration.
 */
export interface BaseSetting {
	debug?: WithEnabled<(msg: string) => void> | undefined;
	verbose?: WithEnabled<(msg: string) => void> | undefined;
}
