import type { DtsOptions, WithEnabled } from "tsdown";

export const defineDts = (
	dts: WithEnabled<DtsOptions>,
): WithUndefined<DtsOptions> => {
	if (dts === false) {
		return undefined;
	}

	const defaultDts = {
		sourcemap: true,
	} satisfies DtsOptions;

	if (typeof dts === "object") {
		return {
			...defaultDts,
			...dts,
		};
	}

	return defaultDts;
};
