import type { RawConfig, TransformFn } from "#types";
import { setPath, walk } from "./utils";

/**
 * Applies an adapter's `transform` to every leaf of its parsed output.
 *
 * Shared by every adapter so key rewriting behaves identically whether the
 * source was a file or the environment. Returning `undefined` from the
 * transform drops that leaf; when two transformed leaves resolve to the same
 * path, the later one wins.
 *
 * @internal
 */
const applyTransform = (
	config: RawConfig,
	transform?: TransformFn,
): RawConfig => {
	if (transform === undefined) return config;

	const result: RawConfig = Object.create(null);
	walk(config, [], (input) => {
		const output = transform(input);
		if (output === undefined) return;

		setPath(result, output.key, output.value);
	});

	return result;
};

export default applyTransform;
