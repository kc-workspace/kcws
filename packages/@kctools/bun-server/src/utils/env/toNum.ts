import type { ConvertEnv } from "./types";

const toNum: ConvertEnv<number> = (v) => {
	if (v === undefined) return undefined;
	const n = Number(v);
	return Number.isNaN(n) ? undefined : n;
};
export default toNum;
