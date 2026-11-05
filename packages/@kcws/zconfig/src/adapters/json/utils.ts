import type { ParseError as JsoncParseError } from "jsonc-parser"
import type { JsonAdapterNormalizedOptions, JsonAdapterOptions, JsonParserModule } from "./types"

import { importSync } from "#utils/imports"
import { getConfigFiles } from "../_internal"

/**
 * Normalizes the options for the JSON adapter.
 * @param options - The options to normalize
 * @returns The normalized options
 */
export const normalizeOptions = (options: JsonAdapterOptions): JsonAdapterNormalizedOptions => ({
	...options,
	jsonc: options.jsonc ?? false,
})

export const parseJsonc = <T>(content: string): T => {
	const parser = importSync<JsonParserModule>("jsonc", "jsonc-parser")
	const errors: JsoncParseError[] = []
	const parsed = parser.parse(content, errors)
	if (errors.length > 0) {
		const diagnostics = errors
			.map(({ error, offset, length }) => {
				const code = parser.printParseErrorCode?.(error) ?? `error ${error}`
				return `${code} at ${offset}:${length}`
			})
			.join(", ")
		throw new Error(`JSONC parse error: ${diagnostics}`)
	}

	return parsed
}

export const parseJson = <T>(content: string): T => JSON.parse(content)

export const getJsonFiles = (name?: string): string[] => getConfigFiles(["json", "jsonc"], name)
