---
title: "raaymax/lazytail: Log viewer for app development"
source: "https://github.com/raaymax/lazytail"
author:
  - "[[raaymax]]"
published:
created: 2026-03-07
description: "高速でユニバーサルなターミナルベースのログビューア。ライブフィルタリング、フォローモード、MCP（Model Context Protocol）によるAIアシスタント統合を備え、Claude・Codex・GeminiなどのAIツールからログファイルを検索・分析できる。Rustで構築されており、メモリ効率が高く大規模ログファイルにも対応。"
tags:
  - "clippings"
  - "cli-tool"
  - "log-viewer"
  - "rust"
  - "mcp"
  - "tui"
  - "devtools"
---

## 概要

**LazyTail** は、Rustで構築された高速・ユニバーサルなターミナルベースのログビューア。ライブフィルタリング、フォローモード（`tail -f` 相当）、そして **MCP（Model Context Protocol）によるAIアシスタント統合** が最大の特徴。

## インストール

ワンライナーでインストール可能（OS・アーキテクチャを自動検出）:

```bash
curl -fsSL https://raw.githubusercontent.com/raaymax/lazytail/master/install.sh | bash
```

その他のインストール方法:
- **カスタムディレクトリ**: `INSTALL_DIR=/usr/local/bin` 環境変数で指定
- **Arch Linux (AUR)**: `yay -S lazytail`
- **ソースからビルド**: Rust 1.70+ が必要。`cargo install --path .`

## AIアシスタント統合（MCP）

LazyTailはMCPサーバーとして動作し、AIアシスタント（**Claude**, **Codex**, **Gemini**）からログファイルの検索・分析が可能。

### セットアップ

| AIツール | 設定方法 |
|---------|---------|
| **Claude Code** | `claude mcp add lazytail -- lazytail --mcp` |
| **OpenAI Codex** | `~/.codex/config.toml` に `[mcp_servers.lazytail]` を追加 |
| **Gemini CLI** | `gemini mcp add lazytail -- lazytail --mcp` |

### 利用可能なMCPツール

| ツール | 説明 |
|-------|------|
| `list_sources` | `~/.config/lazytail/data/` から利用可能なログを検出 |
| `search` | パターン検索（プレーンテキスト、正規表現、構造化クエリ）。コンテキスト行オプション付き |
| `get_tail` | ログファイルの末尾N行を取得 |
| `get_lines` | 特定位置から行を読み取り |
| `get_context` | 特定行番号の周囲の行を取得 |
| `get_stats` | インデックスメタデータ、重要度の内訳、取り込みレート |

`search` ツールは構造化クエリをサポートし、JSONおよびlogfmtログのフィールドベースフィルタリングが可能。演算子: `eq`, `ne`, `regex`, `not_regex`, `contains`, `gt`, `lt`, `gte`, `lte`。ネストされたフィールド（`user.id`）や除外パターンにも対応。

### AIへの質問例

- *「APIログにどんなエラーがある？」*
- *「ステータス500以上のリクエストをすべて検索」*
- *「すべてのログから 'connection refused' を検索」*
- *「workerログの最新100行を表示」*

## 主要機能

### UIと操作
- **マルチタブサポート** — 複数のログファイルをタブで開き、サイドパネルで切替
- **TUIインターフェース** — ratatuiベースのクリーンなターミナルUI、マウス対応
- **Vim風ナビゲーション** — 馴染みのあるキーバインド
- **ANSIカラーサポート** — ANSIエスケープコードをフルカラーでレンダリング
- **行展開** — 長い行を展開して可読性向上
- **クリップボードコピー** — `y` キーで現在行をコピー
- **テーマサポート** — Windows Terminal, Alacritty, Ghostty, iTerm2 からインポート可能

### パフォーマンスと効率
- **遅延ファイル読み込み** — インデックス化された行位置で大規模ログを効率的に処理
- **メモリ効率** — ビューポートベースのレンダリングでRAM使用量を低く維持
- **バックグラウンドフィルタリング** — ノンブロッキングフィルタリングでUI応答性を維持
- **カラムナーインデックス** — キャプチャ時にビルドされるメタデータインデックスで即座の重要度統計とフィルタリング高速化

### フィルタリングと検索
- **ライブフィルタリング** — 入力と同時にリアルタイムで結果表示（正規表現・プレーンテキスト対応）
- **フィルタ履歴** — 過去のフィルタパターンを再利用
- **クエリ言語** — 構造化フィールドフィルタリング（`json | level == "error"`）、集約（`count by (field)`）
- **重要度検出** — ログレベル（ERROR/WARN/INFO/DEBUG）の自動色分けとヒストグラム

### 入力とソース管理
- **Stdin対応** — パイプで直接ログを流し込み可能（`cmd | lazytail`）
- **ファイル監視** — ログファイル変更時に自動リロード（Linux: inotify）
- **フォローモード** — 最新ログが到着すると自動スクロール
- **設定システム** — プロジェクトスコープの `lazytail.yaml` でソース定義
- **セッション永続化** — プロジェクトごとに最後に開いたソースを記憶
- **結合ビュー** — 複数ソースをタイムスタンプで時系列マージ
- **Web UIモード** — ブラウザインターフェース（`lazytail web`）

## 使い方

### 基本

```bash
lazytail /path/to/your/logfile.log        # 単一ファイル
lazytail app.log error.log access.log      # マルチタブ
lazytail web                               # ブラウザUI
kubectl logs pod-name | lazytail           # パイプ入力
```

### キャプチャモード

teeのようにログをキャプチャし、名前付きソースとして保存:

```bash
kubectl logs -f api-pod | lazytail -n "API"     # ターミナル1
docker logs -f worker | lazytail -n "Worker"    # ターミナル2
lazytail                                         # ターミナル3で全ソース表示
```

キャプチャ中のソースはUI上でアクティブ（●）または終了（○）ステータスで表示。

### 設定

プロジェクトルートに `lazytail.yaml` を作成:

```yaml
sources:
  - name: API
    path: /var/log/myapp/api.log
  - name: Worker
    path: ./logs/worker.log
```

`lazytail init` で対話的に設定ファイルを初期化可能。設定はCWDから親ディレクトリを辿って自動検出。

### ベンチマーク

フィルタ性能を計測:

```bash
lazytail bench "error" app.log                    # プレーンテキスト
lazytail bench --regex "level=(error|warn)" app.log  # 正規表現
lazytail bench --query "json | level == \"error\"" app.log  # 構造化クエリ
lazytail bench --compare "error" app.log          # インデックス有無の比較
```

## ユースケース

- **アプリケーションログ**: PM2, カスタムアプリなど
- **システムログ**: syslog, auth.log
- **コンテナログ**: kubectl, docker logs
- **Webサーバーログ**: nginx, Apache

あらゆるプレーンテキストのログファイルに対応（ANSIカラー有無問わず）。

## ライセンス

MIT License
