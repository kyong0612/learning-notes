// TypeScript Type Guards Sample Code

// 1. typeof を使用した型ガード
// `typeof` 演算子を使用すると、プリミティブ型（number, string, boolean など）のチェックが可能
function doSomething(x: number | string) {
	if (typeof x === "string") {
		// `x` が文字列であることが保証されているため、`substr` メソッドを安全に使用できる
		console.log(x.substr(1)); // OK
	} else {
		// `x` が数値であることが保証されているため、`toFixed` メソッドを安全に使用できる
		console.log(x.toFixed(2)); // OK
	}
}
doSomething("Hello");
doSomething(42);

// 2. instanceof を使用した型ガード
// `instanceof` 演算子を使用すると、オブジェクトが特定のクラスのインスタンスであるかを確認可能
class Foo {
	foo = 123;
	common = "common-property";
}

class Bar {
	bar = 456;
	common = "common-property";
}

function checkInstance(arg: Foo | Bar) {
	if (arg instanceof Foo) {
		// `arg` が `Foo` のインスタンスであることが保証される
		console.log(arg.foo); // OK
		// console.log(arg.bar); // Error: `arg` が `Bar` 型であることは保証されないため
	} else {
		// `arg` が `Bar` のインスタンスであることが保証される
		console.log(arg.bar); // OK
		// console.log(arg.foo); // Error: `arg` が `Foo` 型であることは保証されないため
	}
	console.log(arg.common); // OK (共通プロパティ)
}

checkInstance(new Foo());
checkInstance(new Bar());

// 3. in 演算子を使用した型ガード
// `in` 演算子を使用すると、オブジェクトが特定のプロパティを持っているかをチェックできる
interface A {
	x: number;
}
interface B {
	y: string;
}

function checkProperty(q: A | B) {
	if ("x" in q) {
		// `q` が `A` 型であることが保証される
		console.log(q.x); // OK
	} else {
		// `q` が `B` 型であることが保証される
		console.log(q.y); // OK
	}
}
checkProperty({ x: 10 });
checkProperty({ y: "Hello" });

// 4. リテラル型の型ガード
// リテラル型を使用すると、特定の文字列や数値のみに制限された型を扱うことが可能

type TriState = "yes" | "no" | "unknown";

function logOutState(state: TriState) {
	if (state === "yes") {
		console.log("User selected yes");
	} else if (state === "no") {
		console.log("User selected no");
	} else {
		console.log("User has not made a selection yet");
	}
}
logOutState("yes");
logOutState("no");
logOutState("unknown");

// 5. ユーザー定義の型ガード
// `isFoo` 関数は `arg` が `FooType` 型であるかを判定し、`true` の場合は `FooType` であることを保証する
interface FooType {
	foo: number;
	common: string;
}

interface BarType {
	bar: number;
	common: string;
}

function isFoo(arg: unknown): arg is FooType {
	return (arg as FooType).foo !== undefined;
}

function doStuff(arg: FooType | BarType) {
	if (isFoo(arg)) {
		// `arg` が `FooType` であることが保証される
		console.log(arg.foo); // OK
	} else {
		// `arg` が `BarType` であることが保証される
		console.log(arg.bar); // OK
	}
}

doStuff({ foo: 123, common: "123" });
doStuff({ bar: 456, common: "123" });

// 6. コールバック内の型ガード
// `foo.bar` のチェック後、コールバック関数の中で `foo.bar` が変更される可能性があるため、型が保証されない場合がある

declare const foo: { bar?: { baz: string } };
function immediate(callback: () => void) {
	callback();
}

if (foo.bar) {
	console.log(foo.bar.baz); // OK
	immediate(() => {
		console.log(foo.bar?.baz); // Error: Object is possibly 'undefined'
	});
}

// 安全な方法: ローカル変数に保存することで `foo.bar` の変更を回避
if (foo.bar) {
	console.log(foo.bar.baz); // OK
	const bar = foo.bar;
	immediate(() => {
		console.log(bar.baz); // OK (`foo.bar` の変更の影響を受けない)
	});
}
