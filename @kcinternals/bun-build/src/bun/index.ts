import type { CustomPackage, CustomPackageBuildType } from "../package"

import { getBuildPlugin } from "./utils"

export const build = async <T extends CustomPackageBuildType>(
	pkg: CustomPackage<T>,
) => {
	const plugin = getBuildPlugin(pkg)
	await plugin.build(pkg)
}
