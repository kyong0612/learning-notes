---
title: "Node.js — The Node.js Event Loop"
source: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick"
author:
  - "Node.js"
published:
created: 2025-06-21
description: |
  Node.jsのイベントループが、シングルスレッドでありながらノンブロッキングI/O操作をどのように実現しているかを解説します。イベントループの各フェーズ（タイマー、ポーリング、チェックなど）の役割と、`setTimeout`、`setImmediate`、`process.nextTick`の動作と違いについて詳しく説明します。
tags:
  - "nodejs"
  - "event-loop"
  - "asynchronous"
  - "libuv"
  - "performance"
  - "timers"
  - "nexttick"
---

## Node.js イベントループの概要

Node.jsのイベントループは、JavaScriptがシングルスレッドであるにもかかわらず、ノンブロッキングI/O操作を可能にする中心的な仕組みです。操作を可能な限りシステムカーネルにオフロードし、完了した操作のコールバックをキューに入れて処理します。

### イベントループの仕組み

Node.jsは起動時にイベントループを初期化し、スクリプトを実行します。非同期API呼び出しやタイマー設定が行われると、以下のフェーズから成るループ処理を開始します。

```
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

各フェーズはFIFO（先入れ先出し）のコールバックキューを持っており、ループがそのフェーズに入ると、キューが空になるか上限に達するまでコールバックを実行します。

### 各フェーズの詳細

- **timers**: `setTimeout()` と `setInterval()` でスケジュールされたコールバックを実行します。タイマーは指定時間後に「実行可能」になることを保証するもので、正確な実行時間を保証するものではありません。
- **pending callbacks**: TCPソケットのエラーなど、一部のシステム操作のI/Oコールバックを実行します。
- **poll**: 新しいI/Oイベントを取得し、関連するコールバック（クローズコールバック、タイマー、`setImmediate()`を除くほとんど）を実行します。キューが空の場合、Node.jsはここでブロックすることがあります。
- **check**: `setImmediate()` のコールバックはここで実行されます。
- **close callbacks**: `socket.on('close', ...)` のような、ソケットやハンドルのクローズイベントのコールバックを実行します。

## `setImmediate()` vs `setTimeout()`

これら2つのタイマーは似ていますが、呼び出される状況によって動作が異なります。

- **`setImmediate()`**: 現在の`poll`フェーズが完了した直後にスクリプトを実行するように設計されています。
- **`setTimeout()`**: 指定された最小ミリ秒が経過した後にスクリプトを実行するようにスケジュールします。

I/Oサイクル内で呼び出された場合、`setImmediate()` は常に `setTimeout(..., 0)` より先に実行されます。しかし、メインモジュールなどI/Oサイクル外で呼び出された場合、実行順序はプロセスのパフォーマンスに依存するため非決定的です。

## `process.nextTick()`

`process.nextTick()` は厳密にはイベントループの一部ではありません。`nextTickQueue` に登録されたコールバックは、現在の操作が完了した後、イベントループが次のフェーズに進む**前**に処理されます。

これにより、APIの呼び出し側で常にコールバックが非同期に実行されることを保証できますが、再帰的に `process.nextTick()` を呼び出すと、イベントループが `poll` フェーズに到達できなくなり、I/Oが飢餓状態に陥る（starve）可能性があります。

### `process.nextTick()` と `setImmediate()` の比較

名前は紛らわしいですが、`process.nextTick()` は `setImmediate()` よりも即時性が高く、同じフェーズ内で直ちに実行されます。一方、`setImmediate()` はイベントループの次のイテレーション（ティック）で実行されます。この命名は歴史的な経緯によるもので変更されることはないため、挙動を正確に理解することが重要です。

> **推奨**: 2つの動作の違いを理解した上で、より予測しやすい `setImmediate()` の使用が一般的に推奨されています。

### `process.nextTick()` の利用ケース

`process.nextTick()` が有用なのは主に以下の2つのケースです。

1. イベントループが続行する前に、エラー処理やリソースのクリーンアップを行いたい場合。
2. コールスタックが展開された後、かつイベントループが続行する前にコールバックを実行する必要がある場合。例えば、`EventEmitter` を拡張したクラスのコンストラクタ内で、イベントリスナが登録されるのを待ってからイベントを発行したい場合など。

[Prev Discover JavaScript Timers](https://nodejs.org/en/learn/asynchronous-work/discover-javascript-timers) [Next The Node.js Event Emitter](https://nodejs.org/en/learn/asynchronous-work/the-nodejs-event-emitter)
