import { error, log, warn } from "node:console";
import type { CommandFn } from "./types";

const text = {
	desc: "Start the development server",
	html: {
		desc: "Path to the HTML file to serve",
		def: "./public/index.html",
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
		.argument("[html]", text.html.desc, text.html.def)
		.option("-h, --hostname <hostname>", text.hostname.desc, text.hostname.def)
		.option("-p, --port <number>", text.port.desc, text.port.def)
		.option("-P, --next-port", text.nextPort.desc, text.nextPort.def)
		.action(async (html, options) => {
			let port = parseInt(options.port, 10);
			if (Number.isNaN(port) || port <= 0 || port > 65535) {
				error(`Invalid port number: ${options.port}`);
				return;
			}

			const { default: htmlContent } = await import(
				Bun.resolveSync(html, process.cwd())
			);
			const limit = 10;
			let count = 0;
			while (++count < limit) {
				try {
					const server = Bun.serve({
						development: true,
						hostname: options.hostname,
						port: port,
						routes: {
							"/*": htmlContent,
						},
					});

					log(`Listening on ${server.url}`);
					return;
				} catch (e) {
					if (options.nextPort) {
						warn(`Port ${port} is in use, trying ${port + 1}...`);
						port++;
					} else {
						error(e);
						return;
					}
				}
			}
		});
};
