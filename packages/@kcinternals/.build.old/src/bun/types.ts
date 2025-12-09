import type { CustomPackageBuildType } from "../package"
import type { BuildPlugin } from "./plugins/base"

export type BuildPlugins = {
	[K in CustomPackageBuildType]: BuildPlugin<K>
}
