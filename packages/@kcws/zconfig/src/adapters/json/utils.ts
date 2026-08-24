import type { ParseError as JsoncParseError } from "jsonc-parser";
import { importSync } from "#utils/imports";
import { getConfigFiles } from "../_internal";
import type {
	JsonAdapterNormalizedOptions,
	JsonAdapterOptions,
	JsonParserModule,
} from "./types";

/**
 * Normalizes the options for the JSON adapter.
 * @param options - The options to normalize
 * @returns The normalized options
 */
export const normalizeOptions = (
	options: JsonAdapterOptions,
): JsonAdapterNormalizedOptions => ({
	...options,
	jsonc: options.jsonc ?? false,
});

export const parseJsonc = <T>(content: string): T => {
	const parser = importSync<JsonParserModule>("jsonc", "jsonc-parser");
	const errors: JsoncParseError[] = [];
	const parsed = parser.parse(content, errors);
	if (errors.length > 0) {
		const diagnostics = errors
			.map(({ error, offset, length }) => {
				return `${parser.printParseErrorCode?.(error) ?? `error ${error}`} at ${offset}:${length}`;
			})
			.join(", ");
		throw new Error(`JSONC parse error: ${diagnostics}`);
	}

	return parsed;
};

export const parseJson = <T>(content: string): T => JSON.parse(content);

export const getJsonFiles = (name?: string): string[] =>
	getConfigFiles(["json", "jsonc"], name);
