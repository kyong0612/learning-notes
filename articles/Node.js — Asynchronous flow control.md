---
title: "Node.js — Asynchronous flow control"
source: "https://nodejs.org/en/learn/asynchronous-work/asynchronous-flow-control"
author:
  - "A"
  - "CW"
published:
created: 2025-07-08
description: |
  JavaScript is designed to be non-blocking, which introduces challenges when managing complex asynchronous operations. This can lead to "callback hell". This article explores asynchronous flow control patterns in Node.js to write more organized, readable, and maintainable code, covering state management and three primary control flow patterns: serial, limited serial, and parallel execution.
tags:
  - "Node.js"
  - "asynchronous"
  - "flow-control"
  - "callbacks"
  - "state-management"
---

> この記事の内容は、[Mixu's Node.js Book](http://book.mixu.net/node/ch7.html)に強く影響を受けています。

JavaScriptは、基本的に「メイン」スレッドでノンブロッキングに設計されています。これはビューがレンダリングされる場所であり、ブラウザにおけるその重要性は想像に難くありません。メインスレッドがブロックされると、エンドユーザーが恐れる「フリーズ」が発生し、他のイベントもディスパッチできなくなるため、例えばデータ取得が失われるといった事態につながります。

この制約は、関数型プログラミングのスタイルでしか解決できないユニークな問題を生み出します。ここでコールバックが登場します。

しかし、より複雑な処理ではコールバックの扱いは難しくなることがあります。これはしばしば「コールバック地獄」につながり、複数のネストされたコールバック関数がコードの可読性、デバッグ、整理などを困難にします。

```javascript
async1(function (input, result1) {
  async2(function (result2) {
    async3(function (result3) {
      async4(function (result4) {
        async5(function (output) {
          // do something with output
        });
      });
    });
  });
});
```

もちろん、実際には `result1` や `result2` などを処理するための追加のコード行があるため、この問題の長さと複雑さは通常、上記の例よりもずっと乱雑なコードになります。

**ここで*関数*が非常に役立ちます。より複雑な操作は、多くの関数で構成されます：**

1. **イニシエータースタイル / 入力 (initiator style / input)**: シーケンスの最初の関数。操作の元の入力を受け取ります。
2. **ミドルウェア (middleware)**: 中間処理を行う関数。
3. **ターミネーター (terminator)**: 最終処理を行い、コールバックを呼び出す関数。

「イニシエータースタイル / 入力」は、操作の最初の関数です。この関数は、操作のための元の入力（もしあれば）を受け付けます。操作は実行可能な一連の関数であり、元の入力は主に以下のいずれかです：

1. グローバル環境の変数
2. 引数の有無にかかわらず直接呼び出し
3. ファイルシステムまたはネットワークリクエストから取得した値

ネットワークリクエストは、外部ネットワーク、同じネットワーク上の別のアプリケーション、または同じ/外部ネットワーク上のアプリケーション自体によって開始される受信リクエストである可能性があります。

ミドルウェア関数は別の関数を返し、ターミネーター関数はコールバックを呼び出します。以下の例は、ネットワークまたはファイルシステムリクエストへのフローを示しています。ここでは、すべての値がメモリ内で利用可能であるため、レイテンシは0です。

```javascript
function final(someInput, callback) {
  callback(`${someInput} and terminated by executing callback `);
}

function middleware(someInput, callback) {
  return final(`${someInput} touched by middleware `, callback);
}

function initiate() {
  const someInput = 'hello this is a function ';
  middleware(someInput, function (result) {
    console.log(result);
    // requires callback to `return` result
  });
}

initiate();
```

## 状態管理 (State management)

関数は状態に依存する場合としない場合があります。状態依存は、関数の入力や他の変数が外部の関数に依存する場合に発生します。

**この点で、状態管理には主に2つの戦略があります：**

1. 変数を直接関数に渡す。
2. キャッシュ、セッション、ファイル、データベース、ネットワークなどの外部ソースから変数値を取得する。

グローバル変数については言及しませんでした。グローバル変数で状態を管理することは、状態を保証することが困難または不可能になる、ずさんなアンチパターンであることが多いです。複雑なプログラムでは、可能な限りグローバル変数を避けるべきです。

## 制御フロー (Control flow)

オブジェクトがメモリ内で利用可能な場合、反復が可能であり、制御フローに変更はありません：

```javascript
function getSong() {
  let _song = '';
  let i = 100;
  for (i; i > 0; i -= 1) {
    _song += `${i} beers on the wall, you take one down and pass it around, ${
      i - 1
    } bottles of beer on the wall\n`;
    if (i === 1) {
      _song += "Hey let's get some more beer";
    }
  }

  return _song;
}

function singSong(_song) {
  if (!_song) throw new Error("song is '' empty, FEED ME A SONG!");
  console.log(_song);
}

const song = getSong();
// これは動作します
singSong(song);
```

しかし、データがメモリ外に存在する場合、反復はもはや機能しません：

```javascript
function getSong() {
  let _song = '';
  let i = 100;
  for (i; i > 0; i -= 1) {
    setTimeout(function () {
      _song += `${i} beers on the wall, you take one down and pass it around, ${
        i - 1
      } bottles of beer on the wall\n`;
      if (i === 1) {
        _song += "Hey let's get some more beer";
      }
    }, 0);
  }

  return _song;
}

function singSong(_song) {
  if (!_song) throw new Error("song is '' empty, FEED ME A SONG!");
  console.log(_song);
}

const song = getSong('beer');
// これは動作しません
singSong(song);
// Uncaught Error: song is '' empty, FEED ME A SONG!
```

なぜこうなったのでしょうか？ `setTimeout` はCPUに命令をバス上の別の場所に保存するよう指示し、データが後でピックアップされるようにスケジュールされていることを伝えます。関数が0ミリ秒のマークで再びヒットするまでに何千ものCPUサイクルが経過し、CPUはバスから命令を取得して実行します。唯一の問題は、`song`（空文字列）が何千サイクルも前に返されていることです。

ファイルシステムやネットワークリクエストを扱う場合も同様の状況が発生します。メインスレッドは不確定な期間ブロックすることはできないため、コールバックを使用してコードの実行を制御された方法でスケジュールします。

以下の3つのパターンで、ほぼすべての操作を実行できます：

### 1. 直列実行 (In series)

関数は厳密な順序で実行されます。これは `for` ループに最も似ています。

```javascript
// operations defined elsewhere and ready to execute
const operations = [
  { func: function1, args: args1 },
  { func: function2, args: args2 },
  { func: function3, args: args3 },
];

function executeFunctionWithArgs(operation, callback) {
  // executes function
  const { args, func } = operation;
  func(args, callback);
}

function serialProcedure(operation) {
  if (!operation) process.exit(0); // finished
  executeFunctionWithArgs(operation, function (result) {
    // continue AFTER callback
    serialProcedure(operations.shift());
  });
}

serialProcedure(operations.shift());
```

### 2. 制限付き直列実行 (Limited in series)

関数は厳密な順序で実行されますが、実行回数に制限があります。大きなリストを処理する必要があるが、正常に処理されたアイテム数に上限を設けたい場合に便利です。

```javascript
let successCount = 0;

function final() {
  console.log(`dispatched ${successCount} emails`);
  console.log('finished');
}

function dispatch(recipient, callback) {
  // `sendMail` is a hypothetical SMTP client
  sendMail(
    {
      subject: 'Dinner tonight',
      message: 'We have lots of cabbage on the plate. You coming?',
      smtp: recipient.email,
    },
    callback
  );
}

function sendOneMillionEmailsOnly() {
  getListOfTenMillionGreatEmails(function (err, bigList) {
    if (err) throw err;

    function serial(recipient) {
      if (!recipient || successCount >= 1000000) return final();
      dispatch(recipient, function (_err) {
        if (!_err) successCount += 1;
        serial(bigList.pop());
      });
    }

    serial(bigList.pop());
  });
}

sendOneMillionEmailsOnly();
```

### 3. 完全並列実行 (Full parallel)

1,000,000人のメール受信者にメールを送信する場合など、順序が問題にならない場合に使用します。

```javascript
let count = 0;
let success = 0;
const failed = [];
const recipients = [
  { name: 'Bart', email: 'bart@tld' },
  { name: 'Marge', email: 'marge@tld' },
  { name: 'Homer', email: 'homer@tld' },
  { name: 'Lisa', email: 'lisa@tld' },
  { name: 'Maggie', email: 'maggie@tld' },
];

function dispatch(recipient, callback) {
  // `sendMail` is a hypothetical SMTP client
  sendMail(
    {
      subject: 'Dinner tonight',
      message: 'We have lots of cabbage on the plate. You coming?',
      smtp: recipient.email,
    },
    callback
  );
}

function final(result) {
  console.log(`Result: ${result.count} attempts \
      & ${result.success} succeeded emails`);
  if (result.failed.length)
    console.log(`Failed to send to: \
        \n${result.failed.join('\n')}\n`);
}

recipients.forEach(function (recipient) {
  dispatch(recipient, function (err) {
    if (!err) {
      success += 1;
    } else {
      failed.push(recipient.name);
    }
    count += 1;

    if (count === recipients.length) {
      final({
        count,
        success,
        failed,
      });
    }
  });
});
```

それぞれに独自のユースケース、利点、問題があり、それらについてさらに詳しく実験したり読んだりすることができます。最も重要なことは、操作をモジュール化し、コールバックを使用することを忘れないでください！疑問を感じたら、すべてをミドルウェアであるかのように扱ってください！
