# とりあえず型を書いている人へ

ref: <https://zenn.dev/yodaka/articles/c98b256864ceda>

## タグ付きユニオン

```ts
// 図形の型を定義
type Rectangle = { type: "rectangle"; width: number; height: number }; // 長方形
type Circle = { type: "circle"; radius: number } // 円
type Shape =
  | Circle
  | Rectangle

// 面積を計算する関数
function calculateArea(shape: Shape): number {
  switch (shape.type) {
    // タグがcircleなので
    case "circle":
      // shapeはCircleに推論される
      return Math.PI * shape.radius ** 2; // 円の面積
    // タグがrectangleなので
    case "rectangle":
      // shapeはRectangleに推論される
      return shape.width * shape.height; // 長方形の面積
    default:
      throw new Error("未知の図形タイプ");
  }
}
```

- 注意点
  - タグとして使えるのはリテラル型('a',a,1,trueなど)とnullとundefiqnedのみ

## ユーザ定義型ガード

```ts
const isCircle = (shape: Shape): shape is Circle => {
  return shape.type === "circle";
}
if (isCircle(shape)) {
  // shapeはCircle型として扱われる
  console.log(shape.radius);
}
```

```ts
const list = [null, 'aaa', undefined] as const
// const notEmptyList: "aaa"[]
const notEmptyList = list.filter((v): v is NonNullable<typeof v> => v != null)
```
