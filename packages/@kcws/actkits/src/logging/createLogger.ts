import {
	coreDebug,
	coreEndGroup,
	coreError,
	coreInfo,
	coreNotice,
	coreStartGroup,
	coreWarn,
	coreWrap,
} from "./internal/core";
import { isDebug } from "./internal/debug";
import { formatter } from "./internal/format";
import { group, groupSync } from "./internal/group";
import { createNamespace } from "./internal/namespace";
import type { ExtendNamespace } from "./internal/types";
import type { ILogger } from "./types";

/**
 * Creates a logger instance wrapping `@actions/core` logging functions.
 *
 * The returned logger provides printf-style formatting and namespace support
 * for organizing log output in GitHub Actions workflows.
 *
 * @param namespace - Optional namespace for log messages (colon-separated segments)
 * @returns A logger instance with all logging methods
 */
export const createLogger = <NS extends string, SS extends string[]>(
	parent: NS,
	...segments: SS
): ILogger<ExtendNamespace<NS, SS>> => {
	const ns = createNamespace(parent, segments);
	return {
		namespace: ns,
		isDebug: isDebug(),
		debug: (format, ...args) => coreDebug(formatter(format, args, ns)),
		info: (format, ...args) => coreInfo(formatter(format, args, ns)),
		warn: (format, ...args) => coreWrap(coreWarn, ns, format, args),
		error: (format, ...args) => coreWrap(coreError, ns, format, args),
		notice: (format, ...args) => coreWrap(coreNotice, ns, format, args),

		endGroup: coreEndGroup,
		startGroup: coreStartGroup,

		group: group,
		groupSync: groupSync,

		extend: (...childSegments) => createLogger(ns, ...childSegments),
	};
};
