import type { Package, PackageBuildType } from "./pkg.types"

import { path, relative } from "./path"
import {
	DEFAULT_AUTHOR_EMAIL,
	DEFAULT_AUTHOR_NAME,
	DEFAULT_AUTHOR_URL,
	DEFAULT_BRANCH,
	DEFAULT_BUN_VERSION,
	DEFAULT_GIT_REPO,
	DEFAULT_LICENSE,
	DEFAULT_NODE_VERSION,
	DEFAULT_PUBLISH_CONFIG,
} from "./pkg.constants"

const toPkgType = (type: PackageBuildType) => {
	switch (type) {
		case "module":
			return "module"
		case "commonjs":
			return "commonjs"
		default:
			return undefined
	}
}

const toRepository = () => {
	const relativePath = relative(path("."))
	return {
		type: "git",
		directory: relativePath,
		url: DEFAULT_GIT_REPO,
	}
}

const toLicense = () => {
	return DEFAULT_LICENSE
}

const toHomepage = () => {
	const baseURL = DEFAULT_GIT_REPO.replace(/\.git$/, "")
	const relativePath = relative(path("."))
	return `${baseURL}/tree/${DEFAULT_BRANCH}/${relativePath}`
}

const toPublishConfig = () => {
	return {
		access: DEFAULT_PUBLISH_CONFIG,
	}
}

const toAuthor = () => {
	return {
		name: DEFAULT_AUTHOR_NAME,
		email: DEFAULT_AUTHOR_EMAIL,
		url: DEFAULT_AUTHOR_URL,
	}
}

const toEngines = () => {
	return {
		node: DEFAULT_NODE_VERSION,
		bun: DEFAULT_BUN_VERSION,
	}
}

export const loadPkg = async () => {
	const pkgPath = path("package.json")
	const pkg: Package = await Bun.file(pkgPath).json()
	if (!pkg.build) {
		const msg = `Package ${pkg.name} is missing build field in package.json`
		throw new Error(msg)
	}
	if (!pkg.build.type) {
		const msg = `Package ${pkg.name} is missing build.type field in package.json`
		throw new Error(msg)
	}

	const build = pkg.build
	if (build.type === "commonjs") {
		if ((build.entrypoints?.length ?? 0) <= 0) {
			build.entrypoints = ["./src/index.ts"]
		}
	}
	if (build.type === "module") {
		if ((build.entrypoints?.length ?? 0) <= 0) {
			build.entrypoints = ["./src/index.ts"]
		}
	}
	if (build.type === "css") {
		if ((build.entrypoints?.length ?? 0) <= 0) {
			build.entrypoints = ["./src/index.css"]
		}
	}
	if (build.type === "html") {
		if ((build.entrypoints?.length ?? 0) <= 0) {
			build.entrypoints = ["./src/index.html"]
		}
	}

	if (build.outdir === undefined) {
		build.outdir = "dist"
	}

	pkg.build = build
	return pkg
}

export const buildPkg = async (pkg: Package): Promise<string> => {
	const { name, version } = pkg
	const out = {
		name,
		version,
		type: toPkgType(pkg.build.type),

		main: "unknown",
		exports: {
			".": "./index.js",
			default: "./index.js",
			import: "./index.js",
			require: "./index.cjs",
			node: "./index.js",
			browser: "./index.js",
			bun: "./index.js",
		},

		license: pkg.license ?? toLicense(),
		homepage: toHomepage(),
		repository: toRepository(),
		publishConfig: pkg.publishConfig ?? toPublishConfig(),
		author: pkg.author ?? toAuthor(),
		keywords: pkg.keywords,
		files: pkg.files,

		dependencies: pkg.dependencies,
		devDependencies: pkg.devDependencies,
		peerDependencies: pkg.peerDependencies,
		engines: pkg.engines ?? toEngines(),
	}

	return JSON.stringify(out, null, 2)
}

export const updatePkg = async (pkg: Package) => {
	const content = await buildPkg(pkg)
	const pkgPath = path("dist", "package.json")
	await Bun.write(pkgPath, content, {
		createPath: true,
		mode: 0o644, // rw-r--r--
	})
}
