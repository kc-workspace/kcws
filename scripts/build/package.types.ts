export interface BuildPackageParams {
	production?: true
	dts?: true
	target?: Bun.Target
	format?: Bun.BuildConfigBase["format"]
}
