import { format } from "node:util";

/**
 * Formats a message with namespace prefix and printf-style args.
 * @internal
 */
export const formatter = (
	formatter: string,
	args: unknown[],
	ns?: string,
): string => {
	const prefix = ns ? `[${ns}] ` : ``;
	return args.length > 0
		? `${prefix}${format(formatter, ...args)}`
		: `${prefix}${formatter}`;
};
