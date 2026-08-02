import type { BaseSetting } from "../models";
import { withEnabled } from "./enabled";

export const debug = (setting: BaseSetting, msg: string): void =>
	withEnabled(setting?.debug, console.debug.bind(console))?.(msg);

export const verbose = (setting: BaseSetting, msg: string): void =>
	withEnabled(setting?.verbose, console.debug.bind(console))?.(msg);
