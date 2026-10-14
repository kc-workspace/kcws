import type { Adapter } from "#types";
import type { ContentFormat } from "../content";
import { toFileParserByPath } from "../content/utils";
import { fileAdapter } from "../file";
import type { AutoAdapterOptions } from "./types";
import { getAutoFiles } from "./utils";

const FORMATS: [string, Exclude<ContentFormat, "dotenv">][] = [
	[".yaml", "yaml"],
	[".yml", "yaml"],
	[".json5", "json5"],
	[".jsonc", "jsonc"],
	[".json", "json"],
	[".toml", "toml"],
];

const autoAdapter = (options: AutoAdapterOptions = {}): Adapter =>
	fileAdapter({
		name: "auto",
		files: getAutoFiles(),
		...toFileParserByPath("auto", (file) => {
			const format = FORMATS.find(([extension]) => file.endsWith(extension));
			if (format === undefined) {
				throw new Error(`unsupported file extension: ${file}`);
			}
			return { format: format[1] };
		}),
		...options,
	});

export default autoAdapter;
