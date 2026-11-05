import { isDebug as coreIsDebug } from "@actions/core"

/**
 * Returns whether debug logging is enabled via `@actions/core` or `DEBUG` env.
 */
export const isDebug = (): boolean => {
	return coreIsDebug() || (process.env["DEBUG"]?.length ?? 0) > 0
}
