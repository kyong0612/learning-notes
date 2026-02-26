---
title: "Introduction"
source: "https://www.chat-sdk.dev/docs"
author:
  - "[[Vercel]]"
published:
created: 2026-02-26
description: "Chat SDKは、単一のTypeScriptコードベースでSlack、Microsoft Teams、Google Chat、Discord、GitHub、Linearなど複数プラットフォームに対応するチャットボットを構築するための統合ライブラリ。サーバーレス対応、AIストリーミング、JSXベースのリッチUI、スレッド購読など多彩な機能を提供する。"
tags:
  - "clippings"
  - "TypeScript"
  - "Chat Bot"
  - "SDK"
  - "Slack"
  - "Microsoft Teams"
  - "Discord"
  - "Vercel"
  - "AI Streaming"
---

## 概要

Chat SDKは、Vercelが開発したTypeScriptライブラリであり、一つのコードベースで複数のチャットプラットフォーム（Slack、Microsoft Teams、Google Chat、Discord、GitHub、Linear）に対応するボットを構築できる。プラットフォームごとに異なるAPIや仕様の差異を統一インターフェースで抽象化し、開発者の負担を大幅に軽減する。

## 主要なトピック

### Chat SDKを使う理由

複数プラットフォーム対応のチャットボット開発では、通常は各プラットフォームごとに別々のコードベースを保守し、異なるAPIを学習し、プラットフォーム固有の仕様を個別に処理する必要がある。Chat SDKはこれらの違いを統一インターフェースの背後に抽象化する。

主な特徴：

- **サーバーレス対応** — Redisによる分散ステートとメッセージ重複排除
- **AIストリーミング** — LLMレスポンスのストリーミングをファーストクラスサポート
- **リッチUI** — JSXによるカード、ボタン、モーダルを各プラットフォームでネイティブレンダリング
- **スレッド購読** — マルチターン会話のサポート
- **イベント駆動アーキテクチャ** — メンション、メッセージ、リアクション、ボタンクリック、スラッシュコマンド、モーダル用のハンドラ
- **型安全** — TypeScriptによるアダプタとイベントハンドラの完全な型サポート
- **単一コードベース** — すべてのプラットフォームで共通

### 3つのコアコンセプト

1. **State** — スレッド購読と分散ロックのためのプラガブルな永続化レイヤー
2. **Adapters** — Webhookパース、メッセージフォーマット、API呼び出しを処理するプラットフォーム固有の実装
3. **Chat** — アダプタを調整し、イベントをハンドラにルーティングするメインエントリポイント

### 基本的なコード例

```typescript
import { Chat } from "chat";
import { createSlackAdapter } from "@chat-adapter/slack";
import { createRedisState } from "@chat-adapter/state-redis";

const bot = new Chat({
  userName: "mybot",
  adapters: {
    slack: createSlackAdapter(),
  },
  state: createRedisState(),
});

bot.onNewMention(async (thread) => {
  await thread.subscribe();
  await thread.post("Hello! I'm listening to this thread.");
});
```

各アダプタファクトリは環境変数（`SLACK_BOT_TOKEN`、`SLACK_SIGNING_SECRET`、`REDIS_URL`など）から認証情報を自動検出するため、ゼロコンフィグで開始できる。明示的な値を渡してオーバーライドも可能。

### サポートプラットフォーム

| プラットフォーム | パッケージ | メンション | リアクション | カード | モーダル | ストリーミング | DM |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Slack | `@chat-adapter/slack` | Yes | Yes | Yes | Yes | Native | Yes |
| Microsoft Teams | `@chat-adapter/teams` | Yes | Read-only | Yes | No | Post+Edit | Yes |
| Google Chat | `@chat-adapter/gchat` | Yes | Yes | Yes | No | Post+Edit | Yes |
| Discord | `@chat-adapter/discord` | Yes | Yes | Yes | No | Post+Edit | Yes |
| GitHub | `@chat-adapter/github` | Yes | Yes | No | No | No | No |
| Linear | `@chat-adapter/linear` | Yes | Yes | No | No | No | No |

**Slack**が最も機能が充実しており、ネイティブストリーミングとモーダルをサポート。Teams/Google Chat/Discordはカードに対応するがモーダルは未サポートで、ストリーミングはPost+Edit方式。GitHub/Linearはメンションとリアクションに限定。

### パッケージ構成

| パッケージ | 説明 |
| --- | --- |
| `chat` | コアSDK（`Chat`クラス、型、JSXランタイム、ユーティリティ） |
| `@chat-adapter/slack` | Slackアダプタ |
| `@chat-adapter/teams` | Microsoft Teamsアダプタ |
| `@chat-adapter/gchat` | Google Chatアダプタ |
| `@chat-adapter/discord` | Discordアダプタ |
| `@chat-adapter/github` | GitHub Issuesアダプタ |
| `@chat-adapter/linear` | Linear Issuesアダプタ |
| `@chat-adapter/state-redis` | Redis状態アダプタ（本番用） |
| `@chat-adapter/state-ioredis` | ioredis状態アダプタ（代替） |
| `@chat-adapter/state-memory` | インメモリ状態アダプタ（開発用） |

### AIコーディングエージェント対応

Claude CodeなどのAIコーディングエージェントにChat SDKのドキュメント・パターン・ベストプラクティスを教えることが可能：

```bash
npx skills add vercel/chat
```

## 重要な事実・データ

- **GitHubスター数**: 731（2026年2月時点）
- **対応プラットフォーム数**: 6（Slack、Teams、Google Chat、Discord、GitHub、Linear）
- **状態管理**: Redis（本番）、ioredis（代替）、インメモリ（開発）の3種
- **ストリーミング方式**: Slackはネイティブ対応、その他はPost+Edit方式
- **ライセンス**: MIT

## 結論・示唆

### 著者の結論

Chat SDKは「Write once, deploy everywhere」のアプローチでチャットボット開発を統一する。プラットフォーム固有の複雑さをアダプタパターンで抽象化し、開発者がボットのロジックに集中できる設計思想を持つ。

### 実践的な示唆

- 複数プラットフォーム対応のボットを構築する際、個別にAPIを実装する代わりにChat SDKを採用することで開発コストを大幅に削減できる
- 本番環境ではRedis状態アダプタを使用し、開発時にはインメモリアダプタで素早くプロトタイピングが可能
- AIストリーミング機能により、LLMベースのチャットボットを効率的に構築できる
- JSXベースのカードUIにより、Reactに慣れた開発者が直感的にリッチなインタラクションを構築できる

## 制限事項・注意点

- モーダル機能はSlackのみ対応（Teams、Google Chat、Discord、GitHub、Linearは未サポート）
- ストリーミングのネイティブサポートはSlackのみ（他プラットフォームはPost+Edit方式でのフォールバック）
- GitHub/Linearアダプタはメンションとリアクションに限定され、カード・モーダル・ストリーミング・DMは未対応
- TeamsのリアクションはRead-only（読み取り専用）
- `published` の公開日は公式ドキュメント上に明記されていないため未記載

---

*Source: [Introduction - Chat SDK](https://www.chat-sdk.dev/docs)*
