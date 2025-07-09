---
title: "コールスタックと実行コンテキスト｜イベントループとプロミスチェーンで学ぶJavaScriptの非同期処理"
source: "https://zenn.dev/estra/books/js-async-promise-chain-event-loop/viewer/b-epasync-callstack-execution-context"
author:
  - "PADAone"
published: 2025-05-31
created: 2025-07-09
description: |
  この記事では、JavaScriptの実行メカニズムの中心であるコールスタックと実行コンテキストについて詳しく解説します。シングルスレッドの性質から、グローバル、関数、evalという3つの実行コンテキストの種類、そしてそれらがどのようにスタックで管理されるかを学びます。
tags:
  - "clippings"
  - "JavaScript"
  - "非同期処理"
  - "コールスタック"
  - "実行コンテキスト"
  - "イベントループ"
---

# コールスタックと実行コンテキスト

[![PADAone🐕](https://res.cloudinary.com/zenn/image/fetch/s--XVoj6cOU--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_70/https://storage.googleapis.com/zenn-user-upload/avatar/7f05673c72.jpeg)](https://zenn.dev/estra)

## JavaScript はシングルスレッド

JavaScript は**シングルスレッド (single thread)** であり、一度に一つしかできないという性質を持っています。一つのメインスレッドでコードを上から順番に実行していきます。

シングルスレッドであることのメリットは、リソースの競合 (race condition) が発生せず、デッドロックが起こらないことです。しかし、デメリットは、重い処理 (ネットワークリクエストやアニメーションなど) があるとその処理が終わるまで他の処理をブロックしてしまう (同期的に実行されてしまう) ことです。

```js
// 1
console.log("１番目の処理");

// 2
// 時間のかかる重い処理
const start = performance.now();
while (performance.now() - start < 1000) {
  // 1 秒間、他の処理をブロックする
}

// 3
console.log("２番目の処理");
```

これを解決するのが非同期処理です。非同期処理を理解するためには、JavaScript の実行メカニズムである**コールスタック (Call stack)** と**実行コンテキスト (Execution context)** を理解する必要があります。

## コールスタック (Call stack)

**コールスタック**は、プログラムの実行中に呼び出された関数の情報を記録するためのデータ構造です。LIFO (Last-In, First-Out) の原則に従い、最後に追加された関数が最初に実行されます。

JavaScript エンジン (V8 など) は、スクリプトが読み込まれると、まずグローバル実行コンテキストを作成し、それをコールスタックにプッシュします。関数が呼び出されるたびに、その関数の実行コンテキストが作成され、コールスタックにプッシュされます。関数が終了すると、その実行コンテキストはコールスタックからポップされます。

![コールスタックの図](https://storage.googleapis.com/zenn-user-upload/cb7a75908b8b-20220412.png)
_<https://medium.com/jspoint/how-javascript-works-in-browser-and-node-559c1e7c5a2e> より引用_

## 実行コンテキスト (Execution context)

**実行コンテキスト**は、コードが実行される環境そのものを指し、コードの実行に必要な全ての情報 (変数、関数、スコープチェーン、`this` の値など) を含んでいます。

実行コンテキストには以下の 3 つの種類があります。

1. **グローバル実行コンテキスト (Global execution context)**
2. **関数実行コンテキスト (Function execution context)**
3. **eval 実行コンテキスト (Eval execution context)**

### グローバル実行コンテキスト

グローバル実行コンテキストは、プログラムの実行が開始されたときに最初に作成されるデフォルトのコンテキストです。トップレベルのコード (どの関数にも属さないコード) がこのコンテキストで実行されます。

グローバル実行コンテキストは、ブラウザ環境では `window` オブジェクト、Node.js 環境では `global` オブジェクトを生成します。また、`this` の値もこのグローバルオブジェクトを指します。

### 関数実行コンテキスト

関数実行コンテキストは、関数が呼び出されるたびに新しく作成されます。各関数はそれぞれ独自の実行コンテキストを持ちます。

関数実行コンテキストは、`arguments` オブジェクト (アロー関数を除く) など、関数内で使用される情報を含みます。

### eval 実行コンテキスト

`eval` 関数は、文字列として渡された JavaScript コードを実行します。`eval` 関数が呼び出されると、`eval` 実行コンテキストが作成され、コールスタックにプッシュされます。

`eval` の使用は、セキュリティリスクやパフォーマンスの問題があるため、一般的には非推奨です。

## 実行フェーズと作成フェーズ

実行コンテキストには、**作成フェーズ (Creation Phase)** と**実行フェーズ (Execution Phase)** の 2 つのフェーズがあります。

1. **作成フェーズ**:
    * **LexicalEnvironment (静的字句環境)** と **VariableEnvironment (動的変数環境)** が作成される。
    * スコープチェーンが作成され、変数のスコープが決定される。
    * `this` の値が決定される。
    * 変数や関数のメモリが確保される (Hoisting)。

2. **実行フェーズ**:
    * コードが一行ずつ実行される。
    * 変数に値が代入される。

## 実行コンテキストの可視化

以下のコードを使って、実行コンテキストの動きを可視化してみましょう。

```js
let a = 20;
const b = 30;
var c;

function multiply(e, f) {
  var g = 20;
  return e * f * g;
}

c = multiply(20, 30);
```

1. **グローバル実行コンテキストの作成フェーズ**:
    * `a`, `b`, `c`, `multiply` がメモリに確保される。`a` と `b` は `uninitialized` 状態。`c` と `multiply` は `undefined`。
2. **グローバル実行コンテキストの実行フェーズ**:
    * `a` に `20`、`b` に `30` が代入される。
    * `multiply` 関数が呼び出される。
3. **`multiply` 関数実行コンテキストの作成フェーズ**:
    * `e`, `f`, `g` がメモリに確保され、`undefined` で初期化される。`arguments` オブジェクトが作成される。
4. **`multiply` 関数実行コンテキストの実行フェーズ**:
    * `e` に `20`、`f` に `30`、`g` に `20` が代入される。
    * `e * f * g` (12000) が計算され、`return` される。
5. **グローバル実行コンテキストの実行フェーズ (再開)**:
    * `multiply` の返り値 `12000` が `c` に代入される。
    * スクリプトが終了し、プログラムが完了する。

このように、JavaScript エンジンはコールスタックと実行コンテキストを利用してコードを管理・実行しています。この仕組みを理解することが、非同期処理を学ぶ上での重要な基礎となります。
