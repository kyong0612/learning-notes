---
title: "Node.js — Don't Block the Event Loop (or the Worker Pool)"
source: "https://nodejs.org/ja/learn/asynchronous-work/dont-block-the-event-loop"
author:
published:
created: 2025-07-16
description: "Node.jsで高パフォーマンスかつセキュアなアプリケーションを構築するための重要な指針。イベントループとワーカープールをブロックしないための具体的な戦略と、REDOSやJSON DOS攻撃への対処法を解説。"
tags:
  - "clippings"
  - "Node.js"
  - "Event Loop"
  - "Worker Pool"
  - "Performance"
  - "Asynchronous Programming"
  - "Security"
  - "Best Practices"
---

## Don't Block the Event Loop (or the Worker Pool)

## Should you read this guide?

ブリーフなコマンドラインスクリプト以上の複雑なものを書いている場合、このガイドを読むことで、より高性能でセキュアなアプリケーションを書くのに役立ちます。この文書はNode.jsサーバーを念頭に置いて書かれていますが、概念は複雑なNode.jsアプリケーションにも適用されます。

## Summary

Node.jsはJavaScriptコードをEvent Loop（初期化とコールバック）で実行し、ファイルI/Oのような高価なタスクを処理するためのWorker Poolを提供します。Node.jsは多くのクライアントを少数のスレッドで処理することでスケーラビリティを実現しています。

**重要な原則：Node.jsは、任意の時点で各クライアントに関連する作業が「小さい」場合に高速です。**

## Why should I avoid blocking the Event Loop and the Worker Pool?

Node.jsでは2種類のスレッドがあります：

- 1つのEvent Loop（メインループ、メインスレッド、イベントスレッドなど）
- Worker Pool内の`k`個のWorker（スレッドプール）

スレッドがブロックされると以下の問題が発生します：

1. **パフォーマンス**: スループット（リクエスト/秒）が低下
2. **セキュリティ**: 悪意のあるクライアントが「悪意のある入力」を送信してDoS攻撃を引き起こす可能性

## A quick review of Node

### What code runs on the Event Loop?

Event Loopで実行されるコード：

- 初期化フェーズ（モジュールのrequireとイベントコールバックの登録）
- 受信したクライアントリクエストに対する適切なコールバックの実行
- 非ブロッキング非同期リクエスト（ネットワークI/Oなど）の処理

### What code runs on the Worker Pool?

Worker Poolは以下のAPIで使用されます：

**I/O集約的**：

- DNS: `dns.lookup()`, `dns.lookupService()`
- File System: `fs.FSWatcher()`と明示的に同期的なもの以外のすべてのファイルシステムAPI

**CPU集約的**：

- Crypto: `crypto.pbkdf2()`, `crypto.scrypt()`, `crypto.randomBytes()`, `crypto.randomFill()`, `crypto.generateKeyPair()`
- Zlib: 明示的に同期的なもの以外のすべてのzlib API

### How does Node.js decide what code to run next?

Event Loopは実際にはキューを維持せず、代わりにOSのメカニズム（epoll、kqueue、event ports、IOCP）を使用してファイルディスクリプタを監視します。Worker Poolは実際のキューを使用してタスクを管理します。

### What does this mean for application design?

Node.jsでは、公平なスケジューリングはアプリケーションの責任です。単一のコールバックやタスクで過度な作業を行わないようにする必要があります。

## Don't block the Event Loop

Event Loopをブロックしないために：

- JavaScriptコールバックは迅速に完了すべき
- コールバックの計算複雑度を考慮する

### 複雑度の例

```js
// O(1) - 定数時間
app.get('/constant-time', (req, res) => {
  res.sendStatus(200);
});

// O(n) - 線形時間
app.get('/countToN', (req, res) => {
  const n = req.query.n;
  for (let i = 0; i < n; i++) {
    console.log(`Iter ${i}`);
  }
  res.sendStatus(200);
});

// O(n^2) - 二次時間（危険）
app.get('/countToN2', (req, res) => {
  const n = req.query.n;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      console.log(`Iter ${i}.${j}`);
    }
  }
  res.sendStatus(200);
});
```

### Blocking the Event Loop: REDOS

脆弱な正規表現（Vulnerable Regular Expression）は指数関数的な時間がかかる可能性があります。

#### 避けるべきパターン

1. ネストされた量指定子: `(a+)*`
2. 重複する句を持つOR: `(a|a)*`
3. 後方参照: `(a.*) \1`
4. 単純な文字列マッチには`indexOf`を使用

#### REDOS例

```js
app.get('/redos-me', (req, res) => {
  const filePath = req.query.filePath;
  // 危険！二重にネストされた量指定子
  if (filePath.match(/(\/.+)+$/)) {
    console.log('valid path');
  } else {
    console.log('invalid path');
  }
  res.sendStatus(200);
});
```

#### 対策ツール

- [safe-regex](https://github.com/davisjam/safe-regex)
- [rxxr2](https://github.com/superhuman/rxxr2)
- [node-re2](https://github.com/uhop/node-re2) - GoogleのRE2エンジンを使用

### Blocking the Event Loop: Node.js core modules

サーバーで使用すべきでない同期API：

**暗号化**：

- `crypto.randomBytes`（同期版）
- `crypto.randomFillSync`
- `crypto.pbkdf2Sync`

**圧縮**：

- `zlib.inflateSync`
- `zlib.deflateSync`

**ファイルシステム**：

- すべての同期ファイルシステムAPI

**子プロセス**：

- `child_process.spawnSync`
- `child_process.execSync`
- `child_process.execFileSync`

### Blocking the Event Loop: JSON DOS

`JSON.parse`と`JSON.stringify`は大きなオブジェクトに対して非常に高価になる可能性があります。

```js
let obj = { a: 1 };
const iterations = 20;

// オブジェクトを指数関数的に拡大
for (let i = 0; i < iterations; i++) {
  obj = { obj1: obj, obj2: obj };
}

// 2^21サイズのオブジェクト = 50MBの文字列
// JSON.stringify: 0.7秒
// indexOf: 0.03秒
// JSON.parse: 1.3秒
```

**対策**：

- [JSONStream](https://www.npmjs.com/package/JSONStream)
- [Big-Friendly JSON](https://www.npmjs.com/package/bfj)

## Complex calculations without blocking the Event Loop

### Partitioning（分割）

計算を小さな非同期ステップに分割：

```js
function asyncAvg(n, avgCB) {
  let sum = 0;
  function help(i, cb) {
    sum += i;
    if (i == n) {
      cb(sum);
      return;
    }
    // 非同期的に次の操作をスケジュール
    setImmediate(help.bind(null, i + 1, cb));
  }
  help(1, function(sum) {
    const avg = sum / n;
    avgCB(avg);
  });
}
```

### Offloading（オフロード）

Worker Poolへの作業のオフロード：

1. C++アドオンを使用してNode.jsの組み込みWorker Poolを使用
2. Child ProcessまたはClusterを使用して独自のWorker Poolを作成

**注意事項**：

- 通信コスト（シリアライゼーション/デシリアライゼーション）のオーバーヘッド
- CPU集約的タスクとI/O集約的タスクの特性の違いを考慮

## Don't block the Worker Pool

### タスク時間の変動を最小化

目標：タスク時間の変動を最小化し、タスク分割を使用してこれを達成する。

### 例：長時間実行されるファイルシステム読み取り

`fs.readFile()`はv10以前では分割されていません。代わりに以下を使用：

- `fs.read()`（手動分割）
- `ReadStream`（自動分割）

### 例：長時間実行される暗号操作

`crypto.randomBytes()`は分割されていないため、大量のバイトを生成する場合はタスク時間の変動の原因となります。

### Task partitioning（タスク分割）

各タスクを同等のコストのサブタスクに分割：

- 短いタスクは少数のサブタスクに展開
- 長いタスクは多数のサブタスクに展開

### タスク分割を避ける場合

短いタスクと長いタスクを区別できる場合は、各クラスのタスク用に別個のWorker Poolを作成することを検討。

## The risks of npm modules

npmモジュールを使用する際の懸念事項：

1. APIを遵守しているか？
2. APIがEvent LoopやWorkerをブロックする可能性があるか？

**推奨事項**：

- 高価になる可能性のあるAPIのコストを再確認
- 開発者にドキュメント化を依頼するか、自分でソースコードを調査

## Conclusion

高スループットでDoS耐性のあるWebサーバーを書くには：

- 善意および悪意のある入力の両方で、Event LoopもWorkersもブロックしないことを確認
- Node.jsは各クライアントの作業が「小さい」場合に最適に動作することを理解
- 計算の複雑さを考慮し、必要に応じてタスクを分割またはオフロード

## 重要な実装指針

1. **Event Loopの保護**：
   - 計算量の多いコールバックを避ける
   - 脆弱な正規表現を使用しない
   - 大きなJSONオブジェクトの処理に注意

2. **Worker Poolの最適化**：
   - タスク時間の変動を最小化
   - 必要に応じてタスクを分割
   - CPU集約的とI/O集約的タスクを区別

3. **セキュリティの考慮**：
   - REDOS攻撃を防ぐ
   - JSON DOS攻撃を防ぐ
   - 入力サイズを制限する

4. **パフォーマンスの監視**：
   - npmモジュールのコストを確認
   - 最悪のケースの実行時間を評価
   - 適切なツールとライブラリを使用
