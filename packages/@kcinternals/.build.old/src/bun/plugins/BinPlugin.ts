import type { CustomPackage } from "../../package"

import { BaseBuildPlugin } from "./base"

export class BinPlugin extends BaseBuildPlugin<"bin"> {
	public readonly type = "bin"
	async build(pkg: CustomPackage<"bin">): Promise<void> {
		const { target } = this.context.getBuildConfig(pkg)
		await this.context.bunBuild(pkg, {
			action: "build bin package",
			format: "iife",
			target: target,
			sourcemap: "external",
			naming: "[dir]/[name].js",
			banner: `#!/usr/bin/env ${target}`,
			packages: "external",
			production: true,
		})
	}
}
