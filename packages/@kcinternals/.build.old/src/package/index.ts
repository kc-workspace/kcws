import type { CustomPackage } from "./types"

import { getPackagePlugin, readPackage } from "./utils"

export const loadPackage = async (): Promise<CustomPackage> => {
	const raw = await readPackage()
	const plugin = getPackagePlugin(raw)

	const pkg = await plugin.transform(raw)
	await plugin.validate(pkg)

	return pkg
}

export type * from "./types"
