const toWildcardRoute = (route: string): string => {
	return route === "/" ? "/*" : `${route}/*`;
};

export default toWildcardRoute;
