---
title: "JSON stringify a Set"
source: "https://stackoverflow.com/questions/31190885/json-stringify-a-set"
author:
  - MitMaro (質問者)
  - Oriol (回答者)
  - tanguy_k (回答者)
  - Stephen Bolton (回答者)
published: 2015-07-02
created: 2025-10-21
description: JavaScriptのSetオブジェクトをJSON.stringify()で文字列化する方法についてのStack Overflowの質問。Setは通常のJSON.stringify()では空オブジェクト"{}"として出力されるため、配列への変換やreplacer関数などの解決策が提案されている。
tags:
  - javascript
  - json
  - ecmascript-6
  - set
  - json-stringify
---

## 問題の概要

JavaScriptの`Set`オブジェクトを`JSON.stringify()`で文字列化しようとすると、空のオブジェクト`{}`として出力される問題があります。

```javascript
var s = new Set(['foo', 'bar']);

JSON.stringify(s);           // -> "{}"
JSON.stringify(s.values());  // -> "{}"
JSON.stringify(s.keys());    // -> "{}"
```

期待される出力は配列のような形式です：

```javascript
JSON.stringify(["foo", "bar"]); // -> "["foo","bar"]"
```

## 解決策

### 1. Setを配列に変換する（最も推奨）

`JSON.stringify()`はSetのデータがプロパティとして格納されていないため直接扱えません。そのため、Setを配列に変換してから文字列化します。

以下のいずれの方法でも可能です：

```javascript
JSON.stringify([...s]);
JSON.stringify([...s.keys()]);
JSON.stringify([...s.values()]);
JSON.stringify(Array.from(s));
JSON.stringify(Array.from(s.keys()));
JSON.stringify(Array.from(s.values()));
```

**注意点：** Chrome 43では、スプレッド演算子や`Array.from()`がデフォルトで有効になっていない場合があります。その場合は`chrome://flags/#enable-javascript-harmony`を有効にするか、Babelを使用してトランスパイルする必要があります。

### 2. Replacer関数を使用する（柔軟性が高い）

`JSON.stringify()`の第2引数にreplacer関数を渡すことで、Setを含むオブジェクト全体を処理できます：

```javascript
const fooBar = {
  foo: new Set([1, 2, 3]),
  bar: new Set([4, 5, 6])
};

JSON.stringify(
  fooBar,
  (_key, value) => (value instanceof Set ? [...value] : value)
);
// 結果: "{"foo":[1,2,3],"bar":[4,5,6]}"
```

**ES6での簡潔な書き方：**

```javascript
JSON.stringify(fooBar, (key, value) => value instanceof Set ? [...value] : value)
```

この方法は、ネストされたオブジェクト内のSetも自動的に処理できるため、複雑なデータ構造に適しています。

**重要：** `toJSON`メソッドを追加する方法は、レガシー機能とみなされているため推奨されません。Replacer関数を使用する方が適切です。
（参考：<https://github.com/DavidBruant/Map-Set.prototype.toJSON/issues/16）>

### 3. Setをサブクラス化する（頻繁に使用する場合）

Reduxストアなど、Setを頻繁に文字列化する必要がある場合は、Setをサブクラス化して`toJSON`メソッドを追加する方法もあります：

```javascript
class JSONSet extends Set {
    toJSON() {
        return [...this]
    }
}

const set = new JSONSet([1, 2, 3])
console.log(JSON.stringify(set))
```

ただし、前述の通り`toJSON`はレガシー機能とされているため、replacer関数の使用が推奨されます。

### 4. オブジェクトとして扱う（パフォーマンス重視）

Setを配列に変換すると、Setの本来の目的（高速な検索）が失われます。パフォーマンスを重視する場合は、オブジェクトに変換する方法もあります：

```javascript
const mySet = new Set(['hello', 'world']);
const myObj = {};
for (let value of mySet.values()) {
  myObj[value] = true;
}
```

その後、`mySet.has('hello')`の代わりに`myObj.hasOwnProperty('hello')`を使用します。

**注意点：**

- この方法はキーと値の両方を保存するため、メモリ使用量が増加します
- しかし、`Array.includes()`のO(n)と比較して、O(1)の検索パフォーマンスを維持できます

## パース時の考慮事項

Setを配列として文字列化した場合、`JSON.parse()`で復元すると配列になります。Setに戻すには、reviver関数を使用する必要があります：

```javascript
// パース時にSetを識別するため、配列の先頭に"__isSet"などのマーカーを追加
// reviver関数でこのマーカーをチェックし、Setに変換
```

## まとめ

- **シンプルな変換が必要な場合：** `JSON.stringify([...set])`を使用
- **複雑なオブジェクト構造の場合：** Replacer関数を使用
- **パフォーマンスが重要な場合：** オブジェクトへの変換を検討

最も一般的で推奨される方法は、スプレッド演算子または`Array.from()`を使用してSetを配列に変換することです。
