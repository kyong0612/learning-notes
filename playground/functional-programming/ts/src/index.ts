/********************************************
 * 1. 純粋関数とイミュータビリティ
 ********************************************/
// 純粋関数とは、同じ入力に対して常に同じ出力を返し、
// 外部状態に影響を及ぼさず、また影響を受けない関数です。
function add(x: number, y: number): number {
	return x + y;
}

// イミュータビリティの例：
// 配列に要素を追加する場合、既存の配列を変更せず、新しい配列を返す。
function pushImmutable<T>(arr: readonly T[], value: T): T[] {
	return [...arr, value];
}

const nums = [1, 2, 3];
const newNums = pushImmutable(nums, 4);
console.log(nums); // [1,2,3] 元の配列は変更されない
console.log(newNums); // [1,2,3,4]

/********************************************
 * 2. 高階関数(Higher-Order Functions)
 ********************************************/
// 高階関数は、他の関数を引数に取ったり、戻り値として返す関数のことを指します。
// map, filter, reduceは典型的な例です。
const doubled = [1, 2, 3].map((x) => x * 2); // [2,4,6]
const evens = [1, 2, 3, 4, 5].filter((x) => x % 2 === 0); // [2,4]
const sum = [1, 2, 3, 4, 5].reduce((acc, x) => acc + x, 0); // 15

console.log(doubled, evens, sum);

/********************************************
 * 3. カリー化(Currying)と部分適用(Partial Application)
 ********************************************/
// カリー化とは、多引数関数を引数1つを受け取る関数の連鎖へと変換することです。
function add3(a: number, b: number, c: number): number {
	return a + b + c;
}

// カリー化の例 (簡易的なカリー化)
function curryAdd3(a: number) {
	return function (b: number) {
		return function (c: number) {
			return a + b + c;
		};
	};
}

// 部分適用とは、関数に一部の引数を固定した新しい関数を作ること。
const add5 = curryAdd3(2)(3); // b = 3を固定している => add5(c) = 2 + 3 + c
console.log(add5(10)); // 15

/********************************************
 * 4. Option/Maybe型、Either型による安全なエラーハンドリング
 ********************************************/
// JS/TSでよくあるundefinedはエラーの温床になりがちです。
// Functional ProgrammingではOption型(Maybe型)で「値があるかもしれないし、ないかもしれない」を表現。
// Optionを実装してみます。

type None = { kind: "none" };
type Some<T> = { kind: "some"; value: T };
type Option<T> = None | Some<T>;

const none: None = { kind: "none" };
function some<T>(value: T): Option<T> {
	return { kind: "some", value };
}

function isSome<T>(opt: Option<T>): opt is Some<T> {
	return opt.kind === "some";
}

function isNone<T>(opt: Option<T>): opt is None {
	return opt.kind === "none";
}

// Optionを使った安全なデータアクセス例
function safeHead<T>(arr: T[]): Option<T> {
	return arr.length > 0 ? some(arr[0]) : none;
}

const headVal = safeHead([10, 20, 30]);
if (isSome(headVal)) {
	console.log("head:", headVal.value); // 10
} else {
	console.log("empty array");
}

// Either型はエラー情報を格納できるOptionのような型
type Left<E> = { kind: "left"; error: E };
type Right<A> = { kind: "right"; value: A };
type Either<E, A> = Left<E> | Right<A>;

function left<E>(err: E): Either<E, never> {
	return { kind: "left", error: err };
}

function right<A>(val: A): Either<never, A> {
	return { kind: "right", value: val };
}

function divideSafe(a: number, b: number): Either<string, number> {
	return b === 0 ? left("Division by zero!") : right(a / b);
}

const result = divideSafe(10, 2);
if (result.kind === "right") {
	console.log("Quotient:", result.value);
} else {
	console.error("Error:", result.error);
}

/********************************************
 * 5. 関数合成(Function Composition)
 ********************************************/
// 関数合成は、「fの後にgを適用する」という処理を簡潔に記述できます。
// ここでは、シンプルな関数合成関数composeを定義してみます。

function compose<A, B, C>(f: (b: B) => C, g: (a: A) => B): (a: A) => C {
	return (a: A) => f(g(a));
}

const toUpper = (s: string) => s.toUpperCase();
const exclaim = (s: string) => s + "!";
const shout = compose(exclaim, toUpper);
console.log(shout("hello")); // "HELLO!"

/********************************************
 * 6. モナド的操作(Maybeモナド風の例)
 ********************************************/
// Functional ProgrammingではOption(Maybe)型はFunctor, Applicative, Monadの性質を持つことが多いです。
// ここでは、MapやFlatMap（chain）を実装することで、Monad的な操作を擬似的に示します。

function mapOption<T, U>(opt: Option<T>, f: (x: T) => U): Option<U> {
	return isSome(opt) ? some(f(opt.value)) : none;
}

function flatMapOption<T, U>(
	opt: Option<T>,
	f: (x: T) => Option<U>,
): Option<U> {
	return isSome(opt) ? f(opt.value) : none;
}

// 例: Maybeを使ったパイプライン
// 「配列の先頭要素を取り、2倍し、10より大きいか判定し、その結果をOptionで返す」という流れ
const pipeline = (arr: number[]): Option<boolean> =>
	flatMapOption(safeHead(arr), (x) => some(x * 2));

const pipelineResult = pipeline([5, 6, 7]);
// pipeline([5,6,7]) -> safeHead([5,6,7]) = some(5)
//                      flatMapOption(some(5), x => some(x*2)) = some(10)
if (isSome(pipelineResult)) {
	console.log(pipelineResult.value > 10); // false
} else {
	console.log("No value");
}
