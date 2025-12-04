import type { CustomPackage } from "../../package"
import { type BunPlugin, build, type NormalBuildConfig } from "bun"

import { isolatedDeclaration } from "oxc-transform"

import { CONFIG_NAME } from "../../package/constants"
import { info, warn } from "../../utils/log"
import { toAbsPath } from "../../utils/path"

export interface BunBuildParams
	extends Omit<
		Partial<NormalBuildConfig>,
		| "root"
		| "minify"
		| "splitting"
		| "plugins"
		| "footer"
		| "throw"
		| "tsconfig"
	> {
	/** For logging only */
	action: string
	production?: boolean
	dts?: boolean
}

export const dtsPlugin = (): BunPlugin => {
	const name = "oxc-dts-plugin"
	const wroteTrack = new Set<string>()

	return {
		name,
		setup(builder) {
			const { root, outdir } = builder.config

			// biome-ignore lint/style/noNonNullAssertion: root is always set on bunBuild()
			const rootPath = toAbsPath(root!)
			// biome-ignore lint/style/noNonNullAssertion: outdir is always set on bunBuild()
			const outPath = toAbsPath(outdir!)

			builder.onStart(() => wroteTrack.clear())
			builder.onLoad({ filter: /\.ts(x)?$/ }, async (args) => {
				if (args.path.startsWith(rootPath) && !wroteTrack.has(args.path)) {
					wroteTrack.add(args.path)
					const { code } = await isolatedDeclaration(
						args.path,
						await Bun.file(args.path).text(),
					)
					await Bun.write(
						args.path
							.replace(new RegExp(`^${rootPath}`), outPath)
							.replace(/\.ts$/, ".d.ts"),
						code,
					)
				}

				return undefined
			})
		},
	}
}

export const bunBuild = async (
	pkg: CustomPackage,
	{
		action,
		entrypoints,
		outdir,
		production,
		dts,
		format,
		sourcemap,
		packages,
		target,
		env,
		define,
		...params
	}: BunBuildParams,
) => {
	const plugins: BunPlugin[] = []
	if (dts) plugins.push(dtsPlugin())

	const buildConfig = pkg[CONFIG_NAME]
	const environment = production ? "production" : "development"

	const output = await build({
		entrypoints: entrypoints ?? Object.values(buildConfig.entrypoints),
		outdir: outdir ?? buildConfig.outdir ?? "dist",
		format: format ?? "esm",
		sourcemap: sourcemap ?? "linked",
		packages: packages ?? "external",
		target: target ?? "node",
		env: env ?? "PUBLIC_*",
		define: Object.assign(
			{
				"CONSTANTS.ENVIRONMENT": environment,
				"CONSTANTS.VERSION": JSON.stringify(pkg.version ?? "0.0.0"),
				"CONSTANTS.BUILD_TIME": JSON.stringify(new Date().toISOString()),
			},
			define,
		),

		...params,

		root: "src",
		minify: production,
		splitting: production,
		footer: "// made with ♥  by bun",
		throw: true,
		plugins,
	})

	if (!output.success) warn(output.logs)
	else info(`${pkg.name}: ${action}`)
}
