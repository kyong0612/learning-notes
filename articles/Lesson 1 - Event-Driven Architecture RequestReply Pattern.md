---
title: "Lesson 1 - Event-Driven Architecture: Request/Reply Pattern"
source: "https://www.youtube.com/watch?v=3bxAm3XIFmk"
author:
  - Mark Richards
published: 2018-01-09
created: 2025-11-28
description: |
  イベント駆動アーキテクチャにおける Request/Reply パターンの実装方法を解説するレッスン。非同期プロトコルであるメッセージングにおいて、同期的なレスポンスを取得するための2つの手法（Correlation ID方式とTemporary Queue方式）を、具体的な例を用いて説明している。
tags:
  - event-driven-architecture
  - messaging
  - request-reply-pattern
  - asynchronous-communication
  - software-architecture
  - JMS
  - RabbitMQ
---

## 概要

Mark Richards（独立コンサルタント、ハンズオンソフトウェアアーキテクト、developertoarchitect.com 創設者）による「Software Architecture Monday」シリーズの第1回レッスン。イベント駆動アーキテクチャにおける **Request/Reply メッセージング**パターンについて解説する。

## 背景：なぜ Request/Reply が必要か

メッセージングは様々なアーキテクチャスタイルに適用可能で、**コンポーザビリティ（構成可能性）**を提供する強力なパターンである。しかし、メッセージングは本質的に**非同期プロトコル**であるため、「非同期環境でどのようにレスポンスを取得するか？」という疑問が常に生じる。

## Request/Reply パターンの基本構造

メッセージングチャネルは実際には**2つのキュー**で構成される：

```
[送信者] ---> [Request Queue] ---> [サービス/アプリケーション]
[送信者] <--- [Reply Queue]   <--- [サービス/アプリケーション]
```

- **Request Queue**: リクエストを別のサービスやアプリケーションに送信
- **Reply Queue**: そのサービスやアプリケーションからレスポンスを受信

### 擬似同期メッセージング（Pseudo-Synchronous Messaging）

このパターンは**擬似同期メッセージング**と呼ばれる。動作フローは以下の通り：

1. **リクエスト送信**: 例えば「顧客名を取得」というリクエストを送信
2. **待機不要**: 送信後、待機する必要がなく自由に他の処理が可能
3. **並行処理**: サービスが名前を処理している間、送信者は別の処理を実行可能
4. **ブロッキング待機**: Reply Queue に対してブロッキング待機を行う
5. **レスポンス受信**: サービスが処理完了後、レスポンスを送信し、送信者が受信

## 実装方式1：Correlation ID を使用した Request/Reply

### 仕組み

複数の送信者が同じ Reply Queue を共有する場合、自分のレスポンスを特定するために **Correlation ID** を使用する。

### 処理フロー

1. **リクエスト送信**
   - 送信者がメッセージを送信（例：Message ID = 124）
   - 「顧客ABCの名前を取得」というリクエストをRequest Queueに送信

2. **ブロッキング待機**
   - **メッセージセレクタ（Message Selector）**または**メッセージフィルタ**を使用
   - `Correlation ID = 124` のメッセージを待機
   - Reply Queue内の他のメッセージ（Correlation ID: 120, 122など）は無視される

3. **レシーバーの処理**
   - レシーバーがMessage ID 124のメッセージを受信
   - 名前のルックアップを実行
   - **Correlation ID を元のMessage ID（124）に設定**してレスポンスを送信
   - レスポンスは新しいMessage ID（例：857）を取得するが、Correlation IDは124のまま

4. **レスポンス受信**
   - 送信者がCorrelation ID = 124のメッセージを受信
   - 顧客の名前を取得

### 重要ポイント

- Reply Queueには他の送信者向けのメッセージも存在する
- 各メッセージは対応する送信者が取得するまでキューに残る
- Correlation IDにより、自分のレスポンスを正確に識別可能

## 実装方式2：Temporary Queue を使用した Request/Reply

### 仕組み

より**シンプルな方式**。Correlation IDの代わりに**一時キュー（Temporary Queue）**を使用する。

### 処理フロー

1. **初期状態**
   - 送信者とレシーバーの間にResponse Queueは存在しない

2. **リクエスト送信**
   - 送信者がメッセージヘッダーの `Reply-To` フィールドに一時キューを指定
   - 例：`Reply-To: temp-q1`
   - **メッセージブローカーが自動的に一時キューを作成**

3. **一時キューの特性**
   - キューの存在は**そのメッセージ内部でのみ**知られる
   - キュー名は通常UUID形式
   - **自分専用のキュー**なので、メッセージセレクタは不要

4. **レスポンス受信**
   - 送信者は単純にその一時キューでブロッキング待機
   - レシーバーが処理後、レスポンスを一時キューに送信
   - 送信者がレスポンスを受信

5. **クリーンアップ**
   - レスポンス受信後、**メッセージブローカーが自動的に一時キューを削除**

### 利点

- Correlation IDの管理が不要
- シンプルな実装
- 自動的なリソースクリーンアップ

## 2つの方式の比較

| 項目 | Correlation ID方式 | Temporary Queue方式 |
|------|-------------------|---------------------|
| 複雑さ | より複雑 | シンプル |
| キュー管理 | 共有Reply Queue | 送信者ごとに専用キュー |
| メッセージセレクタ | 必要 | 不要 |
| リソース管理 | 手動 | 自動（ブローカーが管理） |

## サンプルコード

### JMS 1.1 / 2.0（ActiveMQ）

- リポジトリ: `github.com/wmr513/messaging`
- Request/Reply コードを参照

### RabbitMQ

- リポジトリ: `github.com/wmr513/streaming`
- 2つのクラスを参照：
  - **TradeGenerator**: メッセージを生成
  - **TradeValidator**: メッセージを受信し、トレードを検証してブロッキング待機中のTradeGeneratorに返送

## 重要な結論

1. **メッセージングは非同期だが、Request/Replyパターンで同期的な動作を実現可能**
2. **Correlation ID方式**は共有キューを使用し、メッセージセレクタで自分のレスポンスをフィルタリング
3. **Temporary Queue方式**はよりシンプルで、専用キューによりフィルタリング不要
4. 両方式ともイベント駆動アーキテクチャに適用可能

## リソース

- [Developer to Architect](https://www.developertoarchitect.com/lessons/) - 毎週月曜日に新しいソフトウェアアーキテクチャのレッスンを公開
- [wmr513/messaging](https://github.com/wmr513/messaging) - JMS サンプルコード
- [wmr513/streaming](https://github.com/wmr513/streaming) - RabbitMQ サンプルコード
