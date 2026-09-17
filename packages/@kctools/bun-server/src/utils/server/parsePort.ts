import { MAX_PORT, MIN_PORT } from "./constants";

type NormalizePort = (port: number) => boolean;

const customPorts: Array<[number, NormalizePort]> = [
	[80, (port: number) => port > 0 && port <= 80],
	[81, (port: number) => port > 80 && port <= 99],
	[443, (port: number) => port > 99 && port <= 443],
	[444, (port: number) => port > 443 && port <= 999],
	[1024, (port: number) => port > 1000 && port <= 1024],
	[1025, (port: number) => port > 1024 && port <= 1999],
	[0, (port: number) => port < MIN_PORT],
	[0, (port: number) => port > MAX_PORT],
];

const parsePort = (port: string | number): number => {
	const parsedPort =
		typeof port === "string" ? Number.parseInt(port, 10) : port;
	if (!Number.isFinite(parsedPort)) throw new Error(`Invalid port: ${port}`);

	const customPort = customPorts.find(([_, validate]) => validate(parsedPort));
	return customPort?.[0] ?? parsedPort;
};

export default parsePort;
