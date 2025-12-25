---
title: "型エイリアス (type alias) | TypeScript入門『サバイバルTypeScript』"
source: "https://typescriptbook.jp/reference/values-types-variables/type-alias"
author:
published:
created: 2025-12-25
description: "TypeScriptでは、型に名前をつけられます。名前のついた型を型エイリアス(タイプエイリアス; type alias)と呼びます。型エイリアスは`type`キーワードを使って宣言し、同じ型を再利用したいときに便利です。型の定義が一箇所になるため、保守性が向上し、型に名前を与えることで可読性も上がります。"
tags:
  - "clippings"
  - "TypeScript"
  - "型エイリアス"
  - "type-alias"
  - "型システム"
---

## 概要

TypeScriptでは、型に名前をつけることができます。名前のついた型を**型エイリアス（type alias）**と呼びます。型エイリアスは、型の再利用性を高め、コードの可読性と保守性を向上させる重要な機能です。

## 型エイリアスの宣言

型エイリアスを宣言するには`type`キーワードを使用します。

```typescript
type StringOrNumber = string | number;
```

この例では、`string | number`型に`StringOrNumber`という型名を付けています。型エイリアスは、`string`などのビルトインの型と同様に、変数や引数、戻り値の型注釈などで使用できます。

```typescript
const value: StringOrNumber = 123;
```

## 型エイリアスの使用例

型エイリアスはさまざまな型に名前をつけることができます。以下に主要な使用例を示します。

### プリミティブ型

```typescript
type Str = string;
```

### リテラル型

```typescript
type OK = 200;
```

### 配列型

```typescript
type Numbers = number[];
```

### オブジェクト型

```typescript
type UserObject = { id: number; name: string };
```

### ユニオン型

```typescript
type NumberOrNull = number | null;
```

### 関数型

```typescript
type CallbackFunction = (value: string) => boolean;
```

## 型エイリアスの使い道

型エイリアスは以下のような場面で特に有効です：

1. **型の再利用**: 同じ型を複数箇所で使用する場合、型エイリアスを使うことで型の定義を一箇所に集約できます。これにより、型定義の変更が必要になった際の保守性が向上します。

2. **可読性の向上**: 型に名前を与えることで、その型が何を意味しているのかがコードの読み手に伝わりやすくなります。例えば、`string | number`よりも`StringOrNumber`の方が意図が明確です。

3. **複雑な型の簡略化**: 複雑な型定義を型エイリアスにまとめることで、コードが簡潔になり、理解しやすくなります。

## 関連情報

- [interfaceとtypeの違い](/reference/object-oriented/interface/interface-vs-type-alias): `interface`での宣言と`type alias`による宣言の違いについて

## まとめ

型エイリアスは、TypeScriptで型に名前をつけるための機能です。`type`キーワードを使用して宣言し、型の再利用性とコードの可読性を向上させることができます。同じ型を複数箇所で使用する場合や、型の意味を明確にしたい場合に特に有効です。
