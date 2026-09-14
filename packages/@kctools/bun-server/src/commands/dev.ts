import { error } from "node:console";
import { DEFAULT_ENTRY, type Mode, resolveInput } from "../utils/entries";
import { modeOption } from "../utils/options";
import { listen, parsePort } from "../utils/serve";
import type { CommandFn } from "./types";

const text = {
	desc: "Start the development server",
	input: {
		desc: `Path to the HTML file (spa) or directory holding the HTML files (mpa) to serve (default: "${DEFAULT_ENTRY.spa}" in spa, "${DEFAULT_ENTRY.mpa}" in mpa)`,
	},
	hostname: {
		desc: "Hostname to bind the dev server to",
		def: "127.0.0.1",
	},
	port: {
		desc: "Port to run the dev server on",
		def: "3000",
	},
	nextPort: {
		desc: "Automatically find the next available port if the specified one is in use",
		def: false,
	},
};

export const dev: CommandFn = (program, Bun) => {
	program
		.command("dev")
		.description(text.desc)
		.argument("[input]", text.input.desc)
		.addOption(modeOption())
		.option("-h, --hostname <hostname>", text.hostname.desc, text.hostname.def)
		.option("-p, --port <number>", text.port.desc, text.port.def)
		.option("-P, --next-port", text.nextPort.desc, text.nextPort.def)
		.action(async (input, options) => {
			const port = parsePort(options.port);
			if (port === undefined) {
				error(`Invalid port number: ${options.port}`);
				return;
			}

			const cwd = process.cwd();
			const resolved = resolveInput(Bun, options.mode as Mode, input, cwd);
			if (resolved === undefined) return;

			const routes: Record<string, unknown> = {};
			for (const entry of resolved.entries) {
				const { default: htmlContent } = await import(
					Bun.resolveSync(entry.path, cwd)
				);
				routes[entry.route] = htmlContent;
				routes[entry.wildcard] = htmlContent;
			}

			listen(Bun, { port, nextPort: options.nextPort }, (current) => ({
				development: true,
				hostname: options.hostname,
				port: current,
				routes,
			}));
		});
};
