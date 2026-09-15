import { error, info, log, warn } from "node:console";
import { resolve } from "node:path";
import type * as BunType from "bun";
import { DEFAULT_ENTRY } from "../utils/entries";
import { collectStatics, resolveCommandInput } from "../utils/input";
import { modeOption, staticsOption } from "../utils/options";
import { loadPlugins, pluginNames, reportPlugins } from "../utils/plugins";
import {
	formatArtifacts,
	formatMessage,
	formatSummary,
	type ReportedFile,
} from "../utils/report";
import { copyStatics, type StaticFile } from "../utils/statics";
import type { CommandFn } from "./types";

const text = {
	desc: "Build the project",
	input: {
		desc: `Path to the HTML file (spa) or directory holding the HTML files (mpa) to build (default: "${DEFAULT_ENTRY.spa}" in spa, "${DEFAULT_ENTRY.mpa}" in mpa)`,
	},
	minify: {
		desc: "Enable minification",
		def: true,
	},
	noMinify: {
		desc: "Disable minification",
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

/** Kind a copied file is reported under, next to the bundled ones. */
const STATIC_KIND = "static";

/**
 * Report the copied files the way the bundled ones are reported.
 *
 * @param bun - Bun runtime namespace
 * @param files - files that were copied
 * @param outdir - absolute path of the output directory
 * @returns one reportable file per copied file
 */
const reportedStatics = (
	bun: typeof BunType,
	files: StaticFile[],
	outdir: string,
): ReportedFile[] =>
	files.map((file) => ({
		path: resolve(outdir, file.to),
		size: bun.file(file.from).size,
		kind: STATIC_KIND,
	}));

export const build: CommandFn = (program, Bun) => {
	program
		.command("build")
		.description(text.desc)
		.argument("[input]", text.input.desc)
		.addOption(modeOption())
		.option("-M, --minify", text.minify.desc, text.minify.def)
		.option("-N, --no-minify", text.noMinify.desc)
		.option("-O, --out <directory>", text.outdir.desc, text.outdir.def)
		.addOption(staticsOption())
		.action(async (input, options) => {
			const cwd = process.cwd();
			const resolved = await resolveCommandInput(Bun, options, input, cwd);
			if (resolved === undefined) return;

			const names = await pluginNames(Bun, cwd);
			reportPlugins(names);
			const plugins = await loadPlugins(Bun, names, cwd);

			const outdir = resolve(cwd, options.out);
			const started = performance.now();
			const output = await Bun.build({
				entrypoints: resolved.entries.map((entry) => entry.path),
				target: "browser",
				outdir,
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

			const files = collectStatics(Bun, resolved);
			if (files === undefined) return;

			const bundled = new Set(output.outputs.map((artifact) => artifact.path));
			const overwritten = files
				.filter((file) => bundled.has(resolve(outdir, file.to)))
				.map((file) => file.to);
			if (overwritten.length > 0) {
				error(
					`Static files overwrite a bundled file: ${overwritten.join(", ")}`,
				);
				return;
			}

			await copyStatics(Bun, files, outdir);
			const written = [
				...output.outputs,
				...reportedStatics(Bun, files, outdir),
			];

			log("\nBuild output:");
			for (const line of formatArtifacts(written, cwd)) log(line);

			info(`\n${formatSummary(written, elapsed)}`);
		});
};
