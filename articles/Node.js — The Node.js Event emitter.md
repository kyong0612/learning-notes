---
title: "Node.js — The Node.js Event emitter"
source: "https://nodejs.org/ja/learn/asynchronous-work/the-nodejs-event-emitter"
author:
  - "[[@nodejs]]"
published:
created: 2025-07-14
description: "Node.js®は、サーバー、Webアプリ、コマンドラインツール、スクリプトの開発を可能にする、無料かつオープンソースのクロスプラットフォームJavaScript実行環境です。"
tags:
  - "clippings"
  - "nodejs"
  - "eventemitter"
---
## Node.jsのイベントエミッタ

ブラウザでJavaScriptを使ったことがあるなら、マウスクリック、キーボードのボタンプレス、マウスの動きへの反応など、ユーザーのインタラクションの多くがイベントを通じて処理されることをご存知でしょう。

バックエンド側では、Node.jsは [`events` モジュール](https://nodejs.org/api/events.html)を使って同様のシステムを構築する選択肢を提供しています。

このモジュールは、特にイベントを処理するために使用する `EventEmitter` クラスを提供します。

次のように初期化します。

```
const EventEmitter = require('node:events');

const eventEmitter = new EventEmitter();
```

このオブジェクトは、他にも多くのメソッドを公開していますが、特に `on` と `emit` メソッドを公開しています。

- `emit` はイベントを発生させるために使われます
- `on` はイベントがトリガーされたときに実行されるコールバック関数を追加するために使われます

例えば、`start` イベントを作成し、サンプルのために、コンソールにログを出力するだけでそれに反応してみましょう：

```js
eventEmitter.on('start', () => {

  console.log('started');

});
```

これを実行すると

```js
eventEmitter.emit('start');
```

イベントハンドラ関数がトリガーされ、コンソールのログが表示されます。

`emit()`に追加の引数を渡すことで、イベントハンドラに引数を渡すことができます：

```js
eventEmitter.on('start', number => {

  console.log(\`started ${number}\`);

});

eventEmitter.emit('start', 23);
```

複数の引数：

```js
eventEmitter.on('start', (start, end) => {

  console.log(\`started from ${start} to ${end}\`);

});

eventEmitter.emit('start', 1, 100);
```

`EventEmitter`オブジェクトは、イベントと対話するための他のいくつかのメソッドも公開しています。例えば：

- `once()`: 一度だけ実行されるリスナーを追加します
- `removeListener()` / `off()`: イベントからイベントリスナーを削除します
- `removeAllListeners()`: イベントのすべてのリスナーを削除します

これらのメソッドについての詳細は、[公式ドキュメント](https://nodejs.org/api/events.html)で読むことができます。

[前へ Node.jsのイベントループ](https://nodejs.org/ja/learn/asynchronous-work/event-loop-timers-and-nexttick) [次へ process.nextTick()について](https://nodejs.org/ja/learn/asynchronous-work/understanding-processnexttick)

所要時間

1 分

著者

編集への協力

[このページを編集](https://github.com/nodejs/nodejs.org/blob/main/TRANSLATION.md#how-to-translate)
