---
title: "Workflow DevKit: Build durable, resilient, and observable workflows"
source: "https://github.com/vercel/workflow"
author:
  - Vercel Engineering Team
  - Adrian Lam
  - Dillon Mulroy
  - Gal Schlezinger
  - JJ Kasper
  - Nathan Rajlich
  - Peter Wielander
  - Pranay Prakash
published: 2024
created: 2025-11-07
description: |
  Workflow DevKitは、非同期JavaScriptに耐久性、信頼性、観測可能性を追加するオープンソースツールキットです。「use workflow」ディレクティブを使用して、中断・再開可能な耐久性のある処理を簡単に構築でき、AIエージェント、長時間実行されるプロセス、マルチステップワークフローなどに最適です。
tags:
  - workflow
  - typescript
  - durability
  - async
  - ai-agents
  - vercel
  - observability
  - open-source
  - reliability
  - state-management
---

# Workflow DevKit

**Workflow DevKit**は、非同期TypeScript/JavaScriptコードに耐久性、信頼性、観測可能性を追加するVercelが開発したオープンソースツールキットです。手動でキューやリトライ処理を実装することなく、中断・再開可能なワークフローを簡単に構築できます。

## 概要

### 主要な機能

1. **シンプルな宣言的API**
   - `"use workflow"`ディレクティブで通常の関数を耐久性のあるワークフローに変換
   - `"use step"`でリトライ可能なステップを定義
   - YAMLや複雑な設定ファイルは不要

2. **自動的な状態管理**
   - ワークフローの実行中に自動的に状態を永続化
   - 中断と再開が可能
   - `sleep()`機能でリソースを消費せずに長期間待機

3. **組み込みの観測可能性**
   - 各ステップのトレース、ログ、メトリクスを自動収集
   - 実行状況の詳細な可視化
   - タイムトラベルデバッグが可能

4. **フレームワーク対応**
   - Next.js、Hono、Nitro、SvelteKitなど主要フレームワークをサポート
   - より多くのフレームワークへの対応を予定（NestJS、Nuxt、Bunなど）

5. **ポータビリティ**
   - ローカル、Docker、Vercel、AWS、その他あらゆるクラウド環境で実行可能
   - ベンダーロックインなし

## 基本的な使い方

### ワークフローの作成

```typescript
import { sleep } from "workflow";

export async function userSignup(email: string) {
  "use workflow";

  // ユーザーを作成してウェルカムメールを送信
  const user = await createUser(email);
  await sendWelcomeEmail(email);

  // 7日間待機（リソースを消費しない）
  await sleep("7 days");
  await sendOneWeekCheckInEmail(email);

  return { userId: user.id, status: "done" };
}
```

### ステップの定義

```typescript
import { Resend } from 'resend';
import { FatalError } from 'workflow';

export async function sendWelcomeEmail(email: string) {
  "use step"

  const resend = new Resend('YOUR_API_KEY');

  const resp = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: [email],
    subject: 'Welcome!',
    html: `Thanks for joining Acme.`,
  });

  if (resp.error) {
    throw new FatalError(resp.error.message);
  }
}
```

### ワークフローの呼び出し

```typescript
export async function welcome(userId: string) {
  "use workflow";

  const user = await getUser(userId);
  const { subject, body } = await generateEmail({
    name: user.name, 
    plan: user.plan
  });

  const { status } = await sendEmail({
    to: user.email,
    subject,
    body,
  });

  return { status, subject, body };
}
```

## 主要な概念

### Reliability-as-code（コードとしての信頼性）

従来のアプローチでは、キューの設定、リトライロジック、状態管理を手動で実装する必要がありました。Workflow DevKitでは、これらの複雑さをシンプルなディレクティブに置き換えます：

- **従来**: カスタムキュー + リトライロジック + 状態管理
- **Workflow DevKit**: `"use workflow"` + `"use step"`

### 制御フロー

ワークフロー内では以下のような制御フローパターンが利用できます：

- **順次実行**: ステップを順番に実行
- **並列実行**: 複数のステップを同時実行
- **条件分岐**: if/else文を使った条件付き実行
- **ループ**: for/while文による繰り返し処理
- **エラーハンドリング**: try/catchによる例外処理

### エラーとリトライ

- **自動リトライ**: ステップが失敗した場合、自動的にリトライ
- **FatalError**: リトライせずに即座に失敗させる
- **カスタムリトライ戦略**: リトライ回数や間隔を設定可能

## ユースケース

Workflow DevKitは以下のような幅広いアプリケーションに適しています：

### 1. AIエージェント

```typescript
export async function aiAgentWorkflow(query: string) {
  "use workflow";

  // Step 1: 初期レスポンスの生成
  const response = await generateResponse(query);

  // Step 2: リサーチと検証
  const facts = await researchFacts(response);

  // Step 3: ファクトチェックによる改善
  const refined = await refineWithFacts(response, facts);

  return { response: refined, sources: facts };
}
```

### 2. 長時間実行プロセス

- CI/CDパイプライン
- データ処理ワークフロー
- バッチジョブ

### 3. マルチステップワークフロー

- ユーザーオンボーディング
- 複数日にわたるメール配信
- 予約・承認フロー

## 主要な利点

### 1. ゼロ設定

複雑なインフラ設定なしに、信頼性を持ったコードにコンパイルされます。キューの配線、スケジューラーの調整、YAMLファイルなどは不要です。

### 2. 完全な可視性

すべての実行をエンドツーエンドで検査できます。ステップの一時停止、リプレイ、タイムトラベルが可能で、追加のサービスやセットアップは不要です。

### 3. 汎用的なパラダイム

単一のパラダイムで、ストリーミング型のリアルタイムエージェントから、数日間にわたるメール配信ワークフローまで、幅広いアプリケーションを実装できます。

### 4. ポータビリティ

同じコードがローカル、Docker、Vercel、AWS、その他あらゆるクラウド環境で実行可能です。オープンソースで設計上ポータブルです。

## サンプルアプリケーション

### Story Generator Slack Bot

協力型の入力から子供向けストーリーを生成するSlackボット。Slackの対話的な機能とWorkflowの状態管理を組み合わせた実装例です。

[Vercelガイドを見る](https://vercel.com/guides/stateful-slack-bots-with-vercel-workflow)

### Flight Booking App

AIエージェントをより信頼性が高くプロダクション対応にするワークフロー。複数ステップの予約プロセスを耐久性のある方法で実装しています。

[GitHubを見る](https://github.com/vercel/workflow-examples/tree/main/flight-booking-app)

### Natural Language Image Search

自然言語による画像検索を構築するための無料オープンソーステンプレート。

[Vectr Storeを見る](https://www.vectr.store)

## 技術仕様

- **ライセンス**: Apache-2.0
- **言語構成**:
  - TypeScript: 82.1%
  - Rust: 11.7%
  - JavaScript: 3.0%
  - CSS: 2.6%
  - その他: 1.6%
- **インストール**: `npm i workflow`
- **公式サイト**: <https://useworkflow.dev>
- **ドキュメント**: <https://useworkflow.dev/docs>
- **GitHubスター**: 1.1k+
- **フォーク**: 77
- **コントリビューター**: 41+

## 対応フレームワーク

### 現在対応済み

- **Next.js**: [ガイドを見る](https://useworkflow.dev/docs/getting-started/next)
- **Hono**: [ガイドを見る](https://useworkflow.dev/docs/getting-started/hono)
- **Nitro**: [ガイドを見る](https://useworkflow.dev/docs/getting-started/nitro)
- **SvelteKit**: [ガイドを見る](https://useworkflow.dev/docs/getting-started/sveltekit)

### 対応予定

- NestJS
- Nuxt
- Bun

## コミュニティとサポート

### コミュニティリソース

- **ディスカッション**: [GitHub Discussions](https://github.com/vercel/workflow/discussions) - 質問、アイデア共有、プロジェクト紹介
- **イシュー**: [GitHub Issues](https://github.com/vercel/workflow/issues) - バグ報告や機能リクエスト
- **サンプル集**: [workflow-examples](https://github.com/vercel/workflow-examples) - 実装例とテンプレート

### 貢献

Workflow DevKitへの貢献は歓迎されています。GitHubのissuesやdiscussionsを通じて、チームやコミュニティと協力してください。

## セキュリティ

セキュリティ脆弱性を発見した場合は、**公開イシューを作成せず**、<responsible.disclosure@vercel.com>までメールで責任ある開示を行ってください。Vercelのオープンソースソフトウェアバグバウンティプログラムに参加できます。

## コア貢献エンジニア

- Adrian Lam ([@adriandlam](https://github.com/adriandlam))
- Dillon Mulroy ([@dmmulroy](https://github.com/dmmulroy))
- Gal Schlezinger ([@Schniz](https://github.com/Schniz))
- JJ Kasper ([@ijjk](https://github.com/ijjk))
- Nathan Rajlich ([@TooTallNate](https://github.com/TooTallNate))
- Peter Wielander ([@VaguelySerious](https://github.com/VaguelySerious))
- Pranay Prakash ([@pranaygp](https://github.com/pranaygp))

**ロゴデザイン**: Cecilio Ruiz ([@ceciliorz](https://x.com/ceciliorz))

## 開発ステータス

**ベータ版**として公開されており、積極的な開発が続けられています。プロダクション環境での使用は可能ですが、APIが変更される可能性があります。

## 関連リンク

- 公式サイト: <https://useworkflow.dev>
- GitHubリポジトリ: <https://github.com/vercel/workflow>
- サンプル集: <https://github.com/vercel/workflow-examples>
- ドキュメント: <https://useworkflow.dev/docs>
- コミュニティ: <https://github.com/vercel/workflow/discussions>
