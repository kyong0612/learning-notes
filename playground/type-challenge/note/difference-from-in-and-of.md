# 「in」と「of」の違い

- 「in」は型レベルの操作（マップド型など）で使われる
- 「of」は実行時の繰り返し処理などで使われる

```ts
// "in": マップド型などで使われる
type Keys = "name" | "age";
type Person = {
  [K in Keys]: string | number; // key in Keys
};

// "of": 配列から値を取り出す
const arr = [1, 2, 3];
for (const num of arr) {
  console.log(num);
}
```
