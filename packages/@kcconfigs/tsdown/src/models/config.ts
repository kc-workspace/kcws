import type { Config } from "@kcconfigs/_builder";
import type { UserConfig, WithEnabled } from "tsdown";

export type TsdownConfig = Config<UserConfig>;

export type EnableOption<T> = Exclude<
	WithEnabled<T>,
	undefined | null | boolean | string
>;
