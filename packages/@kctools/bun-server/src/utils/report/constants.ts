import { createLogger, type Logger } from "#utils/logger";

export const logger: Logger = createLogger("utils/report");

/** File kinds in the order they are reported, unknown kinds last. */
export const KIND_ORDER: string[] = [
	"entry-point",
	"chunk",
	"asset",
	"sourcemap",
	"bytecode",
	"static",
];

/** Shorter labels for the kinds Bun reports. */
export const KIND_LABEL: Record<string, string> = {
	"entry-point": "entry",
	chunk: "chunk",
	asset: "asset",
	sourcemap: "sourcemap",
	bytecode: "bytecode",
	static: "static",
};
