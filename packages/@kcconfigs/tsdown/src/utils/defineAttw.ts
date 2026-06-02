import type { AttwOptions, WithEnabled } from "tsdown";
import type { MinimalFormatObject } from "./defineFormat";

export const defineAttw = (
	format: WithUndefined<MinimalFormatObject>,
): WithEnabled<AttwOptions> => {
	// We don't build package for node older than 10
	// https://github.com/arethetypeswrong/arethetypeswrong.github.io/blob/main/docs/problems/NoResolution.md#true-positive-node-10-doesnt-support-packagejson-exports
	let profile: NonNullable<AttwOptions["profile"]> = "node16";

	// check if the format is only esm, then we will use esm-only profile instead
	const keys = Object.keys(format ?? {}) as (keyof MinimalFormatObject)[];
	if (keys.length === 1 && keys.includes("esm")) profile = "esm-only";

	return {
		enabled: true,
		level: "error",
		profile,
	};
};
