---
title: "googleworkspace/cli: Google Workspace CLI — one command-line tool for Drive, Gmail, Calendar, Sheets, Docs, Chat, Admin, and more. Dynamically built from Google Discovery Service. Includes AI agent skills."
source: "https://github.com/googleworkspace/cli"
author:
  - "[[googleworkspace]]"
published: 2026-03-02
created: 2026-03-07
description: "Google Workspace全体を1つのCLIで操作できるRust製ツール。Google Discovery Serviceからコマンドを動的に生成し、Drive・Gmail・Calendar・Sheets・Docs・Chat・Adminなど全APIに対応。構造化JSON出力とAIエージェントスキルを内蔵し、人間とAIエージェント双方のワークフローを効率化する。"
tags:
  - "clippings"
  - "cli"
  - "google-workspace"
  - "ai-agent"
  - "rust"
  - "automation"
  - "devtools"
---

## 概要

**gws** は Google Workspace の全 API を1つのコマンドラインツールで操作できる Rust 製 CLI。Google の [Discovery Service](https://developers.google.com/discovery) を実行時に読み取り、コマンド体系を**動的に生成**する。Google が API エンドポイントやメソッドを追加すると、gws が自動的にそれを認識する。

> **注意**: Google の公式サポート製品ではない。現在活発に開発中で、v1.0 に向けて破壊的変更が発生する可能性がある。

| 項目 | 値 |
|---|---|
| 言語 | Rust |
| ライセンス | Apache-2.0 |
| Stars | 14,536 |
| Forks | 513 |
| Node.js 要件 | 18+ |

---

## インストール

```bash
# npm（プリビルドバイナリ同梱、Rustツールチェーン不要）
npm install -g @googleworkspace/cli

# ソースからビルド
cargo install --git https://github.com/googleworkspace/cli --locked

# Nix flake
nix run github:googleworkspace/cli
```

プリビルドバイナリは [GitHub Releases](https://github.com/googleworkspace/cli/releases) からもダウンロード可能。

---

## クイックスタート

```bash
gws auth setup     # Google Cloud プロジェクト設定ウィザード
gws auth login     # OAuth ログイン
gws drive files list --params '{"pageSize": 5}'
```

---

## 設計思想 — Why gws?

### 人間向け
- `curl` で REST ドキュメントを叩く必要がなくなる
- すべてのリソースに `--help`、リクエストプレビュー用の `--dry-run`、自動ページネーションを提供

### AIエージェント向け
- すべてのレスポンスが**構造化JSON**
- 付属のエージェントスキルと組み合わせることで、LLM がカスタムツーリングなしに Workspace を管理可能

---

## 使用例

```bash
# 最新10件のファイル一覧
gws drive files list --params '{"pageSize": 10}'

# スプレッドシート作成
gws sheets spreadsheets create --json '{"properties": {"title": "Q1 Budget"}}'

# Chat メッセージ送信（dry-run）
gws chat spaces messages create \
  --params '{"parent": "spaces/xyz"}' \
  --json '{"text": "Deploy complete."}' \
  --dry-run

# メソッドのリクエスト/レスポンススキーマを確認
gws schema drive.files.list

# ページネーション結果をNDJSONでストリーム
gws drive files list --params '{"pageSize": 100}' --page-all | jq -r '.files[].name'

# マルチパートアップロード
gws drive files create --json '{"name": "report.pdf"}' --upload ./report.pdf
```

---

## 認証

複数の認証ワークフローに対応し、ローカル・CI・サーバーで動作する。

| シナリオ | 方法 |
|---|---|
| `gcloud` インストール済み | `gws auth setup`（最速） |
| GCPプロジェクトはあるが `gcloud` なし | 手動OAuth設定（Cloud Console） |
| 既存のOAuthアクセストークン | `GOOGLE_WORKSPACE_CLI_TOKEN` 環境変数 |
| 既存のクレデンシャルファイル | `GOOGLE_WORKSPACE_CLI_CREDENTIALS_FILE` 環境変数 |

### 認証の優先順位

| 優先度 | ソース | 設定方法 |
|--------|--------|----------|
| 1 | アクセストークン | `GOOGLE_WORKSPACE_CLI_TOKEN` |
| 2 | クレデンシャルファイル | `GOOGLE_WORKSPACE_CLI_CREDENTIALS_FILE` |
| 3 | 暗号化クレデンシャル | `gws auth login` |
| 4 | プレーンテキストクレデンシャル | `~/.config/gws/credentials.json` |

### セキュリティ
- クレデンシャルは保存時に **AES-256-GCM** で暗号化され、鍵はOSキーリングに保存される
- ブラウザアシスト認証（人間・エージェント両対応）もサポート

### ヘッドレス / CI 環境

```bash
# 1. ブラウザのあるマシンで認証後エクスポート
gws auth export --unmasked > credentials.json

# 2. ヘッドレスマシンで使用
export GOOGLE_WORKSPACE_CLI_CREDENTIALS_FILE=/path/to/credentials.json
gws drive files list
```

---

## AIエージェントスキル

リポジトリには **100以上のAgent Skills**（`SKILL.md` ファイル）が同梱されている。

- 各サポートAPIごとのスキル
- 一般的なワークフロー向けの高レベルヘルパー
- Gmail、Drive、Docs、Calendar、Sheets 向けの **50のキュレーションレシピ**

```bash
# 全スキルを一括インストール
npx skills add https://github.com/googleworkspace/cli

# 必要なものだけ選択
npx skills add https://github.com/googleworkspace/cli/tree/main/skills/gws-drive
npx skills add https://github.com/googleworkspace/cli/tree/main/skills/gws-gmail
```

### Gemini CLI 拡張機能

```bash
gws auth setup
gemini extensions install https://github.com/googleworkspace/cli
```

Gemini CLI エージェントに全 `gws` コマンドと Google Workspace エージェントスキルへの直接アクセスを付与する。

---

## 高度な機能

### ページネーション

| フラグ | 説明 | デフォルト |
|---|---|---|
| `--page-all` | 自動ページネーション（NDJSON形式） | off |
| `--page-limit <N>` | 最大取得ページ数 | 10 |
| `--page-delay <ms>` | ページ間の遅延 | 100ms |

### Model Armor（レスポンスサニタイゼーション）

[Google Cloud Model Armor](https://cloud.google.com/security/products/model-armor) と統合し、APIレスポンスがエージェントに到達する前にプロンプトインジェクションをスキャンできる。

```bash
gws gmail users messages get --params '...' \
  --sanitize "projects/P/locations/L/templates/T"
```

| 環境変数 | 説明 |
|---|---|
| `GOOGLE_WORKSPACE_CLI_SANITIZE_TEMPLATE` | デフォルトの Model Armor テンプレート |
| `GOOGLE_WORKSPACE_CLI_SANITIZE_MODE` | `warn`（デフォルト）または `block` |

---

## アーキテクチャ

**2フェーズパーシング**戦略を採用：

1. `argv[1]` からサービスを特定（例: `drive`）
2. サービスの Discovery Document を取得（24時間キャッシュ）
3. ドキュメントのリソースとメソッドから `clap::Command` ツリーを構築
4. 残りの引数を再パース
5. 認証 → HTTPリクエスト構築 → 実行

すべての出力（成功・エラー・ダウンロードメタデータ）は構造化JSON。

---

## トラブルシューティング

| 問題 | 原因と対処 |
|---|---|
| "Access blocked" / 403 | OAuthアプリがテストモードでテストユーザー未登録 → OAuth同意画面でユーザー追加 |
| "Google hasn't verified this app" | テストモードでは正常な動作。Advanced → 続行 で進む |
| スコープ過多エラー | `gws auth login -s drive,gmail,sheets` で必要なサービスのみ選択 |
| `redirect_uri_mismatch` | OAuth クライアントの種類が「デスクトップアプリ」でない → 再作成が必要 |
| `accessNotConfigured` | 必要なAPIが未有効化 → エラー内の `enable_url` からAPIを有効化 |

---

## 環境変数一覧

| 変数 | 説明 |
|---|---|
| `GOOGLE_WORKSPACE_CLI_TOKEN` | OAuth2 アクセストークン（最高優先度） |
| `GOOGLE_WORKSPACE_CLI_CREDENTIALS_FILE` | OAuthクレデンシャルJSONのパス |
| `GOOGLE_WORKSPACE_CLI_CLIENT_ID` | OAuth クライアント ID |
| `GOOGLE_WORKSPACE_CLI_CLIENT_SECRET` | OAuth クライアントシークレット |
| `GOOGLE_WORKSPACE_CLI_CONFIG_DIR` | 設定ディレクトリ（デフォルト: `~/.config/gws`） |
| `GOOGLE_WORKSPACE_CLI_SANITIZE_TEMPLATE` | Model Armor テンプレート |
| `GOOGLE_WORKSPACE_CLI_SANITIZE_MODE` | `warn` / `block` |
| `GOOGLE_WORKSPACE_PROJECT_ID` | GCPプロジェクトIDフォールバック |

環境変数は `.env` ファイルでも設定可能（[dotenvy](https://crates.io/crates/dotenvy) 経由）。
