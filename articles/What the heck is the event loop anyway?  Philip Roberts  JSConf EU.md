---
title: "What the heck is the event loop anyway? | Philip Roberts | JSConf EU"
source: "https://www.youtube.com/watch?v=8aGhZQkoFbQ"
author:
  - "[[JSConf]]"
published: 2014-10-10
created: 2025-06-26
description: |
  JavaScript programmers like to use words like, "event-loop", "non-blocking", "callback", "asynchronous", "single-threaded" and "concurrency".

  We say things like "don't block the event loop", "make sure your code runs at 60 frames-per-second", "well of course, it won't work, that function is an asynchronous callback!"

  If you're anything like me, you nod and agree, as if it's all obvious, even though you don't actually know what the words mean; and yet, finding good explanations of how JavaScript actually works isn't all that easy, so let's learn!

  With some handy visualisations, and fun hacks, let's get an intuitive understanding of what happens when JavaScript runs.
tags:
  - "JavaScript"
  - "event-loop"
  - "asynchronous"
  - "non-blocking"
  - "Node.js"
  - "V8"
---

この講演では、Philip Roberts氏がJavaScriptの非同期処理の核心であるイベントループの仕組みを、視覚的なデモを交えながら解説します。多くの開発者が曖昧に理解している「ノンブロッキング」「非同期」「シングルスレッド」といった概念が、どのように連携して動作するのかを明らかにします。

### はじめに: JavaScriptの動作原理への疑問

多くのJavaScript開発者は、「イベントループ」や「ノンブロッキング」といった用語を日常的に使いますが、その正確な意味や仕組みを深く理解しているわけではありません。発表者自身も、かつてはV8エンジンやコールバックの動作について完全には理解しておらず、18ヶ月にわたる学習と探求の末に得た知見を共有したいと述べます。

### JavaScriptランタイムの誤解と全体像

一般的に、V8のようなJavaScriptランタイムは「コールスタック」と「ヒープ」で構成されると説明されます。しかし、`setTimeout`, DOM API, Ajax(`XMLHttpRequest`)といった非同期機能は、実はV8のソースコード内には存在しません。これらはJSランタイム自体の一部ではないのです。

実際の動作環境（ブラウザやNode.js）は、JSランタイムに加えて、以下の要素で構成されています。

* **Web API**: ブラウザが提供する追加機能群（DOM, Ajax, setTimeoutなど）。これらはバックグラウンドで並行して動作するスレッドのように振る舞います。
* **タスクキュー（Callback Queue）**: Web APIでの処理が完了した際に、実行されるべきコールバック関数が置かれる待ち行列。
* **イベントループ (Event Loop)**: コールスタックが空かどうかを常に監視し、空であればタスクキューから最初のタスク（コールバック）を取り出してコールスタックにプッシュする、という非常にシンプルな役割を担います。

![JavaScript Visualized](https://i.imgur.com/8O3kG1E.png)

### コールスタックとブロッキング

JavaScriptはシングルスレッドであり、一度に一つの処理しか実行できません。この処理の実行場所が「コールスタック」です。

* **コールスタック**: プログラムの現在位置を記録するデータ構造。関数を呼び出すとスタックにプッシュ（追加）され、関数からリターンするとポップ（削除）されます。エラー発生時に表示されるスタックトレースは、その瞬間のコールスタックの状態を示しています。
* **ブロッキング**: ネットワークリクエストや重い計算など、時間のかかる同期処理がコールスタック上で実行されると、後続のすべての処理が待たされてしまいます。ブラウザ環境では、コールスタックがブロックされるとUIの描画更新やユーザー操作も停止するため、ユーザー体験を著しく損ないます。

### 非同期コールバックによる解決策

ブロッキングを避けるため、ブラウザのAPIのほとんどは非同期コールバック形式で提供されます。`setTimeout`を例に、非同期処理のフローを見てみましょう。

1. `setTimeout(callback, 5000)`がコールスタックで実行されます。
2. `setTimeout`はブラウザのWeb APIであり、JSランタイムはタイマーの開始をWeb APIに依頼します。
3. `setTimeout`自体の処理はすぐに完了し、コールスタックからポップされます。JSのコードは次の行へ進みます。
4. 5秒後、Web APIのタイマーが完了し、指定された`callback`関数を**タスクキュー**に追加します。
5. **イベントループ**が、コールスタックが空になったタイミングを検知し、タスクキューから`callback`をコールスタックにプッシュします。
6. コールスタックにプッシュされた`callback`が実行されます。

この仕組みにより、時間のかかる処理を待っている間も、メインの処理をブロックすることなく実行を続けられます。

### `setTimeout(..., 0)` の謎

`setTimeout`の遅延時間を`0`に設定しても、コールバックはすぐには実行されません。これは、コールバックを即座にタスクキューに送り、「現在のコールスタック上のすべての同期コードが完了した後」に実行を遅延させるためのテクニックです。

### レンダリングとの関係

ブラウザは理想的には1秒間に60回（約16.6msごと）画面を再描画しようとします。しかし、このレンダリング処理もコールバックと同様に、コールスタックが空になるのを待つ必要があります。ただし、レンダリングはタスクキュー内の通常のコールバックよりも優先度が高く扱われます。

コールスタック上で時間のかかる同期処理を行うと、レンダリングがその間ずっと妨げられ、UIがカクついたりフリーズしたりします。「**イベントループをブロックするな**」という格言は、まさにこの現象を避けるためのものです。

### 結論と可視化ツール "Loupe"

JavaScriptの非同期性や並行性は、JSランタイムそのものではなく、それが動作する環境（ブラウザのWeb APIなど）との連携によって実現されています。イベントループ、タスクキュー、Web APIの仕組みを理解することが、ノンブロッキングでパフォーマンスの高いコードを書く鍵となります。

発表者は、この一連のメカニズムを視覚的に理解するためのツール「**[Loupe](http://latentflip.com/loupe/)**」を開発・公開しており、これを使うことでイベントループの動きを実際に目で見て学ぶことができます。
