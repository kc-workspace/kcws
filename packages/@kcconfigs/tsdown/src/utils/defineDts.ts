import type { DtsOptions, WithEnabled } from "tsdown";

export const defineDts = (
	dts: WithEnabled<DtsOptions>,
): WithUndefined<DtsOptions> => {
	if (dts === false) {
		return undefined;
	}

	const defaultDts = {
		sourcemap: true,
		resolve: false,
	} satisfies DtsOptions;

	if (typeof dts === "object") {
		delete dts.resolve;
		return {
			...defaultDts,
			...dts,
		};
	}

	return defaultDts;
};
