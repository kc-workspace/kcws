import type { ConvertEnv } from "./types";

const toBool: ConvertEnv<boolean> = (v) => {
	switch (v?.toLowerCase()) {
		case "true":
		case "1":
		case "yes":
		case "on":
			return true;
		case "false":
		case "0":
		case "no":
		case "off":
			return false;
		default:
			return undefined;
	}
};
export default toBool;
