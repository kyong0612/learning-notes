/**
 * TypeScriptのリテラル型に関するサンプルコード
 *
 * 記事「リテラル型 | TypeScript Deep Dive 日本語版」より
 *
 * - リテラル型とは？
 * - 文字列リテラル型
 * - 数値リテラル型
 * - ブーリアンリテラル型
 * - ユニオン型での活用
 * - 文字列列挙型の模倣
 */

/** 文字列リテラル型の例 */

// biome-ignore lint/style/useConst: <explanation>
let greeting: "Hello";
greeting = "Hello"; // OK
// greeting = 'Hi'; // エラー: "Hi" は "Hello" に代入できない

/** ユニオン型としてのリテラル型の使用 */
type CardinalDirection = "North" | "East" | "South" | "West";

function move(distance: number, direction: CardinalDirection) {
	console.log(`Moving ${distance} units towards ${direction}`);
}

move(10, "North"); // OK
// move(10, 'Northeast'); // エラー: "Northeast" は CardinalDirection に含まれない

/** 数値リテラル型の使用 */
type OneToFive = 1 | 2 | 3 | 4 | 5;
const rating: OneToFive = 3; // OK
// rating = 6; // エラー: "6" は OneToFive に含まれない

/** ブーリアンリテラル型の使用 */
type Bools = true | false;
const flag: Bools = true; // OK
// flag = 'true'; // エラー: 文字列 "true" は boolean 型に代入できない

/** 既存のJavaScript APIをリテラル型でモデリング */
type ReadOnlyOption = boolean | "nocursor";
const editorReadOnly: ReadOnlyOption = "nocursor"; // OK

/** keyof typeof を用いた文字列列挙型の模倣 */
function strEnum<T extends string>(o: Array<T>): { [K in T]: K } {
	return o.reduce((res, key) => {
		res[key] = key;
		return res;
	}, Object.create(null));
}

const Direction = strEnum(["North", "South", "East", "West"]);
type Direction = keyof typeof Direction;

let sampleDirection: Direction;
sampleDirection = Direction.North; // OK
sampleDirection = "North"; // OK
// sampleDirection = 'Other'; // エラー: "Other" は Direction に含まれない
