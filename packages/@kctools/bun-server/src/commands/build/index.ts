import { resolve } from "node:path";
import type { BuildConfig } from "bun";
import type { Command } from "commander";
import { DEFAULT_OUTPUT } from "#constants";
import type { CommandFn } from "#types";
import { defineCommand } from "#utils/command";
import { createLogger } from "#utils/logger";
import { cwdOption, readOptions } from "#utils/options";
import { readPlugins } from "#utils/plugin";
import { reportArtifacts, reportSummary } from "#utils/report";
import { parseRouteFiles } from "#utils/routeFiles";
import {
	copyStaticFiles,
	parseStaticFiles,
	staticOption,
} from "#utils/staticFiles";

const logger = createLogger("commands/build");

const define = (command: Command) => {
	return command
		.argument("[input...]", "Path to html file or directory contains html")
		.addOption(staticOption)
		.addOption(cwdOption)
		.option("-M, --minify", "Enable minification", true)
		.option("-N, --no-minify", "Disable minification")
		.option(
			"-O, --out <directory>",
			"Specify the output directory",
			DEFAULT_OUTPUT,
		);
};

const build: CommandFn = defineCommand(
	"build",
	"Build the project using Bun.build()",
	(command, Bun) => {
		define(command).action(async (inputs, options) => {
			const cwd = readOptions<string>(options, "cwd");
			const out = resolve(cwd, readOptions<string>(options, "out"));
			logger.debug({ inputs, options }, "building the project");

			const routeFiles = await parseRouteFiles(Bun, inputs, options);
			if (routeFiles.length === 0) {
				logger.warn("No route files found. Nothing to build.");
				return;
			}

			const staticFiles = await parseStaticFiles(Bun, options);

			const plugins = await readPlugins(Bun, options);

			const started = performance.now();
			const buildConfig: BuildConfig = {
				entrypoints: routeFiles.map((route) => route.path),
				target: "browser",
				format: "esm",
				outdir: out,
				minify: readOptions<boolean>(options, "minify"),
				splitting: true,
				sourcemap: "linked",
				metafile: true,
				env: "BUN_PUBLIC_*",
				plugins,
			};
			logger.debug({ buildConfig }, "Build configuration prepared");
			const output = await Bun.build(buildConfig);
			if (!output.success) {
				logger.error("\nBuild failed!");
				return;
			}

			const bundled = new Set(output.outputs.map((artifact) => artifact.path));
			const overwritten = staticFiles
				.filter((file) => bundled.has(file.target))
				.map((file) => file.target);
			if (overwritten.length > 0) {
				logger.error(
					{ overwritten },
					`The following static files will overwrite build output`,
				);
				return;
			}

			const reportedFiles = await copyStaticFiles(Bun, staticFiles);
			const elapsed = performance.now() - started;

			const artifacts = [...output.outputs, ...reportedFiles];
			for (const message of reportArtifacts(cwd, artifacts)) {
				logger.info(message);
			}
			logger.info(reportSummary(elapsed, artifacts));
		});
	},
);

export default build;
