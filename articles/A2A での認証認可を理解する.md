---
title: "A2A での認証認可を理解する"
source: "https://zenn.dev/satohjohn/articles/6e65b4be3f933a"
author: "佐藤慧太"
published: 2026-01-02
created: 2026-01-04
description: "Linux Foundation傘下のAgent2Agent Protocol (A2A)における認証認可の実装方法を解説。AI Agent同士が協調して動作するためのセキュリティ仕様を、FastAPI/Pythonの実装例を交えて説明。"
tags:
  - "clippings"
  - "A2A"
  - "authentication"
  - "OAuth"
  - "AI-Agent"
---

## 概要

本記事は、Linux Foundation傘下のAgent2Agent Protocol (A2A)における認証認可の実装方法を解説しています。AI Agent同士が協調して動作するためのセキュリティ仕様を、実装例を交えて詳細に説明しています。

## A2A認証フロー（5段階）

A2Aの認証プロセスは以下の5つの段階で構成されます：

### 1. Discovery

AgentCard.jsonを取得し、利用可能な認証方式を確認します。エージェントがサポートする認証スキームを発見するフェーズです。

### 2. Negotiation

クライアントが対応可能な認証スキームを選択します。複数の認証方式がサポートされている場合、クライアントとサーバー間で合意形成を行います。

### 3. Token Acquisition

IdP（Identity Provider）からアクセストークンを取得します。OAuth 2.0やOpenID Connectなどのプロトコルを使用してトークンを発行してもらいます。

### 4. Task Execution

トークンをBearer形式で付与し、JSON-RPCリクエストを送信します。認証情報を含めた実際のエージェント間通信を実行します。

### 5. Validation

サーバー側でトークン検証を実施します。受信したトークンの署名、有効期限、発行者などを検証し、リクエストの正当性を確認します。

## securitySchemesとsecurityの区別

A2Aの仕様では、2つの重要な概念を区別しています：

- **securitySchemes**: エージェントが利用可能な認証方式の説明。どのような認証メカニズムをサポートしているかを宣言的に記述します。

- **security**: エージェント連携時のセキュリティ要件指定。実際のエージェント間通信で必要となる認証要件を定義します。

## 実装例：FastAPI/Python

記事では、以下の技術要素を含む実装例が紹介されています：

### 主要な実装要素

- **JWT署名検証**: HS256アルゴリズムを使用したトークンの署名検証
- **OAuth 2.0 Token Exchange**: RFC 8693に準拠したトークン交換フロー
- **Google OIDC連携**: Googleの認証基盤との統合
- **Google ADK v1.21.0での実装**: Google Agent Development Kitを使用した実装例

### 実装パターン

**リモートエージェント側:**

- `before_agent_callback`で認証ヘッダーを検証
- 受信したリクエストの妥当性をチェックし、不正なアクセスを防ぐ

**クライアント側:**

- `a2a_request_meta_provider`でトークンを埋め込み
- 送信前にリクエストに必要な認証情報を付与

## 重要なポイント

- AI Agent同士の安全な協調動作にはセキュリティ仕様の理解が不可欠
- 標準化されたプロトコル（OAuth 2.0、OIDC）の活用により、既存のエコシステムとの統合が容易
- トークンベースの認証により、ステートレスで拡張性の高いシステム構築が可能

## 参考資料

- A2A仕様書: <https://a2a-protocol.org/latest/specification/#7-authentication-and-authorization>
- 実装コード: GitHub上で公開
- Google ADKサンプル: Agent Development Kitの公式サンプル
