import { text } from "node:stream/consumers";
import type { Adapter } from "#types";
import { toAdapterError, ZconfigAdapterError } from "#utils/errors";
import { applyTransform } from "#utils/transforms";
import type { ContentSource } from "../content";
import { decodeContent, resolveParser, toRawConfig } from "../content/utils";
import type { StreamAdapterOptions, StreamSource } from "./types";

const LOAD_ERR = "Failed to load config stream";

/**
 * Creates an adapter that parses configuration read from a stream.
 *
 * Use it for asynchronous sources such as standard input or a remote store:
 * `stream: async () => (await fetch(url)).body`. Content is parsed with a
 * built-in `format` or a custom `parseSync`/`parse` pair.
 *
 * Streams cannot be read synchronously, so `loadSync` always throws; use this
 * adapter with {@link loadConfig}, not {@link loadConfigSync}.
 *
 * @param options - stream, parsing, and transformation options
 * @returns adapter suitable for {@link loadConfig}
 * @throws {ZconfigAdapterError} when loaded synchronously, when a stream value
 * is read twice, or when the stream cannot be read or parsed
 */
const streamAdapter = (options: StreamAdapterOptions): Adapter => {
	const name = options.name ?? "stream";
	const parser = resolveParser(name, options);
	let consumed = false;

	const getSource = ():
		| Promise<StreamSource | ContentSource>
		| StreamSource => {
		if (typeof options.stream === "function") {
			return Promise.resolve(options.stream());
		}
		if (consumed) {
			throw new ZconfigAdapterError(
				name,
				"stream has already been consumed; pass a function to load more than once",
			);
		}
		consumed = true;
		return options.stream;
	};

	return {
		name,
		load: async () => {
			try {
				const source = await getSource();
				const content =
					typeof source === "string" || source instanceof Uint8Array
						? decodeContent(source)
						: await text(source);
				const config = toRawConfig(await parser.parse(content));
				return applyTransform(config, options.transform);
			} catch (cause) {
				const message =
					cause instanceof Error ? `${LOAD_ERR}: ${cause.message}` : LOAD_ERR;
				throw toAdapterError(name, message, cause);
			}
		},
		loadSync: () => {
			throw new ZconfigAdapterError(
				name,
				"synchronous loading is not supported; use loadConfig instead",
			);
		},
	};
};

export default streamAdapter;
