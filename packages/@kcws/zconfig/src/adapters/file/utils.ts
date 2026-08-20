import { existsSync, readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { cwd } from "node:process";
import type { RawConfig } from "#types";
import { ZconfigAdapterError } from "#utils/errors";
import type {
	ExtendFileAdapterOptions,
	FileAdapterNormalizedOptions,
	FileAdapterOptions,
} from "./types";

/**
 * Normalizes the options for the file adapter, providing default values for missing options.
 *
 * @param options - the options to normalize
 * @returns the normalized options
 */
export const normalizeOptions = (
	options: FileAdapterOptions,
): FileAdapterNormalizedOptions => ({
	name: options.name,
	files: options.files,
	path: options.path,
	directories: options.directories ?? getConfigDirectories(),
	optional: options.optional ?? false,
	transform: options.transform,
	parseSync: options.parseSync,
	parse: options.parse ?? toParse(options.parseSync),
});

export const readConfig = async (
	path: string | undefined,
	parse: FileAdapterNormalizedOptions["parse"],
): Promise<RawConfig> => {
	if (!path) return {};
	const content = await readFile(path, { encoding: "utf-8" });
	return parse(content, path);
};

export const readConfigSync = (
	path: string | undefined,
	parseSync: FileAdapterNormalizedOptions["parseSync"],
): RawConfig => {
	if (!path) return {};
	const content = readFileSync(path, { encoding: "utf-8" });
	return parseSync(content, path);
};

/**
 * Finds the first existing configuration file based on the provided options.
 * @param options - normalized options
 * @returns The absolute path of the first found config
 */
export const findConfig = ({
	name,
	directories,
	files,
	path,
	optional,
}: FileAdapterNormalizedOptions): string | undefined => {
	if (path !== undefined) {
		const resolvedPath = resolve(cwd(), path);
		if (existsSync(resolvedPath)) return resolvedPath;
		if (optional) return undefined;
		throw missingFileError(name, [resolvedPath]);
	}

	const possiblePaths: string[] = [];
	for (const base of directories) {
		for (const file of files) {
			const path = resolve(base, file);
			possiblePaths.push(path);
			if (existsSync(path)) return path;
		}
	}

	if (!optional) throw missingFileError(name, possiblePaths);
	else return undefined;
};

/**
 * Returns an array of possible configuration file names based on the provided extension and optional name.
 * @param extension - The file extension (e.g., "json", "toml")
 * @param name - Optional name to include in the file names
 * @returns An array of possible configuration file names
 */
export const getConfigFiles = (
	extensions: string[],
	name: string | undefined,
): string[] => {
	const files: string[] = [
		...extensions.map((ext) => `config.${ext}`),
		...extensions.map((ext) => `.config.${ext}`),
	];

	if (name) {
		files.push(
			...extensions.map((ext) => `${name}.${ext}`),
			...extensions.map((ext) => `.${name}.${ext}`),
			...extensions.map((ext) => `${name}/config.${ext}`),
			...extensions.map((ext) => `.${name}/config.${ext}`),
			...extensions.map((ext) => `config/${name}.${ext}`),
			...extensions.map((ext) => `.config/${name}.${ext}`),
		);
	}

	return files;
};

/**
 * Returns the default directories to search for configuration files.
 * @returns An array of default directories
 */
export const getConfigDirectories = (): string[] => {
	return [cwd()];
};

export const getExtendOptions = (
	options: ExtendFileAdapterOptions,
): ExtendFileAdapterOptions => {
	const output = Object.assign({}, options);
	if (output.name) delete output.name;
	return output;
};

const missingFileError = (name: string, paths: string[]) =>
	new ZconfigAdapterError(name, `file not found: ${paths.join(", ")}`);

const toParse = (
	parseSync: FileAdapterOptions["parseSync"],
): NonNullable<FileAdapterOptions["parse"]> => {
	return (content, file) => Promise.resolve(parseSync(content, file));
};
