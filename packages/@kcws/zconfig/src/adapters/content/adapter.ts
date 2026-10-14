import type { Adapter } from "#types";
import { toAdapterError } from "#utils/errors";
import { applyTransform } from "#utils/transforms";
import type { ContentAdapterOptions, ContentSource } from "./types";
import { decodeContent, resolveParser, toRawConfig } from "./utils";

const LOAD_ERR = "Failed to load config content";

/**
 * Creates an adapter that parses configuration from in-memory content.
 *
 * Use it for configuration that is not a local file, such as a string from a
 * command-line flag or bytes already fetched from a remote store. Content is
 * parsed with a built-in `format` or a custom `parseSync`/`parse` pair. A
 * `content` function is called on every load.
 *
 * @param options - content, parsing, and transformation options
 * @returns adapter suitable for {@link loadConfig} and {@link loadConfigSync}
 * @throws {ZconfigAdapterError} when the content cannot be produced or parsed
 */
const contentAdapter = (options: ContentAdapterOptions): Adapter => {
	const name = options.name ?? "content";
	const parser = resolveParser(name, options);
	const getContent = (): string =>
		decodeContent(
			typeof options.content === "function"
				? options.content()
				: (options.content as ContentSource),
		);

	return {
		name,
		load: async () => {
			try {
				const config = toRawConfig(await parser.parse(getContent()));
				return applyTransform(config, options.transform);
			} catch (cause) {
				throw toLoadError(name, cause);
			}
		},
		loadSync: () => {
			try {
				const config = toRawConfig(parser.parseSync(getContent()));
				return applyTransform(config, options.transform);
			} catch (cause) {
				throw toLoadError(name, cause);
			}
		},
	};
};

const toLoadError = (name: string, cause: unknown) => {
	const message =
		cause instanceof Error ? `${LOAD_ERR}: ${cause.message}` : LOAD_ERR;
	return toAdapterError(name, message, cause);
};

export default contentAdapter;
