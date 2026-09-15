import { Option } from "commander";
import { DEFAULT_MODE, MODES } from "./entries";

const text = {
	mode: {
		flags: "-m, --mode <mode>",
		desc: "Page layout of the website",
	},
	statics: {
		flags: "-s, --statics <source[:target]>",
		desc: "Files copied as they are, repeatable; the target defaults to the directory the source is rooted at",
	},
};

/**
 * Build the `--mode` option shared by the commands that resolve HTML entries.
 *
 * @returns a commander option accepting only a known {@link MODES} value
 */
export const modeOption = (): Option =>
	new Option(text.mode.flags, text.mode.desc)
		.choices([...MODES])
		.default(DEFAULT_MODE);

/**
 * Build the `--statics` option shared by the commands that serve or write
 * files the bundler does not touch.
 *
 * The option is repeatable, so every occurrence is appended to the list
 * instead of replacing the one before it.
 *
 * @returns a commander option collecting every given specification
 */
export const staticsOption = (): Option =>
	new Option(text.statics.flags, text.statics.desc)
		.argParser((value: string, previous: string[]) => [...previous, value])
		.default([]);
