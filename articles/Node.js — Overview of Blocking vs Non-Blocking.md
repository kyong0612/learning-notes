---
title: "Node.js — Overview of Blocking vs Non-Blocking"
source: "https://nodejs.org/en/learn/asynchronous-work/overview-of-blocking-vs-non-blocking#overview-of-blocking-vs-non-blocking"
author:
  - "Node.js"
  - "CW"
  - "H"
published:
created: 2025-07-09
description: |
  This overview covers the difference between blocking and non-blocking calls in Node.js. It refers to the event loop and libuv but no prior knowledge of those topics is required. Readers are assumed to have a basic understanding of the JavaScript language and Node.js callback pattern.
tags:
  - "clippings"
  - "Node.js"
  - "asynchronous"
  - "blocking"
  - "non-blocking"
  - "I/O"
---

この記事では、Node.jsにおける**ブロッキング**と**ノンブロッキング**の呼び出しの違いについて概説します。I/Oとは、主に[libuv](https://libuv.org/)によってサポートされるシステムのディスクやネットワークとの対話を指します。

## ブロッキング (Blocking)

**ブロッキング**とは、Node.jsプロセス内での追加のJavaScriptの実行が、JavaScript以外の操作が完了するまで待機しなければならない状態のことです。これは、ブロッキング操作が発生している間、イベントループがJavaScriptの実行を継続できないために起こります。

一般的に、I/Oを待つのではなくCPU負荷が高いことが原因でパフォーマンスが低下するJavaScriptは、ブロッキングとは呼ばれません。Node.js標準ライブラリ内のlibuvを使用する同期メソッドが、最も一般的に使用されるブロッキング操作です。

## コードの比較

ブロッキングメソッドは**同期的**に実行され、ノンブロッキングメソッドは**非同期**に実行されます。

### 同期的な例 (ブロッキング)

ファイルシステムモジュールを使用した同期的なファイル読み込みの例です。`fs.readFileSync`は、ファイルが読み込まれるまで後続のコードの実行をブロックします。

```javascript
const fs = require('node:fs');

const data = fs.readFileSync('/file.md'); // ここでファイルが読み終わるまでブロックする
console.log(data);
moreWork(); // console.logの後に実行される
```

### 非同期的な例 (ノンブロッキング)

等価な非同期の例です。`fs.readFile`はノンブロッキングであるため、JavaScriptの実行は継続でき、`moreWork()`が先に呼び出されます。

```javascript
const fs = require('node:fs');

fs.readFile('/file.md', (err, data) => {
  if (err) throw err;
  console.log(data);
});
moreWork(); // console.logの前に実行される
```

ファイルの読み込み完了を待たずに`moreWork()`を実行できる能力は、より高いスループットを可能にするための重要な設計上の選択です。

## 並行性とスループット

Node.jsのJavaScript実行はシングルスレッドであるため、ここでの並行性とは、他の作業を完了した後にJavaScriptのコールバック関数を実行するイベントループの能力を指します。並行して実行されることを期待されるコードは、I/Oのような非JavaScript操作が発生している間もイベントループが実行を継続できるようにしなければなりません。

例えば、ウェブサーバーへの各リクエストの完了に50msかかり、そのうち45msが非同期に実行可能なデータベースI/Oだとします。ノンブロッキングの非同期操作を選択することで、リクエストごとにその45msが解放され、他のリクエストを処理できるようになります。

## ブロッキングとノンブロッキングのコードを混ぜる危険性

I/Oを扱う際に避けるべきパターンがあります。以下の例では、`fs.unlinkSync()`が`fs.readFile()`のコールバックより先に実行され、ファイルが読み込まれる前に削除されてしまう可能性があります。

```javascript
const fs = require('node:fs');

fs.readFile('/file.md', (err, data) => {
  if (err) throw err;
  console.log(data);
});
fs.unlinkSync('/file.md');
```

これを解決するには、以下のように完全にノンブロッキングで、正しい順序で実行されることが保証される書き方をします。

```javascript
const fs = require('node:fs');

fs.readFile('/file.md', (readFileErr, data) => {
  if (readFileErr) throw readFileErr;
  console.log(data);
  fs.unlink('/file.md', unlinkErr => {
    if (unlinkErr) throw unlinkErr;
  });
});
```

このコードでは、`fs.unlink()`のノンブロッキング呼び出しを`fs.readFile()`のコールバック内に配置することで、正しい操作順序を保証しています。

## 追加リソース

* [libuv](https://libuv.org/)
