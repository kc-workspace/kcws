/**
 * Logging utilities for GitHub Actions workflow commands.
 *
 * This module re-exports logging functions from `@actions/core` and provides
 * additional utilities like `createLogger` and `withGroup`.
 *
 * @packageDocumentation
 */

export { createLogger } from "./createLogger";
export { isDebug } from "./internal/debug";
export { formatter as format } from "./internal/format";

export type { ILogger } from "./types";
