import type { PackagePlugin } from "./plugins/base"

interface BaseBuildConfig<Type extends string> {
	type: Type
	/** @default {[name]: ./src/index.[ext]} */
	entrypoints: Record<string, string>
	/** @default dist */
	outdir: string
}

interface ModuleBuildConfig extends BaseBuildConfig<"module"> {}

interface CommonJSBuildConfig extends BaseBuildConfig<"commonjs"> {}

interface BinBuildConfig extends BaseBuildConfig<"bin"> {
	/** @default bun */
	target: "node" | "bun"
}

type BuildConfigMap = {
	module: ModuleBuildConfig
	commonjs: CommonJSBuildConfig
	bin: BinBuildConfig
}

export type CustomPackageBuildType = keyof BuildConfigMap
export type CustomPackageBuildConfig<
	Type extends CustomPackageBuildType = CustomPackageBuildType,
> = BuildConfigMap[Type]

interface CustomPackageMetadata {
	/** Name without scope (e.g. @example/hello => hello, world => world) */
	name: string
	/** Absolute path to the package directory */
	path: string
}

type CustomPackageBase<PKG, Type extends CustomPackageBuildType> = PKG & {
	metadata: CustomPackageMetadata
	["@kcinternals/bun-build"]: CustomPackageBuildConfig<Type>
}

export type CustomAnyPackage<
	Type extends CustomPackageBuildType = CustomPackageBuildType,
> = CustomPackageBase<AnyPackage, Type>
export type CustomPackage<
	Type extends CustomPackageBuildType = CustomPackageBuildType,
> = CustomPackageBase<Package, Type>

export type PackagePlugins = {
	[K in CustomPackageBuildType]: PackagePlugin<K>
}
