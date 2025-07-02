---
title: "V8 エンジンについて｜イベントループとプロミスチェーンで学ぶJavaScriptの非同期処理"
source: "https://zenn.dev/estra/books/js-async-promise-chain-event-loop/viewer/e-epasync-v8-engine"
author:
  - "PADAone (estra)"
published: "2023-07-22"
created: 2025-07-02
description: |
  V8エンジンはChromeやNode.jsで利用されるJavaScriptエンジンです。このチャプターでは、V8の基礎知識、役割（コンパイル、コールスタック管理、メモリ管理など）、そしてローカル環境でV8をスタンドアロンで動かす方法（jsvuとd8を使用）について解説します。また、V8が持つデフォルトのイベントループとタスク処理の仕組みについても、具体的なコード例を交えて説明します。
tags:
  - "V8"
  - "JavaScript"
  - "非同期処理"
  - "イベントループ"
  - "Node.js"
---

# V8 エンジンについて

## このチャプターについて

V8 エンジンは Chrome, Node, Deno のそれぞれの環境で利用されている JavaScript エンジンです。V8 について知っておくと理解できることがいくつかあります。

このチャプターでは、V8 エンジンについての基礎知識や、V8 エンジンをローカルで使う方法などについて解説します。

## V8エンジン

まず V8 とは何かを確認しておきます。

> V8 is Google's open source high-performance JavaScript and WebAssembly engine, written in C++. It is used in Chrome and in Node.js, among others. **It implements ECMAScript and WebAssembly**, and runs on Windows 7 or later, macOS 10.12+, and Linux systems that use x64, IA-32, ARM, or MIPS processors. **V8 can run standalone, or can be embedded into any C++ application**.  
> ([上記公式ページ](https://v8.dev/) より引用、太字は筆者強調)

V8 は **Google が提供するオープンソースの JavaScript エンジン** です。C++ で書かれており、主に Chrome ブラウザなどで利用されています。

重要なこととして、V8 エンジンは JavaScript の標準化された言語機能の仕様である **ECMAScript を実装しています** 。他の環境や C++ アプリケーションではこの JavaScript エンジンを埋め込んだ上で API などを提供することでその環境において JavaScript を実行できるようにしています。Deno では [rusty_v8](https://github.com/denoland/rusty_v8) という Rust バインディングによって V8 エンジンの C++ API を Rust で操作できるようにしているようです。その他には、V8 は WebAssembly エンジンとしても利用できます(ECMASCript と同様に WebAssembly も実装しています)。

### V8 の役割

JavaScript の実行環境において JavaScript エンジンである V8 エンジンが担当している役割は色々あります。

- JavaScript コードをコンパイルして実行: コンパイラ
- 関数呼び出しの特定順序で実行できるようにする: コールスタック
- オブジェクトのメモリアロケーションの管理: メモリヒープ
- 使用されなくなったオブジェクトのメモリ解放: ガベージコレクション
- JavaScript におけるすべてのデータ型、演算子、オブジェクト、関数の提供

V8 は DOM については一切感知しませんし、Web API も(ごく一部を除いて)提供しません。後で解説しますが、 **実は V8 エンジンはデフォルトのイベントループとタスクキュー/マイクロタスクキューを保有しています** 。

V8 は基本的にシングルスレッド実行エンジンであり、１つのコールスタック上に実行コンテキストを積み上げて JavaScript コードをシングルスレッドで処理します。

### ヒープとコールスタック

非同期処理のイベントループで考えるべきものとして V8 で重要なのはヒープとコールスタックです。V8 エンジンにはこのヒープとコールスタックが存在しています。

MDN のドキュメントのイベントループの項目で示されているように、イベントループでコールスタックとヒープは大きな役割を占めています。

![Stack heap](https://res.cloudinary.com/zenn/image/fetch/s--Dc96FJPG--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/3cd27a05effdb3e040485c4d.jpg%3Fsha%3Dad9eb4a8bd0cab120e389f9237db3e1e7ff0606b) *[並行モデルとイベントループ - JavaScript | MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/EventLoop) より引用*

そして、V8 エンジンはイベントループにおいて、メモリアロケーションのためのヒープとシングルスレッド実行のためのコールスタックを管理します。

## V8 エンジンを使ってみる

V8 エンジンをスタンドアロンで利用できればほぼ素の ECMAScript の機能を利用できます。つまり、環境の提供する API に惑わされることなく ECMAScript のことだけを考える事ができます。

### jsvu

そして、実際 V8 エンジンはスタンドアロンで利用できます。次の GoogleChromeLabs が提供している jsvu(JavaScript engine Version Updater) でローカルに簡単にインストールでき、ソースからコンパイルすることなく利用できます。

まず、 `npm install -g` で jsvu をグローバルインストールします。

```shell
# jsvu を npm でグローバルインストール
$ npm install -g jsvu
```

インストールできたらパスを通します。

パスを通すためにまずはディレクトリ `~/.jsvu` を作成しておきます。

```shell
mkdir ~/.jsvu
```

fish shell なら `config.fish` で `fish_add_path` 関数を使用してパスを通します。

```fish:config.fish
# jsvu
fish_add_path $HOME/.jsvu
```

fish shell でのパスの通し方については次の記事で詳しく書いたので fish を使っている方は参考にしてみてください。

bash の場合は `~/.bashrc` などのファイルに次のコードを記載してパスを通してください。

```sh:.bashrc
export PATH="${HOME}/.jsvu:${PATH}"
```

パスを通したら、次のコマンドで JavaScript エンジンをインストールします。

```shell
jsvu
```

jsvu は V8 エンジンのみだけでなく、あらゆる JavaScript エンジンのインストールができます。次のサポートバージョンのエンジンがインストールできるようになっています。上記コマンドを実行すると、インストールできるもののリストが表示されるので V8 を選択してインストールします。

![jsvu support versions](https://res.cloudinary.com/zenn/image/fetch/s--pIUaDfJN--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/a96044ce5769e6c8131e158f.jpg%3Fsha%3D8295657a5842b92d3baba968008e338a13601c2b) *[GoogleChromeLabs/jsvu](https://github.com/GoogleChromeLabs/jsvu) より引用*

V8 が Chrome (Google) から提供されているように、 [SpiderMonkey](https://spidermonkey.dev/) は Firefox (Mozilla) から、 [JavaScriptCore](https://developer.apple.com/documentation/javascriptcore) なら safari (Apple) といったように JavaScript エンジンは通常は有名なブラウザベンダーから提供されます。

### d8

> d8 is V8's own developer shell.
>
> **d8 is useful for running some JavaScript locally or debugging changes you have made to V8**.  
> ([上記ページ](https://v8.dev/docs/d8) より引用、太字は筆者強調)

d8 は V8 エンジンで利用でき、ローカル環境で JavaScript の実行をテストできます。 `v8` コマンドで立ち上がる REPL もこの d8 となります。

jsvu で V8 エンジンをインストールできたら `v8` コマンドが利用できるようになっています。実際に使用してみます。

```shell:コマンドライン
# REPL を立ち上げて色々なオブジェクトについて見てみる
❯ v8
V8 version 10.3.125
d8> globalThis
[object global]
d8> Object.keys(globalThis)
["version", "print", "printErr", "write", "read", "readbuffer", "readline", "load", "setTimeout", "quit", "testRunner", "Realm", "performance", "Worker", "os", "d8", "arguments"]
d8> console
{debug: function debug() { [native code] }, error: function error() { [native code] }, info: function info() { [native code] }, log: function log() { [native code] }, warn: function warn() { [native code] }, dir: function dir() { [native code] }, dirxml: function dirxml() { [native code] }, table: function table() { [native code] }, trace: function trace() { [native code] }, group: function group() { [native code] }, groupCollapsed: function groupCollapsed() { [native code] }, groupEnd: function groupEnd() { [native code] }, clear: function clear() { [native code] }, count: function count() { [native code] }, countReset: function countReset() { [native code] }, assert: function assert() { [native code] }, profile: function profile() { [native code] }, profileEnd: function profileEnd() { [native code] }, time: function time() { [native code] }, timeLog: function timeLog() { [native code] }, timeEnd: function timeEnd() { [native code] }, timeStamp: function timeStamp() { [native code] }, context: function context() { [native code] }, [Symbol(Symbol.toStringTag)]: "Object"}
d8> setTimeout
function setTimeout() { [native code] }
d8> setInterval
(d8):1: ReferenceError: setInterval is not defined
setInterval
^
ReferenceError: setInterval is not defined
    at (d8):1:1
d8> queueMicrotask
(d8):1: ReferenceError: queueMicrotask is not defined
queueMicrotask
^
ReferenceError: queueMicrotask is not defined
    at (d8):1:1
d8> Promise
function Promise() { [native code] }
```

上記 REPL での実行結果から色々なことが分かります。

### V8 エンジンの Web API もどき

JavaScript エンジンにはそれを埋め込む環境が提供する Web APIs などは通常含まれませんが、最低限の Web API もどきは提供されているようです。

- `console.log()` などの Console API は提供されている(スタンドアロンでテストするためにも必要)
- `setTimeout()` は存在するが `setInterval()` は提供されていない
- Promise は ECMAScript のビルトインオブジェクトなのでもちろん存在する
- `queueMicrotask()` は Web API なので提供されていない

ちなみに V8 エンジンで提供される `setTimeout()` は遅延時間を指定してその時間が経過した後にタスクを発行することはできず、直ちにタスクを発行します。つまりタイマーとしては機能しませんので、V8 エンジンを埋め込む環境がちゃんとした Web API として実装して提供する必要があります。

例えば、次のスクリプトファイルを V8 エンジンで実行してみた場合には、遅延時間を指定しても無駄です。直ちにタスクが発火されます。

```js:v8SimpleTask.js
// v8SimpleTask.js
console.log("[1] 🦖 MAINLINE: Start [GEC]");

setTimeout(() => {
  console.log("[3] ⏰ TIMERS: timeout 5000ms");
  // 遅延時間を長くしてもこちらが先にタスクとして処理される
}, 5000);

setTimeout(() => {
  console.log("[4] ⏰ TIMERS: timeout 0 ms");
  // 遅延時間 0 ms
});

console.log("[2] 🦖 MAINLINE: End [GEC]");
```

V8 コマンドでは `deno run` や `node` とまったく同じ様にスクリプト名を引数に渡して JavaScript を実行できます。

```shell
❯ v8 v8SimpleTask.js
[1] 🦖 MAINLINE: Start [GEC]
[2] 🦖 MAINLINE: End [GEC]
[3] ⏰ TIMERS: timeout 5000ms
[4] ⏰ TIMERS: timeout 0 ms
```

出力順番を見ると、遅延時間を指定しても意味がなく、直ちにタスクとして処理されていることが分かりますね。時間を測る作業自体は JavaScript エンジンではなく環境が並列的にバックグラウンド行う機能ですから、ここでは存在していません(Node 環境ならポーリングの機構によってソートされたタイマーで有効期限の切れたものを一括処理しています)。

ここまで来てお気づきだと思いますが、実は V8 エンジンにはタスクとマイクロタスクを扱うことのできるデフォルトのイベントループが存在しています。

V8 エンジンのミラーリポジトリの `V8/src/libplatform` ディレクトリなどを見てみると分かります。

以下のようにデフォルトの job や task queue に関するファイルがあります。

![V8 src](https://res.cloudinary.com/zenn/image/fetch/s--OtSvLxEm--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/7b413b3a3f2fcdbd0cf48e53.jpg%3Fsha%3Dea118a68d88573affca9b4325a9905319309f5c7)

おそらく、この辺りがデフォルトのイベントループでしょうか。

V8 単体で Promise 関連の処理からマイクロタスクを発行することもできますし、「 **単一タスクの実行後にすべてのマイクロタスクを処理する** 」というルールも完全にみたされていることがわかります。

```js:v8EventLoop.js
// v8EventLoop.js
// <- 1st Task
console.log("🦖 [1] MAINLINE: Start");

setTimeout(() => {
  // 2nd Task
  console.log("⏰ [4] TIMERS: setTimeout 1st [callback start]");
  Promise.resolve("1st Promise")
    .then((value) => {
      console.log("👦 [6] MICRO: Resolved value:", value);
    })
    .then(() => {
      console.log("👦 [7] MICRO: Next chain");
    });
  setTimeout(() => {
    // 5th Task
    console.log("⏰ [13] TIMERS: setTimeout 4th");
    Promise.resolve("2nd Promise")
      .then((value) => {
        console.log("👦 [14] MICRO: Resolved value:", value);
      })
      .then(() => {
        console.log("👦 [15] MICRO: Next chain");
      });
  });
  console.log("⏰ [5] TIMERS: [callback end]");
});
setTimeout(() => {
  // 3rd Task
  console.log("⏰ [8] TIMERS: setTimeout 2nd [callback start]");
  Promise.resolve("3rd Promise")
    .then((value) => {
      console.log("👦 [10] MICRO: Resolved value:", value);
    })
    .then(() => {
      console.log("👦 [11] MICRO: Next chain");
    });
  console.log("⏰ [9] TIMERS: [callback end]");
});

Promise.resolve()
  .then(() => {
    console.log("👦 [3] MICRO: then callback")
    setTimeout(() => console.log("⏰ [12] TIMERS: 3rd")) // 4th Task
  });

console.log("🦖 [2] MAINLINE: End");
// 1st Task ->
```

このようなコードでも、V8 のデフォルトイベントループでは「単一タスクの後にすべてのマイクロタスクを処理する」というルールがみたされているので次の様に予想通りの結果が得られます。

```shell
❯ v8 v8EventLoop.js
🦖 [1] MAINLINE: Start
🦖 [2] MAINLINE: End
👦 [3] MICRO: then callback
⏰ [4] TIMERS: setTimeout 1st [callback start]
⏰ [5] TIMERS: [callback end]
👦 [6] MICRO: Resolved value: 1st Promise
👦 [7] MICRO: Next chain
⏰ [8] TIMERS: setTimeout 2nd [callback start]
⏰ [9] TIMERS: [callback end]
👦 [10] MICRO: Resolved value: 3rd Promise
👦 [11] MICRO: Next chain
⏰ [12] TIMERS: 3rd
⏰ [13] TIMERS: setTimeout 4th
👦 [14] MICRO: Resolved value: 2nd Promise
👦 [15] MICRO: Next chain
```

## V8のイベントループ

ブラウザ環境でのレンダリング作業やランタイム環境での非同期 I/O 関連の色々を考えることなくシンプルに考えることができます。

V8エンジンのデフォルトイベントループ

```js
while (tasksAreWaiting()) {
  queue = getNextQueue();
  task = queue.pop();
  execute(task);

  while (micortaskQueue.hasTasks()) {
    doMicrotask();
  }
}
```

V8 エンジンのデフォルトイベントループにタスクキューが実際いくつ存在しているかは分かりませんが、とりあえず `setTimeout()` 用のタスクキューは存在していることが分かります。タスクキューは１つ以上あることが仕様で定義されているので、タスクキューの数に関わらず `getNextQueue()` でとにかく１つのタスクキューを選ぶということで上の疑似コードとしています。
