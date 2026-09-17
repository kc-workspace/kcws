import type * as Bun from "bun";
import type { Command } from "commander";

/** Represents the type of the Bun module */
export type BunType = typeof Bun;

export type CommandAction = (command: Command, Bun: BunType) => void;
export interface CommandFn {
	name: string;
	description: string;
	action: CommandAction;
}
