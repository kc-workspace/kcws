import type * as Bun from "bun";
import type { Command } from "commander";

export type CommandFn = (program: Command, bun: typeof Bun) => void;
