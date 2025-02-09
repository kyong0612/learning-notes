// =====================================================
// 1. 型安全でない（Naive）キューの実装例
// -----------------------------------------------------
// この実装では、どんな型でもキューに追加できるため、
// 例えば数値だけを扱うつもりのキューに誤って文字列が混入してしまう危険性があります。
// その結果、キューから取り出した後の処理（例えば数値に対して数値専用のメソッドを呼び出すなど）で
// ランタイムエラーが発生する可能性があります。
class NaiveQueue {
	private data: unknown[] = []; // 型が unknown の配列として内部データを保持

	// 任意の型のアイテムを追加する
	push(item: unknown): void {
		this.data.push(item);
	}

	// キューの先頭から要素を取り出す（型は unknown）
	pop(): unknown {
		return this.data.shift();
	}
}

// 使用例
const naiveQueue = new NaiveQueue();
naiveQueue.push(0); // 数値を追加
naiveQueue.push("1"); // 誤って文字列を追加（本来は数値のみが望ましい）
// 以下は、数値として扱おうとしたときにエラーになる例（ランタイムエラーとなる可能性がある）:
// console.log(naiveQueue.pop().toPrecision(1)); // 文字列の場合、toPrecision は存在しない → エラー！

// =====================================================
// 2. ジェネリクスを用いた型安全なキューの実装例
// -----------------------------------------------------
// クラス定義にジェネリクスパラメータ <T> を導入することで、
// キューに追加される値と取り出される値の型が常に同じ型 T であることを保証できます。
class Queue<T> {
	private data: T[] = []; // 内部データは型 T の配列

	// T 型のアイテムのみ追加できる
	push(item: T): void {
		this.data.push(item);
	}

	// キューから T 型のアイテムを取り出す（空の場合は undefined）
	pop(): T | undefined {
		return this.data.shift();
	}
}

// 使用例：数値専用のキュー
const numberQueue = new Queue<number>();
numberQueue.push(0);
// numberQueue.push("1"); // コンパイルエラー：string は number に割り当てられません
const num = numberQueue.pop();
if (num !== undefined) {
	console.log(num.toPrecision(1)); // 安全に数値メソッドを利用できる
}

// =====================================================
// 3. ジェネリック関数: 配列の要素を逆順に並べ替える reverse 関数
// -----------------------------------------------------
// この reverse 関数は、ジェネリック型パラメータ <T> を用いて、
// 入力配列 items の要素の型を保持しながら逆順の配列を返します。
function reverse<T>(items: T[]): T[] {
	const toReturn: T[] = [];
	// 配列の末尾から先頭に向かってループ
	for (let i = items.length - 1; i >= 0; i--) {
		toReturn.push(items[i]);
	}
	return toReturn;
}

// 使用例：数値の配列を逆順に
const numbers = [1, 2, 3];
const reversedNumbers = reverse(numbers);
console.log(reversedNumbers); // 出力: [3, 2, 1]

// 型安全性の確認：
// 以下のように、reversedNumbers は number[] 型となるため、
// 誤って文字列を代入しようとするとコンパイルエラーになります。
// reversedNumbers[0] = "10"; // エラー: string は number に割り当てられません
reversedNumbers[0] = 10; // OK

// =====================================================
// 4. ジェネリック関数: getJSON 関数
// -----------------------------------------------------
// この関数は、指定した URL から JSON を取得し、
// 呼び出し側が期待する型 T にキャストして Promise<T> として返します。
// これにより、JSON レスポンスの構造に対する型安全性を高めることができます。
async function getJSON<T>(config: {
	url: string;
	headers?: { [key: string]: string };
}): Promise<T> {
	// fetch 用の設定（GET メソッド、デフォルトのヘッダー）
	const fetchConfig: RequestInit = {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			...(config.headers || {}),
		},
	};

	// 指定した URL からデータを取得
	const response = await fetch(config.url, fetchConfig);
	// JSON をパースして型 T にキャストして返す
	const data: T = await response.json();
	return data;
}

// レスポンスの型例：ユーザー情報のロード
type LoadUsersResponse = {
	users: {
		name: string;
		email: string;
	}[];
};

// 使用例: loadUsers 関数
function loadUsers(): Promise<LoadUsersResponse> {
	// getJSON のジェネリクスパラメータに LoadUsersResponse を指定
	return getJSON<LoadUsersResponse>({ url: "https://example.com/users" });
}

// =====================================================
// 5. ジェネリック関数: send 関数（引数にのみジェネリクスを利用する例）
// -----------------------------------------------------
// この関数は、引数として受け取った値の型 T を保持しますが、戻り値は void です。
// このような場合、ジェネリクスパラメータは主に補完や型チェックのために使われます。
// ※この例は、実際の実装ではなく、型安全な API を示すための宣言です。
declare function send<T>(arg: T): void;

// 使用例:
type Something = { x: number; y: string };
send<Something>({ x: 123, y: "example" });
// ※もし送信する値が Something 型と一致しなければ、コンパイル時にエラーとなります。
// 例えば、以下はエラー:
// send<Something>({ x: 123, y: 456 }); // エラー：y は number ですが、string が必要

// =====================================================
// 6. ジェネリクスパラメータの命名例
// -----------------------------------------------------
// 複数のジェネリクスパラメータが必要な場合、意味のある名前を使用することで、
// コードの可読性が向上します。
// 以下は、キーと値のペアを表すインターフェースの例です。
interface MapEntry<TKey, TValue> {
	key: TKey;
	value: TValue;
}

// 使用例:
const entry: MapEntry<string, number> = { key: "age", value: 30 };

// =====================================================
// サマリ：
// - NaiveQueue の例では、型指定がされていないため、異なる型が混在するリスクがあることを示しています。
// - Queue<T> クラスを用いることで、プッシュとポップする値の型を一致させ、型安全性を確保しています。
// - reverse<T> 関数は、入力配列の型情報を保持しつつ、逆順の配列を返す例です。
// - getJSON<T> 関数は、API 呼び出し時のレスポンスを期待する型に合わせてパースする方法を示しています。
// - send<T> 関数の例では、引数の型にジェネリクスを用いることで、呼び出し側の型補完を助ける使い方を示しています。
// - また、複数のジェネリクスパラメータを用いる場合の命名規則についても触れています。

// 以上のサンプルコードにより、記事の内容全体（ジェネリクスの利点と利用方法）が実装例として理解できると思います。
