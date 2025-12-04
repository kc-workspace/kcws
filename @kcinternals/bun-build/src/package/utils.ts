import type { PackagePlugin } from "./plugins/base"
import type {
	CustomAnyPackage,
	CustomPackageBuildConfig,
	CustomPackageBuildType,
} from "./types"
import { basename, dirname } from "node:path"

import { toAbsPath } from "../utils/path"
import { CONFIG_NAME, PLUGIN_TYPES, PLUGINS } from "./constants"

const toMetadata = (pkgPath: string, pkg: AnyPackage) => {
	return {
		name: basename(pkg.name),
		path: dirname(pkgPath),
	}
}

const toBuildConfig = (pkg: AnyPackage): CustomPackageBuildConfig => {
	const build = pkg[CONFIG_NAME]
	if (!build || typeof build["type"] !== "string")
		throw new Error(`Missing "${CONFIG_NAME}" field in package.json`)
	if (!PLUGIN_TYPES.includes(build["type"]))
		throw new Error(
			`Invalid "${CONFIG_NAME}".type field (${PLUGIN_TYPES.join(", ")})`,
		)

	return build as CustomPackageBuildConfig
}

export const readPackage = async (): Promise<CustomAnyPackage> => {
	const pkgPath = toAbsPath("package.json")
	const pkg = await Bun.file(pkgPath).json()
	return {
		...pkg,
		metadata: toMetadata(pkgPath, pkg),
		[CONFIG_NAME]: toBuildConfig(pkg),
	}
}

export const getPackagePlugin = <T extends CustomPackageBuildType>(
	pkg: CustomAnyPackage<T>,
): PackagePlugin<T> => {
	return PLUGINS[pkg[CONFIG_NAME].type as T]
}
