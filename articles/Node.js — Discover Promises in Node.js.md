---
title: "Node.js — Discover Promises in Node.js"
source: "https://nodejs.org/en/learn/asynchronous-work/discover-promises-in-nodejs"
author:
  - "AK"
published:
created: 2025-07-11
description: |
  A Promise is a special object in JavaScript that represents the eventual completion (or failure) of an asynchronous operation and its resulting value. Essentially, a Promise is a placeholder for a value that is not yet available but will be in the future.
tags:
  - "clippings"
  - "Node.js"
  - "Promise"
  - "async/await"
  - "asynchronous"
  - "JavaScript"
---

## Node.jsにおけるPromiseの発見

**Promise** は、非同期操作の最終的な完了（または失敗）とその結果の値を表現するJavaScriptの特別なオブジェクトです。本質的に、Promiseはまだ利用できないが将来的に利用可能になる値のプレースホルダーとして機能します。

ピザを注文するようなものだと考えてください。すぐには手に入りませんが、配達員が後で届けると約束してくれます。いつ届くかは正確にはわかりませんが、結果は「ピザが配達された」か「何か問題が発生した」のどちらかになります。

### Promiseの状態

Promiseには3つの状態があります：

* **Pending（保留中）**: 初期状態。非同期操作がまだ実行中です。
* **Fulfilled（履行済み）**: 操作が正常に完了し、Promiseが値で解決された状態。
* **Rejected（拒否済み）**: 操作が失敗し、Promiseが理由（通常はエラー）で確定した状態。

Promiseが最終的な結果に達すると、**settled（確定済み）**と見なされます。

### Promiseの基本構文

`new Promise()`コンストラクタを使用してPromiseを作成するのが一般的です。このコンストラクタは、`resolve`と`reject`という2つのパラメータを持つ関数を受け取ります。これらの関数は、Promiseを**保留中**の状態から**履行済み**または**拒否済み**の状態に遷移させるために使用されます。

```javascript
const myPromise = new Promise((resolve, reject) => {
  const success = true;

  if (success) {
    resolve('Operation was successful!');
  } else {
    reject('Something went wrong.');
  }
});
```

### Promiseのハンドリング：`.then()`, `.catch()`, `.finally()`

Promiseが作成されると、`.then()`、`.catch()`、`.finally()`メソッドを使用してその結果を処理できます。

* `.then()`: 履行されたPromiseを処理し、その結果にアクセスするために使用します。
* `.catch()`: 拒否されたPromiseを処理し、発生したエラーをキャッチするために使用します。
* `.finally()`: Promiseが解決されたか拒否されたかに関わらず、確定したPromiseを処理するために使用します。

```javascript
myPromise
  .then(result => {
    console.log(result); // Promiseが履行された場合に実行
  })
  .catch(error => {
    console.error(error); // Promiseが拒否された場合に実行
  })
  .finally(() => {
    console.log('The promise has completed'); // Promiseが確定したときに実行
  });
```

### Promiseのチェーン

Promiseの優れた機能の1つは、複数の非同期操作を連結できることです。各`.then()`ブロックは、前のブロックが完了するのを待ってから実行されます。

```javascript
const { setTimeout: delay } = require('node:timers/promises');

delay(1000)
  .then(() => 'First task completed')
  .then(result => {
    console.log(result);
    return delay(1000).then(() => 'Second task completed');
  })
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error(error);
  });
```

### `async/await`とPromise

モダンなJavaScriptでPromiseを扱う最良の方法の1つが**`async/await`**です。これにより、同期的であるかのように見える非同期コードを書くことができ、可読性と保守性が向上します。

* `async`: Promiseを返す関数を定義するために使用します。
* `await`: `async`関数内で、Promiseが確定するまで実行を一時停止するために使用します。

```javascript
async function performTasks() {
  try {
    const result1 = await promise1;
    console.log(result1);

    const result2 = await promise2;
    console.log(result2);
  } catch (error) {
    console.error(error);
  }
}
```

#### トップレベルAwait

ECMAScriptモジュールを使用する場合、モジュール自体が非同期操作をネイティブにサポートするトップレベルスコープとして扱われます。つまり、`async`関数なしでトップレベルで`await`を使用できます。

### PromiseベースのNode.js API

Node.jsは、多くのコアAPIに対してPromiseベースのバージョンを提供しており、特に従来コールバックで処理されていた非同期操作で利用できます。これにより、「コールバック地獄」のリスクが軽減されます。

例えば、`fs`（ファイルシステム）モジュールには`fs.promises`以下にPromiseベースのAPIがあります。

```javascript
const fs = require('node:fs/promises');

async function readFile() {
  try {
    const data = await fs.readFile('example.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error('Error reading file:', err);
  }
}
```

### 高度なPromiseメソッド

* `Promise.all(promises)`: すべてのPromiseが履行されると解決されます。1つでも拒否されると即座に拒否されます。
* `Promise.allSettled(promises)`: すべてのPromiseが確定（履行または拒否）するのを待ち、各Promiseの結果を記述したオブジェクトの配列を返します。
* `Promise.race(promises)`: 最初のPromiseが確定（履行または拒否）するとすぐに解決または拒否されます。
* `Promise.any(promises)`: いずれかのPromiseが履行されるとすぐに解決されます。すべてが拒否された場合は`AggregateError`で拒否されます。
* `Promise.resolve(value)` / `Promise.reject(reason)`: 即座に解決または拒否されたPromiseを作成します。
* `Promise.try(fn)`: 同期・非同期を問わず関数を実行し、結果をPromiseでラップします。同期的なエラーも`.catch()`で捕捉できるため便利です。
* `Promise.withResolvers()`: Promiseとその`resolve`・`reject`関数をオブジェクトとして作成し返します。Promiseの外部から制御したい場合に有用です。

### Promiseのエラーハンドリング

`.catch()`メソッドや、`async/await`構文の`try/catch`ブロックを使用してエラーを処理することが重要です。これにより、アプリケーションが予期せぬ状況でも正しく動作するようになります。

```javascript
// async/awaitでのエラーハンドリング
async function performTask() {
  try {
    const result = await myPromise;
    console.log(result);
  } catch (error) {
    console.error(error);
  } finally {
    console.log('performTask() completed');
  }
}
```

### イベントループでのタスクスケジューリング

* `queueMicrotask(callback)`: 現在のスクリプト実行後、他のI/Oイベントやタイマーの前に実行されるマイクロタスクをスケジュールします。Promiseの解決などで使用されます。
* `process.nextTick(callback)`: 現在の操作が完了した直後にコールバックを実行します。I/Oイベントの前に実行したい場合に利用します。
* `setImmediate(callback)`: イベントループのチェックフェーズでコールバックを実行します。これはポーリングフェーズの後です。

これらのタスク内の未捕捉例外は、周囲の`try/catch`では捕捉されず、アプリケーションをクラッシュさせる可能性があるため、適切なエラー管理が必要です。
