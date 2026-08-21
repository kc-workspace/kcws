/**
 * Every schema key must be strict camelCase.
 *
 * Environment variable names are a flat `[A-Z0-9_]+` namespace, so encoding a
 * nested key path into one needs `__` for path separation and `_` for word
 * separation. That encoding is only unambiguous while keys themselves contain
 * no underscore and never start with an uppercase letter — otherwise
 * `APP_DATABASE_HOST` could decode to either `database.host` or `databaseHost`.
 *
 * @internal
 */
export const KEY_PATTERN: RegExp = /^[a-z][a-zA-Z0-9]*$/;

/**
 * Placeholder path segment for values behind a runtime key.
 *
 * @internal
 */
export const RUNTIME_KEY = "*";

/**
 * Wrappers that hold exactly one child schema under `innerType`.
 *
 * @internal
 */
export const INNER_TYPE_WRAPPERS: ReadonlySet<string> = new Set([
	"optional",
	"nullable",
	"default",
	"prefault",
	"nonoptional",
	"catch",
	"readonly",
	"promise",
	"success",
]);
