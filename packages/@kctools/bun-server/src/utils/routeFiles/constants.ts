import { createLogger, type Logger } from "#utils/logger";

/** The default index file name used in routes */
export const HTML_INDEX = "index" as const;

/** The separator used in HTML paths */
export const HTML_SEP = "/" as const;

/** Regular expression to match HTML file extensions */
export const HTML_EXTENSION: RegExp = /\.html$/;

export const logger: Logger = createLogger("utils/routeFiles");
