import type { Serve } from "bun";
import type { Command } from "commander";
import type { CommandFn } from "#types";
import { defineCommand } from "#utils/command";
import { createLogger } from "#utils/logger";
import { cwdOption, readOptions } from "#utils/options";
import { parseRouteFiles } from "#utils/routeFiles";
import { createServer } from "#utils/server";
import { parseStaticFiles, staticOption } from "#utils/staticFiles";

const define = (command: Command) => {
	return command
		.argument("[input...]", "Path to html file or directory contains html")
		.addOption(staticOption)
		.addOption(cwdOption)
		.option(
			"-h, --hostname <hostname>",
			"Hostname to bind the dev server to",
			"127.0.0.1",
		)
		.option("-p, --port <number>", "Port to run the dev server on", "3000")
		.option(
			"-P, --next-port",
			"Automatically find the next available port if the specified one is in use",
			true,
		);
};

const logger = createLogger("commands/dev");

const dev: CommandFn = defineCommand(
	"dev",
	"Start the development server using Bun.serve()",
	(command, Bun) => {
		define(command).action(async (inputs, options) => {
			logger.debug({ inputs, options }, "starting the development server");

			const routes: Serve.Routes<undefined, string> = {};

			const routeFiles = await parseRouteFiles(Bun, inputs, options);
			for (const routeFile of routeFiles) {
				routes[routeFile.route] = Bun.file(routeFile.path);
				routes[routeFile.wildcard] = Bun.file(routeFile.path);
			}

			const staticFiles = await parseStaticFiles(Bun, options);
			for (const staticFile of staticFiles) {
				routes[staticFile.route] = Bun.file(staticFile.source);
			}

			const server = createServer(
				Bun,
				readOptions<string>(options, "hostname"),
				readOptions<string>(options, "port"),
				readOptions<boolean>(options, "nextPort"),
				{ routes },
			);
			logger.info(`Listening on ${server.url}`);
		});
	},
);

export default dev;
