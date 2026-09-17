import { KIND_LABEL } from "./constants";

const formatKind = (kind: string): string => {
	return KIND_LABEL[kind] ?? kind;
};

export default formatKind;
