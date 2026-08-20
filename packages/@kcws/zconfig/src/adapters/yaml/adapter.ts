import type { Adapter } from "#types";
import { importSync } from "#utils/imports";
import { fileAdapter, getConfigFiles, getExtendOptions } from "../file";
import type { YamlAdapterOptions, YamlParserModule } from "./types";

const yamlAdapter = (options: YamlAdapterOptions = {}): Adapter =>
	fileAdapter({
		name: "yaml",
		files: getConfigFiles(["yml", "yaml"], options.name),
		parseSync: (content) =>
			importSync<YamlParserModule>("yaml", "yaml").parse(content),
		...getExtendOptions(options),
	});

export default yamlAdapter;
