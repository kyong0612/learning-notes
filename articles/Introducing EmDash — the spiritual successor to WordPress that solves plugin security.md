---
title: "Introducing EmDash — the spiritual successor to WordPress that solves plugin security"
source: "https://blog.cloudflare.com/emdash-wordpress/"
author:
  - "[[Matt TK Taylor]]"
  - "[[Matt Kane]]"
published: 2026-04-01
created: 2026-04-03
description: "CloudflareがWordPressの精神的後継となるオープンソースCMS「EmDash」のベータを発表。TypeScriptで書かれ、Astro上に構築されたサーバーレスCMSで、プラグインをサンドボックス化されたWorker isolateで実行することにより、WordPressの根本的なプラグインセキュリティ問題を解決する。MITライセンスで公開。"
tags:
  - "clippings"
  - "Cloudflare"
  - "CMS"
  - "WordPress"
  - "TypeScript"
  - "Astro"
  - "Security"
  - "Serverless"
  - "Open Source"
  - "x402"
---

## 概要

Cloudflareが「EmDash」という新しいオープンソースCMSを発表した。WordPressの精神的後継を目指し、TypeScriptで完全に書き直されたサーバーレスCMSである。最大の特徴は、WordPressにおけるセキュリティ問題の96%を占めるプラグインの脆弱性を、**Dynamic Workers**によるサンドボックス化で根本的に解決する点にある。Astro 6.0をベースとし、MITライセンスで[GitHub上に公開](https://github.com/emdash-cms/emdash)されている。

## 主要なトピック

### WordPressの功績と限界

- WordPressはインターネットの**40%以上**を支えるCMSであり、オープンソースの成功事例として出版の民主化に貢献した
- しかしWordPressは今年で24年目を迎え、AWSすら存在しなかった時代に生まれたアーキテクチャを引きずっている
- 現代ではサーバーレスアーキテクチャが主流となり、JavaScriptバンドルをグローバルネットワークにデプロイする時代に移行している

### プラグインセキュリティ問題の解決

- WordPressサイトのセキュリティ問題の**96%がプラグインに起因**（[Patchstack調査](https://patchstack.com/whitepaper/state-of-wordpress-security-in-2025/)）
- 2025年には過去2年分を合わせたより多くの高深刻度脆弱性が発見された
- **根本原因**: WordPressプラグインはPHPスクリプトとして直接フックされ、サイトのデータベースとファイルシステムに無制限にアクセスできる（分離なし）

**EmDashの解決策**:
- 各プラグインは独立した**Dynamic Worker**（サンドボックス化されたisolate）で実行される
- プラグインはマニフェストで明示的に宣言したcapability（権限）のみ使用可能
- 外部ネットワークアクセスはデフォルトで無効。必要な場合は特定のホスト名のみ許可を宣言
- OAuthフローのように、インストール前にプラグインが要求する権限を確認できる

**プラグインコード例**:

```typescript
import { definePlugin } from "emdash";

export default () => definePlugin({
  id: "notify-on-publish",
  version: "1.0.0",
  capabilities: ["read:content", "email:send"],
  hooks: {
    "content:afterSave": async (event, ctx) => {
      if (event.collection !== "posts" || event.content.status !== "published") return;
      await ctx.email!.send({
        to: "editors@example.com",
        subject: `New post published: ${event.content.title}`,
        text: `"${event.content.title}" is now live.`,
      });
      ctx.log.info(`Notified editors about ${event.content.id}`);
    },
  },
});
```

### マーケットプレイスのロックイン問題の解決

- WordPressは手動でプラグインをレビュー・承認しており、レビューキューは**800件以上**で通過に最低**2週間**かかる
- WordPressプラグインはGPLライセンスの強制が議論されており、マーケットプレイスへのロックインが生じている

**EmDashの解決策**:
1. **ライセンスの自由**: プラグインはEmDashのコードを共有しないため、任意のライセンスを選択可能（NPMやPyPiと同様）
2. **安全なコード実行**: サンドボックスにより、プラグインのソースコードを公開せずとも信頼できる
3. capabilityの宣言により、コード行数に関係なくプラグインの権限範囲が明確

### x402による組み込みの課金機能

- AI時代においてコンテンツクリエイターのビジネスモデルが危機に瀕している
- **[x402](https://www.x402.org/)**: インターネットネイティブな決済のためのオープン標準
  - HTTP 402 Payment Requiredステータスコードを活用
  - エージェントやクライアントがオンデマンドで従量課金
- EmDashにはx402サポートが組み込まれており、サブスクリプション不要でコンテンツへの課金が可能
- 設定はコンテンツの選択、価格設定、ウォレットアドレスの提供のみ

### サーバーレスによるスケールトゥゼロ

- WordPressは従来型のサーバー管理が必要で、トラフィックスパイクへの対応にはアイドルコンピュートの事前プロビジョニングが不可避
- EmDashはCloudflare Workersの**v8 isolateアーキテクチャ**上で動作:
  - リクエスト到着時に即座にisolateを起動
  - リクエストがなければゼロにスケールダウン
  - **CPUタイムのみ課金**（実際の処理時間のみ）
- [Cloudflare for Platforms](https://developers.cloudflare.com/cloudflare-for-platforms/)で数百万のEmDashインスタンスを運用可能

### Astroによるモダンなフロントエンドテーマ

- EmDashのテーマはAstroプロジェクトとして作成:
  - **Pages**: コンテンツレンダリング用のAstroルート
  - **Layouts**: 共有HTML構造
  - **Components**: 再利用可能なUI要素
  - **Styles**: CSSまたはTailwind設定
  - **Seedファイル**: CMSのコンテンツタイプとフィールドを定義するJSON
- WordPressテーマの`functions.php`はプラグインと同様のセキュリティリスクを持つが、EmDashテーマはデータベース操作が不可能

### AI Native CMS

EmDashはAIエージェントによるプログラマティックな管理を前提に設計:

1. **Agent Skills**: プラグイン作成やWordPressテーマのEmDash移行などのガイダンスを含む[スキルファイル](https://github.com/emdash-cms/emdash/blob/main/skills/creating-plugins/SKILL.md)を提供
2. **EmDash CLI**: ローカル/リモートインスタンスとプログラムで対話（メディアアップロード、コンテンツ検索、スキーマ管理）
3. **組み込みMCPサーバー**: 各EmDashインスタンスがModel Context Protocol（MCP）サーバーを提供

### パスキー認証とプラガブル認証

- デフォルトでパスキーベース認証を採用（パスワード漏洩やブルートフォース攻撃のリスクを排除）
- ロールベースアクセス制御: administrator、editor、author、contributor
- SSOプロバイダとの統合が可能で、IdPメタデータに基づく自動プロビジョニングに対応

### WordPressからの移行

- WordPress管理画面からWXRファイルをエクスポート、または[EmDash Exporterプラグイン](https://github.com/emdash-cms/wp-emdash/tree/main/plugins/emdash-exporter)をインストールして移行
- メディアの自動移行に対応
- WordPressのカスタム投稿タイプ（Advanced Custom Fieldsなど）を、EmDashの独立したコレクションとして移行可能
- カスタムブロックは[EmDash Block Kit Agent Skill](https://github.com/emdash-cms/emdash/blob/main/skills/creating-plugins/references/block-kit.md)でビルド可能

## 重要な事実・データ

- **WordPressのシェア**: インターネットの40%以上
- **プラグイン起因のセキュリティ問題**: 96%
- **WordPressの年齢**: 24年目（2026年時点）
- **プラグインレビューキュー**: 800件以上、最低2週間
- **EmDashバージョン**: v0.1.0 プレビュー（開発者ベータ）
- **ライセンス**: MIT
- **基盤技術**: TypeScript, Astro 6.0, Cloudflare Workers
- **開始方法**: `npm create emdash@latest` またはCloudflareダッシュボードからデプロイ

## 結論・示唆

### 著者の結論

EmDashはWordPressの功績を尊重しつつ、WordPressが構造的に解決できないプラグインセキュリティ、マーケットプレイスロックイン、スケーラビリティの問題を根本から解決する新世代CMSである。AI時代のコンテンツビジネスモデル（x402）とAIネイティブな管理機能を組み込むことで、次の時代のコンテンツプラットフォームを目指している。

### 実践的な示唆

- WordPressサイトの運営者は、セキュリティリスクの軽減策としてEmDashへの移行を検討する価値がある
- プラグイン/テーマ開発者は、GPL制約から解放されたMITライセンスのエコシステムで自由にライセンスを選択できる
- ホスティングプラットフォームは、サーバーレスアーキテクチャによるコスト最適化（スケールトゥゼロ）の恩恵を受けられる
- コンテンツクリエイターは、x402の組み込みサポートによりエンジニアリング不要で課金モデルを導入できる

## 制限事項・注意点

- 現在**v0.1.0プレビュー版**（開発者ベータ）であり、本番運用向けではない
- WordPressの機能との互換性を目指しているが、WordPressのコードは一切使用していない
- Cloudflare以外の環境（Node.jsサーバー）でも動作するが、スケールトゥゼロやDynamic Workersの恩恵はCloudflare上でのみ最大化される
- プラグインエコシステムは新規であり、WordPressの豊富なプラグイン資産とは比較にならない規模

---

*Source: [Introducing EmDash — the spiritual successor to WordPress that solves plugin security](https://blog.cloudflare.com/emdash-wordpress/)*