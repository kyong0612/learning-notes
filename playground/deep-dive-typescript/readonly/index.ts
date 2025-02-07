/**
 * このサンプルコードは、TypeScript における `readonly` の使い方を
 * 各シナリオごとに詳しく解説するためのものです。
 *
 * 注意:
 * - `readonly` は「浅い（shallow）」不変性しか保証しません。つまり、ネストされたオブジェクトの内部プロパティは変更可能です。
 * - `const` は変数そのものの再代入を防ぎますが、オブジェクトのプロパティの不変性とは別物です。
 */

// ============================
// 1. インターフェースでの `readonly` の使用
// ============================
/**
 * インターフェースで `readonly` を宣言すると、
 * オブジェクト生成後に該当プロパティを変更することができなくなります。
 */
interface Config {
	readonly bar: number;
	readonly bas: number;
}

function printConfig(config: Config): void {
	console.log("Config.bar =", config.bar);
	console.log("Config.bas =", config.bas);
	// 以下の行はコンパイルエラーになります:
	// config.bar = 456; // Error: Cannot assign to 'bar' because it is a read-only property.
}

const config: Config = { bar: 123, bas: 456 };
printConfig(config);

// ============================
// 2. 型エイリアスおよびクラスにおける `readonly` の利用
// ============================

// 型エイリアスでも同様に、プロパティを読み取り専用にできます。
type FooType = {
	readonly bar: number;
	readonly bas: number;
};

const fooObj: FooType = { bar: 123, bas: 456 };
// fooObj.bar = 456; // Error: Cannot assign to 'bar' because it is a read-only property.

// クラスの場合は、コンストラクタ内で初期化することが可能です。
// ただし、一度初期化された readonly プロパティは以降変更できません。
class FooClass {
	readonly bar = 1; // 宣言時に初期化
	readonly baz: string; // コンストラクタで初期化する場合

	constructor(baz?: string) {
		// コンストラクタ内では初回の代入が許可される
		this.baz = baz ?? "hello";
	}

	// メソッド内からの変更も不可です。
	update(): void {
		// this.bar = 2; // Error: Cannot assign to 'bar' because it is a read-only property.
	}
}

const fooInstance = new FooClass("world");
console.log("FooClass.bar =", fooInstance.bar); // 出力: 1
console.log("FooClass.baz =", fooInstance.baz); // 出力: world

// ============================
// 3. Readonly<T> ユーティリティ型
// ============================
/**
 * Readonly<T> を使うと、T のすべてのプロパティを自動的に readonly に変換できます。
 */
interface FooProps {
	bar: number;
	bas: number;
}

type FooPropsReadonly = Readonly<FooProps>;

const fooReadonly: FooPropsReadonly = { bar: 123, bas: 456 };
// fooReadonly.bar = 456; // Error: Cannot assign to 'bar' because it is a read-only property.

// ============================
// 4. ReadonlyArray<T> の利用
// ============================
/**
 * ReadonlyArray<T> は配列の内容が変更されないことを保証します。
 * つまり、要素の追加・削除などの変更操作は行えません。
 */
let numbers: ReadonlyArray<number> = [1, 2, 3];
console.log("First number =", numbers[0]); // 出力: 1

// 以下はエラー: ReadonlyArray 型は変更操作を許可していません。
// numbers.push(4); // Error: Property 'push' does not exist on type 'readonly number[]'.

// 変更操作をしたい場合は、新しい配列を生成するメソッドを利用します。
numbers = numbers.concat([4]); // OK: concat は新しい配列を返すので元の配列は変更されない
console.log("Numbers after concat =", numbers); // 出力: [1, 2, 3, 4]

// ============================
// 5. React の Props/State における `readonly` の利用例
// ============================
/**
 * React コンポーネントでは、Props や State を不変にすることで、予期しない変更を防ぎます。
 * クラスコンポーネントの例として示しますが、現在は関数コンポーネントが主流です。
 */
//   import React from "react";

//   interface Props {
//     readonly foo: number;
//   }

//   interface State {
//     readonly bar: number;
//   }

//   class Something extends React.Component<Props, State> {
//     constructor(props: Props) {
//       super(props);
//       // state は初期化時に設定しますが、後から直接変更はできません。
//       this.state = { bar: 0 };
//     }

//     someMethod(): void {
//       // 以下はエラー: Props と State は読み取り専用です。
//       // this.props.foo = 123; // Error: Cannot assign to 'foo' because it is a read-only property.
//       // this.state.bar = 456; // Error: Cannot assign to 'bar' because it is a read-only property.
//     }

//     render(): React.ReactNode {
//       return (
//         <div>
//           Foo: {this.props.foo}, Bar: {this.state.bar}
//         </div>
//       );
//     }
//   }

// ============================
// 6. インデックスシグネチャでの `readonly` の利用
// ============================
/**
 * インデックスシグネチャに readonly を付与すると、数値や文字列キーでアクセスするプロパティも読み取り専用になります。
 */
interface ReadonlyIndex {
	readonly [index: number]: number;
}

const indexedReadonly: ReadonlyIndex = { 0: 123, 2: 345 };
console.log("Indexed value at 0 =", indexedReadonly[0]); // 出力: 123
// indexedReadonly[0] = 456; // Error: Cannot assign to '0' because it is a read-only property.

// ============================
// 7. `const` と `readonly` の違い
// ============================
/**
 * - `const` は変数の再代入を防ぎますが、その変数が参照するオブジェクトの内容までは保護しません。
 * - `readonly` はオブジェクトやクラスのプロパティを変更不可にします。
 */

// 例: const 変数
const fooConst = 123; // fooConst 自体は再代入できません。
// fooConst = 456; // Error: Assignment to constant variable.

// 例: オブジェクトのプロパティに readonly を適用するには、インターフェースや型エイリアスで定義する必要があります。
interface ReadonlyObj {
	readonly bar: number;
}

const readonlyObj: ReadonlyObj = { bar: 456 };
// readonlyObj.bar = 789; // Error: Cannot assign to 'bar' because it is a read-only property.

console.log("const fooConst =", fooConst);
console.log("readonlyObj.bar =", readonlyObj.bar);

/**
 * まとめ:
 * - `readonly` を用いることで、意図しない値の変更を防止し、不変性を確保できます。
 * - 特にオブジェクトや配列など、複雑なデータ構造においては、副作用を防ぐために積極的に利用すると良いでしょう。
 * - ただし、`readonly` は浅い不変性なので、ネストされたオブジェクトまで完全に保護するには、別途深いコピーやライブラリの利用が必要です。
 */
