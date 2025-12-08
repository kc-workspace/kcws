import type {
	CustomAnyPackage,
	CustomPackage,
	CustomPackageBuildType,
} from "../types"

import { error, info, warn } from "../../utils/log"

export interface PackagePluginContext {
	error: (msg: string) => never
	warn: (msg: string) => void
	info: (msg: string) => void
}

export interface PackagePlugin<Type extends CustomPackageBuildType> {
	validate(pkg: CustomPackage<Type>): Promise<void>
	transform(pkg: CustomAnyPackage<Type>): Promise<CustomPackage>
}

export abstract class BasePackagePlugin<Type extends CustomPackageBuildType>
	implements PackagePlugin<Type>
{
	private static DEFAULT_CONTEXT: PackagePluginContext = {
		error: (msg) => {
			throw new Error(msg)
		},
		warn: (msg) => {
			warn(msg)
		},
		info: (msg) => {
			info(msg)
		},
	}

	public abstract readonly type: Type
	protected readonly context: PackagePluginContext

	constructor(context?: Partial<PackagePluginContext>) {
		this.context = {
			...BasePackagePlugin.DEFAULT_CONTEXT,
			...context,
		}
	}

	abstract validate(pkg: CustomPackage<Type>): Promise<void>

	abstract transform(pkg: CustomAnyPackage<Type>): Promise<CustomPackage<Type>>
}
