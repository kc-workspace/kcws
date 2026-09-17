import { Command } from "commander";
import { bin, description, name, version } from "#root/package.json";
import type { BunType, CommandFn } from "#types";
import { createLogger, type Logger } from "#utils/logger";

class Program {
	#root: Command;
	#bun: BunType;
	#logger: Logger;

	constructor(bun: BunType) {
		this.#bun = bun;
		this.#root = new Command()
			.name(Object.keys(bin).at(0) ?? name)
			.description(description)
			.version(version);
		this.#logger = createLogger("core/program");
	}

	/**
	 * Add a new command to the program
	 * @param fn The function that defines the command
	 * @returns The current instance of the program for chaining
	 */
	add(def: CommandFn): this {
		this.#logger.debug(`adding command: ${def.name}`);
		const cmd = this.#root.command(def.name).description(def.description);
		def.action(cmd, this.#bun);

		return this;
	}

	/**
	 * Parse the command-line arguments and execute the corresponding command.
	 * @param args The command-line arguments to parse
	 */
	parse(args: string[]): void {
		this.#root.parse(args, {
			from: "node",
		});
	}
}

export { Program };
