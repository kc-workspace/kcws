import type { CustomAnyPackage, CustomPackage } from "../types"

import { toAbsPath } from "../../utils/path"
import { CONFIG_NAME } from "../constants"
import { BasePackagePlugin } from "./base"

export class BinPlugin extends BasePackagePlugin<"bin"> {
	public readonly type = "bin"

	async transform(pkg: CustomAnyPackage<"bin">): Promise<CustomPackage<"bin">> {
		const { metadata, ...rest } = pkg
		const build = pkg[CONFIG_NAME]

		if (!build.target) build.target = "bun"

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

	async validate(pkg: CustomAnyPackage<"bin">): Promise<void> {
		if (!pkg.name) this.context.error(`name field is required`)
		if (!pkg.version) this.context.error(`version field is required`)
		if (!pkg.bin) this.context.error(`bin field is required`)

		if (!pkg.author) this.context.warn("author field is recommended")
		if (!pkg.license) this.context.warn("license field is recommended")
		if (!pkg.repository) this.context.warn("repository field is recommended")
		if (!pkg.homepage) this.context.warn("homepage field is recommended")
		if (!pkg.files) this.context.warn("files field is recommended")
		if (!pkg.engines) this.context.warn("engines field is recommended")
	}
}
