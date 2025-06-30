---
title: "Encore — Framework for type-safe Distributed Systems"
source: "https://encore.dev/"
author:
  - "[[Encore — Open Source Backend Framework for robust distributed systems]]"
published:
created: 2025-06-30
description: |
  Encore is an open-source TypeScript backend framework for building robust, type-safe, and high-performance distributed systems. It features Rust-powered performance, declarative infrastructure as code, and deep AI integration to simplify development.
tags:
  - "Encore"
  - "TypeScript"
  - "Backend"
  - "Distributed Systems"
  - "Performance"
  - "Type-Safety"
  - "AI"
---

Encore.tsは、堅牢で型安全なアプリケーションを構築するためのオープンソースのTypeScriptバックエンドフレームワークです。

![Leap AI agent for Encore.ts apps](https://encore.dev/assets/img/leap.svg)

**[Leap — The AI developer agent for building Encore.ts applications](https://leap.new)**

* GitHub Stars: [★10k+](https://github.com/encoredev/encore)
* Contributors: [80+](https://github.com/encoredev/encore/graphs/contributors)
* npm dependencies: 0

<iframe width="560" height="315" src="https://www.youtube.com/embed/vvqTGfoXVsw" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## クイックスタート

1. **Encoreのインストール (macOS via Brew)**

    ```bash
    brew install encoredev/tap/encore
    ```

2. **アプリケーションの作成**

    ```bash
    encore app create --example=ts/hello-world
    ```

3. **ローカルでの実行**

    ```bash
    encore run
    ```

---

## パフォーマンス: Express.jsの9倍、Elysia & Honoの3倍高速

Encoreは、他の一般的なフレームワークと比較して、特にスキーマバリデーションありの場合に大幅に高いリクエスト/秒を達成します。

| Framework                 | Requests/sec (Without validation) | Requests/sec (With schema validation) |
| ------------------------- | --------------------------------- | ------------------------------------- |
| **Encore v1.38.7**        | **121,005**                       | **107,018**                           |
| Elysia (+ TypeBox)        | 82,617                            | 35,124                                |
| Hono (+ TypeBox)          | 71,202                            | 33,150                                |
| Fastify (+ Ajv)           | 62,207                            | 48,397                                |
| Express (+ Zod)           | 15,707                            | 11,878                                |

[→ ベンチマーク詳細を見る](/blog/event-loops)

## RustによるパフォーマンスとNode.jsでの型安全性

* **パフォーマンス**: Rustによるマルチスレッドのリクエストハンドリングとバリデーション。
* **互換性**: 完全なエコシステム互換性のためのネイティブNode.jsプロセスとして実行。
* **型安全性**: ランタイムの型安全性を実現するRustでの自動リクエストバリデーション。

<video controls width="100%"><source src="https://encore.dev/assets/videos/node_diagram.mp4" type="video/mp4"></video>

## 1行のコードで関数をAPIに変換

Encore.tsは通信のボイラープレートを生成し、完全な型安全性を保証します。

```typescript
// 通常のTypeScript関数
export const getBlogPost = async (req: { id: number }): Promise<BlogPost> => {
  // ...
};

// api()でラップしてAPIエンドポイントに変換
import { api } from "encore.dev/api";

export const getBlogPost = api(
  { method: "GET", path: "/blog/:id" },
  async (req: { id: number }): Promise<BlogPost> => {
    // ...
  }
);
```

## インフラを型安全なオブジェクトとして統合

Encoreはインフラを型対応にし、接続文字列やその他のボイラープレートを不要にします。

```typescript
// 1行でPostgreSQLデータベースを定義
import { SQLDatabase } from "encore.dev/storage/sqldb";
const db = new SQLDatabase("userdb", { migrations: "./migrations" });

// ... db.queryでデータベースをクエリする
```

* **オープンソース**: Encoreのツールを使い、Dockerイメージをサポートする任意の場所へデプロイ可能。
* **Encore Cloud**: AWSとGCP上でインフラとDevOpsを完全に自動化。

## AI対応、開発者中心

* **システム全体の生成**: AIツールがコードスニペットだけでなく、サービス、API、クラウドアインフラを含む統合された分散システムを生成。
* **AI生成コードの自動検証**: Encoreのパーサーが、サービスやAPIの定義、インフラ統合を正しく実装しているか検証。
* **知識の損失なし**: AIがコードを生成しても、自動ドキュメント、サービスカタログ、APIリファレンス、アーキテクチャ図により、開発者の理解とコンテキストを維持。

<video controls width="100%"><source src="https://encore.dev/assets/videos/ai_gen.mp4" type="video/mp4"></video>

### Cursorとの連携強化

| Feature                        | Cursor                                   | Encore + Cursor                                                                                               |
| ------------------------------ | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Code Autocomplete              | ✅                                       | ✅                                                                                                            |
| Chat + Agent                   | ✅                                       | ✅                                                                                                            |
| **App Architecture Introspection** | ❌                                       | ✅ EncoreのMCPサーバーがアプリのアーキテクチャ、API、データ、トレースを深く洞察し、より賢い開発を実現 |
| **Infrastructure Generation**  | ❌                                       | ✅ クラウドインフラ統合を自動で作成・検証                                                                      |
| **Standardized APIs**          | ❌                                       | ✅ 一貫したAPI設計と実装パターン                                                                               |
| **Automated Documentation**    | ❌                                       | ✅ APIドキュメントとアーキテクチャ図を自動生成                                                                 |

## 既存スタックとの互換性

Node.js, Next.js, Remix, Astro, Vue, Svelte, Prisma, Drizzle, Sequelize, GitHub, Vercel, Netlify, AWS, GCP, DigitalOcean, Temporal, Neon, Kubernetes, Datadog, Grafanaなど、多くの既存ツールと連携できます。

## 自動化されたローカルインフラと開発ダッシュボード

<video controls width="100%"><source src="https://encore.dev/assets/videos/hero.mp4" type="video/mp4"></video>

`encore run` コマンド一つで、アプリケーションとすべてのインフラが起動します。

* ![Hot Reload](https://encore.dev/assets/icons/features/live-reload-inverted.png) **ホットリロード付き自動ローカルインフラ**: YAMLやDocker Composeは不要。
* ![API Explorer](https://encore.dev/assets/icons/features/api-docs-inverted.png) **サービスカタログ & APIエクスプローラー**: APIドキュメントとテスト用UIを自動生成。
* ![Tracing](https://encore.dev/assets/icons/features/tracing-inverted.png) **トレーシング & ロギング**: APIリクエスト、DB呼び出し、Pub/Subメッセージをトレース。
* ![Architecture Diagrams](https://encore.dev/assets/icons/features/flow-inverted.png) **アーキテクチャ図**: アプリケーションの概要をリアルタイムで可視化。

## サンプルプロジェクト

Encoreを使って様々なアプリケーションを構築できます。

* **URL Shortener**: REST APIとPostgreSQLデータベースを持つURL短縮サービス。
* **Slack Bot**: Slack APIと統合されたCowsay Slackボット。
* **Event-Driven System**: イベント駆動型の稼働監視システム。
* **SaaS Starter**: Next.jsフロントエンド、Clerk認証、Stripe決済などを含むSaaSアプリ。

[→ すべてのオープンソースサンプルアプリを見る](https://github.com/encoredev/examples)

## コミュニティ

* **Discord**: 2k+のメンバーが参加。
* **GitHub**: 10k+のスターと80+のコントリビューター。
* **Twitter(X)**, **YouTube**でも情報を発信中。
