import type {
	CustomPackage,
	CustomPackageBuildConfig,
	CustomPackageBuildType,
} from "../../package"

import { CONFIG_NAME } from "../../package/constants"
import { bunBuild } from "../apis/bunBuild"

export interface BuildPluginContext {
	getBuildConfig: <T extends CustomPackageBuildType>(
		pkg: CustomPackage<T>,
	) => CustomPackageBuildConfig<T>
	bunBuild: typeof bunBuild
}

export interface BuildPlugin<Type extends CustomPackageBuildType> {
	build(pkg: CustomPackage<Type>): Promise<void>
}

export abstract class BaseBuildPlugin<Type extends CustomPackageBuildType>
	implements BuildPlugin<Type>
{
	private static DEFAULT_CONTEXT: BuildPluginContext = {
		getBuildConfig: (pkg) => pkg[CONFIG_NAME],
		bunBuild: bunBuild,
	}

	public abstract readonly type: Type
	protected readonly context: BuildPluginContext

	constructor(context?: Partial<BuildPluginContext>) {
		this.context = {
			...BaseBuildPlugin.DEFAULT_CONTEXT,
			...context,
		}
	}

	abstract build(pkg: CustomPackage<Type>): Promise<void>
}
