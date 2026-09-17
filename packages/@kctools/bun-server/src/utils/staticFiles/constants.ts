import { createLogger, type Logger } from "#utils/logger";

/** Separator between the source and the target of a specification. */
export const STATIC_SEPARATOR = ":" as const;

export const logger: Logger = createLogger("utils/staticFiles");
