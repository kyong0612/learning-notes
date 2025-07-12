---
title: "Node.js — JavaScriptタイマーを理解する"
source: "https://nodejs.org/en/learn/asynchronous-work/discover-javascript-timers#discover-javascript-timers"
author:
  - "[[@nodejs]]"
published:
created: 2025-07-12
description: "Node.js®は、開発者がサーバー、Webアプリ、コマンドラインツール、スクリプトを作成できる、無料のオープンソース、クロスプラットフォームのJavaScriptランタイム環境です。"
tags:
  - "clippings"
---
## setTimeout()

JavaScriptのコードを書いていると、関数の実行を遅らせたいことがあるかもしれません。

これが`setTimeout`の役割です。後で実行するコールバック関数と、それをどれくらい後に実行したいかをミリ秒単位で指定します。

```js
setTimeout(() => {

  // 2秒後に実行

}, 2000);

setTimeout(() => {

  // 50ミリ秒後に実行

}, 50);
```

この構文は新しい関数を定義します。その中では好きな他の関数を呼び出すこともできますし、既存の関数名とパラメータのセットを渡すこともできます。

```js
const myFunction = (firstParam, secondParam) => {

  // 何か処理をする

};

// 2秒後に実行

setTimeout(myFunction, 2000, firstParam, secondParam);
```

`setTimeout`はNode.jsでは[`Timeout`](https://nodejs.org/api/timers.html#class-timeout)インスタンスを返しますが、ブラウザでは数値のタイマーIDを返します。このオブジェクトまたはIDを使用して、スケジュールされた関数の実行をキャンセルできます。

```js
const timeout = setTimeout(() => {

  // 2秒後に実行されるはず

}, 2000);

//気が変わった

clearTimeout(timeout);
```

### 遅延ゼロ

タイムアウトの遅延を`0`に指定すると、コールバック関数は可能な限り早く、しかし現在の関数の実行が終わった後に実行されます。

```js
setTimeout(() => {

  console.log('後 ');

}, 0);

console.log(' 前 ');
```

このコードは以下のように出力します。

```bash
前

後
```

これは、重い計算を実行中に他の関数を実行させ、CPUをブロックするのを避けるために特に便利です。スケジューラに関数をキューイングすることで実現します。

> 一部のブラウザ（IEとEdge）では、これと全く同じ機能を持つ`setImmediate()`メソッドが実装されていますが、これは標準ではなく、[他のブラウザでは利用できません](https://caniuse.com/#feat=setimmediate)。しかし、Node.jsでは標準の関数です。

## setInterval()

`setInterval`は`setTimeout`に似た関数ですが、違いがあります。コールバック関数を一度だけ実行する代わりに、指定した時間間隔（ミリ秒単位）で永久に実行し続けます。

```js
setInterval(() => {

  // 2秒ごとに実行

}, 2000);
```

上の関数は、`clearInterval`を使って停止するように指示しない限り、2秒ごとに実行されます。`setInterval`が返したインターバルIDを渡します。

```js
const timeout = setInterval(() => {

  // 2秒ごとに実行

}, 2000);

clearInterval(timeout);
```

`setInterval`のコールバック関数内で`clearInterval`を呼び出し、再度実行するか停止するかを自動的に判断させるのが一般的です。例えば、以下のコードは`App.somethingIWait`の値が`arrived`になるまで何かを実行します。

```js
const interval = setInterval(() => {

  if (App.somethingIWait === 'arrived') {

    clearInterval(interval);

  }

  // そうでなければ何かをする

}, 100);
```

## 再帰的なsetTimeout

`setInterval`は、関数の実行がいつ終了したかを考慮せずに、nミリ秒ごとに関数を開始します。

もし関数が常に同じ時間を要するなら、問題ありません。

![正常に動作するsetInterval](https://nodejs.org/_next/image?url=%2Fstatic%2Fimages%2Flearn%2Fjavascript-timers%2Fsetinterval-ok.png&w=3840&q=75)

しかし、例えばネットワークの状態によって、関数の実行時間が異なる場合があります。

![実行時間が変動するsetInterval](https://nodejs.org/_next/image?url=%2Fstatic%2Fimages%2Flearn%2Fjavascript-timers%2Fsetinterval-varying-duration.png&w=3840&q=75)

そして、ある長い実行が次の実行と重なってしまうこともあります。

![実行が重複するsetInterval](https://nodejs.org/_next/image?url=%2Fstatic%2Fimages%2Flearn%2Fjavascript-timers%2Fsetinterval-overlapping.png&w=3840&q=75)

これを避けるために、コールバック関数が終了したときに再帰的な`setTimeout`をスケジュールすることができます。

```js
const myFunction = () => {

  // 何か処理をする

  setTimeout(myFunction, 1000);

};

setTimeout(myFunction, 1000);
```

このシナリオを実現するためです。

![再帰的なsetTimeout](https://nodejs.org/_next/image?url=%2Fstatic%2Fimages%2Flearn%2Fjavascript-timers%2Frecursive-settimeout.png&w=3840&q=75)

`setTimeout`と`setInterval`は、Node.jsの[Timersモジュール](https://nodejs.org/api/timers.html)を通じて利用できます。

Node.jsは`setImmediate()`も提供しており、これは`setTimeout(() => {}, 0)`と同等で、主にNode.jsのイベントループと連携するために使用されます。

[前へ Node.jsのPromiseを理解する](https://nodejs.org/en/learn/asynchronous-work/discover-promises-in-nodejs) [次へ Node.jsのイベントループ](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)
