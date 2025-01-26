// 基本アノテーション
let num: number = 42;
let str: string = "Hello, TypeScript!";
let bool: boolean = true;

// 配列型
let numbers: number[] = [1, 2, 3];
let strings: string[] = ["a", "b", "c"];

// インターフェース
interface User {
	id: number;
	name: string;
	isActive: boolean;
}

const user: User = {
	id: 1,
	name: "Alice",
	isActive: true,
};

// インライン型アノテーション
let product: { name: string; price: number } = {
	name: "Laptop",
	price: 1500,
};

// 特殊な型: any, null, undefined, void
let something: any = "Can be anything";
something = 123;

let maybeNull: string | null = null;
let undefinedValue: undefined = undefined;

function logMessage(message: string): void {
	console.log(message);
}

// ジェネリックス
function reverseArray<T>(items: T[]): T[] {
	return items.reverse();
}

const reversedNumbers = reverseArray([1, 2, 3]);

// ユニオン型
function formatInput(input: string | number): string {
	return typeof input === "string" ? input.toUpperCase() : input.toString();
}

// 交差型
function extend<T, U>(first: T, second: U): T & U {
	return { ...first, ...second };
}

const mergedObject = extend({ name: "Alice" }, { age: 30 });

// タプル型
let userInfo: [string, number];
userInfo = ["Bob", 25];

// 型エイリアス
type Point = { x: number; y: number };
type StringOrNumber = string | number;

const point: Point = { x: 10, y: 20 };
let value: StringOrNumber = "A string value";

// 実用例：型エイリアスと関数を組み合わせる
type Callback = (data: string) => void;

function fetchData(callback: Callback): void {
	callback("Sample data");
}

fetchData((data) => console.log(data));
