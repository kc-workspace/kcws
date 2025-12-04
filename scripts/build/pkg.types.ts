export interface PackageBuildBase {
	/**
	 * @default "dist"
	 */
	outdir: string
}

export interface PackageBuildModule extends PackageBuildBase {
	type: "module"
	/** @default ["./src/index.ts"] */
	entrypoints: `./${string}.ts`[]
}

export interface PackageBuildCommonJS extends PackageBuildBase {
	type: "commonjs"
	/** @default ["./src/index.ts"] */
	entrypoints: `./${string}.ts`[]
}

export interface PackageBuildCSS extends PackageBuildBase {
	type: "css"
	/** @default ["./src/index.css"] */
	entrypoints: `./${string}.css`[]
}

export interface PackageBuildHTML extends PackageBuildBase {
	type: "html"
	/** @default ["./src/index.html"] */
	entrypoints: `./${string}.html`[]
}

export interface PackageBuildBin extends PackageBuildBase {
	type: "bin"
	/** @default ["./bin/index.ts"] */
	entrypoints: `./bin/${string}.ts`[]
}

export interface PackageBuildTypes extends PackageBuildBase {
	type: "types"
	/** @default ["./types/index.d.ts"] */
	entrypoints: `./types/${string}.d.ts`[]
}

export type PackageBuild =
	| PackageBuildModule
	| PackageBuildCommonJS
	| PackageBuildCSS
	| PackageBuildHTML
	| PackageBuildBin
	| PackageBuildTypes
export type PackageBuildType = PackageBuild["type"]

export interface Package {
	name: string
	version: string
	build: PackageBuild

	publishConfig?: UnknownObject
	author?: UnknownObject
	license?: string
	files?: string[]
	keywords?: string[]
	dependencies?: string[]
	devDependencies?: string[]
	peerDependencies?: string[]

	engines?: Record<string, string>
}

export type UnknownObject = Record<string, unknown>
// biome-ignore lint/suspicious/noExplicitAny: This represents any package.json object
export type AnyPackage = Record<string, any>
