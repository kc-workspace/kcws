import { error } from "node:console";
import { join, resolve, sep } from "node:path";
import type * as Bun from "bun";
import { listen, parsePort } from "./serve";
import type { CommandFn } from "./types";

const text = {
	desc: "Preview the built website",
	directory: {
		desc: "Directory to serve",
		def: "dist",
	},
	hostname: {
		desc: "Hostname to bind the preview server to",
		def: "127.0.0.1",
	},
	port: {
		desc: "Port to run the preview server on",
		def: "3000",
	},
	nextPort: {
		desc: "Automatically find the next available port if the specified one is in use",
		def: false,
	},
};

const INDEX = "index.html";

const isInside = (root: string, target: string): boolean =>
	target === root || target.startsWith(`${root}${sep}`);

const readable = async (
	bun: typeof Bun,
	path: string,
): Promise<Bun.BunFile | undefined> => {
	const file = bun.file(path);
	return (await file.exists()) ? file : undefined;
};

/**
 * Build the static file handler serving `root`.
 *
 * Requests resolve to a file, to the `index.html` of a directory, and finally
 * fall back to the root `index.html` so client side routes keep working.
 *
 * @param bun - Bun runtime namespace
 * @param root - absolute path of the served directory
 * @returns a fetch handler for `Bun.serve`
 */
const createHandler =
	(bun: typeof Bun, root: string) =>
	async (request: Request): Promise<Response> => {
		const pathname = decodeURIComponent(new URL(request.url).pathname);
		const target = resolve(root, `.${pathname}`);
		if (!isInside(root, target)) {
			return new Response("Forbidden", { status: 403 });
		}

		const file =
			(await readable(bun, target)) ??
			(await readable(bun, join(target, INDEX))) ??
			(await readable(bun, join(root, INDEX)));

		if (file === undefined) return new Response("Not Found", { status: 404 });
		return new Response(file);
	};

export const preview: CommandFn = (program, Bun) => {
	program
		.command("preview")
		.description(text.desc)
		.argument("[directory]", text.directory.desc, text.directory.def)
		.option("-h, --hostname <hostname>", text.hostname.desc, text.hostname.def)
		.option("-p, --port <number>", text.port.desc, text.port.def)
		.option("-P, --next-port", text.nextPort.desc, text.nextPort.def)
		.action((directory, options) => {
			const port = parsePort(options.port);
			if (port === undefined) {
				error(`Invalid port number: ${options.port}`);
				return;
			}

			const root = resolve(process.cwd(), directory);
			const fetch = createHandler(Bun, root);

			listen(Bun, { port, nextPort: options.nextPort }, (current) => ({
				hostname: options.hostname,
				port: current,
				fetch,
			}));
		});
};
