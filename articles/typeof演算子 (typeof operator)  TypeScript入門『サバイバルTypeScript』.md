---
title: "typeof演算子 (typeof operator) | TypeScript入門『サバイバルTypeScript』"
source: "https://typescriptbook.jp/reference/values-types-variables/typeof-operator"
author:
published:
created: 2025-12-25
description: "JavaScriptのtypeof演算子の使い方と、TypeScriptでの型ガードとしての活用方法について説明しています。nullや配列の判別における注意点も含まれています。"
tags:
  - "clippings"
  - "TypeScript"
  - "JavaScript"
  - "typeof"
  - "型ガード"
  - "型推論"
---

## 概要

JavaScriptの`typeof`演算子は、値の型を調べるための演算子です。TypeScriptでは、この演算子をifやswitchと組み合わせることで、型ガードとして機能し、制御フロー分析によって変数の型を絞り込むことができます。

## typeof演算子の基本的な使い方

JavaScriptの`typeof`演算子は、様々な値に対して以下のような文字列を返します：

```javascript
typeof true; //=> "boolean"
typeof 0; //=> "number"
typeof "Hello World"; //=> "string"
typeof undefined; //=> "undefined"
typeof null; //=> "object"  // 注意: nullは"object"を返す
typeof Symbol(); //=> "symbol"
typeof 1n; //=> "bigint"
typeof [1, 2, 3]; //=> "object"  // 配列も"object"を返す
typeof { a: 1, b: 2 }; //=> "object"
typeof (() => {}); //=> "function"
```

## TypeScriptでのtypeofを使った型ガード

TypeScriptでは、`typeof`演算子をifやswitchと併せて使うと、条件と合致したときにその変数をその型として扱えるようになります。これは**制御フロー分析（control flow analysis）**の機能です。

```typescript
const n: unknown = "";

if (typeof n === "string") {
  // このブロック内では、nはstring型として扱われる
  n.toUpperCase(); // 型安全にメソッドを呼び出せる
}
```

この機能により、`unknown`型の変数を安全に型を絞り込んで使用することができます。

## nullを判別する際の注意点

`typeof`演算子で特筆すべきなのは、値が`null`の場合です。`typeof null`の演算結果は`"null"`ではなく`"object"`を返します。これはJavaScriptの仕様によるもので、誤解が起きやすい部分なので注意が必要です。

特に値がオブジェクトかどうかを判定したいときは、`typeof null`が`"object"`になることを意識して書かないと思いがけない不具合になることがあります。

### まずい実装例

```javascript
// まずい実装
function isObject(value) {
  return typeof value === "object"; // valueがnullになる場合を考慮していない
}

isObject(null); // 戻り値がtrueになってしまう（誤り）
```

### 正しい実装例

```javascript
function isObject(value) {
  return value !== null && typeof value === "object";
}
```

`null`を明示的に除外することで、正しくオブジェクトを判別できます。

## 配列を判別する

配列を`typeof`にかけると`"object"`となります。これは不具合でもなんでもなく、配列はオブジェクトであるのでそのように判別されます。

配列かどうかを判別する機会は多いため、専用に`Array.isArray()`というメソッドが`Array`オブジェクトにあります。

### Array.isArray()の使用

TypeScriptでは、`Array.isArray()`を使ってtrueの戻り値が帰ってきた場合、その変数は`any[]`型であると判別されます。

```typescript
if (Array.isArray(n)) {
  // n is any[]
}
```

`any[]`型を任意の型の配列として判別したい場合は、各要素に対して`typeof`や`Array.isArray()`など型を調べる関数を使います。

## 関連トピック

- **typeof型演算子**: TypeScriptには、変数から型を抽出する`typeof`型演算子もあります。これはJavaScriptの`typeof`演算子とは異なる機能です。
- **unknown型**: TypeScriptの`unknown`型は、型が何かわからないときに使う型です。
- **型ガード関数**: TypeScriptのコンパイラはifやswitchといった制御フローの各場所での変数の型を分析しており、この機能を制御フロー分析と呼びます。

## まとめ

- JavaScriptの`typeof`演算子は値の型を文字列として返す
- TypeScriptでは`typeof`を型ガードとして使用でき、制御フロー分析によって型を絞り込める
- `typeof null`は`"object"`を返すため、オブジェクト判定時は`null`チェックが必要
- 配列の判別には`Array.isArray()`を使用する
- TypeScriptの`typeof`型演算子とは別物であることに注意
