class Point {
	x: number;
	y: number;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
	add(point: Point) {
		return new Point(this.x + point.x, this.y + point.y);
	}
}

const p1 = new Point(0, 10);
const p2 = new Point(10, 20);
const p3 = p1.add(p2); // {x:10,y:30}

/**
 * inheritance
 */
class Point3D extends Point {
	z: number;
	constructor(x: number, y: number, z: number) {
		super(x, y);
		this.z = z;
	}
	add(point: Point3D) {
		const point2D = super.add(point);
		return new Point3D(point2D.x, point2D.y, this.z + point.z);
	}
}

/**
 * static member
 */
class Something {
	static instances = 0; //クラスの全インスタンスで共有されるstaticなプロパティ
	constructor() {
		Something.instances++;
	}
}

const s1 = new Something();
const s2 = new Something();
console.log(Something.instances); // 2

/**
 * access modifiers
 */
class FooBase {
	public x: number;
	private y: number;
	protected z: number;
}

// インスタンスにおける効果
const foo = new FooBase();
foo.x; // okay
// foo.y; // ERROR : private
// foo.z; // ERROR : protected

// サブクラスにおける効果
class FooChild extends FooBase {
	constructor() {
		super();
		this.x; // okay
		//	this.y; // ERROR: private
		this.z; // okay
	}
}

/**
 * abstract class
 */
abstract class FooCommand {}

class BarCommand extends FooCommand {}

// const fooCommand: FooCommand = new FooCommand(); // 抽象クラスのインスタンスは作成できません

const barCommand = new BarCommand(); // 抽象クラスを継承したクラスのインスタンスは作成できます

////////////////////////////////////

abstract class FooCommand2 {
	abstract execute(): string;
}

// class BarErrorCommand extends FooCommand2 {} // 'BarErrorCommand'は抽象メンバー'execute'を実装する必要があります

class BarCommand2 extends FooCommand2 {
	execute() {
		return "コマンドBarが実行されました";
	}
}

const barCommand2 = new BarCommand2();

barCommand2.execute(); // コマンドBarが実行されました
