import pkg from "../package.json";

export const getName = (name: string = pkg.name): string => {
	return name;
};
