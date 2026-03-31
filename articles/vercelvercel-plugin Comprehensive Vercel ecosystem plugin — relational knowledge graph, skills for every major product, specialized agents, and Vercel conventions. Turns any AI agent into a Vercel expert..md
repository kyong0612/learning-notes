---
title: "vercel/vercel-plugin: Comprehensive Vercel ecosystem plugin — relational knowledge graph, skills for every major product, specialized agents, and Vercel conventions. Turns any AI agent into a Vercel expert."
source: "https://github.com/vercel/vercel-plugin"
author:
  - "Vercel Labs"
  - "Melkeydev"
published: 2026-03-18
created: 2026-03-31
description: "Vercelエコシステム全体をカバーするAIコーディングエージェント向けプラグイン。リレーショナルナレッジグラフ、25のスキル、3つの専門エージェント、5つのスラッシュコマンド、ライフサイクルフックを備え、AIエージェントをVercelエキスパートに変換する。Claude Code・Cursor対応。"
tags:
  - "vercel"
  - "ai-coding-agent"
  - "claude-code"
  - "cursor"
  - "nextjs"
  - "ai-sdk"
  - "plugin"
  - "developer-tools"
---

## 概要

**vercel-plugin** は、Vercel Labs が開発したAIコーディングエージェント向けの包括的プラグインである。Vercelエコシステム全体（全プロダクト、ライブラリ、CLI、API、サービス）を**リレーショナルナレッジグラフ**として構造化し、AIエージェントに自動的にコンテキストを注入することで、Vercelに関する深い専門知識を提供する。

- **バージョン**: v0.25.0（plugin.json）/ v0.24.0（package.json）
- **ライセンス**: Apache-2.0
- **対応ツール**: Claude Code、Cursor（OpenAI Codexは近日対応予定）
- **前提条件**: Node.js 18+、Bun

### インストール

```bash
npx plugins add vercel/vercel-plugin
```

インストール後はセットアップ不要。プラグインは自動的にアクティベートされる。

---

## 動作原理

プラグインはAIエージェントのツール呼び出し、ファイルパス、プロジェクト設定から作業内容を検出し、適切な専門知識を適切なタイミングで自動注入する。ユーザーが学ぶべきコマンドや設定は一切ない。

---

## コンポーネント構成

### 1. エコシステムグラフ（`vercel.md`）

テキスト形式のリレーショナルグラフで以下をカバー:

- **全Vercelプロダクトとその相互関係** — 依存関係（→）、統合関係（↔）、代替関係（⇢）、包含関係（⊃）を明示
- **意思決定マトリクス** — レンダリング戦略、データミューテーション、AI機能、ストレージ、ビルド、セキュリティ、Functions の使い分け
- **クロスプロダクトワークフロー** — AIチャットボット構築、マルチプラットフォームBot、Durable Agent、Full-Stack SaaS、モノレポ構成、カスタムCI/CDの手順
- **マイグレーション対応表** — `@vercel/postgres`→Neon、`@vercel/kv`→Upstash Redis、AI SDK v5→v6、`middleware.ts`→`proxy.ts`など30以上の移行パス

### 2. スキル（25スキル）

各スキルは特定のVercelプロダクト/領域に対する深いガイダンスを提供する。

| スキル | カバー範囲 |
|--------|-----------|
| `ai-gateway` | 統一モデルAPI、プロバイダールーティング、フェイルオーバー、コストトラッキング、100+モデル |
| `ai-sdk` | AI SDK v6 — テキスト/オブジェクト生成、ストリーミング、ツールコーリング、エージェント、MCP、埋め込み |
| `ai-elements` | AI インターフェース用プリビルドReactコンポーネント（40+） |
| `auth` | 認証統合 — Clerk、Descope、Auth0のNext.jsセットアップ |
| `bootstrap` | プロジェクトブートストラップ — リンク、env プロビジョニング、DB セットアップ |
| `chat-sdk` | マルチプラットフォームチャットBot — Slack、Telegram、Teams、Discord、Google Chat、GitHub、Linear |
| `deployments-cicd` | デプロイとCI/CD — deploy、promote、rollback、--prebuilt、CIワークフロー |
| `env-vars` | 環境変数管理 — .envファイル、vercel envコマンド、OIDCトークン |
| `knowledge-update` | プラグインのナレッジ更新ガイダンス |
| `marketplace` | インテグレーション発見・インストール、自動env変数、統一課金 |
| `next-cache-components` | Next.js 16 Cache Components — PPR、`use cache`、cacheLife、cacheTag |
| `next-forge` | 本番SaaSモノレポスターター — Turborepo、Clerk、Prisma/Neon、Stripe、shadcn/ui |
| `next-upgrade` | Next.jsバージョンアップグレード — codemod、移行ガイド |
| `nextjs` | App Router、Server Components、Server Actions、Cache Components、ルーティング、レンダリング戦略 |
| `react-best-practices` | React/Next.jsパフォーマンス最適化 — 8カテゴリ64ルール |
| `routing-middleware` | リクエストインターセプション — Edge/Node.js/Bunランタイム |
| `runtime-cache` | リージョンごとのKVキャッシュ、タグベース無効化 |
| `shadcn` | shadcn/ui — CLI、コンポーネントインストール、カスタムレジストリ、テーマ |
| `turbopack` | Next.jsバンドラー、HMR、設定 |
| `turborepo` | モノレポビルドオーケストレーション、--affected、リモートキャッシュ |
| `vercel-agent` | AIコードレビュー、インシデント調査、PR分析 |
| `vercel-cli` | 全CLIコマンド — deploy、env、dev、domains、キャッシュ管理、MCP統合 |
| `vercel-functions` | Serverless、Edge、Fluid Compute、ストリーミング、Cron Jobs |
| `vercel-sandbox` | Firecracker microVM による安全な未信頼コード実行 |
| `vercel-storage` | Blob、Edge Config、Neon Postgres、Upstash Redis |
| `verification` | フルストーリー検証 — ブラウザ→API→データ→レスポンスのE2E検証 |
| `workflow` | Workflow DevKit — 永続実行、DurableAgent、ステップ、Worlds |

### 3. 専門エージェント（3エージェント）

| エージェント | 専門分野 |
|-------------|---------|
| `deployment-expert` | CI/CDパイプライン、デプロイ戦略、トラブルシューティング、環境変数 |
| `performance-optimizer` | Core Web Vitals、レンダリング戦略、キャッシュ、アセット最適化 |
| `ai-architect` | AIアプリケーション設計、モデル選定、ストリーミングアーキテクチャ、MCP統合 |

### 4. コマンド（5コマンド）

| コマンド | 目的 |
|---------|------|
| `/vercel-plugin:bootstrap` | プロジェクトブートストラップ — リンク、envプロビジョニング、DBセットアップ |
| `/vercel-plugin:deploy` | Vercelへのデプロイ（プレビューまたは本番） |
| `/vercel-plugin:env` | 環境変数管理 |
| `/vercel-plugin:status` | プロジェクトステータス概要 |
| `/vercel-plugin:marketplace` | マーケットプレイスインテグレーションの発見・インストール |

### 5. ライフサイクルフック

セッション中に自動実行されるフック:

| フック | 動作 |
|-------|------|
| **SessionStart コンテキスト注入** | セッション開始時に `vercel.md`（エコシステムグラフ＋規約）を注入 |
| **SessionStart リポプロファイラー** | 設定ファイルと依存関係をスキャンし、スキルマッチングを高速化 |
| **PreToolUse スキル注入** | ツール呼び出しをスキルにマッチングし、関連ガイダンスを重複排除して注入 |
| **PreWrite/Edit 検証** | 非推奨パターン（サンセットパッケージ、旧APIなど）が書き込まれる前にキャッチ |

---

## アーキテクチャ

```
vercel-plugin/
├── .plugin/plugin.json              # プラグインマニフェスト
├── vercel.md                        # エコシステムグラフ + 規約
├── skills/                          # 25スキル
│   ├── ai-sdk/                      # アップストリーム同期スキル例:
│   │   ├── overlay.yaml             #   プラグイン注入メタデータ
│   │   ├── upstream/                #   純粋なアップストリームコンテンツ
│   │   │   ├── SKILL.md
│   │   │   └── references/
│   │   ├── SKILL.md                 #   ビルド出力（overlay + upstream）
│   │   └── references/
│   ├── ai-elements/                 # プラグイン専用スキル例:
│   │   └── SKILL.md
│   └── ...
├── agents/                          # 3つの専門エージェント
├── commands/                        # 5つのスラッシュコマンド
├── scripts/                         # ビルドスクリプト
│   ├── build-skills.ts              # overlay + upstream → SKILL.md
│   ├── build-manifest.ts            # skill-manifest.json 生成
│   └── build-from-skills.ts         # テンプレートインクルード解決
└── hooks/                           # ライフサイクルフック
    └── src/                         # TypeScript → .mjs（tsup経由）
```

---

## アップストリームスキル同期

12のスキルは [skills.sh](https://skills.sh) のアップストリームソースリポジトリから同期される。**overlay + upstream モデル**を採用:

- `overlay.yaml` — プラグイン側のメタデータ（priority、pathPatterns、validate、chainTo）。同期で上書きされない
- `upstream/SKILL.md` — ソースリポジトリから取得。手動編集不可
- `SKILL.md` — ビルド出力。`bun run build:skills` で自動生成

| スキル | アップストリームリポ |
|--------|-------------------|
| `ai-sdk` | [vercel/ai](https://github.com/vercel/ai) |
| `chat-sdk` | [vercel/chat](https://github.com/vercel/chat) |
| `next-cache-components` | [vercel-labs/next-skills](https://github.com/vercel-labs/next-skills) |
| `next-forge` | [vercel/next-forge](https://github.com/vercel/next-forge) |
| `next-upgrade` | [vercel-labs/next-skills](https://github.com/vercel-labs/next-skills) |
| `nextjs` | [vercel-labs/next-skills](https://github.com/vercel-labs/next-skills) |
| `react-best-practices` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) |
| `vercel-cli` | [vercel/vercel](https://github.com/vercel/vercel) |
| `vercel-sandbox` | [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) |
| `workflow` | [vercel/workflow](https://github.com/vercel/workflow) |

---

## ビルドパイプライン

```bash
bun run build             # 全4ステージを順番に実行
bun run build:skills      # Stage 1: overlay + upstream → SKILL.md をマージ
bun run build:hooks       # Stage 2: TypeScript → .mjs にコンパイル
bun run build:manifest    # Stage 3: skill-manifest.json を生成
bun run build:from-skills # Stage 4: テンプレートインクルードを解決
```

CIでの整合性チェック:
```bash
bun run build:skills:check  # SKILL.md が最新かチェック（非ゼロで終了 = 要更新）
```

---

## エコシステムカバレッジ（2026年3月時点）

プラグインがカバーする全プロダクト:

- **フレームワーク**: Next.js 16（App Router、Cache Components、Proxy、View Transitions）、shadcn/ui
- **AI**: AI SDK v6、AI Elements（40+コンポーネント）、AI Gateway（100+モデル）、Chat SDK（マルチプラットフォーム）、Workflow DevKit（DurableAgent）、v0、Vercel Agent
- **コンピュート**: Vercel Functions（Fluid Compute、ストリーミング、Cron Jobs）、Routing Middleware、Vercel Sandbox（Firecracker microVM）
- **ストレージ**: Blob、Edge Config、Neon Postgres、Upstash Redis
- **インフラ**: Runtime Cache API、Vercel Queues、Vercel Flags、Rolling Releases
- **セキュリティ**: Sign in with Vercel、Auth統合（Clerk、Descope、Auth0）
- **ビルド**: Turborepo（--affected、リモートキャッシュ）、Turbopack
- **オブザーバビリティ**: Analytics、Speed Insights、Drains
- **マーケットプレイス**: ワンクリックインテグレーション、統一課金
- **開発ツール**: Vercel CLI、Agent Browser

---

## 重要な知見と特徴

1. **完全自動化**: インストール後、ユーザーが意識的に操作する必要なし。AIエージェントのツール呼び出しからコンテキストを検出し、関連スキルを自動注入
2. **重複排除機構**: セッション内で同じスキルが2度注入されることを防ぐデデュプ機能。最大3スキル/呼び出し、18KBバイト予算制限
3. **非推奨パターンガード**: `@vercel/postgres`や旧API名など、サンセット済みパターンがコードに書き込まれる前にキャッチ
4. **アップストリーム同期モデル**: 12スキルはVercelの各プロダクトリポジトリから自動同期。プラグイン固有のメタデータ（overlay）と分離管理
5. **デバッグログ**: `VERCEL_PLUGIN_LOG_LEVEL=debug` でスキル注入の詳細をトレース可能

---

## 制限事項

- **対応ツール**: 現時点ではClaude CodeとCursorのみ。OpenAI Codexは「Coming soon」
- **Bun必須**: ビルドパイプラインにBunが必要
- **スキル注入上限**: 1回のツール呼び出しにつき最大3スキル、18KBまで
- **ベータ段階**: v0.25.0であり、まだ安定版リリース前
