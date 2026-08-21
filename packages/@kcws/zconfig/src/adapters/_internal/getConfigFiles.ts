/**
 * Returns an array of possible configuration file names based on the provided extension and optional name.
 * @param extension - The file extension (e.g., "json", "toml")
 * @param name - Optional name to include in the file names
 * @returns An array of possible configuration file names
 */
const getConfigFiles = (
	extensions: string[],
	name: string | undefined,
): string[] => {
	const files: string[] = [];

	if (name) {
		files.push(
			...extensions.map((ext) => `${name}.config.${ext}`),
			...extensions.map((ext) => `.${name}.config.${ext}`),
			...extensions.map((ext) => `.${name}/config.${ext}`),
			...extensions.map((ext) => `${name}/config.${ext}`),
			...extensions.map((ext) => `.config/${name}.${ext}`),
			...extensions.map((ext) => `config/${name}.${ext}`),
		);
	}
	files.push(
		...extensions.map((ext) => `config.${ext}`),
		...extensions.map((ext) => `.config.${ext}`),
	);

	return files;
};
export default getConfigFiles;
