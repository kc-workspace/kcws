export type * from "./types"
/**
 * Alias of {@link CommitlintConfig}, kept for backward compatibility.
 */
export type {CommitlintConfig as UserConfig} from "./types"

export {RuleConfigSeverity as Severity} from "@commitlint/types"

export {default as defineConfig} from "./utils/defineConfig"
