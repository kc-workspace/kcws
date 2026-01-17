export type Severity = "error" | "warning" | "info";

export type WithEnabled<T> = T | boolean;

export type ObjectType = "preset" | "rule" | "filter" | "plugin";

// biome-ignore lint/suspicious/noExplicitAny: Any object type
export type AnyObject = Record<string, any>;
export type EmptyObject = Record<never, never>;

export interface BaseObject<T extends ObjectType, N extends string> {
	type: T;
	name: N;
}
export type AnyBaseObject = BaseObject<ObjectType, string>;

export interface ExtendSeverity {
	severity?: Severity;
}

export type UserBase<
	RS extends AnyBaseObject[],
	T extends ObjectType,
	K extends keyof RS[number],
> = {
	[R in RS[number] as R extends BaseObject<T, infer N>
		? N
		: never]: K extends keyof R ? R[K] : R;
};
