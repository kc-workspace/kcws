import { error } from "node:console";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import type * as Bun from "bun";
import { listen, parsePort } from "../utils/serve";
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
		def: "4000",
	},
	nextPort: {
		desc: "Automatically find the next available port if the specified one is in use",
		def: false,
	},
};

const INDEX = "index.html";

// lexical containment only: it stops `../` traversal, it is not a sandbox, so a
// symlink inside the served directory pointing outside is still followed
const isInside = (root: string, target: string): boolean => {
	const path = relative(root, target);
	return path === "" || (!path.startsWith("..") && !isAbsolute(path));
};

/**
 * Decode a request pathname, rejecting what cannot become a file path.
 *
 * @param url - the requested URL
 * @returns the decoded pathname, or `undefined` when it is unusable
 */
const decodePath = (url: string): string | undefined => {
	try {
		const pathname = decodeURIComponent(new URL(url).pathname);
		return pathname.includes("\0") ? undefined : pathname;
	} catch {
		// malformed percent encoding
		return undefined;
	}
};

/** Every directory from `target` up to `root`, closest first. */
const parents = (root: string, target: string): string[] => {
	const directories: string[] = [];
	let current = target;
	while (isInside(root, current)) {
		directories.push(current);
		const parent = dirname(current);
		if (parent === current) break;
		current = parent;
	}
	return directories;
};

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
 * Requests resolve to the file itself, then to the document the same path with
 * an `.html` extension names, then to the `index.html` of the closest parent
 * directory down to the root. The middle step mirrors `mpa`, where `about.html`
 * and `about/index.html` both serve `/about`; the last one keeps client side
 * routes working.
 *
 * @param bun - Bun runtime namespace
 * @param root - absolute path of the served directory
 * @returns a fetch handler for `Bun.serve`
 */
const createHandler =
	(bun: typeof Bun, root: string) =>
	async (request: Request): Promise<Response> => {
		const pathname = decodePath(request.url);
		if (pathname === undefined) {
			return new Response("Bad Request", { status: 400 });
		}

		const target = resolve(root, `.${pathname}`);
		if (!isInside(root, target)) {
			return new Response("Forbidden", { status: 403 });
		}

		let file =
			(await readable(bun, target)) ??
			(await readable(bun, join(target, INDEX))) ??
			(await readable(bun, `${target}.html`));

		for (const directory of parents(root, target)) {
			if (file !== undefined) break;
			file = await readable(bun, join(directory, INDEX));
		}

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
