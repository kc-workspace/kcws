/**
 * Encodes a camelCase key path into an env name.
 * @param key key path
 * @param prefix env prefix
 * @param sep separator used in the environment variable name
 * @returns encoded env name
 */
export const encodeEnvKey = (
	key: string[],
	prefix: string | undefined,
	sep: string,
): string => {
	const prefixVal = getPrefixVal(prefix);
	if (prefixVal === undefined) {
		return convertCamelToSnake(key.join(sep));
	} else {
		return `${prefixVal}${convertCamelToSnake(key.join(sep))}`;
	}
};

/**
 * Decodes an env name into a camelCase key path.
 * @param key env name
 * @param prefix env prefix
 * @param sep separator used in the environment variable name
 * @returns camelCase key path or undefined if the key does not match the prefix
 */
export const decodeEnvKey = (
	key: string,
	prefix: string | undefined,
	sep: string,
): string[] | undefined => {
	const prefixVal = getPrefixVal(prefix);
	const encoded =
		prefixVal === undefined
			? key
			: key.startsWith(prefixVal)
				? key.slice(prefixVal.length)
				: undefined;
	if (encoded === undefined) return undefined;

	const segments = encoded.split(sep);
	if (
		segments.some(
			(segment) =>
				segment.length === 0 ||
				segment.startsWith("_") ||
				segment.endsWith("_"),
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

const convertCamelToSnake = (str: string): string =>
	str.replace(/([A-Z])/g, "_$1").toUpperCase();

const convertSnakeToCamel = (str: string): string =>
	str.toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
