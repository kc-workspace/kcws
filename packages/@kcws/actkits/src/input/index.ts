/**
 * Input parsing utilities for GitHub Actions.
 *
 * This module provides type-safe input parsing with Zod schema validation,
 * supporting both environment variables and GitHub Actions inputs.
 *
 * @packageDocumentation
 */

/**
 * Re-export of Zod for convenient schema definition.
 * @see {@link https://zod.dev | Zod Documentation}
 */
export { z } from "zod";

export { parseInput } from "./parseInput";
export {
	zBoolean,
	zJsonFile,
	zJsonString,
	zNumber,
	zNumberArray,
	zStringArray,
	zYamlFile,
	zYamlString,
} from "./ztypes";
