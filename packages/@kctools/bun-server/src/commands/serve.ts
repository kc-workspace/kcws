import { error, log, warn } from "node:console";
import type * as Bun from "bun";

/** How many consecutive ports are tried when `nextPort` is enabled. */
export const MAX_PORT_ATTEMPTS = 10;

const MIN_PORT = 1;
const MAX_PORT = 65535;

/**
 * Parse a port from the command line.
 *
 * @param raw - raw option value
 * @returns the port, or `undefined` when it is not a usable TCP port
 */
export const parsePort = (raw: string): number | undefined => {
	const port = parseInt(raw, 10);
	if (Number.isNaN(port) || port < MIN_PORT || port > MAX_PORT)
		return undefined;
	return port;
};

/** Port selection shared by every command that starts a server. */
export interface ListenOptions {
	/** First port to try. */
	port: number;
	/** Try the following ports when the requested one is taken. */
	nextPort: boolean;
}

/**
 * Start a server, optionally walking to the next port while the requested one
 * is in use.
 *
 * @param bun - Bun runtime namespace
 * @param options - port selection
 * @param create - builds the serve options for the port being tried
 * @returns the running server, or `undefined` when no port could be bound
 */
export const listen = <O extends object>(
	bun: typeof Bun,
	options: ListenOptions,
	create: (port: number) => O,
): Bun.Server<unknown> | undefined => {
	// Bun.serve is overloaded per option shape; each command supplies its own.
	const serve = bun.serve as unknown as (
		serveOptions: O,
	) => Bun.Server<unknown>;

	let port = options.port;
	for (let attempt = 0; attempt < MAX_PORT_ATTEMPTS; attempt++) {
		try {
			const server = serve(create(port));
			log(`Listening on ${server.url}`);
			return server;
		} catch (e) {
			if (!options.nextPort) {
				error(e);
				return undefined;
			}

			warn(`Port ${port} is in use, trying ${port + 1}...`);
			port++;
		}
	}

	error(`Unable to find a free port after ${MAX_PORT_ATTEMPTS} attempts`);
	return undefined;
};
