import { createLogger, type Logger } from "#utils/logger";

/** Characters making a path segment a pattern instead of a plain name. */
export const STATIC_GLOB_MAGIC: RegExp = /[*?[\]{}!]/;

export const logger: Logger = createLogger("utils/path");
