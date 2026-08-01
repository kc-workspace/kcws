import type { UserConfig, WithEnabled } from "tsdown";

export type TsdownConfig = UserConfig;

export type EnableOption<T> = Exclude<
	WithEnabled<T>,
	undefined | null | boolean | string
>;
