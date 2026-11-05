import type { CustomConfig, Intersection, UserConfig } from "./model"

import { defineBaseConfig } from "./defineBaseConfig"
import { mergeConfig } from "./mergeConfig"
import { normalizeConfig } from "./normalizeConfig"

export const defineConfig = <C extends UserConfig, CO extends (UserConfig | undefined)[] = C[]>(
	config?: C,
	...configs: CO
): UserConfig & CustomConfig<Intersection<C & CO[number]>> => {
	return normalizeConfig(mergeConfig(defineBaseConfig(config), ...configs))
}
