import { error, info, log } from "node:console";
import { resolve } from "node:path";
import tailwind from "bun-plugin-tailwind";
import { Option } from "commander";
import { DEFAULT_ENTRY, listEntries, MODES, type Mode } from "./entries";
import type { CommandFn } from "./types";

const text = {
	desc: "Build the project",
	html: {
		desc: "Path to the HTML file (spa) or glob to the HTML files (mpa) to build",
	},
	mode: {
		desc: "Page layout of the website",
		def: "spa",
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
		.argument("[html]", text.html.desc)
		.addOption(
			new Option("-m, --mode <mode>", text.mode.desc)
				.choices([...MODES])
				.default(text.mode.def),
		)
		.option("-M, --no-minify", text.noMinify.desc, true)
		.option("-O, --out <directory>", text.outdir.desc, text.outdir.def)
		.action(async (html, options) => {
			const cwd = process.cwd();
			const mode = options.mode as Mode;
			const pattern: string = html ?? DEFAULT_ENTRY[mode];

			const entries = listEntries(Bun, mode, pattern, cwd);
			if (entries.length === 0) {
				error(`No HTML entry found for ${pattern}`);
				return;
			}

			const plugins = [tailwind];

			const output = await Bun.build({
				entrypoints: entries.map((entry) => entry.path),
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
