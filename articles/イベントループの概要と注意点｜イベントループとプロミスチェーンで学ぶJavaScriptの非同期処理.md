---
title: "イベントループの概要と注意点｜イベントループとプロミスチェーンで学ぶJavaScriptの非同期処理"
source: "https://zenn.dev/estra/books/js-async-promise-chain-event-loop/viewer/2-epasync-event-loop"
author:
  - "PADAone🐕"
published: 2023-07-22
created: 2025-06-30
description: |
  JavaScriptの非同期処理の根幹をなすイベントループについて、その仕組み、よくある誤解、ブラウザ環境での具体的な動作を詳細に解説します。タスクキューとマイクロタスクキューの役割や、スクリプト評価が最初のタスクとして扱われる点など、非同期処理を深く理解するための重要な概念を学びます。
tags:
  - "JavaScript"
  - "イベントループ"
  - "非同期処理"
  - "タスクキュー"
  - "マイクロタスクキュー"
---

## このチャプターについて

このチャプターでは、JavaScriptの非同期処理の核心であるイベントループの各ステップと、それに関する注意点について解説します。イベントループの概念を視覚的に理解するためには、Philip Roberts氏による講演『[What the heck is the event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ)』の視聴が推奨されます。

## イベントループの各ステップ

イベントループは、ブラウザやNode.jsなどの実行環境によって実装が異なりますが、基本的な概念は共通しています。タスクキューとマイクロタスクキューにある処理をコールスタックに送るためのループアルゴリズムです。

[JS Visualizer](https://www.jsv9000.app/)では、イベントループが以下の4つのステップで構成されると説明されています。

1. **スクリプトの評価**: スクリプト全体を同期的に実行する。これは最初のタスクとして扱われる。
2. **単一のタスクの実行**: タスクキューから最も古いタスクを1つ取り出し、実行する。
3. **すべてのマイクロタスクの実行**: マイクロタスクキューが空になるまで、すべてのマイクロタスクを実行する。
4. **UIのレンダリング更新**: UIを更新し、ステップ2に戻る（ブラウザ環境のみ）。

## イベントループへの誤解

イベントループの挙動は、以下の疑似コードでより正確に理解できます。

```js
while (eventLoop.waitForTask()) {
  // 複数あるタスクキューから1つを選択
  const taskQueue = eventLoop.selectTaskQueue();
  if (taskQueue.hasNextTask()) {
    // タスクを1つ処理
    taskQueue.processNextTask();
  }

  // マイクロタスクキューの全タスクを処理
  const microtaskQueue = eventLoop.microTaskQueue;
  while (microtaskQueue.hasNextMicrotask()) {
    microtaskQueue.processNextMicrotask();
  }

  // 必要であればレンダリングを更新
  if (shouldRender()) {
    render();
  }
}
```

重要な点は以下の通りです。

* **最初のタスク**: 「スクリプトの評価」そのものが最初のタスクとなります。
* **ネストしたループ**: 1回のループでタスクは1つだけ処理されますが、マイクロタスクはそのループ内でキューが空になるまですべて処理されます。
* **複数のタスクキュー**: `setTimeout`のコールバックやUIイベントなど、タスクの発生源（Task source）ごとに異なるタスクキューが存在します。ブラウザはどのキューを優先するかを決定します。
* **レンダリングのタイミング**: レンダリングは毎回のループで発生するわけではなく、約16.7ミリ秒（60fps）ごとなど、ブラウザが最適と判断したタイミングで行われます。

## イベントループのステップ(1)とステップ(2)は実質的に同じ

以下のコードを実行すると、`Promise`のコールバック（マイクロタスク）が`setTimeout`のコールバック（タスク）より先に実行されます。

```js
console.log("🦖 [1] Mainline");

setTimeout(() => { // タスク
  console.log("⏰ [3] Callback is a task");
}, 0);

Promise.resolve()
  .then(() => { // マイクロタスク
    console.log("👦 [2] Callback is a microtask");
  });

/* 実行結果
🦖 [1] Mainline
👦 [2] Callback is a microtask
⏰ [3] Callback is a task
*/
```

これは、最初の同期的なコード実行（`console.log("🦖 [1] Mainline")`など）全体が「最初のタスク」として扱われるためです。この最初のタスクが完了した後、マイクロタスクキューが処理され、その後に次のタスク（この場合は`setTimeout`のコールバック）が実行されます。

この事実は、Jake Archibald氏の講演『In The Loop』やErin Zimmer氏の講演『Further Adventures of the Event Loop』でも明確に説明されています。

<iframe src="https://www.youtube-nocookie.com/embed/cCOL7MC4Pl0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>
<iframe src="https://www.youtube-nocookie.com/embed/u1kqx6AenYw" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>

結論として、`<script>`タグ内の同期処理はまとめて1つのタスクとして実行され、`addEventListener`のコールバックのような非同期処理は、イベントが発生した時点で別のタスクとしてキューに追加されます。

```html
<script>
  // <- Task1 (スクリプトの評価)
  const foo = bar;
  foo.doSomething();

  document.body.addEventLlistener('keydown', (event) => {
    // <- Task2 (イベント発火時にキューイングされる)
    if (event.key === 'PageDown') {
      location.href = "/#/36";
    }
  });
  // Task1 ->
</script>
```
