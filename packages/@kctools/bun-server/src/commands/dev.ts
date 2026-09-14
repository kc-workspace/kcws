import { error } from "node:console";
import { Option } from "commander";
import {
	DEFAULT_ENTRY,
	DEFAULT_MODE,
	duplicateRoutes,
	listEntries,
	MODES,
	type Mode,
} from "./entries";
import { listen, parsePort } from "./serve";
import type { CommandFn } from "./types";

const text = {
	desc: "Start the development server",
	input: {
		desc: `Path to the HTML file (spa) or directory holding the HTML files (mpa) to serve (default: "${DEFAULT_ENTRY.spa}" in spa, "${DEFAULT_ENTRY.mpa}" in mpa)`,
	},
	mode: {
		desc: "Page layout of the website",
		def: DEFAULT_MODE,
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
		.addOption(
			new Option("-m, --mode <mode>", text.mode.desc)
				.choices([...MODES])
				.default(text.mode.def),
		)
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
			const mode = options.mode as Mode;
			const inputPath: string = input ?? DEFAULT_ENTRY[mode];

			const entries = listEntries(Bun, mode, inputPath, cwd);
			if (entries.length === 0) {
				error(`No HTML entry found in ${inputPath}`);
				return;
			}

			const duplicates = duplicateRoutes(entries);
			if (duplicates.length > 0) {
				error(
					`Multiple HTML entries claim the same route: ${duplicates.join(", ")}`,
				);
				return;
			}

			const routes: Record<string, unknown> = {};
			for (const entry of entries) {
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
