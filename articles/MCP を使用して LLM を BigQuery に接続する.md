---
title: "MCP を使用して LLM を BigQuery に接続する"
source: "https://docs.cloud.google.com/bigquery/docs/pre-built-tools-with-mcp-toolbox?hl=ja"
author:
  - "Google Cloud"
published: 2025-12-08
created: 2025-12-12
description: "データベース向け MCP ツールボックスを使用して、BigQuery プロジェクトを Cursor、Claude、VS Code などの IDE やデベロッパーツールに Model Context Protocol (MCP) 経由で接続する方法を説明するガイド。"
tags:
  - BigQuery
  - MCP
  - Model-Context-Protocol
  - LLM
  - AI
  - IDE-integration
  - Cursor
  - Claude
  - VS-Code
  - Google-Cloud
---

## 概要

このガイドでは、[データベース向け MCP ツールボックス](https://github.com/googleapis/genai-toolbox)を使用して、BigQuery プロジェクトをさまざまな統合開発環境（IDE）とデベロッパーツールに接続する方法を説明する。

**Model Context Protocol（MCP）** は、大規模言語モデル（LLM）を BigQuery などのデータソースに接続するためのオープンプロトコル。これにより、SQL クエリを実行して、既存のツールからプロジェクトを直接操作できる。

> **注意**: データベース向け MCP ツールボックスはベータ版（v1.0 より前）であり、最初の安定版リリース（v1.0）まで互換性を破る変更が行われる可能性がある。

## 対応 IDE

- **Cursor**
- **Windsurf**（旧 Codeium）
- **Visual Studio Code**（Copilot）
- **Cline**（VS Code 拡張機能）
- **Claude Desktop**
- **Claude Code**

> **Gemini CLI を使用する場合**: BigQuery 拡張機能を使用でき、MCP ツールボックスのインストールは不要。

## 前提条件

1. Google Cloud プロジェクトを選択または作成
2. BigQuery API を有効化
3. 必要な IAM ロール:
   - **BigQuery ユーザー**ロール（`roles/bigquery.user`）
   - **BigQuery データ閲覧者**ロール（`roles/bigquery.dataViewer`）
4. [アプリケーションのデフォルト認証情報（ADC）](https://docs.cloud.google.com/docs/authentication/set-up-adc-local-dev-environment?hl=ja)を構成

## MCP ツールボックスのインストール

MCP ツールボックスは IDE と BigQuery の間に配置されるオープンソースの MCP サーバーとして機能し、AI ツール用の安全で効率的なコントロールプレーンを提供する。

### 1. バイナリをダウンロード

**バージョン V0.7.0 以降が必要**

| OS | コマンド |
|---|---|
| Linux / amd64 | `curl -O https://storage.googleapis.com/genai-toolbox/VERSION/linux/amd64/toolbox` |
| macOS darwin/arm64 | `curl -O https://storage.googleapis.com/genai-toolbox/VERSION/darwin/arm64/toolbox` |
| macOS darwin/amd64 | `curl -O https://storage.googleapis.com/genai-toolbox/VERSION/darwin/amd64/toolbox` |
| Windows / amd64 | `curl -O https://storage.googleapis.com/genai-toolbox/VERSION/windows/amd64/toolbox` |

`VERSION` は MCP ツールボックスのバージョン（例: `v0.7.0`）に置き換える。

### 2. 実行権限を付与

```bash
chmod +x toolbox
```

### 3. インストール確認

```bash
./toolbox --version
```

## IDE 別の設定

### 共通の設定構成

すべての IDE で基本的に同じ JSON 構成を使用する:

```json
{
  "mcpServers": {
    "bigquery": {
      "command": "./PATH/TO/toolbox",
      "args": ["--prebuilt", "bigquery", "--stdio"],
      "env": {
        "BIGQUERY_PROJECT": "PROJECT_ID"
      }
    }
  }
}
```

> **注意**: `BIGQUERY_PROJECT` 環境変数には、MCP ツールボックスで使用するデフォルトの Google Cloud プロジェクト ID を指定する。クエリの実行など、すべての BigQuery オペレーションはこのプロジェクト内で実行される。

### Cursor

1. プロジェクトルートに `.cursor` ディレクトリを作成
2. `.cursor/mcp.json` ファイルを作成し、上記の構成を追加
3. **Settings > Cursor Settings > MCP** で接続状態を確認（緑色のアクティブステータスで確認）

### Claude Code

1. プロジェクトルートに `.mcp.json` ファイルを作成
2. 上記の構成を追加
3. Claude Code を再起動

### Claude Desktop

1. **Settings > Developer > Edit Config** で構成ファイルを開く
2. 上記の構成を追加
3. Claude Desktop を再起動
4. 新しいチャット画面にハンマー（MCP）アイコンが表示される

### Visual Studio Code（Copilot）

1. プロジェクトルートに `.vscode` ディレクトリを作成
2. `.vscode/mcp.json` ファイルを作成
3. 以下の構成を追加（`mcpServers` ではなく `servers` キーを使用）:

```json
{
  "servers": {
    "bigquery": {
      "command": "./PATH/TO/toolbox",
      "args": ["--prebuilt", "bigquery", "--stdio"],
      "env": {
        "BIGQUERY_PROJECT": "PROJECT_ID"
      }
    }
  }
}
```

4. VS Code ウィンドウを再読み込み

### Cline（VS Code 拡張機能）

1. Cline 拡張機能を開き、**MCP Servers** アイコンをタップ
2. **Configure MCP Servers** をタップ
3. 上記の構成を追加
4. 緑色のアクティブステータスで接続確認

### Windsurf

1. Cascade アシスタントを開く
2. MCP アイコン > **Configure** をクリック
3. 上記の構成を追加

## 利用可能なツール

MCP 接続後、LLM で以下のツールが使用可能:

| ツール名 | 説明 |
|---|---|
| `analyze_contribution` | 貢献度分析（主要因分析）を実行 |
| `ask_data_insights` | データ分析の実行、分析情報の取得、BigQuery テーブルの内容に関する複雑な質問への回答 |
| `execute_sql` | SQL ステートメントを実行 |
| `forecast` | 時系列データを予測 |
| `get_dataset_info` | データセットのメタデータを取得 |
| `get_table_info` | テーブルのメタデータを取得 |
| `list_dataset_ids` | データセットを一覧表示 |
| `list_table_ids` | テーブルを一覧表示 |
| `search_catalog` | 自然言語を使用してテーブルを検索 |

## 使用例

AI ツールが MCP を使用して BigQuery に接続されたら、AI アシスタントに以下のような操作を依頼できる:

- テーブルのリスト表示
- テーブルの作成
- SQL ステートメントの定義と実行
- データ分析と分析情報の取得
- 時系列データの予測

## 関連リンク

- [データベース向け MCP ツールボックス GitHub](https://github.com/googleapis/genai-toolbox)
- [Model Context Protocol 公式サイト](https://modelcontextprotocol.io/introduction)
- [Gemini CLI を使用して開発する](https://docs.cloud.google.com/bigquery/docs/develop-with-gemini-cli?hl=ja)
