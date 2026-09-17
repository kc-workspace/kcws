import logger from "./logger";
import type { Logger } from "./types";

const createLogger = (name: string): Logger => {
	return logger.child({ name });
};
export default createLogger;
