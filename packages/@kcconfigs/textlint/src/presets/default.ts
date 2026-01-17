import type { Preset } from "../models";
import { type TerminologyRule, terminology } from "../rules/terminology";
import { definePreset } from "../utils/definePreset";

const name = "@kcconfigs/textlint/preset-default";

type DefaultPreset = Preset<typeof name, [TerminologyRule]>;

const config: DefaultPreset = definePreset(name, terminology());

export default config;
