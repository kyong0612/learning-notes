---
title: "Node.js — Profiling Node.js Applications"
source: "https://nodejs.org/en/learn/getting-started/profiling"
author:
  - "[[@nodejs]]"
published:
created: 2025-07-01
description: |
  Node.jsアプリケーションのプロファイリングは、実行中のCPU、メモリ、その他のランタイムメトリクスを分析してパフォーマンスを測定するプロセスです。これにより、効率、応答性、スケーラビリティに影響を与える可能性のあるボトルネック、高いCPU使用率、メモリリーク、遅い関数呼び出しを特定できます。
tags:
  - "clippings"
  - "Node.js"
  - "profiling"
  - "performance"
  - "V8"
  - "diagnostics"
---

## Node.js アプリケーションのプロファイリング

Node.jsアプリケーションのプロファイリングは、CPU、メモリ、その他のランタイムメトリクスを分析してパフォーマンスを測定するプロセスです。これにより、アプリケーションの効率、応答性、スケーラビリティに影響を与えるボトルネック、高いCPU使用率、メモリリーク、または遅い関数呼び出しを特定できます。

多くのサードパーティツールが存在しますが、最も簡単な選択肢はNode.jsの組み込みプロファイラを使用することです。このプロファイラはV8内部のプロファイラを利用し、実行中に定期的にスタックをサンプリングします。

### 組み込みプロファイラの使用方法

簡単なExpressアプリケーションを例に、組み込みプロファイラの使用方法を説明します。このアプリケーションには、新規ユーザーを追加するハンドラと、ユーザー認証を検証するハンドラの2つがあります。

**問題のあるコード例 (同期処理):**

ユーザー認証ハンドラで、パスワードのハッシュ化に同期的な`crypto.pbkdf2Sync`を使用しています。

```javascript
app.get('/auth', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';

  username = username.replace(/[^a-zA-Z0-9]/g, '');

  if (!username || !password || !users[username]) {
    return res.sendStatus(400);
  }

  const { salt, hash } = users[username];
  const encryptHash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');

  if (crypto.timingSafeEqual(hash, encryptHash)) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});
```

このアプリケーションを高負荷状態で実行すると、リクエストのレイテンシが非常に高くなる問題が発生します。

### プロファイリングの実行と分析

1. **プロファイラを有効にしてアプリを実行:**
    `--prof`フラグを付けてアプリケーションを実行します。これにより、ティックファイル(`isolate-0xnnnnnnnnnnnn-v8.log`のような名前)が生成されます。

    ```bash
    NODE_ENV=production node --prof app.js
    ```

2. **負荷テストの実施:**
    `ab` (ApacheBench) などのツールを使用してサーバーに負荷をかけます。

    ```bash
    ab -k -c 20 -n 250 "http://localhost:8080/auth?username=matt&password=password"
    ```

    結果、1秒あたり約5リクエストしか処理できず、平均リクエスト時間は4秒近くかかることがわかります。

3. **プロファイル結果の処理:**
    生成されたティックファイルを、`--prof-process`フラグを使って人間が読める形式に変換します。

    ```bash
    node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > processed.txt
    ```

4. **結果の分析:**
    出力された`processed.txt`を確認すると、CPU時間の大部分(この例では97%以上)がC++コードで費やされていることがわかります。詳細を見ると、`node::crypto::PBKDF2`関数がCPU時間の51.8%を占めており、これがボトルネックであることが明らかになります。

    ```
     [C++]:
       ticks  total  nonlib   name
      19557   51.8%   52.9%  node::crypto::PBKDF2(v8::FunctionCallbackInfo<v8::Value> const&)
       4510   11.9%   12.2%  _sha1_block_data_order
       3165    8.4%    8.6%  _malloc_zone_malloc
    ```

    [Bottom up (heavy) profile]セクションを見ると、これらのCPU負荷の高い関数がすべて`pbkdf2`の同期呼び出しに関連していることが確認できます。

### 改善策: 非同期処理への変更

ボトルネックは、パスワードハッシュの生成が同期的であり、イベントループをブロックしていることでした。これを解決するため、`crypto.pbkdf2`の非同期バージョンを使用するようにハンドラを修正します。

**改善後のコード例 (非同期処理):**

```javascript
app.get('/auth', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';

  username = username.replace(/[^a-zA-Z0-9]/g, '');

  if (!username || !password || !users[username]) {
    return res.sendStatus(400);
  }

  crypto.pbkdf2(
    password,
    users[username].salt,
    10000,
    512,
    'sha512',
    (err, hash) => {
      if (users[username].hash.toString() === hash.toString()) {
        res.sendStatus(200);
      } else {
        res.sendStatus(401);
      }
    }
  );
});
```

### 改善後の結果

再度負荷テストを実行すると、1秒あたり約20リクエストを処理できるようになり、スループットが約4倍に向上しました。また、平均レイテンシも4秒から1秒強に短縮されました。

この例から、V8のティックプロセッサがNode.jsアプリケーションのパフォーマンスを理解し、ボトルネックを特定するのにいかに役立つかがわかります。
