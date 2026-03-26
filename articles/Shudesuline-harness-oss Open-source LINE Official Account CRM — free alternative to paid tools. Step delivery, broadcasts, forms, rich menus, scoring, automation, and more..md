---
title: "Shudesu/line-harness-oss: Open-source LINE Official Account CRM — free alternative to paid tools. Step delivery, broadcasts, forms, rich menus, scoring, automation, and more."
source: "https://github.com/Shudesu/line-harness-oss"
author:
  - "[[Shudesu]]"
published: 2026-03-23
created: 2026-03-26
description: "LINE公式アカウント向けの完全オープンソースCRMツール。Lステップ・Utageなどの有料ツールの無料代替として、ステップ配信・ブロードキャスト・フォーム・リッチメニュー・スコアリング・自動化などの全機能をCloudflare無料枠上で提供する。MITライセンス。"
tags:
  - "clippings"
  - "LINE"
  - "CRM"
  - "Open Source"
  - "Cloudflare Workers"
  - "TypeScript"
  - "Marketing Automation"
---

## 概要

**LINE Harness** は、LINE公式アカウントの運用に必要なCRM機能を包括的に提供する完全オープンソース（MITライセンス）のプロジェクトである。Lステップ（月額2万円〜）やUtage（月額1万円〜）といった有料SaaSの無料代替として位置づけられ、**Cloudflare無料枠で5,000友だちまでサーバー代0円で運用可能**。

GitHub上で235スター・73フォークを獲得しており（2026年3月時点）、Claude Codeからの全操作対応やBAN検知・自動移行など、既存有料ツールにはないユニークな機能も搭載している。

## 主要なトピック

### 競合比較 — なぜ LINE Harness か

|  | L社（Lステップ等） | U社（Utage等） | **LINE Harness** |
| --- | --- | --- | --- |
| 月額 | 2万円〜 | 1万円〜 | **0円** |
| ステップ配信 | ✅ | ✅ | ✅ |
| セグメント配信 | ✅ | ✅ | ✅ |
| リッチメニュー切替 | ✅ | ✅ | ✅ |
| フォーム | ✅ | ✅ | ✅ |
| スコアリング | ✅ | ❌ | ✅ |
| IF-THEN 自動化 | 一部 | 一部 | ✅ |
| API 公開 | ❌ | ❌ | **全機能** |
| AI (Claude Code) 対応 | ❌ | ❌ | **✅** |
| BAN 検知 & 自動移行 | ❌ | ❌ | **✅** |
| マルチアカウント | 別契約 | 別契約 | **標準搭載** |
| ソースコード | 非公開 | 非公開 | **MIT** |

LINE Harnessの主な差別化ポイントは以下の4点：
1. **全API公開** — 100+エンドポイントをREST APIとして利用可能
2. **AI連携** — Claude CodeからCRM全操作が可能
3. **BAN対策** — アカウントヘルス監視とワンクリック移行
4. **マルチアカウント** — 追加契約なしで複数アカウント管理

### 全機能一覧

#### 配信機能
- **ステップ配信** — `delay_minutes` で分単位制御、条件分岐、ステルスモード対応
- **即時配信** — ブロードキャスト・個別メッセージの即時送信
- **ブロードキャスト** — 全員/タグ/セグメント配信、即時 or 予約配信、バッチ送信
- **リマインダー** — 指定日からのカウントダウン配信（セミナー3日前、1日前、当日など）
- **テンプレート** — メッセージテンプレートの管理・再利用
- **テンプレート変数** — `{{name}}`, `{{uid}}`, `{{auth_url:CHANNEL_ID}}` で友だちごとにパーソナライズ
- **配信時間帯制御** — 9:00-23:00 JST のみ配信、ユーザー別の好み時間設定

#### CRM機能
- **友だち管理** — Webhook 自動登録、プロフィール取得、カスタムメタデータ
- **タグ** — セグメント分け、配信条件、シナリオトリガー
- **スコアリング** — 行動ベースのリードスコア自動計算
- **オペレーターチャット** — 管理画面から直接 LINE 返信

#### マーケティング機能
- **リッチメニュー** — ユーザー別・タグ別のメニュー動的切替
- **トラッキングリンク** — クリック計測 + 自動タグ付け + シナリオ開始
- **フォーム (LIFF)** — LINE 内で完結するフォーム、回答→メタデータ自動保存
- **カレンダー予約** — Google Calendar 連携の予約システム (LIFF)

#### 自動化機能
- **IF-THEN ルール** — 7種のトリガー × 6種のアクション
- **自動返信** — キーワードマッチ（完全一致/部分一致）
- **Webhook IN/OUT** — 外部サービス連携（Stripe, Slack 等）
- **通知ルール** — 条件付きアラート配信

#### 安全性・運用機能
- **BAN 検知** — アカウントヘルスの自動監視（normal/warning/danger）
- **アカウント移行** — BAN 時のワンクリック移行（友だち・タグ・シナリオ引き継ぎ）
- **ステルスモード** — 送信ジッター、バッチ間隔ランダム化でBAN回避
- **マルチアカウント** — 1 Worker で複数アカウント管理、Webhook 署名で自動ルーティング
- **クロスプロバイダー UUID 統合** — `?uid=` パラメータで別プロバイダー間の同一人物を自動リンク

#### 分析機能
- **CV 計測** — コンバージョンポイント定義 → イベント記録 → レポート
- **アフィリエイト** — コード発行、クリック追跡、報酬計算
- **流入元追跡** — `/auth/line?ref=xxx` で友だち追加経路を自動記録

### 技術スタック

```
LINE Platform ──→ Cloudflare Workers (Hono) ──→ D1 (SQLite)
                         ↑                          ↑
                   Cron (5分毎)              42 テーブル
                         ↓
                  LINE Messaging API

Next.js 15 (管理画面) ──→ Workers API ──→ D1
LIFF (Vite) ──→ Workers API ──→ D1
TypeScript SDK ──→ Workers API ──→ D1
Claude Code ──→ Workers API ──→ D1
```

| レイヤー | 技術 |
| --- | --- |
| API / Webhook | Cloudflare Workers + Hono |
| データベース | Cloudflare D1 (SQLite) — 42 テーブル |
| 管理画面 | Next.js 15 (App Router) + Tailwind CSS |
| LIFF | Vite + TypeScript |
| SDK | TypeScript (ESM + CJS, 41 テスト) |
| 定期実行 | Workers Cron Triggers (5分毎) |
| CI/CD | GitHub Actions → 自動デプロイ |

### プロジェクト構成

```
line-harness-oss/
├── apps/
│   ├── worker/           # Cloudflare Workers API (Hono)
│   ├── web/              # Next.js 15 管理画面
│   └── liff/             # LINE ミニアプリ (Vite)
├── packages/
│   ├── db/               # D1 スキーマ + クエリ (42テーブル)
│   ├── sdk/              # TypeScript SDK (41テスト)
│   ├── line-sdk/         # LINE Messaging API ラッパー
│   └── shared/           # 共有型定義
├── docs/
│   └── wiki/             # 全23ページのドキュメント
└── .github/
    └── workflows/        # GitHub Actions 自動デプロイ
```

### セットアップ手順

**前提条件**: Node.js 20+, pnpm 9+, Cloudflareアカウント, LINE Developersアカウント

1. **クローン＆インストール** — `git clone` → `pnpm install`
2. **LINE チャネル設定** — Messaging APIチャネル + LINE Loginチャネル（UUID取得用、必須）の2つを作成
3. **D1 データベース作成** — `wrangler d1 create` でDB作成、スキーマ適用
4. **シークレット設定** — `LINE_CHANNEL_SECRET`, `LINE_CHANNEL_ACCESS_TOKEN`, `API_KEY`, `LINE_LOGIN_CHANNEL_ID`, `LINE_LOGIN_CHANNEL_SECRET` を設定
5. **デプロイ** — `pnpm deploy:worker`
6. **Webhook設定** — LINE Developers Console でWebhook URLを登録
7. **動作確認** — 友だち追加URL・API疎通テスト

> ⚠️ LINE Login チャネルがないと `/auth/line` 経由の友だち追加で UUID が取れず、マルチアカウント統合・流入追跡が機能しない。

### API エンドポイント

25のルートファイル、**100+エンドポイント**を提供。主な例：

- `GET /api/friends` — 友だち一覧取得
- `POST /api/scenarios` — シナリオ作成（ステップ配信）
- `POST /api/broadcasts` — ブロードキャスト予約配信
- `POST /api/automations` — 自動化ルール作成

## 重要な事実・データ

- **コスト**: 5,000友だちまで無料（Cloudflare無料枠）、〜10,000で約$10/月、50,000+で約$25/月
- **競合との価格差**: Lステップ月額21,780円〜 vs LINE Harness 0円〜
- **データベース規模**: 42テーブル構成
- **API規模**: 25ルートファイル、100+エンドポイント
- **テスト**: SDK 41テスト
- **ドキュメント**: Wiki全23ページ
- **GitHub統計（2026年3月時点）**: 235スター、73フォーク、7オープンイシュー
- **ライセンス**: MIT
- **リポジトリ作成日**: 2026-03-23
- **主要言語**: TypeScript

## 結論・示唆

### プロジェクトの位置づけ

LINE Harnessは、LINE公式アカウントのマーケティングオートメーション市場において、有料SaaSに対する完全オープンソースの代替選択肢を提供するプロジェクトである。Cloudflareの無料枠を活用することでインフラコストをゼロに抑えつつ、有料ツールと同等以上の機能セット（特にAPI全公開・AI連携・BAN対策）を実現している。

### 実践的な示唆

- **小規模事業者・個人**: 5,000友だちまでは完全無料で運用可能なため、LINE公式アカウント運用のコスト削減に直結する
- **開発者**: 全APIが公開されており、Claude Code連携も可能なため、独自のカスタマイズや自動化が容易
- **マルチアカウント運用者**: 追加契約なしで複数アカウントを一元管理できる点は、複数店舗・ブランドを持つ事業者にとって大きなメリット
- **BAN リスク対策**: ステルスモードやBAN検知・自動移行は、既存ツールにはないユニークな安全機能

## 制限事項・注意点

- **セルフホスティング**: SaaSではないため、Cloudflareアカウントの開設やデプロイ作業など、技術的なセットアップが必要
- **LINE Login チャネル必須**: UUID取得のためLINE Loginチャネルの設定が必須であり、これがないとマルチアカウント統合・流入追跡が機能しない
- **大規模運用時のコスト**: 50,000友だち以上ではQueues推奨となり、Cloudflare有料プランの契約が必要
- **リポジトリの歴史**: 2026年3月23日作成の新しいプロジェクトであり、長期的な継続性・コミュニティの成熟度はまだ未知数

---

*Source: [Shudesu/line-harness-oss](https://github.com/Shudesu/line-harness-oss)*
