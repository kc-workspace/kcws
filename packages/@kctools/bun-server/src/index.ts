import build from "#commands/build";
import dev from "#commands/dev";
import preview from "#commands/preview";
import { Program } from "#core/program";
import type { BunType } from "#types";

const setup = (bun: BunType): Program => {
	const program = new Program(bun);
	return program.add(dev).add(build).add(preview);
};

export { setup };
