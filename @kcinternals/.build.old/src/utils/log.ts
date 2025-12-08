export const info = (msg: unknown, ...args: unknown[]) => {
	console.log("[INF]", msg, ...args)
}

export const warn = (msg: unknown, ...args: unknown[]) => {
	console.warn("[WRN]", msg, ...args)
}

export const error = (msg: unknown, ...args: unknown[]) => {
	console.error("[ERR]", msg, ...args)
}
