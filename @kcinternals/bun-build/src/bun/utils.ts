import type { CustomPackage, CustomPackageBuildType } from "../package"

import { CONFIG_NAME } from "../package/constants"
import { PLUGINS } from "./constants"

export const getBuildPlugin = <T extends CustomPackageBuildType>(
	pkg: CustomPackage<T>,
) => {
	return PLUGINS[pkg[CONFIG_NAME].type as T]
}
