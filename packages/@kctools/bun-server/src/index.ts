import type * as Bun from "bun";
import { Command } from "commander";
import { bin, description, name, version } from "../package.json";
import { build } from "./commands/build";
import { dev } from "./commands/dev";
import type { CommandFn } from "./commands/types";

export class Program {
	private readonly program: Command;
	private readonly Bun: typeof Bun;

	constructor(bun: typeof Bun) {
		this.Bun = bun;
		this.program = new Command()
			.name(Object.keys(bin).at(0) ?? name)
			.description(description)
			.version(version);
	}

	add(fn: CommandFn): this {
		fn(this.program, this.Bun);
		return this;
	}

	parse(args: string[]): void {
		this.program.parse(args, {
			from: "node",
		});
	}
}

const setup = (bun: typeof Bun): Program => {
	const program = new Program(bun);
	program.add(dev).add(build);
	return program;
};

export { setup };
