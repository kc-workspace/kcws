import { copyFiles, ensureDir } from "./build/path"
import { loadPkg, updatePkg } from "./build/pkg"

// const dtsPlugin = (): BunPlugin => {
// 	const name = "oxc-dts-plugin"
// 	const wroteTrack = new Set<string>()
// 	return {
// 		name,
// 		setup(builder) {
// 			const { root, outdir } = builder.config

// 			const rootPath = path(root ?? ".")
// 			const outPath = path(outdir ?? "dist")

// 			builder.onStart(() => wroteTrack.clear())
// 			builder.onLoad({ filter: /\.ts$/ }, async (args) => {
// 				if (args.path.startsWith(rootPath) && !wroteTrack.has(args.path)) {
// 					wroteTrack.add(args.path)
// 					const { code } = await isolatedDeclaration(
// 						args.path,
// 						await Bun.file(args.path).text(),
// 					)
// 					await Bun.write(
// 						args.path
// 							.replace(new RegExp(`^${rootPath}`), outPath)
// 							.replace(/\.ts$/, ".d.ts"),
// 						code,
// 					)
// 				}

// 				return undefined
// 			})
// 		},
// 	}
// }

// const buildPackage = async ({
// 	production,
// 	dts,
// 	target,
// 	format,
// }: BuildPackageParams) => {
// 	const entrypoints = await Promise.all(
// 		[
// 			path("src", "index.ts"),
// 			path("src", "index.css"),
// 			path("src", "index.html"),
// 		].map(async (p) => ((await Bun.file(p).exists()) ? p : undefined)),
// 	)

// 	const plugins: BunPlugin[] = []
// 	if (dts) plugins.push(dtsPlugin())

// 	await build({
// 		root: "src",
// 		entrypoints: entrypoints.filter((p) => p !== undefined),
// 		format: format ?? "esm",
// 		sourcemap: "linked",
// 		packages: "external",
// 		target: target ?? "node",
// 		outdir: "dist",
// 		env: "PUBLIC_*",
// 		minify: production,
// 		splitting: production,
// 		plugins,
// 		naming: {
// 			chunk: production ? "[dir]/[name]-[hash].[ext]" : "",
// 			asset: production ? "[dir]/[name]-[hash].[ext]" : "",
// 			entry: production ? "[dir]/[name].[ext]" : "",
// 		},
// 	})
// }

async function main() {
	const pkg = await loadPkg()
	await ensureDir(pkg.build.outdir)

	console.log(pkg.name, pkg.build)

	await Promise.all([
		copyFiles(pkg.build, [
			"LICENSE",
			"README.md",
			"CHANGELOG.md",
			"CHANGELOG.json",
		]),
		updatePkg(pkg),
	])
}

void main()
