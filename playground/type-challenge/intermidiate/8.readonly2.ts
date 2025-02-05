/*
  8 - Readonly 2
  -------
  by Anthony Fu (@antfu) #中級 #readonly #object-keys

  ### 質問

  2つの型引数`T`と`K`を取る`MyReadonly2<T, K>`を実装します。

  `K`が指定されている場合は、`T`の中の`K`のプロパティのみを読み取り専用にします。`K`が指定されていない場合は、通常の`Readonly<T>`と同様に、すべてのプロパティを読み取り専用にします。

  例えば

  ```ts
  interface Todo {
    title: string
    description: string
    completed: boolean
  }

  const todo: MyReadonly2<Todo, 'title' | 'description'> = {
    title: "Hey",
    description: "foobar",
    completed: false,
  }

  todo.title = "Hello" // Error: cannot reassign a readonly property
  todo.description = "barFoo" // Error: cannot reassign a readonly property
  todo.completed = true // OK
  ```

  > GitHubで確認する：https://tsch.js.org/8/ja
*/

/* _____________ ここにコードを記入 _____________ */

/**
- `T`: 対象のオブジェクト型
- `K extends keyof T = keyof T`:  
 - K は T のプロパティ名のうちのいずれかでなければならず、省略した場合は T の全てのプロパティ（`keyof T`）が対象になります。

実際の実装は以下の2つのユーティリティ型を組み合わせています:

1. `Omit<T, K>`  
   - T からキー K に該当するプロパティを取り除いた型を作成します。
2. `Readonly<Pick<T, K>>`  
   - `Pick<T, K>` はオブジェクト型 T からキー K に該当するプロパティだけを抽出する型です。その上で `Readonly<...>` を適用することで、その抽出したプロパティをすべて読み取り専用にします。

 */
type MyReadonly2<T, K extends keyof T = keyof T> = Omit<T, K> &
	Readonly<Pick<T, K>>;

/* _____________ テストケース _____________ */
import type { Alike, Expect } from "@type-challenges/utils";

type cases = [
	Expect<Alike<MyReadonly2<Todo1>, Readonly<Todo1>>>,
	Expect<Alike<MyReadonly2<Todo1, "title" | "description">, Expected>>,
	Expect<Alike<MyReadonly2<Todo2, "title" | "description">, Expected>>,
	Expect<Alike<MyReadonly2<Todo2, "description">, Expected>>,
];

// @ts-expect-error
type error = MyReadonly2<Todo1, "title" | "invalid">;

interface Todo1 {
	title: string;
	description?: string;
	completed: boolean;
}

interface Todo2 {
	readonly title: string;
	description?: string;
	completed: boolean;
}

interface Expected {
	readonly title: string;
	readonly description?: string;
	completed: boolean;
}

/* _____________ 次のステップ _____________ */
/*
  > 解答を共有する：https://tsch.js.org/8/answer/ja
  > 解答を見る：https://tsch.js.org/8/solutions
  > その他の課題：https://tsch.js.org/ja
*/
