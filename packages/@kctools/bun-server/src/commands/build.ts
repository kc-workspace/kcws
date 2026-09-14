import { error, info, log, warn } from "node:console";
import { resolve } from "node:path";
import type * as BunType from "bun";
import tailwind from "bun-plugin-tailwind";
import { DEFAULT_ENTRY, type Mode, resolveInput } from "../utils/entries";
import { modeOption } from "../utils/options";
import { formatArtifacts, formatMessage, formatSummary } from "../utils/report";
import type { CommandFn } from "./types";

const text = {
	desc: "Build the project",
	input: {
		desc: `Path to the HTML file (spa) or directory holding the HTML files (mpa) to build (default: "${DEFAULT_ENTRY.spa}" in spa, "${DEFAULT_ENTRY.mpa}" in mpa)`,
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

/** Send a bundler message to the console channel matching its level. */
const report = (message: BunType.BuildOutput["logs"][number]): void => {
	const line = formatMessage(message);
	if (message.level === "error") error(line);
	else if (message.level === "warning") warn(line);
	else log(line);
};

export const build: CommandFn = (program, Bun) => {
	program
		.command("build")
		.description(text.desc)
		.argument("[input]", text.input.desc)
		.addOption(modeOption())
		.option("-M, --no-minify", text.noMinify.desc, true)
		.option("-O, --out <directory>", text.outdir.desc, text.outdir.def)
		.action(async (input, options) => {
			const cwd = process.cwd();
			const resolved = resolveInput(Bun, options.mode as Mode, input, cwd);
			if (resolved === undefined) return;

			const plugins = [tailwind];

			const started = performance.now();
			const output = await Bun.build({
				entrypoints: resolved.entries.map((entry) => entry.path),
				target: "browser",
				outdir: resolve(cwd, options.out),
				root: resolved.root,
				minify: options.minify,
				sourcemap: "linked",
				plugins,
			});
			const elapsed = performance.now() - started;

			output.logs.forEach(report);

			if (!output.success) {
				error("\nBuild failed!");
				return;
			}

			log("\nBuild output:");
			for (const line of formatArtifacts(output.outputs, cwd)) log(line);

			info(`\n${formatSummary(output.outputs, elapsed)}`);
		});
};
