import type { Adapter } from "#types";
import { importSync } from "#utils/imports";
import { fileAdapter, getConfigFiles, getExtendOptions } from "../file";
import type { TomlAdapterOptions, TomlParserModule } from "./types";

const tomlAdapter = (options: TomlAdapterOptions = {}): Adapter =>
	fileAdapter({
		name: "toml",
		files: getConfigFiles(["toml"], options.name),
		parseSync: <T>(content: string): T =>
			importSync<TomlParserModule>("toml", "smol-toml").parse(content) as T,
		...getExtendOptions(options),
	});

export default tomlAdapter;
