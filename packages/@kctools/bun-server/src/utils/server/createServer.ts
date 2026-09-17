import type { Serve } from "bun";
import { DEFAULT_NOT_FOUND } from "#constants";
import type { BunType } from "#types";
import { logger, MAX_ATTEMPTS } from "./constants";
import getNextPort from "./getNextPort";
import parsePort from "./parsePort";

type ParialOptions<WebSocketData, R extends string> = Omit<
	Serve.Options<WebSocketData, R>,
	"hostname" | "port" | "unix"
>;

const createServer = <WebSocketData, R extends string>(
	Bun: BunType,
	host: string,
	port: string,
	nextPort: boolean,
	options: ParialOptions<WebSocketData, R>,
): Bun.Server<WebSocketData> => {
	let attempts = 0;
	let currentPort = parsePort(port);
	while (attempts < MAX_ATTEMPTS) {
		attempts++;
		try {
			logger.debug(
				{ attempts, currentPort },
				`attempt start server with port: ${currentPort}`,
			);

			const config = Object.assign(
				{
					development: true,
					hostname: host,
					port: currentPort,
				},
				options,
			) as Serve.Options<WebSocketData, R>;

			const server = Bun.serve({
				fetch: () => {
					return new Response(DEFAULT_NOT_FOUND, { status: 404 });
				},

				...config,
			});
			if (server) {
				logger.debug({ config }, "start server with config");
				return server;
			}
		} catch (error) {
			if (nextPort) {
				logger.debug(
					{ error },
					`failed to create server with port: ${currentPort}, try again`,
				);
				currentPort = getNextPort(currentPort);
			} else {
				throw error;
			}
		}
	}
	throw new Error(`Failed to create server after ${MAX_ATTEMPTS} attempts`);
};

export default createServer;
