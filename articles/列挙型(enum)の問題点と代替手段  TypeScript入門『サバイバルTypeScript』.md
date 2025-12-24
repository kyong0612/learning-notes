---
title: "列挙型(enum)の問題点と代替手段 | TypeScript入門『サバイバルTypeScript』"
source: "https://typescriptbook.jp/reference/values-types-variables/enum/enum-problems-and-alternatives-to-enums"
author:
published:
created: 2025-12-24
description: "TypeScriptの列挙型(enum)にはいくつか問題点が指摘されています。JavaScriptから離れすぎた独自機能、数値列挙型の型安全性の問題、文字列列挙型だけが公称型になる不整合などがあります。ユニオン型やオブジェクトリテラルを使った代替案を紹介します。"
tags:
  - "clippings"
  - "TypeScript"
  - "enum"
  - "型安全性"
  - "ユニオン型"
  - "代替手段"
---

## 列挙型(enum)の問題点と代替手段

## 列挙型の問題点

### 列挙型はTypeScript独自すぎる

TypeScriptはJavaScriptを拡張した言語であり、型の世界に限って機能を追加するという思想があります。型に関する部分を除けば、JavaScriptの文法から離れすぎない言語設計になっています。

しかし、列挙型は以下の点でJavaScriptから離れすぎています：

- 構文がJavaScriptに存在しない
- コンパイル後の列挙型がJavaScriptのオブジェクトに変化する（型の世界の拡張からはみ出している）

この独自機能が受け入れられないTypeScriptプログラマーもいます。

### 数値列挙型には型安全上の問題がある

数値列挙型には、`number`型なら何でも代入できてしまう型安全上の問題があります。

#### TypeScript 5.0未満での問題

TypeScript 5.0未満では、列挙型のメンバー以外の数値も代入できてしまいます：

```typescript
// TypeScript v4.9.5
enum ZeroOrOne {
  Zero = 0,
  One = 1,
}

const zeroOrOne: ZeroOrOne = 9; // コンパイルエラーは起きない！
```

#### TypeScript 5.0以降での改善

TypeScript 5.0からは改善されており、コンパイルエラーとなります：

```typescript
// TypeScript v5.0.4
enum ZeroOrOne {
  Zero = 0,
  One = 1,
}

const zeroOrOne: ZeroOrOne = 9; // Type '9' is not assignable to type 'ZeroOrOne'.
```

#### 値でのアクセスの問題

列挙型オブジェクトに値でアクセスすると、メンバー名を得られる仕様がありますが、メンバーに無い値でアクセスしてもコンパイルエラーになりません：

```typescript
enum ZeroOrOne {
  Zero = 0,
  One = 1,
}

console.log(ZeroOrOne[0]); // "Zero" - 期待どおり
console.log(ZeroOrOne[9]); // undefined - コンパイルエラーになってほしいところ
```

### 文字列列挙型だけ公称型になる

TypeScriptの型システムは構造的部分型を採用していますが、文字列列挙型は例外的に公称型になります：

```typescript
enum StringEnum {
  Foo = "foo",
}

const foo1: StringEnum = StringEnum.Foo; // コンパイル通る
const foo2: StringEnum = "foo"; // コンパイルエラーになる
// Type '"foo"' is not assignable to type 'StringEnum'.
```

この仕様は意外さがあり、数値列挙型は公称型にならないため、不揃いな点でもあります。

## 列挙型の代替案

列挙型の代替案をいくつか提示します。ただし、どの代替案も列挙型の特徴を100%再現するものではありません。目的や用途に合う合わないを判断して使い分けてください。

### 列挙型の代替案1: ユニオン型

もっともシンプルな代替案はユニオン型を用いる方法です：

```typescript
type YesNo = "yes" | "no";

function toJapanese(yesno: YesNo) {
  switch (yesno) {
    case "yes":
      return "はい";
    case "no":
      return "いいえ";
  }
}
```

ユニオン型とシンボルを組み合わせる方法もあります：

```typescript
const yes = Symbol();
const no = Symbol();
type YesNo = typeof yes | typeof no;

function toJapanese(yesno: YesNo) {
  switch (yesno) {
    case yes:
      return "はい";
    case no:
      return "いいえ";
  }
}
```

### 列挙型の代替案2: オブジェクトリテラル

オブジェクトリテラルを使う方法もあります：

```typescript
const Position = {
  Top: 0,
  Right: 1,
  Bottom: 2,
  Left: 3,
} as const;

type Position = (typeof Position)[keyof typeof Position];
// 上は type Position = 0 | 1 | 2 | 3 と同じ意味になります

function toJapanese(position: Position) {
  switch (position) {
    case Position.Top:
      return "上";
    case Position.Right:
      return "右";
    case Position.Bottom:
      return "下";
    case Position.Left:
      return "左";
  }
}
```

## まとめ

列挙型には以下の問題点があります：

1. **TypeScript独自すぎる**: JavaScriptの文法から離れすぎており、コンパイル後にオブジェクトに変化する
2. **型安全上の問題**: 数値列挙型では、TypeScript 5.0未満ではメンバー以外の数値も代入できてしまう
3. **型システムの不整合**: 文字列列挙型だけが公称型になり、数値列挙型は構造的部分型のまま

代替案として、ユニオン型やオブジェクトリテラルを使用することで、よりJavaScriptに近い形で同様の機能を実現できます。特に列挙型は型安全上の問題もあるため、列挙型を積極的に使うかどうかは、よく検討する必要があります。
