---
title: "それぞれのイベントループ｜イベントループとプロミスチェーンで学ぶJavaScriptの非同期処理"
source: "https://zenn.dev/estra/books/js-async-promise-chain-event-loop/viewer/c-epasync-what-event-loop"
author:
  - "PADAone🐕"
published: 2025-05-31
created: 2025-07-27
description: |
  イベントループには HTML 仕様がありますが、それぞれの実行環境で少しずつ異なる部分があります。このチャプターでは各実行環境においてイベントループがどのようになっているか、擬似コードを使って理解していきます。
tags:
  - "clippings"
  - "JavaScript"
  - "非同期処理"
  - "イベントループ"
  - "Node.js"
  - "ブラウザ"
---
### このチャプターについて

本章では、JavaScriptの実行環境（ブラウザ、Node.js, Denoなど）ごとに少しずつ異なるイベントループの仕組みを、擬似コードを用いて解説します。

### イベントループの共通性質

どの環境にも共通するイベントループの核心的な性質は以下の2点です。

1. **単一のタスク(Task)が実行された後に、すべてのマイクロタスク(Microtask)を処理する。**
2. **コールスタック(Call stack)が空になったらマイクロタスクを処理する。**

`setTimeout`のようなタイマーやI/Oイベントは「タスク」を発行し、`Promise`や`async/await`は「マイクロタスク」を発行します。この違いを理解することが、非同期処理を予測する上で極めて重要です。

V8エンジンのブログで示されている以下の図は、この関係性を視覚的に理解する上で役立ちます。

![microtasks vs tasks](https://res.cloudinary.com/zenn/image/fetch/s--3bpJW2il--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/77ea3987c0018413c848dd19.png%3Fsha%3Dcfdb21585df283bba7cf34f8f7303b36569d7acb)
*([Faster async functions and promises · V8](https://v8.dev/blog/fast-async#tasks-vs.-microtasks) より引用)*

### イベントループの仕組み

#### ブラウザ環境

ブラウザのイベントループは、レンダリング処理が加わるため最も複雑です。

* **複数のタスクキュー**: ユーザーインタラクション、タイマーなど、タスクの種類ごとにキューが分かれています。どのキューからタスクを取り出すかはブラウザ（Blinkスケジューラなど）が決定します。
* **レンダリングパイプライン**: DOM変更やCSS更新を画面に反映させるための一連の処理です。約16.7ms（60fps）ごとに行われ、この間はJavaScriptの実行がブロックされます。
* **`requestAnimationFrame`**: レンダリング直前のタイミングで実行されるコールバックを登録するAPIです。アニメーションの実装に用いられます。

最終的なブラウザのイベントループの擬似コードは以下のようになります。

```js
// ブラウザ環境のイベントループ(v6)
while (true) {
  queue = getNextQueue();
  task = queue.pop();
  execute(task);

  while (microtaskQueue.hasTasks()) {
    doMicrotask();
  }

  if(isRepaintTime()) {
    animationTasks = animationQueue.copyTasks();
    for(task in animationTasks) {
      doAnimationTask(task);
      while (microtaskQueue.hasTasks()) {
        doMicrotask();
      }
    }
    repaint();
  }
}
```

#### Web Workers

Web Workerは独自のイベントループを持ちますが、DOM操作やレンダリングがないため、ブラウザのメインスレッドよりシンプルです。

#### Node.js環境

Node.jsのイベントループは`libuv`ライブラリによって実装されており、以下の特徴があります。

* **フェーズ(Phase)**: イベントループは6つのフェーズ（timers, pending callbacks, idle/prepare, poll, check, close callbacks）を順番に巡回します。
* **2種類のマイクロタスクキュー**:
    1. `nextTickQueue`: `process.nextTick()`で登録。Promiseよりも優先度が高い。
    2. `microTaskQueue`: `Promise`や`queueMicrotask()`で登録。

Node v11以降、ブラウザとの互換性向上のため、1つのタスクが完了するごとにマイクロタスクキューを空にするように挙動が変更されました。

![Node-event-loop](https://res.cloudinary.com/zenn/image/fetch/s--_Na2nCRk--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/b461cb134e88f3b5ee3ad340.jpg%3Fsha%3Dd4295c303b2e471cfdd9f354c145a702f08dffc7)

#### Deno環境

DenoのイベントループはRust製の`Tokio`をベースにしており、PromiseベースのAPIが中心のためNode.jsよりシンプルです。基本的にはV8のデフォルトイベントループに近い動作をします。

### 結論

各実行環境で細かな違いはあれど、「**単一タスクの後に全マイクロタスクを実行する**」という原則は共通しています。この基本モデルを理解し、各環境の特性（レンダリング、フェーズなど）を付け加えることで、JavaScriptの非同期処理の挙動を正確に予測できるようになります。
