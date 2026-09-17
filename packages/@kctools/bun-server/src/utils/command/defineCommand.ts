import type { CommandAction, CommandFn } from "#types";

const defineCommand = (
	name: string,
	description: string,
	action: CommandAction,
): CommandFn => {
	return {
		name,
		description,
		action,
	};
};

export default defineCommand;
