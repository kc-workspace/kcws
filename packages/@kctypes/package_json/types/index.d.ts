declare global {
	/**
	 * The repository field on package.json file.
	 */
	interface PackageRepository {
		type: "git";
		url: string;
		directory?: string;
	}

	/**
	 * The bugs field on package.json file.
	 */
	interface PackageBugReport {
		email?: string;
		url?: string;
	}

	/**
	 * The author field on package.json file.
	 */
	interface PackageAuthor {
		name: string;
		email?: string;
		url?: string;
	}

	/**
	 * The publishConfig field on package.json file.
	 */
	interface PackagePublishConfig {
		access: "public" | "restricted";
	}

	/**
	 * Custom typedoc field on package.json file.
	 */
	interface TypedocConfig {
		entryPoint: string;
	}

	/**
	 * The package.json schema.
	 */
	interface Package {
		name: string;
		version: string;
		private?: boolean;
		description?: string;
		typedoc?: TypedocConfig;
		main?: string;
		bin?: string | Record<string, string>;
		types?: string;
		license?: string;
		homepage?: string;
		repository?: string | PackageRepository;
		bugs?: string | PackageBugReport;
		author?: string | PackageAuthor;
		publishConfig?: PackagePublishConfig;
		keywords?: string[];
		files?: string[];
		engines?: Record<string, string>;
		scripts?: Record<string, string>;
		dependencies?: Record<string, string>;
		devDependencies?: Record<string, string>;
		peerDependencies?: Record<string, string>;
		exports?: Record<string, string>;
	}

	// biome-ignore lint/suspicious/noExplicitAny: This represents any package.json object
	type AnyPackage = Package & Record<string, any>;
	type OptionalPackage = Partial<Package>;
	type ReadonlyPackage = Readonly<Package>;
	type OptionalReadonlyPackage = Readonly<OptionalPackage>;
}

/**
 * @internal
 */
declare const pkg: globalThis.Package;
export default pkg;
