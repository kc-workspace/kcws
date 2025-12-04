import type { CustomPackage } from "../../package"

import { BaseBuildPlugin } from "./base"

export class ModulePlugin extends BaseBuildPlugin<"module"> {
	public readonly type = "module"
	async build(pkg: CustomPackage<"module">): Promise<void> {
		Promise.all([
			this.context.bunBuild(pkg, {
				action: "build module package (ESM)",
				production: true,
				dts: true,
				format: "esm",
				naming: "[dir]/[name].js",
			}),
			this.context.bunBuild(pkg, {
				action: "build module package (CJS)",
				production: true,
				format: "cjs",
				naming: "[dir]/[name].cjs",
			}),
		])
	}
}
