---
title: "satisfies演算子「satisfies operator」 | TypeScript入門『サバイバルTypeScript』"
source: "https://typescriptbook.jp/reference/values-types-variables/satisfies"
author:
published:
created: 2025-12-24
description: "satisfies T(Tは型)は、変数宣言時に使用する演算子で、その値が型Tを満たすことを検証します。この演算子は型の絞り込みを保持したまま型チェックを行える特徴があります。型アノテーションと同様の型チェック機能を持ちながら、ユニオン型を含む場合でも実際の値に基づいて型を絞り込むことができます。"
tags:
  - "clippings"
  - "TypeScript"
  - "型システム"
  - "satisfies演算子"
  - "型推論"
  - "型アサーション"
---

## satisfies演算子「satisfies operator」

`satisfies T`（`T`は型）は、変数宣言時に使用する演算子で、その値が型`T`を満たすことを検証します。この演算子は型の絞り込みを保持したまま型チェックを行える特徴があります。

`as const`と異なり、`satisfies`はその後に型を要求します。単独で使用することはできません。

## 型アノテーションと同じようにできること

変数宣言のときに変数名の後ろに`: T`と書くことを型アノテーションといいます。こちらは変数宣言時にその変数が型`T`を満たすことを検証します。

`satisfies T`の機能は型アノテーションと基本的に同じ働きをします：

- 宣言した型に沿わない型を与えるとエラーが発生する
- 存在しないプロパティを追加することもできない

例：

```typescript
type Pokemon = {
  name: string;
  no: number;
  genre: string;
  height: number;
  weight: number;
};

// 型アノテーションを使用
const pikachu: Pokemon = {
  name: "pikachu",
  no: 25,
  genre: "mouse pokémon",
  height: 0.4,
  weight: 6.0,
};

// satisfies演算子を使用
const raichu = {
  name: "raichu",
  no: 26,
  genre: "mouse pokémon",
  height: 0.8,
  weight: 30.0,
} satisfies Pokemon;
```

どちらも型チェックが行われ、型に合わない値や存在しないプロパティを追加しようとするとエラーが発生します。

## 型アノテーションとちがうこと

`satisfies`の最大の特徴は、型`T`にユニオン型が含まれる場合でも、実際の値に基づいて型を絞り込むことができる点です。型アノテーションでは失われてしまう型の情報を保持できます。

主にオブジェクトリテラルや配列で使用しますが、プリミティブ型でも使用できます。

### 配列での型の絞り込み

```typescript
// 型アノテーション: 型が (string | number)[] のまま
const array1: (string | number)[] = [1, 2, 3];
// array1: (string | number)[]

// satisfies演算子: 実際の値に基づいて number[] に絞り込まれる
const array2 = [1, 2, 3] satisfies (string | number)[];
// array2: number[]
```

ユニオン型の配列の場合は期待する結果にならないときもあります：

```typescript
const array1: (string | number)[] = [1, "2", 3];
// array1: (string | number)[]

const array2 = [1, "2", 3] satisfies (string | number)[];
// array2: (string | number)[]
```

### タプル型での型の絞り込み

タプル型の場合は個々に型の絞り込みを行います：

```typescript
const tuple1: [string | number, string | number, string | number] = [1, "2", 3];
// tuple1: [string | number, string | number, string | number]

const tuple2 = [1, "2", 3] satisfies [
  string | number,
  string | number,
  string | number
];
// tuple2: [number, string, number]
```

### オブジェクトのプロパティでの型の絞り込み

オブジェクトのプロパティにあるユニオン型にも効果があります：

```typescript
type SuccessResponse = {
  success: true;
  data: object;
};

type ErrorResponse = {
  success: false;
  error: string;
};

type ApiResponse = SuccessResponse | ErrorResponse;

// 型アノテーション: 型が ApiResponse のまま
const res1: ApiResponse = {
  success: false,
  error: "too many requests",
};
// res1: ApiResponse

// satisfies演算子: 実際の値に基づいて ErrorResponse に絞り込まれる
const res2 = {
  success: false,
  error: "too many requests",
} satisfies ApiResponse;
// res2: { success: false; error: string; }
```

## as constと組み合わせる

`as const`と組み合わせて`as const satisfies T`と書くことができます。

これは型`T`を満たしていることを検証した上で絞り込みを行い、さらにリテラル型にしてreadonlyにするという`as const`と`satisfies`の機能をあわせ持っています。

```typescript
// 配列の場合
const array = [1, "2", 3] as const satisfies (string | number)[];
// array: readonly [1, "2", 3]

// タプルの場合
const tuple = [1, "2", 3] as const satisfies [
  string | number,
  string | number,
  string | number
];
// tuple: readonly [1, "2", 3]

// オブジェクトの場合
const res = {
  success: false,
  error: "too many requests",
} as const satisfies ApiResponse;
// res: { readonly success: false; readonly error: "too many requests"; }
```

## まとめ

`satisfies`演算子は以下の特徴を持ちます：

1. **型チェック機能**: 型アノテーションと同様に、値が指定した型を満たすことを検証する
2. **型の絞り込み保持**: ユニオン型を含む場合でも、実際の値に基づいて型を絞り込むことができる
3. **as constとの組み合わせ**: `as const satisfies T`で、型チェックとリテラル型化を同時に行える

型アノテーションでは失われてしまう型情報を保持しながら、型安全性を確保できるため、特にユニオン型を扱う際に有用です。
