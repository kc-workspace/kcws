import { resolve } from "node:path";
import { Option } from "commander";

export const cwdOption: Option = new Option(
	"-C, --cwd <directory>",
	"Specify the current working directory",
)
	.argParser((value: string) => resolve(value))
	.default(process.cwd());
