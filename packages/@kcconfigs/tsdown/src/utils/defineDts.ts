import type { DtsOptions, WithEnabled } from "tsdown";

export const defineDts = (
	dts: WithEnabled<DtsOptions>,
): WithUndefined<DtsOptions> => {
	type Key = keyof DtsOptions;

	const blacklist: Key[] = ["resolve"];

	const _dts: DtsOptions = {
		sourcemap: true,
		resolve: false,
	};
	if (dts === false) {
		return undefined;
	}
	if (typeof dts === "object") {
		for (const [key, value] of Object.entries(dts)) {
			if (blacklist.includes(key as Key)) continue;
			_dts[key as Key] = value;
		}
	}

	return _dts;
};
