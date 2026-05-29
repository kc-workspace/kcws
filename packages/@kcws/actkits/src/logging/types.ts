import type { ExtendNamespace, Getter } from "./internal/types";

/**
 * Public logger contract for the logging module.
 *
 * @typeParam NS - Full namespace represented by this logger instance.
 */
export interface ILogger<NS extends string> {
	/** The namespace of this logger (colon-separated segments) */
	readonly namespace: NS;
	/** Whether debug logging is enabled */
	readonly isDebug: boolean;

	/** Logs a debug message with printf-style formatting */
	debug(format: string, ...args: unknown[]): void;
	/** Logs an informational message with printf-style formatting */
	info(format: string, ...args: unknown[]): void;
	/** Logs a warning annotation with printf-style formatting */
	warn(format: string, ...args: unknown[]): void;
	/** Logs an error annotation with printf-style formatting */
	error(format: string, ...args: unknown[]): void;
	/** Logs a notice annotation with printf-style formatting */
	notice(format: string, ...args: unknown[]): void;

	/** Executes an asynchronous function within a log group */
	group<R>(title: string, run: Getter<Promise<R>>): Promise<R>;
	/** Executes a synchronous function within a log group */
	groupSync<R>(title: string, run: Getter<R>): R;

	/** Starts a new log group */
	startGroup(title: string): void;
	/** Ends the current log group */
	endGroup(): void;

	/** Creates a child logger with an extended namespace */
	extend<SS extends string[]>(
		...segments: SS
	): ILogger<ExtendNamespace<NS, SS>>;
}
