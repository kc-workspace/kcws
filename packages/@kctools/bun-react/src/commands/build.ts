import { error, info, log } from "node:console";
import { resolve } from "node:path";
import tailwind from "bun-plugin-tailwind";
import type { CommandFn } from "./types";

const text = {
	desc: "Build the project",
	html: {
		desc: "Path to the HTML file to serve",
		def: "./public/index.html",
	},
	noMinify: {
		desc: "Disable minification",
		def: false,
	},
	outdir: {
		desc: "Output directory",
		def: "dist",
	},
};

export const build: CommandFn = (program, Bun) => {
	program
		.command("build")
		.description(text.desc)
		.argument("[html]", text.html.desc, text.html.def)
		.option("-M, --no-minify", text.noMinify.desc, true)
		.option("-O, --out <directory>", text.outdir.desc, text.outdir.def)
		.action(async (html, options) => {
			const cwd = process.cwd();
			const plugins = [tailwind];

			const output = await Bun.build({
				entrypoints: [resolve(cwd, html)],
				target: "browser",
				outdir: resolve(cwd, options.out),
				minify: options.minify,
				sourcemap: "linked",
				plugins,
			});

			log("Build output:");
			output.logs.forEach((l) => {
				log(`${l.level}: ${l.name} - ${l.message}`);
			});

			log();
			if (output.success) {
				info("\nBuild succeeded");
			} else {
				error("\nBuild failed!");
			}
		});
};
