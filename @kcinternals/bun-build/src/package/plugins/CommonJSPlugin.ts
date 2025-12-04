import type { CustomAnyPackage, CustomPackage } from "../types"

import { BasePackagePlugin } from "./base"

export class CommonJSPlugin extends BasePackagePlugin<"commonjs"> {
	public readonly type = "commonjs"

	transform(
		pkg: CustomAnyPackage<"commonjs">,
	): Promise<CustomPackage<"commonjs">> {
		throw new Error("Method not implemented.")
	}

	validate(pkg: CustomAnyPackage<"commonjs">): Promise<void> {
		throw new Error("Method not implemented.")
	}
}
