import { createLogger, type Logger } from "#utils/logger";

/** Min possible port number (0 will random any available port) */
export const MIN_PORT = 0;
/** Max possible port number  */
export const MAX_PORT = 65535;
/** Max attempt with port is in-use */
export const MAX_ATTEMPTS = 10;

export const logger: Logger = createLogger("utils/server");
