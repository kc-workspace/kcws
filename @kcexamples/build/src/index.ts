import { readFileSync } from "node:fs";
import pkg from "../package.json";

type P = Package;

export const getName = (name: string = pkg.name): string => {
	const file = readFileSync(name, { encoding: "utf8" });
	console.log(file);

	return name;
};
