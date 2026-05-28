import { isAnnotationProps } from "./annotation";
import { formatter } from "./format";
import type { Log } from "./types";

export {
	debug as coreDebug,
	endGroup as coreEndGroup,
	error as coreError,
	info as coreInfo,
	notice as coreNotice,
	startGroup as coreStartGroup,
	warning as coreWarn,
} from "@actions/core";

export const coreWrap = (
	log: Log,
	ns: string,
	format: string,
	args: unknown[],
): void => {
	const lastArg = args.at(-1);
	if (isAnnotationProps(lastArg)) {
		log(formatter(format, args.slice(0, -1), ns), lastArg);
	} else {
		log(formatter(format, args, ns));
	}
};
