import { Option } from "commander";
import { DEFAULT_MODE, MODES } from "./entries";

const text = {
	mode: {
		flags: "-m, --mode <mode>",
		desc: "Page layout of the website",
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
