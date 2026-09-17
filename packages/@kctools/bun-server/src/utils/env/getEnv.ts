import { env } from "node:process";
import type { ConvertEnv } from "./types";

const getEnv = <V>(key: string, to: ConvertEnv<V>): V | undefined => {
	return to(env[key]);
};

export default getEnv;
