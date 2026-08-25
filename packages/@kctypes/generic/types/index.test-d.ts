import { describe, expectTypeOf, it } from "vitest";
import "./index.d.ts";

describe("Constructor type", () => {
	it("should accept a class constructor", () => {
		class TestClass {
			constructor(public value: number) {}
		}

		expectTypeOf<Constructor<TestClass>>(TestClass).toEqualTypeOf<
			new (
				// biome-ignore lint/suspicious/noExplicitAny: For testing purpose
				...args: any[]
			) => TestClass
		>();
	});

	it("should work with built-in constructors", () => {
		expectTypeOf<Constructor<Date>>(Date).toEqualTypeOf<
			new (
				// biome-ignore lint/suspicious/noExplicitAny: For testing purpose
				...args: any[]
			) => Date
		>();
		expectTypeOf<Constructor<Error>>(Error).toEqualTypeOf<
			new (
				// biome-ignore lint/suspicious/noExplicitAny: For testing purpose
				...args: any[]
			) => Error
		>();
	});
});

describe("WithNull type", () => {
	it("should accept number and null", () => {
		expectTypeOf<WithNull<number>>().toEqualTypeOf<number | null>();
	});

	it("should not accept undefined or boolean", () => {
		expectTypeOf<WithNull<number>>().not.toEqualTypeOf<undefined>();
		expectTypeOf<WithNull<number>>().not.toEqualTypeOf<boolean>();
	});
});

describe("WithUndefined type", () => {
	it("should accept string and undefined", () => {
		expectTypeOf<WithUndefined<string>>().toEqualTypeOf<string | undefined>();
	});

	it("should not accept null or number", () => {
		expectTypeOf<WithUndefined<string>>().not.toEqualTypeOf<null>();
		expectTypeOf<WithUndefined<string>>().not.toEqualTypeOf<number>();
	});
});

describe("Optional type", () => {
	it("should accept boolean, undefined, and null", () => {
		expectTypeOf<Optional<boolean>>().toEqualTypeOf<
			boolean | undefined | null
		>();
	});

	it("should not accept number", () => {
		expectTypeOf<Optional<boolean>>().not.toEqualTypeOf<number>();
	});
});

describe("RequiredK type", () => {
	interface Test {
		a: number;
		b: string;
		c: boolean;
		d: null;
		e: object;
		f: unknown;
	}

	it("should make specified key required", () => {
		const value: RequiredK<Test, "a"> = {
			a: 123,
		};

		expectTypeOf(value).toExtend<{
			a: number;
			b?: string;
			c?: boolean;
			d?: null;
			e?: object;
			f?: unknown;
		}>();
	});
});

describe("PartialK type", () => {
	interface Test {
		a: number;
		b: string;
		c: boolean;
		d: null;
		e: object;
		f: unknown;
	}

	it("should make specified key partial", () => {
		const value: PartialK<Test, "a"> = {
			b: "hello",
			c: false,
			d: null,
			e: {},
			f: new Function(),
		};

		expectTypeOf(value).toExtend<{
			a?: number;
			b: string;
			c: boolean;
			d: null;
			e: object;
			f: unknown;
		}>();
	});
});
