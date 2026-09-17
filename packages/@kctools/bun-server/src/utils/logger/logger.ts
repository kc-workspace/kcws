import { type LoggerOptions, pino } from "pino";
import { build } from "pino-pretty";
import isDebug from "./isDebug";
import type { Logger } from "./types";

const steam = build({
	colorize: true,
});

const option = {
	level: isDebug() ? "debug" : "info",
} satisfies LoggerOptions<never, boolean>;

const logger: Logger = pino(option, steam);
export default logger;
