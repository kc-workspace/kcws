import type { Adapter } from "#types";
import { importSync } from "#utils/imports";
import { fileAdapter, getConfigFiles, getExtendOptions } from "../file";
import type { Json5AdapterOptions, Json5ParserModule } from "./types";

const json5Adapter = (options: Json5AdapterOptions = {}): Adapter =>
	fileAdapter({
		name: "json5",
		files: getConfigFiles(["json5"], options.name),
		parseSync: (content) =>
			importSync<Json5ParserModule>("json5", "json5").parse(content),
		...getExtendOptions(options),
	});

export default json5Adapter;
