import type { BaseContentAdapterOptions, ContentSource } from "../content";

/**
 * A readable source of configuration chunks, such as a Node.js `Readable`,
 * `process.stdin`, or a web `ReadableStream` like `fetch` response bodies.
 * Byte chunks are decoded as UTF-8.
 */
export type StreamSource = AsyncIterable<string | Uint8Array>;

/** Options for {@link streamAdapter}. */
export type StreamAdapterOptions = BaseContentAdapterOptions & {
	/**
	 * Stream to read, or a function returning a stream or content.
	 *
	 * A stream can only be read once, so a stream value fails on a second load.
	 * Pass a function to produce a fresh source on every load.
	 */
	stream:
		| StreamSource
		| (() =>
				| StreamSource
				| ContentSource
				| Promise<StreamSource | ContentSource>);
};
