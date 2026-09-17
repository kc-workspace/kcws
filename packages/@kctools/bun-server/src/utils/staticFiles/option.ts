import { Option } from "commander";

const flag = "-s, --statics <source[:target]>";
const description = "Files copied as they are, repeatable";

export const staticOption: Option = new Option(flag, description)
	.argParser((value: string, previous: string[]) => [...previous, value])
	.default([]);
