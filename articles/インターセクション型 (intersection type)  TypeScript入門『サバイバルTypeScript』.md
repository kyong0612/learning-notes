---
title: "インターセクション型 (intersection type) | TypeScript入門『サバイバルTypeScript』"
source: "https://typescriptbook.jp/reference/values-types-variables/intersection"
author:
published:
created: 2025-12-24
description: "インターセクション型はユニオン型と相対する概念で、複数の型を`&`演算子で結合して、すべての型のプロパティを満たす新しい型を作成します。オブジェクト型の合成に特に有効で、`Required<T>`や`Partial<T>`などのユーティリティ型と組み合わせることで、必須プロパティとオプショナルプロパティを明確に分離した型定義が可能になります。"
tags:
  - "clippings"
  - "TypeScript"
  - "intersection-type"
  - "type-system"
  - "utility-types"
---

## 概要

インターセクション型は、ユニオン型と相対する概念です。ユニオン型が「どれか」を意味するのに対し、インターセクション型は「どれも」を意味します。つまり、複数のオブジェクト型の定義を合成させることを指します。

インターセクション型を作るためには、合成したいオブジェクト同士を`&`演算子で列挙します。

## 基本的な使用例

```typescript
type TwoDimensionalPoint = {
  x: number;
  y: number;
};

type Z = {
  z: number;
};

type ThreeDimensionalPoint = TwoDimensionalPoint & Z;

const p: ThreeDimensionalPoint = {
  x: 0,
  y: 1,
  z: 2,
};
```

この例では、xy平面上の点を表す`TwoDimensionalPoint`を拡張して、xyz平面上の点の`ThreeDimensionalPoint`に変換しています。

## プリミティブ型のインターセクション型

プリミティブ型のインターセクション型を作ることもできますが、互いに矛盾する型（例：`string & number`）を結合すると`never`型が生成されます。

```typescript
type Never = string & number;

const n: Never = "2"; // エラー: Type 'string' is not assignable to type 'never'.
```

`never`型にはいかなる値も代入できません。一見使い道がないように見えますが、型システムの高度な使い方で役に立ちます。

## インターセクション型を使いこなす

システムが巨大化し、受け付けたいパラメーターが複雑になった場合、必須プロパティとオプショナルプロパティの区別が分かりにくくなることがあります。

### 問題のある型定義

```typescript
type Parameter = {
  id: string;
  index?: number;
  active: boolean;
  balance: number;
  photo?: string;
  age?: number;
  surname: string;
  givenName: string;
  company?: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  // ...
};
```

このような型定義では、どのプロパティが必須で、どのプロパティが選択可能かが非常にわかりづらいです。

### 解決策: インターセクション型とユーティリティ型の組み合わせ

インターセクション型とユーティリティ型の`Required<T>`と`Partial<T>`を使うことで、より明確に型定義を表現できます。

#### 1. 必須とそうでないパラメータのタイプエイリアスに分離する

```typescript
type Mandatory = {
  id: string;
  active: boolean;
  balance: number;
  surname: string;
  givenName: string;
  email: string;
};

type Optional = {
  index: number;
  photo: string;
  age: number;
  company: string;
  phoneNumber: string;
  address: string;
};
```

#### 2. `Required<T>`と`Partial<T>`をつける

`Mandatory`は`Required<T>`を、`Optional`は`Partial<T>`をつけます。

```typescript
type Mandatory = Required<{
  id: string;
  active: boolean;
  balance: number;
  surname: string;
  givenName: string;
  email: string;
}>;

type Optional = Partial<{
  index: number;
  photo: string;
  age: number;
  company: string;
  phoneNumber: string;
  address: string;
}>;
```

#### 3. インターセクション型で合成する

これで最初に定義した`Parameter`と同じタイプエイリアスができました。

```typescript
type Parameter = Mandatory & Optional;
```

この方法により、必須プロパティとオプショナルプロパティが明確に分離され、型定義の可読性と保守性が向上します。

## まとめ

- インターセクション型は`&`演算子で複数の型を結合し、すべての型のプロパティを満たす型を作成する
- オブジェクト型の合成に特に有効
- `Required<T>`や`Partial<T>`などのユーティリティ型と組み合わせることで、型定義の可読性を向上させることができる
- プリミティブ型のインターセクション型は`never`型になることがあるが、これは型システムの高度な使い方で役立つ
