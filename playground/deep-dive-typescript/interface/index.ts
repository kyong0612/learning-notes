// インターフェースの基本的な定義
interface Point1 {
	x: number;
	y: number;
}

// インターフェースを使用したオブジェクトの宣言
const pointA: Point1 = { x: 10, y: 20 };

// インターフェースの拡張性
interface Point2 {
	z?: number; // オプショナルプロパティ
}

const pointB: Point2 = { z: 30 };

// クラスとインターフェース
class MyPoint implements Point1 {
	x: number;
	y: number;
	z?: number;

	constructor(x: number, y: number, z?: number) {
		this.x = x;
		this.y = y;
		if (z !== undefined) this.z = z;
	}
}

const myPointInstance = new MyPoint(5, 15, 25);

// 特殊な構造を持つインターフェース
interface Crazy {
	new (): {
		hello: number;
	};
}

// // クラスではなく関数を使用してインターフェースを実現
// const CrazyClass: Crazy = class {
// 	constructor() {
// 		return { hello: 123 };
// 	}
// };

// const crazyInstance = new CrazyClass(); // { hello: 123 }

// 複数のライブラリ間でインターフェースを拡張
// ライブラリa.d.ts
interface ExtendedPoint {
	x: number;
	y: number;
}

declare let extendedPointA: ExtendedPoint;

// ライブラリb.d.ts
interface ExtendedPoint {
	z: number;
}

declare let extendedPointB: ExtendedPoint;

// コード側で使用
const extendedPoint: ExtendedPoint = { x: 1, y: 2, z: 3 }; // OK

// クラスとインターフェースの互換性チェック
interface StrictPoint {
	x: number;
	y: number;
	z: number;
}

class StrictPointClass implements StrictPoint {
	x: number;
	y: number;
	z: number;

	constructor(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
}

const strictPointInstance = new StrictPointClass(10, 20, 30);
