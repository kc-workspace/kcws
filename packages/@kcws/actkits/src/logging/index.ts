/**
 * Logging utilities for GitHub Actions workflow commands.
 *
 * This module re-exports logging functions from `@actions/core` and provides
 * additional utilities like `createLogger` and `withGroup`.
 *
 * @packageDocumentation
 */

/**
 * Creates a namespaced logger with printf-style formatting support.
 */
export { createLogger } from "./createLogger";

/**
 * Returns whether debug logging is enabled.
 */
export { isDebug } from "./internal/debug";

/**
 * Formats a log message using Node.js printf-style substitutions.
 */
export { formatter as format } from "./internal/format";

/**
 * Public logger interface.
 */
export type { ILogger } from "./types";
