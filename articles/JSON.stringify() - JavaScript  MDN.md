---
title: "JSON.stringify() - JavaScript | MDN"
source: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify"
author:
  - "[[MozDevNet]]"
published: 2025-07-22
created: 2025-10-22
description: "JSON.stringify() メソッドは、ある JavaScript のオブジェクトや値を JSON 文字列に変換します。置き換え関数を指定して値を置き換えたり、置き換え配列を指定して指定されたプロパティのみを含むようにしたりすることもできます。"
tags:
  - "JavaScript"
  - "JSON"
  - "API"
  - "シリアライゼーション"
  - "メソッド"
  - "Web開発"
---

## 概要

**`JSON.stringify()`** は、JavaScriptのオブジェクトや値をJSON文字列に変換する標準組み込みメソッドです。2015年7月以降、すべての主要ブラウザで広くサポートされている Baseline 機能です。

### 基本構文

```javascript
JSON.stringify(value)
JSON.stringify(value, replacer)
JSON.stringify(value, replacer, space)
```

## 引数

### value（必須）

JSON文字列に変換する値。

### replacer（省略可）

文字列化の挙動を変更する関数、または出力に含めるプロパティを指定する配列。

- **関数の場合**: `key` と `value` の2つの引数を受け取り、プロパティの値を変換・フィルタリングできます
- **配列の場合**: 配列内の文字列・数値で指定されたプロパティのみが出力に含まれます
- `null` または省略した場合: すべての列挙可能なプロパティが含まれます

### space（省略可）

可読性向上のための空白文字を挿入。

- **数値**: インデントに使用する空白文字の数（最大10）
- **文字列**: インデント文字として使用（最初の10文字まで）
- それ以外: 空白なし

## 値の変換ルール

### プリミティブ型とオブジェクト

- `Boolean`、`Number`、`String` オブジェクトは対応するプリミティブ値に変換
- `Symbol` オブジェクトはプレーンオブジェクトとして扱われる

### 特殊な値の扱い

- `undefined`、関数、シンボル:
  - オブジェクト内: 省略される
  - 配列内: `null` に変換
  - 単独で渡した場合: `undefined` を返す
- `Infinity`、`NaN`: `null` に変換
- `BigInt`: 例外が発生（`toJSON()` メソッドがあれば使用可能）

### 配列

- 0から `length - 1` までの添字のみが文字列化される
- その他のプロパティは無視される

### オブジェクト

- **シンボルキー**: 完全に無視される
- **`toJSON()` メソッド**: 定義されている場合、その返値が文字列化される
  - `Date` インスタンスは `toISOString()` を返す `toJSON()` を実装
- **列挙可能なプロパティのみ**: `Map`、`Set` などは `"{}"`に変換
- **プロパティの順序**: `Object.keys()` と同じアルゴリズムで一貫性のある順序

## replacer 関数の詳細

replacer関数は以下の順序で呼び出されます：

1. 最初に空文字列 `""` をキーとして、文字列化されるオブジェクト全体に対して呼び出される
2. その後、各プロパティに対して順次呼び出される

返値による動作：

- 数値、文字列、論理値、`null`: その値を文字列化
- 関数、シンボル、`undefined`: プロパティを出力から除外
- その他のオブジェクト: 再帰的に文字列化

## 実用例

### 基本的な使用

```javascript
JSON.stringify({ x: 5, y: 6 });
// '{"x":5,"y":6}'

JSON.stringify([new Number(3), new String("false"), new Boolean(false)]);
// '[3,"false",false]'

JSON.stringify(new Date(1906, 0, 2, 15, 4, 5));
// '"1906-01-02T15:04:05.000Z"'
```

### replacer関数でフィルタリング

```javascript
function replacer(key, value) {
  if (typeof value === "string") {
    return undefined; // 文字列プロパティを除外
  }
  return value;
}

const foo = { foundation: "Mozilla", model: "box", week: 45 };
JSON.stringify(foo, replacer);
// '{"week":45}'
```

### replacer配列で特定プロパティのみ出力

```javascript
const foo = { foundation: "Mozilla", week: 45, month: 7 };
JSON.stringify(foo, ["week", "month"]);
// '{"week":45,"month":7}'
```

### space引数で整形

```javascript
JSON.stringify({ a: 2 }, null, " ");
/*
{
 "a": 2
}
*/

JSON.stringify({ uno: 1, dos: 2 }, null, "\t");
/*
{
 "uno": 1,
 "dos": 2
}
*/
```

### toJSON()によるカスタムシリアライゼーション

```javascript
const obj = {
  data: "data",
  toJSON(key) {
    return key ? `Now I am a nested object under key '${key}'` : this;
  },
};

JSON.stringify(obj);
// '{"data":"data"}'

JSON.stringify({ obj });
// '{"obj":"Now I am a nested object under key 'obj'"}'
```

### localStorageでの使用例

```javascript
const session = {
  screens: [],
  state: true,
};
session.screens.push({ name: "screenA", width: 450, height: 250 });

// 保存
localStorage.setItem("session", JSON.stringify(session));

// 復元
const restoredSession = JSON.parse(localStorage.getItem("session"));
```

## 重要な制限事項と注意点

### 循環参照

JSON形式はオブジェクト参照に対応していないため、循環参照を含むオブジェクトは `TypeError` を発生させます。

```javascript
const circularReference = {};
circularReference.myself = circularReference;
JSON.stringify(circularReference);
// TypeError: cyclic object value
```

**解決策**:

- 循環参照に対応したライブラリを使用（Douglas Crockfordの cycle.js など）
- ディープコピーには `structuredClone()` を使用（循環参照対応）
- Node.jsの `v8.serialize()` などバイナリシリアライゼーションAPI

### Well-formed JSON.stringify()

サロゲート文字（U+D800からU+DFFF）は、リテラルではなくUnicodeエスケープシーケンスで文字列化されます。

```javascript
// 旧仕様
JSON.stringify("\uD800"); // '"�"'

// 新仕様（well-formed）
JSON.stringify("\uD800"); // '"\\ud800"'
```

これにより、妥当なUTF-8/UTF-16エンコーディングが保証されます。

### 標準データ構造の扱い

```javascript
JSON.stringify([
  new Set([1]),
  new Map([[1, 2]]),
  new WeakSet([{ a: 1 }]),
  new WeakMap([[{ a: 1 }, 2]]),
]);
// '[{},{},{},{}]'
```

`Map`、`Set` などのコレクションは空のオブジェクトとして変換されるため、replacer関数でカスタム変換が必要です。

## ブラウザ互換性

ECMAScript 2026仕様に含まれ、すべての主要ブラウザ（Chrome、Firefox、Safari、Edge）でサポートされています。well-formed JSON.stringify仕様も広く実装されています。

## 関連メソッド

- **`JSON.parse()`**: JSON文字列をJavaScriptオブジェクトに変換（`reviver`引数で逆変換をカスタマイズ可能）
- **`JSON.rawJSON()`**: 生のJSONテキストを扱うための特殊メソッド
- **`structuredClone()`**: 循環参照に対応したディープコピー
- **`JSON.isRawJSON()`**: 生JSONオブジェクトかどうかを判定
