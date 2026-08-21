const symbol = /[^a-zA-Z0-9_]/g;

/**
 * Encodes a camelCase key path into an env name.
 * @param keys key path
 * @param prefix env prefix
 * @param keySep separator used for nested keys
 * @returns encoded env name
 */
export const encodeEnvKey = (
	keys: string[],
	prefix: string | undefined,
	keySep: string,
): string => {
	const wSep = "_";
	if (keySep === wSep) throw new Error(`keySep cannot be "${wSep}"`);

	const prefixVal = getPrefixVal(prefix) ?? "";
	const prefixEnv = prefixVal.replace(symbol, wSep).toUpperCase();
	const keyEnv = keys
		.map((key) => {
			return key
				.replace(/^[0-9]+/g, "")
				.replace(/([A-Z])/g, `${wSep}$1`)
				.replace(symbol, wSep);
		})
		.join(keySep)
		.toUpperCase();

	return `${prefixEnv}${keyEnv}`;
};

/**
 * Decodes an env name into a camelCase key path.
 * @param key env name
 * @param prefix env prefix
 * @param sep separator used for nested keys
 * @returns camelCase key path or undefined if the key does not match the prefix
 */
export const decodeEnvKey = (
	key: string,
	prefix: string | undefined,
	keySep: string,
): string[] | undefined => {
	const wSep = "_";
	if (keySep === wSep) throw new Error(`keySep cannot be "${wSep}"`);

	const prefixVal = getPrefixVal(prefix);
	const encoded =
		prefixVal === undefined
			? key
			: key.startsWith(prefixVal)
				? key.slice(prefixVal.length)
				: undefined;
	if (encoded === undefined) return undefined;

	const segments = encoded.split(keySep);
	if (
		segments.some(
			(segment) =>
				segment.length === 0 ||
				segment.startsWith(wSep) ||
				segment.endsWith(wSep),
		)
	) {
		return undefined;
	}

	return segments.map(convertSnakeToCamel);
};

const getPrefixVal = (prefix: string | undefined): string | undefined => {
	if (prefix === undefined || prefix === "") return undefined;
	else if (prefix.endsWith("_")) return prefix;
	else return `${prefix}_`;
};

const convertSnakeToCamel = (str: string): string =>
	str.toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
