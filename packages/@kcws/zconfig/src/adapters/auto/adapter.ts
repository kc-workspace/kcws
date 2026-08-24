import type { Adapter } from "#types";
import { importSync } from "#utils/imports";
import { fileAdapter } from "../file";
import type { JsonParserModule } from "../json/types";
import type { Json5ParserModule } from "../json5/types";
import type { TomlParserModule } from "../toml/types";
import type { YamlParserModule } from "../yaml/types";
import type { AutoAdapterOptions } from "./types";
import { getAutoFiles } from "./utils";

const autoAdapter = (options: AutoAdapterOptions = {}): Adapter =>
	fileAdapter({
		name: "auto",
		files: getAutoFiles(),
		parseSync: (content, path) => {
			if (path.endsWith(".yaml") || path.endsWith(".yml")) {
				return importSync<YamlParserModule>("yaml", "yaml").parse(content);
			} else if (path.endsWith(".json5")) {
				return importSync<Json5ParserModule>("json5", "json5").parse(content);
			} else if (path.endsWith(".jsonc")) {
				return importSync<JsonParserModule>("jsonc", "jsonc-parser").parse(
					content,
				);
			} else if (path.endsWith(".json")) {
				return JSON.parse(content);
			} else if (path.endsWith(".toml")) {
				return importSync<TomlParserModule>("toml", "smol-toml").parse(content);
			}
		},
		...options,
	});

export default autoAdapter;
