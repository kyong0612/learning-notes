# tuple と array の違い

## 1. 型の構造

### 配列 (array)

- 要素数に制限がなく、すべての要素が同じ型 であることを前提としています。
- 例: number[] は「数値型の要素のみをいくつでも並べられる配列」です。

```ts
const numbers: number[] = [10, 20, 30];
numbers.push(40); // OK
// numbers.push("Hello"); // エラー：string は number[] に追加できない
```

### タプル (tuple)

- 要素数と要素の型が固定 されている配列です。
- 要素ごとに型を明確に指定できるため、位置に意味を持たせたいときに便利です。

```ts
const user: [number, string] = [1, "Tom"];
// 1番目の要素は number、2番目の要素は string であることが保証される
```

## 2. 要素数の固定

配列は要素数の増減が可能ですが、タプルは 宣言時に定義した要素数が基本的には固定 です。

```ts
// タプル
let profile: [string, number] = ["Alice", 30];
// profile = ["Bob"]          // エラー：要素数が足りない
// profile = ["Bob", 25, 170] // エラー：要素数が多い
```

ただし、TypeScript のタプルでも push メソッドは使えてしまい、完全に要素の追加を防げない点には注意が必要です（コンパイラがエラーを出さない仕様です）。
この場合、追加された要素は要素型に union が広がった形で推論されてしまい、後続の型チェックにも影響する可能性があります。

```ts
let data: [string, number] = ["foo", 100];

// push は一応できてしまう
data.push(200);
console.log(data); // 実行時: ["foo", 100, 200]
// ただし型推論的には扱いが複雑になる
```

もし「要素数が変わらない配列が必要だけど、push や pop は厳密に防ぎたい」という場合は、readonly タプルを使う選択肢もあります。

## 3. 利用シーンの違い

### 配列が向いているケース

- 同じ型のデータを可変長 で扱いたい場合
- たとえば「ユーザー ID のリスト」「文字列のリスト」など

```ts
const userIds: number[] = [1, 2, 3, 4, 5];
```

タプルが向いているケース

- 決まった個数 の要素にそれぞれ異なる型を割り当てたい場合
- 「先頭はエラーコード (number) で、後続はエラーメッセージ (string)」のように、要素の位置に明確な意味を持たせたいとき

```ts
type HttpError = [number, string]; // [ステータスコード, エラーメッセージ]

const notFound: HttpError = [404, "Not Found"];
const internalError: HttpError = [500, "Internal Server Error"];
```

## まとめ

- 配列 (array): 同一型の要素を可変長で扱う。
- タプル (tuple): 要素数と各要素の型が事前に定義されている、位置に意味を持たせる場合に便利。
