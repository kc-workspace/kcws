import type { CustomPackage } from "../../package"

import { BaseBuildPlugin } from "./base"

export class CommonJSPlugin extends BaseBuildPlugin<"commonjs"> {
	public readonly type = "commonjs"
	async build(pkg: CustomPackage<"commonjs">): Promise<void> {
		throw new Error("Method not implemented.")
	}
}
