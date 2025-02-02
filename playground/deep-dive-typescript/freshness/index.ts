// 1. 基本的な構造的型付けの例
function logName(something: { name: string }) {
	console.log(something.name);
}

const person = { name: "matt", job: "being awesome" };
const animal = { name: "cow", diet: "vegan, but has milk of own species" };
const random = { note: `I don't have a name property` };

logName(person); // OK: `person` は `name` プロパティを持っている
logName(animal); // OK: `animal` も `name` プロパティを持っている
// logName(random); // エラー: `random` は `name` プロパティを持っていない

// 2. オブジェクトリテラルを直接渡した場合の Freshness チェック
logName({ name: "matt" }); // OK: `name` プロパティのみを持つ
// logName({ name: 'matt', job: 'being awesome' }); // エラー: `job` は型 `{ name: string }` に存在しない

// 3. オプショナルプロパティを持つオブジェクトの例
function logIfHasName(something: { name?: string }) {
	if (something.name) {
		console.log(something.name);
	}
}

logIfHasName(person); // OK
logIfHasName(animal); // OK
// logIfHasName({neme: 'I just misspelled name to neme'}); // エラー: `neme` は `name` のスペルミス

// 4. インデックスシグネチャを用いた追加プロパティの許可
const x: { foo: number; [key: string]: unknown } = { foo: 1, baz: 2 }; // OK: `baz` はインデックスシグネチャにマッチする

// 5. React の setState の例 (オプショナルプロパティを活用)
interface State {
	foo?: string;
	bar?: string;
}

class Component {
	state: State = { foo: "Hello", bar: "World" };

	setState(newState: Partial<State>) {
		this.state = { ...this.state, ...newState };
	}
}

const component = new Component();
component.setState({ foo: "Hello" }); // OK: `bar` は省略可能
// component.setState({ foos: "Hello" }); // エラー: `foos` は存在しないプロパティ
// component.setState({ foo: 123 }); // エラー: `foo` は string 型であるべき
