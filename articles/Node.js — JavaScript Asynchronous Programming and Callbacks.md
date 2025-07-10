---
title: "Node.js — JavaScript Asynchronous Programming and Callbacks"
source: "https://nodejs.org/en/learn/asynchronous-work/javascript-asynchronous-programming-and-callbacks"
author:
  - "[[@nodejs]]"
published:
created: 2025-07-10
description: |
  JavaScriptにおける非同期プログラミングの概念と、その中心的な仕組みであるコールバック関数について解説します。コールバックの基本的な使い方から、エラーハンドリング、そして「コールバックヘル」と呼ばれる問題点、さらにその代替策となるPromiseやAsync/Awaitまでを扱います。
tags:
  - "clippings"
  - "Node.js"
  - "JavaScript"
  - "Asynchronous"
  - "Callback"
  - "Promises"
  - "Async/Await"
---

## JavaScriptの非同期プログラミングとコールバック

### プログラミング言語における非同期性

コンピュータは設計上、本質的に非同期です。つまり、物事はメインプログラムのフローとは独立して発生する可能性があります。現代のコンピュータでは、各プログラムが特定の時間だけ実行され、その後他のプログラムに実行を譲るというサイクルを高速に繰り返すことで、複数のプログラムが同時に動いているかのように見せています（マルチプロセッサマシンを除く）。

プログラムは内部で*割り込み*（プロセッサの注意を引くための信号）を使用します。これにより、例えばネットワークからの応答を待っている間も、プロセッサを停止させることなく他の処理を実行できます。

通常、C, Java, C#, PHP, Go, Ruby, Swift, Pythonなどのプログラミング言語はデフォルトで同期的ですが、スレッドやライブラリを通じて非同期処理を管理する方法を提供しています。

### JavaScriptにおける非同期

JavaScriptはデフォルトで**同期的**かつシングルスレッドです。つまり、新しいスレッドを作成してコードを並列実行することはできません。コードは以下のように、上から下へ順番に実行されます。

```javascript
const a = 1;
const b = 2;
const c = a * b;
console.log(c);
doSomething();
```

しかし、JavaScriptはブラウザ内でユーザーのアクション（クリック、マウスオーバーなど）に応答するために生まれました。これを同期的なモデルで実現するために、ブラウザ環境は非同期処理を可能にするAPIセットを提供します。Node.jsは、この概念をファイルアクセスやネットワーク呼び出しなどに拡張しました。

### コールバック関数

ユーザーがいつボタンをクリックするかは予測できません。そのため、クリックイベントに対する**イベントハンドラ**を定義します。このハンドラは、イベントが発生したときに呼び出される関数（コールバック）を受け取ります。

```javascript
document.getElementById('button').addEventListener('click', () => {
  // item clicked
});
```

コールバックとは、他の関数に値として渡され、特定のイベントが発生したときにのみ実行される単純な関数です。JavaScriptでは関数が第一級オブジェクトであるため、変数に代入したり、他の関数（高階関数）に渡したりすることができます。

ページの準備ができたときにコードを実行するために、`window`の`load`イベントにリスナーを設定するのも一般的な使い方です。

```javascript
window.addEventListener('load', () => {
  // window loaded
  // do what you want
});
```

コールバックはDOMイベントだけでなく、タイマー処理などでも広く使われます。

```javascript
setTimeout(() => {
  // runs after 2 seconds
}, 2000);
```

### コールバックにおけるエラーハンドリング

コールバックでエラーを扱う一般的な方法は、Node.jsで採用された**エラーファーストコールバック**という規約です。これは、コールバック関数の最初の引数をエラーオブジェクト用に確保するものです。

エラーが発生しなかった場合、この引数は `null` になります。エラーが発生した場合は、エラーに関する情報を含むオブジェクトが渡されます。

```javascript
const fs = require('node:fs');

fs.readFile('/file.json', (err, data) => {
  if (err) {
    // エラー処理
    console.log(err);
    return;
  }

  // エラーがない場合、データを処理
  console.log(data);
});
```

### コールバックの問題点（コールバックヘル）

コールバックは単純なケースでは非常に有効ですが、多用するとネストが深くなり、コードが急速に複雑化します。これは**コールバックヘル**（または*破滅のピラミッド*）として知られています。

```javascript
window.addEventListener('load', () => {
  document.getElementById('button').addEventListener('click', () => {
    setTimeout(() => {
      items.forEach(item => {
        // your code here
      });
    }, 2000);
  });
});
```

この例は4階層のネストですが、実際のコードではさらに深くなることも珍しくありません。

### コールバックの代替手段

この問題を解決するため、ES6以降のJavaScriptでは、コールバックを使わずに非同期コードを扱うための機能が導入されました。

* **Promises (ES6)**
* **Async/Await (ES2017)**

これらの機能により、非同期処理をより直線的で読みやすいコードで記述できるようになりました。
