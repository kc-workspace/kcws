import type { Logger } from "./types"

import logger from "./logger"

const createLogger = (name: string): Logger => {
	return logger.child({ name })
}
export default createLogger
