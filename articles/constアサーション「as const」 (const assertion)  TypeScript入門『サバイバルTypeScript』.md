---
title: "constアサーション「as const」 (const assertion) | TypeScript入門『サバイバルTypeScript』"
source: "https://typescriptbook.jp/reference/values-types-variables/const-assertion"
author:
published:
created: 2025-12-24
description: "変数宣言のときに、末尾に`as const`をつけるとその値をreadonlyにした上で、リテラル型にしてくれます。プリミティブ型の値だとそこまでうま味を感じにくいですが、配列やオブジェクトリテラルに対して使うと便利です。`readonly`修飾子とは異なり、`as const`は再帰的にすべてのプロパティをreadonlyにし、リテラル型として固定します。"
tags:
  - "clippings"
  - "TypeScript"
  - "const assertion"
  - "readonly"
  - "リテラル型"
---

## constアサーション「as const」 (const assertion)

## 概要

変数宣言のときに、末尾に`as const`をつけるとその値をreadonlyにした上で、リテラル型にしてくれます。プリミティブ型の値だとそこまでうま味を感じにくいですが、配列やオブジェクトリテラルに対して使うと便利です。

## 基本的な使い方

### プリミティブ型

```typescript
const str1 = "hello";
// const str1: "hello"

const str2 = "hello" as const; // これはas constがなくても同じ
// const str2: "hello"
```

プリミティブ型の場合、`const`で宣言すれば既にリテラル型になるため、`as const`は必須ではありません。

### 配列

```typescript
const array1 = [1, 2, 3];
// const array1: number[]

const array2 = [1, 2, 3] as const;
// const array2: readonly [1, 2, 3]
```

`as const`を使うと、配列はタプル型になり、各要素がリテラル型として固定されます。また、`readonly`になるため要素の代入ができなくなります。

### オブジェクト

```typescript
const obj1 = {
  name: "pikachu",
  no: 25,
  genre: "mouse pokémon",
  height: 0.4,
  weight: 6.0,
};
// const obj1: {
//     name: string;
//     no: number;
//     genre: string;
//     height: number;
//     weight: number;
// }

const obj2 = {
  name: "pikachu",
  no: 25,
  genre: "mouse pokémon",
  height: 0.4,
  weight: 6.0,
} as const;
// const obj2: {
//     readonly name: "pikachu";
//     readonly no: 25;
//     readonly genre: "mouse pokémon";
//     readonly height: 0.4;
//     readonly weight: 6;
// }
```

`as const`を使うと、オブジェクトのすべてのプロパティが`readonly`になり、値がリテラル型として固定されます。

### 代入の制限

`readonly`になるため、代入はできません。

```typescript
array1[0] = 4; // OK
array2[0] = 4; // Error: Cannot assign to '0' because it is a read-only property.

obj1.name = "raichu"; // OK
obj2.name = "raichu"; // Error: Cannot assign to 'name' because it is a read-only property.
```

## `readonly`と`const assertion`の違い

どちらもオブジェクトのプロパティを`readonly`にする機能は同じですが、以下の点が異なります。

### 1. `readonly`はプロパティごとにつけられる

`const assertion`はオブジェクト全体に対する宣言なので、すべてのプロパティが対象になりますが、`readonly`は必要なプロパティのみにつけることができます。

### 2. `const assertion`は再帰的に`readonly`にできる

オブジェクトの中にオブジェクトがあるときの挙動が異なります。

#### `readonly`の場合

```typescript
type Country = {
  name: string;
  capitalCity: string;
};

type Continent = {
  readonly name: string;
  readonly canada: Country;
  readonly us: Country;
  readonly mexico: Country;
};

const america: Continent = {
  name: "North American Continent",
  canada: {
    name: "Republic of Canada",
    capitalCity: "Ottawa",
  },
  us: {
    name: "United States of America",
    capitalCity: "Washington, D.C.",
  },
  mexico: {
    name: "United Mexican States",
    capitalCity: "Mexico City",
  },
};

// トップレベルのプロパティへの代入は不可
america.name = "African Continent"; // Error
america.canada = { ... }; // Error

// しかし、ネストされたオブジェクトのプロパティは変更可能
america.canada.name = "Republic of Côte d'Ivoire"; // OK
america.canada.capitalCity = "Yamoussoukro"; // OK
```

`readonly`をつけたプロパティがオブジェクトである場合に、そのオブジェクトのプロパティまで`readonly`にはしません。

#### `as const`の場合

```typescript
const america = {
  name: "North American Continent",
  canada: {
    name: "Republic of Canada",
    capitalCity: "Ottawa",
  },
  us: {
    name: "United States of America",
    capitalCity: "Washington, D.C.",
  },
  mexico: {
    name: "United Mexican States",
    capitalCity: "Mexico City",
  },
} as const;

// トップレベルのプロパティへの代入は不可
america.name = "African Continent"; // Error
america.canada = { ... }; // Error

// ネストされたオブジェクトのプロパティも変更不可
america.canada.name = "Republic of Côte d'Ivoire"; // Error
america.canada.capitalCity = "Yamoussoukro"; // Error
```

`as const`は、オブジェクトが持つすべてのプロパティを再帰的に`readonly`にします。

### 3. `const assertion`はすべてのプロパティを固定する

`as const`は、プロパティを`readonly`にするだけでなく、値もリテラル型として固定します。これにより、型の推論がより厳密になります。

## まとめ

- `as const`は、値を`readonly`にし、リテラル型として固定する
- 配列やオブジェクトリテラルに対して特に有用
- `readonly`修飾子とは異なり、再帰的にすべてのプロパティを`readonly`にする
- すべてのプロパティの値をリテラル型として固定するため、型の推論がより厳密になる

## 関連情報

- [型アサーション「as」](/reference/values-types-variables/type-assertion-as)
- [オブジェクト型のreadonlyプロパティ](/reference/values-types-variables/object/readonly-property)
