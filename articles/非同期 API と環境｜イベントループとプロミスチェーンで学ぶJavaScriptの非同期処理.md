---
title: "非同期 API と環境｜イベントループとプロミスチェーンで学ぶJavaScriptの非同期処理"
source: "https://zenn.dev/estra/books/js-async-promise-chain-event-loop/viewer/f-epasync-asynchronous-apis"
author:
  - "PADAone"
published: "2024-08-16"
created: 2025-06-28
description: |
  JavaScriptの非同期処理の文脈において、非同期APIがどのように機能し、ブラウザやNode.jsといった実行環境によって提供されるかを解説します。
tags:
  - "JavaScript"
  - "非同期処理"
  - "API"
  - "イベントループ"
  - "Promise"
---

# 非同期 API と環境

JavaScript はシングルスレッドで動作する言語であり、一度に 1 つのことしか実行できません。しかし、実際にはタイマー処理 (setTimeout) やネットワークリクエスト (fetch) のような時間のかかる処理を、他の処理をブロックすることなく行えます。これを可能にしているのが、JavaScript 実行環境 (ブラウザや Node.js) が提供する**非同期 API** です。

## 実行環境が提供する API

JavaScript エンジン (V8 など) 自体には、非同期処理を行う機能は組み込まれていません。非同期処理を実現する API は、ブラウザや Node.js といった実行環境によって提供され、JavaScript から利用できるようになっています。

これらの API は、JavaScript のメインスレッドとは別の場所 (C++ などで実装された内部スレッド) で実行されます。

### Web API (ブラウザ環境)

ブラウザは、JavaScript の実行に加えて、以下のような Web API を提供します。

* **DOM (Document Object Model) API**: HTML や XML ドキュメントを操作するための API。
* **XMLHttpRequest / Fetch API**: サーバーとの間で HTTP リクエストを行うための API。
* **setTimeout / setInterval**: 指定した時間が経過した後に処理を実行するためのタイマー機能。
* **Geolocation API**: デバイスの地理的な位置情報を取得するための API。
* **Canvas API**: グラフィックスを描画するための API。

`setTimeout` を例に考えてみましょう。

```js
console.log("Start");

setTimeout(() => {
  console.log("Timer finished");
}, 2000); // 2秒後に実行

console.log("End");
```

このコードを実行すると、コンソールには以下の順番で出力されます。

```
Start
End
Timer finished
```

`setTimeout` が呼び出されると、ブラウザはタイマー処理を開始し、即座に次の `console.log("End")` を実行します。JavaScript のメインスレッドはブロックされません。2 秒後、タイマーが完了すると、コールバック関数 `() => { console.log("Timer finished"); }` がタスクキューに追加され、イベントループによって実行されます。

### Node.js API (Node.js 環境)

Node.js はサーバーサイドの JavaScript 実行環境であり、ブラウザとは異なる API を提供します。

* **File System (fs) API**: ファイルシステムの操作 (読み書きなど) を行うための API。
* **HTTP API**: HTTP サーバーやクライアントを実装するための API。
* **Child Processes API**: 新しいプロセスを生成・操作するための API。
* **Worker Threads API**: CPU 負荷の高い処理を別スレッドで実行するための API。

例えば、`fs.readFile` はファイルの読み込みを非同期で行います。

```js
const fs = require('fs');

console.log("Start reading file...");

fs.readFile('/path/to/file', 'utf8', (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }
  console.log("File content:", data);
});

console.log("Continuing with other tasks...");
```

この場合も、ファイルの読み込みという時間のかかる可能性のある処理が、Node.js の内部で非同期に行われ、その間も JavaScript のメインスレッドは他のタスクを実行できます。

## まとめ

* JavaScript はシングルスレッド言語ですが、非同期処理によってノンブロッキングな動作を実現しています。
* `setTimeout` や `fetch`、`fs.readFile` といった非同期 API は、JavaScript エンジン自体ではなく、ブラウザや Node.js といった**実行環境**によって提供されます。
* 非同期 API が呼び出されると、実際の処理は JavaScript のメインスレッドとは別の場所で実行され、完了後に結果がコールバック関数などを通じて通知されます。
* この仕組みにより、時間のかかる I/O 処理 (ネットワーク、ファイルアクセスなど) の間も、アプリケーションの応答性を維持することができます。

このように、JavaScript の非同期モデルを理解するには、言語仕様だけでなく、それが動作する環境が提供する API の役割を理解することが不可欠です。
