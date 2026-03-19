---
title: "garrytan/gstack: Use Garry Tan's exact Claude Code setup: 15 opinionated tools that serve as CEO, Designer, Eng Manager, Release Manager, Doc Engineer, and QA"
source: "https://github.com/garrytan/gstack"
author:
  - "Garry Tan"
published: 2025-03-18
created: 2026-03-19
description: "Y Combinator CEO Garry Tanが公開した、Claude Codeを仮想エンジニアリングチームに変えるオープンソースのソフトウェアファクトリー。15の専門スラッシュコマンドと6つのパワーツールで、1人で20人チーム規模の開発を実現する。"
tags:
  - "clippings"
  - "Claude Code"
  - "AI coding"
  - "agentic development"
  - "developer tools"
  - "open source"
  - "Y Combinator"
---

## 概要

**gstack** は、Y Combinator CEO の **Garry Tan** が自身の開発ワークフローをオープンソース化したもの。Claude Code を「仮想エンジニアリングチーム」に変換し、CEO・デザイナー・エンジニアリングマネージャー・リリースエンジニア・ドキュメントエンジニア・QA といった専門的な役割を持つ **15のスラッシュコマンド** と **6つのパワーツール** を提供する。MIT ライセンスで完全無料。

---

## 著者について

Garry Tan は Y Combinator の社長兼 CEO。Coinbase、Instacart、Rippling などの企業を初期段階から支援してきた。Palantir のロゴデザイナー兼初期のエンジニアリングマネージャー/PM/デザイナーでもあり、Posterous（後に Twitter に売却）の共同創業者。2013年には YC の内部 SNS「Bookface」を構築した。

---

## 驚異的な生産性の実績

- 過去60日間で **60万行以上のプロダクションコード**（35%がテスト）を執筆
- **1日あたり10,000〜20,000行** の使用可能なコードを、YC CEO としての業務をこなしながらパートタイムで出力
- 直近7日間の `/retro` 統計: **140,751行追加、362コミット、約115k行ネット LOC**（3プロジェクト合計）
- 2026年の GitHub コントリビューション: **1,237件以上**（2013年の Bookface 構築時は 772件）

> 同じ人間。違う時代。違いはツーリングにある。

---

## コンセプト: スプリントプロセス

gstack は単なるツール集ではなく、**プロセス**として設計されている。スキルはスプリントの順序に沿って配置されている：

**Think → Plan → Build → Review → Test → Ship → Reflect**

各スキルは次のスキルにフィードする。`/office-hours` が設計ドキュメントを書き、`/plan-ceo-review` がそれを読む。`/plan-eng-review` がテスト計画を書き、`/qa` がそれを拾う。すべてのステップが前のステップの成果を知っているため、何も漏れない。

**1スプリント・1人・1機能で約30分。** さらに、**10〜15のスプリントを並列実行** することで、1日10,000行以上のコードを出力できる。

---

## 15の専門スキル一覧

| スキル | 役割 | 機能 |
|--------|------|------|
| `/office-hours` | **YC Office Hours** | 6つの強制的な質問で製品のフレーミングを見直す。前提に挑戦し、実装の代替案を生成。設計ドキュメントが下流のすべてのスキルにフィードされる |
| `/plan-ceo-review` | **CEO / 創業者** | 問題を再考。リクエストの中に隠れた「10-star product」を見つける。4つのモード: Expansion、Selective Expansion、Hold Scope、Reduction |
| `/plan-eng-review` | **エンジニアリングマネージャー** | アーキテクチャ、データフロー、図表、エッジケース、テストをロックイン。隠れた前提を明らかにする |
| `/plan-design-review` | **シニアデザイナー** | 各デザインディメンションを0-10で評価し、10が何を意味するか説明した上でプランを編集。AI Slop検出機能付き |
| `/design-consultation` | **デザインパートナー** | 完全なデザインシステムをゼロから構築。競合調査、クリエイティブなリスク提案、リアルな製品モックアップ生成 |
| `/review` | **スタッフエンジニア** | CI を通過するが本番で爆発するバグを発見。明白な問題は自動修正。完全性のギャップをフラグ |
| `/investigate` | **デバッガー** | 体系的な根本原因デバッグ。「調査なしに修正なし」の鉄則。データフロー追跡、仮説テスト、3回失敗で停止 |
| `/design-review` | **コーディングできるデザイナー** | `/plan-design-review` と同じ監査を行い、見つけた問題を修正。アトミックコミット、before/afterスクリーンショット |
| `/qa` | **QAリード** | アプリをテスト、バグを発見・修正。アトミックコミットで再検証。すべての修正に対してリグレッションテストを自動生成 |
| `/qa-only` | **QAレポーター** | `/qa` と同じ手法だがレポートのみ。コード変更なしの純粋なバグレポートが必要な場合に使用 |
| `/ship` | **リリースエンジニア** | mainを同期、テスト実行、カバレッジ監査、プッシュ、PR作成。テストフレームワークがない場合はゼロからブートストラップ |
| `/document-release` | **テクニカルライター** | プロジェクトの全ドキュメントを出荷内容に合わせて更新。古いREADMEを自動検出 |
| `/retro` | **エンジニアリングマネージャー** | チーム対応の週次レトロスペクティブ。個人別内訳、出荷ストリーク、テストヘルス傾向、成長機会 |
| `/browse` | **QAエンジニア** | エージェントに目を与える。実際のChromiumブラウザで実クリック・実スクリーンショット。コマンドあたり約100ms |
| `/setup-browser-cookies` | **セッションマネージャー** | 実際のブラウザ（Chrome、Arc、Brave、Edge）からヘッドレスセッションにCookieをインポート |

---

## 6つのパワーツール

| スキル | 機能 |
|--------|------|
| `/codex` | **セカンドオピニオン** — OpenAI Codex CLIによる独立コードレビュー。レビュー（pass/failゲート）、敵対的チャレンジ、オープンコンサルテーションの3モード。`/review`（Claude）と`/codex`（OpenAI）の両方が実行された場合、クロスモデル分析を提供 |
| `/careful` | **安全ガードレール** — 破壊的コマンド（rm -rf、DROP TABLE、force-push）の前に警告。「be careful」で有効化。警告はオーバーライド可能 |
| `/freeze` | **編集ロック** — ファイル編集を1つのディレクトリに制限。デバッグ中のスコープ外への意図しない変更を防止 |
| `/guard` | **フルセーフティ** — `/careful` + `/freeze` を1コマンドで。本番作業用の最大安全モード |
| `/unfreeze` | **ロック解除** — `/freeze` の境界を解除 |
| `/gstack-upgrade` | **セルフアップデーター** — gstackを最新版にアップグレード。グローバル/ベンダーインストールを検出し両方を同期 |

---

## 主要な特徴と革新

### `/office-hours` による製品リフレーミング
ユーザーの言葉通りではなく、実際のペインポイントを聞いて問題を再定義する。例：「日次ブリーフィングアプリ」→「パーソナルチーフオブスタッフAI」への再フレーミング。生成された設計ドキュメントは下流のすべてのスキルに自動的にフィードされる。

### デザイン中心のアプローチ
`/design-consultation` は単にフォントを選ぶだけでなく、競合調査、安全な選択とクリエイティブなリスクの提案、実際の製品のリアルなモックアップ生成、`DESIGN.md` の作成を行う。デザインの決定がシステム全体に流れる。

### `/qa` による大規模並列化の実現
6並列から12並列への拡張を可能にした。Claude Code が「問題を発見」し、実際に修正し、リグレッションテストを生成し、修正を検証する。

### スマートレビュールーティング
よく運営されたスタートアップのように、CEOがインフラのバグ修正を見る必要はなく、バックエンドの変更にデザインレビューは不要。gstack は実行されたレビューを追跡し、適切な判断を行う。

### ブラウザハンドオフ
CAPTCHA、認証壁、MFA プロンプトに遭遇した場合、`$B handoff` で同じページ・Cookie・タブを持つ可視 Chrome を開ける。問題解決後に `$B resume` で再開。3回連続失敗後に自動提案。

### マルチAIセカンドオピニオン
`/codex` で OpenAI の Codex CLI から独立したレビューを取得。`/review`（Claude）と `/codex`（OpenAI）の両方が実行された場合、**クロスモデル分析**（重複する発見と固有の発見を表示）を提供。

---

## クイックスタート（最初の10分）

1. gstack をインストール（30秒）
2. `/office-hours` を実行 — 構築するものを説明
3. `/plan-ceo-review` を任意の機能アイデアで実行
4. `/review` を変更のあるブランチで実行
5. `/qa` をステージングURLで実行
6. そこで止める — 自分に合うかどうかがわかる

### インストール要件
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
- [Git](https://git-scm.com/)
- [Bun](https://bun.sh/) v1.0+

### Step 1: マシンにインストール
```bash
git clone https://github.com/garrytan/gstack.git ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup
```

### Step 2: リポジトリに追加（チームメイト用、任意）
```bash
cp -Rf ~/.claude/skills/gstack .claude/skills/gstack && rm -rf .claude/skills/gstack/.git && cd .claude/skills/gstack && ./setup
```

---

## 10〜15並列スプリント

gstack の真の力は並列実行にある。[Conductor](https://conductor.build) を使い、複数の Claude Code セッションをそれぞれ独立したワークスペースで並列実行する：

- 1つのセッションが `/office-hours` で新しいアイデアを検討
- 別のセッションが PR の `/review` を実行
- 3つ目がフィーチャーを実装
- 4つ目がステージングで `/qa` を実行
- さらに6つ以上が別のブランチで作業

**プロセスがなければ、10のエージェントは10のカオスの源。** プロセスがあれば、各エージェントが何をすべきか、いつ止まるべきかを正確に知っている。

---

## メッセージ

> モデルは毎週劇的に良くなっている。今、本当にモデルと共に働く方法を見つけた人々 — ただ試すだけでなく — は、巨大なアドバンテージを持つことになる。これがその窓だ。

**MIT ライセンス。永久に無料。何かを作ろう。**

---

## 関連リンク

- [GitHub リポジトリ](https://github.com/garrytan/gstack)
- [スキル詳細ドキュメント](https://github.com/garrytan/gstack/blob/main/docs/skills.md)
- [アーキテクチャ](https://github.com/garrytan/gstack/blob/main/ARCHITECTURE.md)
- [ブラウザリファレンス](https://github.com/garrytan/gstack/blob/main/BROWSER.md)
- [Changelog](https://github.com/garrytan/gstack/blob/main/CHANGELOG.md)
- [YC ソフトウェアチーム採用ページ](https://ycombinator.com/software)
