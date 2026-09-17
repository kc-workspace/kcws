import { MAX_PORT } from "./constants";
import parsePort from "./parsePort";

const getNextPort = (port: number): number => {
	const nextPort = port >= MAX_PORT ? port + 1 - MAX_PORT : port + 1;
	return parsePort(nextPort);
};

export default getNextPort;
