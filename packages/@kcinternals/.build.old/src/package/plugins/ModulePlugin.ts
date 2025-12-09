import type { CustomAnyPackage, CustomPackage } from "../types"

import { toAbsPath } from "../../utils/path"
import { CONFIG_NAME } from "../constants"
import { BasePackagePlugin } from "./base"

export class ModulePlugin extends BasePackagePlugin<"module"> {
	public readonly type = "module"

	async transform(
		pkg: CustomAnyPackage<"module">,
	): Promise<CustomPackage<"module">> {
		const { metadata, ...rest } = pkg
		const build = pkg[CONFIG_NAME]

		if (!build.outdir) build.outdir = toAbsPath("dist")
		else build.outdir = toAbsPath(build.outdir)

		if (build.entrypoints && Object.keys(build.entrypoints).length > 0) {
			build.entrypoints = Object.fromEntries(
				Object.entries(build.entrypoints).map(([key, value]) => {
					return [key, toAbsPath(value)]
				}),
			)
		} else {
			build.entrypoints = {
				[metadata.name]: toAbsPath("src", "index.ts"),
			}
		}

		return {
			...rest,
			metadata,
			[CONFIG_NAME]: build,
		}
	}

	async validate(pkg: CustomAnyPackage<"module">): Promise<void> {
		if (!pkg.name) this.context.error(`name field is required`)
		if (!pkg.version) this.context.error(`version field is required`)
		if (!pkg.main) this.context.error(`main field is required`)
		if (!pkg.types) this.context.error(`types field is required`)
		if (!pkg.exports) this.context.error(`exports field is required`)

		if (!pkg.author) this.context.warn("author field is recommended")
		if (!pkg.license) this.context.warn("license field is recommended")
		if (!pkg.repository) this.context.warn("repository field is recommended")
		if (!pkg.homepage) this.context.warn("homepage field is recommended")
	}
}
