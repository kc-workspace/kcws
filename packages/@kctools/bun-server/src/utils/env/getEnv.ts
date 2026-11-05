import type { ConvertEnv } from "./types"

import { env } from "node:process"

const getEnv = <V>(key: string, to: ConvertEnv<V>): V | undefined => {
	return to(env[key])
}

export default getEnv
