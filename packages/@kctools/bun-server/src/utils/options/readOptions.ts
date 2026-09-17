const readOptions = <T>(options: AnyRecord, key: string): T => {
	return options[key] as T;
};

export default readOptions;
