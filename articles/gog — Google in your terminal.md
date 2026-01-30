---
title: "gog — Google in your terminal"
source: "https://gogcli.sh/"
author: "Peter Steinberger (@steipete)"
published:
created: 2026-01-30
description: "gog (gogcli) は、Gmail、Calendar、Drive、Contacts、Tasks、Sheets、Docs、Slides、People、Chat、Classroom、Keep、Groups など Google Workspace の主要サービスをターミナルから統一的に操作できる Go 製 CLI ツール。JSON 出力対応でスクリプトやAIエージェントとの連携にも最適化されている。"
tags:
  - "cli"
  - "google-workspace"
  - "go"
  - "productivity"
  - "automation"
---

## 概要

**gog (gogcli)** は、Google Workspace の複数サービスを単一のバイナリで操作できるコマンドラインツール。Peter Steinberger ([@steipete](https://github.com/steipete)) によって開発されており、GitHub で1,000以上のスターを獲得している。

### 対応サービス

| カテゴリ | サービス |
|---------|---------|
| メール・コミュニケーション | Gmail, Chat (Workspace のみ) |
| スケジュール | Calendar |
| ファイル・ドキュメント | Drive, Docs, Slides, Sheets |
| 連絡先・プロファイル | Contacts, People |
| タスク管理 | Tasks |
| 教育 (Workspace for Education) | Classroom |
| その他 (Workspace のみ) | Keep, Groups |

## 主な特徴

### 1. 統一的なコマンド体系

```bash
# Gmail検索
gog gmail search 'newer_than:7d' --max 10

# カレンダー表示
gog calendar events primary --today

# Drive操作
gog drive ls --max 20

# Sheets読み書き
gog sheets get <spreadsheetId> 'Sheet1!A1:B10'
```

### 2. JSON出力によるスクリプト対応

```bash
# JSON出力でjqと連携
gog gmail search 'newer_than:7d' --max 50 --json | jq '.threads[] | .subject'

# カレンダー情報の取得
gog calendar calendars --max 5 --json | jq '.calendars[].summary'
```

### 3. マルチアカウント対応

```bash
# 環境変数でデフォルトアカウント設定
export GOG_ACCOUNT=you@gmail.com

# またはフラグで指定
gog gmail search 'is:unread' --account work@company.com

# エイリアス設定も可能
gog auth alias set work work@company.com
```

### 4. セキュアな認証情報管理

- **macOS**: Keychain Access
- **Linux**: Secret Service (GNOME Keyring, KWallet)
- **Windows**: Credential Manager
- 暗号化されたファイルバックエンドも選択可能

## インストール

### Homebrew (推奨)

```bash
brew install steipete/tap/gogcli
```

### ソースからビルド

```bash
git clone https://github.com/steipete/gogcli.git
cd gogcli
make
./bin/gog --help
```

## 初期セットアップ

### 1. OAuth2 認証情報の取得

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) でプロジェクト作成
2. 必要な API を有効化（Gmail, Calendar, Drive など）
3. OAuth consent screen を設定
4. **Desktop app** タイプの OAuth クライアントを作成
5. JSON ファイルをダウンロード

### 2. 認証情報の登録

```bash
# OAuth クライアントJSONを登録
gog auth credentials ~/Downloads/client_secret_....json

# アカウントを認証（ブラウザが開く）
gog auth add you@gmail.com

# 動作確認
export GOG_ACCOUNT=you@gmail.com
gog gmail labels list
```

## サービス別機能詳細

### Gmail

| 機能 | コマンド例 |
|------|-----------|
| 検索 | `gog gmail search 'newer_than:7d has:attachment' --max 10` |
| スレッド取得 | `gog gmail thread get <threadId>` |
| 添付ファイルダウンロード | `gog gmail thread get <threadId> --download` |
| メール送信 | `gog gmail send --to a@b.com --subject "Hi" --body "Hello"` |
| ラベル管理 | `gog gmail labels list` |
| フィルタ作成 | `gog gmail filters create --from 'noreply@example.com' --add-label 'Notifications'` |
| 開封トラッキング | `gog gmail send --to a@b.com --subject "Hi" --body-html "<p>Hi!</p>" --track` |

### Calendar

| 機能 | コマンド例 |
|------|-----------|
| 今日の予定 | `gog calendar events primary --today` |
| 週間予定 | `gog calendar events primary --week` |
| イベント作成 | `gog calendar create primary --summary "Meeting" --from 2025-01-15T10:00:00Z --to 2025-01-15T11:00:00Z` |
| 空き時間確認 | `gog calendar freebusy --calendars "primary" --from ... --to ...` |
| チームカレンダー | `gog calendar team user1@example.com,user2@example.com --today` |
| 繰り返し設定 | `--rrule "RRULE:FREQ=MONTHLY;BYMONTHDAY=11"` |

### Drive

| 機能 | コマンド例 |
|------|-----------|
| ファイル一覧 | `gog drive ls --max 20` |
| 検索 | `gog drive search "invoice" --max 20` |
| アップロード | `gog drive upload ./file --parent <folderId>` |
| ダウンロード | `gog drive download <fileId> --out ./file.pdf` |
| PDF エクスポート | `gog drive download <docId> --format pdf --out ./doc.pdf` |
| 共有 | `gog drive share <fileId> --email user@example.com --role reader` |

### Sheets / Docs / Slides

```bash
# Sheets 読み込み
gog sheets get <spreadsheetId> 'Sheet1!A1:B10'

# Sheets 書き込み
gog sheets update <spreadsheetId> 'A1' 'val1|val2,val3|val4'

# PDF エクスポート
gog sheets export <spreadsheetId> --format pdf --out ./sheet.pdf
gog docs export <docId> --format docx --out ./doc.docx
gog slides export <presentationId> --format pptx --out ./deck.pptx
```

### Tasks

```bash
# タスクリスト一覧
gog tasks lists --max 50

# タスク追加
gog tasks add <tasklistId> --title "Task title"

# 繰り返しタスク
gog tasks add <tasklistId> --title "Weekly sync" --due 2025-02-01 --repeat weekly --repeat-count 4

# タスク完了
gog tasks done <tasklistId> <taskId>
```

### Contacts / People

```bash
# 連絡先検索
gog contacts search "Ada" --max 50

# 連絡先作成
gog contacts create --given-name "John" --family-name "Doe" --email "john@example.com"

# Workspace ディレクトリ検索
gog contacts directory search "Jane" --max 50
```

## 高度な機能

### サービスアカウント (Workspace のみ)

ドメイン全体の委任 (Domain-wide delegation) を使用して、サービスアカウントでユーザーになりすまして API にアクセス可能。

```bash
gog auth service-account set you@yourdomain.com --key ~/Downloads/service-account.json
```

### コマンド制限 (サンドボックス化)

AIエージェントなどで使用する際、許可するコマンドを制限可能。

```bash
# calendar と tasks のみ許可
gog --enable-commands calendar,tasks calendar events --today

# 環境変数でも設定可能
export GOG_ENABLE_COMMANDS=calendar,tasks
```

### 出力フォーマット

| オプション | 説明 |
|-----------|------|
| (デフォルト) | 人間が読みやすいテーブル形式 |
| `--plain` | TSV形式（スクリプト向け） |
| `--json` | JSON形式（jqとの連携に最適） |

## 環境変数

| 変数名 | 説明 |
|--------|------|
| `GOG_ACCOUNT` | デフォルトアカウント |
| `GOG_CLIENT` | OAuthクライアント名 |
| `GOG_JSON` | JSON出力をデフォルトに |
| `GOG_TIMEZONE` | 出力タイムゾーン |
| `GOG_ENABLE_COMMANDS` | 許可するコマンドのリスト |

## ユースケース

### AIエージェントとの統合

JSON出力とコマンド制限機能により、AIコーディングエージェント（Claude Code、Cursor など）からの利用に最適化されている。

```bash
# エージェント用に最小権限で認証
gog auth add you@gmail.com --services calendar,tasks --readonly

# JSON出力で処理
gog --json calendar events primary --today | jq '.events[] | .summary'
```

### バッチ処理

```bash
# 特定送信者からのメールをすべて既読に
gog --json gmail search 'from:noreply@example.com' --max 200 | \
  jq -r '.threads[].id' | \
  xargs -n 50 gog gmail labels modify --remove UNREAD
```

## 技術仕様

- **言語**: Go
- **ライセンス**: MIT
- **リポジトリ**: [github.com/steipete/gogcli](https://github.com/steipete/gogcli)
- **インスピレーション**: Mario Zechner の [gmcli](https://github.com/badlogic/gmcli), [gccli](https://github.com/badlogic/gccli), [gdcli](https://github.com/badlogic/gdcli)

## 関連リンク

- [公式サイト](https://gogcli.sh/)
- [GitHub リポジトリ](https://github.com/steipete/gogcli)
- [CHANGELOG](https://github.com/steipete/gogcli/blob/main/CHANGELOG.md)
- [作者ブログ](https://steipete.me)
