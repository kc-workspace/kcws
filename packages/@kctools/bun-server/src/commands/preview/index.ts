import { join, relative, resolve } from "node:path";
import type { Command } from "commander";
import { DEFAULT_NOT_FOUND, DEFAULT_OUTPUT } from "#constants";
import type { BunType, CommandFn } from "#types";
import { defineCommand } from "#utils/command";
import { createLogger } from "#utils/logger";
import { cwdOption, readOptions } from "#utils/options";
import { getFile, isInside } from "#utils/path";
import { createServer } from "#utils/server";
import { decodePath, type RequestHandler } from "#utils/url";

const define = (command: Command) => {
	return command
		.argument("[input]", "Path to directory for serve", DEFAULT_OUTPUT)
		.addOption(cwdOption)
		.option(
			"-h, --hostname <hostname>",
			"Hostname to bind the dev server to",
			"127.0.0.1",
		)
		.option("-p, --port <number>", "Port to run the dev server on", "4000")
		.option(
			"-P, --next-port",
			"Automatically find the next available port if the specified one is in use",
			true,
		);
};

const logger = createLogger("commands/preview");

const preview: CommandFn = defineCommand(
	"preview",
	"Preview the built website using Bun.serve()",
	(command, Bun) => {
		define(command).action(async (input, options) => {
			logger.debug({ input, options }, "starting the preview server");

			const cwd = readOptions<string>(options, "cwd");
			const root = resolve(cwd, input);

			const server = createServer(
				Bun,
				readOptions<string>(options, "hostname"),
				readOptions<string>(options, "port"),
				readOptions<boolean>(options, "nextPort"),
				{ development: false, fetch: createHandler(Bun, root) },
			);
			logger.info(`Listening on ${server.url}`);
		});
	},
);

const createHandler = (Bun: BunType, root: string): RequestHandler => {
	return async (request: Request): Promise<Response> => {
		const pathname = decodePath(request.url);
		if (pathname === undefined) {
			return new Response("Bad Request", { status: 400 });
		}

		const target = resolve(root, `.${pathname}`);
		if (!isInside(root, target)) {
			return new Response("Forbidden", { status: 403 });
		}

		const file =
			(await getFile(Bun, target)) ??
			(await getFile(Bun, join(target, "index.html"))) ??
			(await getFile(Bun, `${target}.html`));

		if (file) {
			logger.debug(`GET ${pathname} > ${relative(root, file?.name ?? "")}`);
			return new Response(file, { status: 200 });
		} else return new Response(DEFAULT_NOT_FOUND, { status: 404 });
	};
};

export default preview;
