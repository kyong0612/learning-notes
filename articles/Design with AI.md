---
title: "Stitch MCP Setup - Design with AI"
source: "https://stitch.withgoogle.com/docs/mcp/setup"
author:
  - "[[Google]]"
published:
created: 2026-01-22
description: "Google StitchのMCP（Model Context Protocol）セットアップガイド。AIエージェントをUI/UXデザインプラットフォームに接続し、自然言語でデザインを生成・管理する方法を解説。"
tags:
  - "clippings"
  - "Google"
  - "MCP"
  - "AI"
  - "UI/UX"
  - "Design"
---

## 概要

Google Stitchは、AIを活用してモバイルおよびWebアプリケーションのUIを生成するデザインツールである。MCP（Model Context Protocol）を通じて、AIエージェント（Claude、Cursor、Gemini CLIなど）から直接Stitchにアクセスし、自然言語でUIデザインを作成・管理できる。

## MCPとは

Model Context Protocol（MCP）は、Anthropicが提唱するAIモデルとデータ・ツールを接続するための標準プロトコル。「AIのUSB-C」とも呼ばれ、AIアプリケーションが複雑なマルチステップタスクを実行できるようにする。Googleは、BigQuery、Maps、Google Compute Engineなど、様々なサービスに対して完全管理型のリモートMCPサーバーをリリースしている。

## セットアップ要件

### 前提条件
- Google Cloudプロジェクト
- Google Cloud CLI（gcloud）のインストール
- Stitch APIの有効化

### 認証設定

Google Cloudの認証は2段階で行う必要がある。

```bash
# 1. ユーザー認証（Google Cloudへの識別）
gcloud auth login

# 2. プロジェクト設定
gcloud config set project YOUR_PROJECT_ID

# 3. クォータプロジェクトの設定
gcloud auth application-default set-quota-project YOUR_PROJECT_ID

# 4. Stitch APIの有効化
gcloud beta services mcp enable stitch.googleapis.com

# 5. アプリケーションデフォルト認証（API呼び出しの認可）
gcloud auth application-default login
```

## MCP設定

### 基本設定（Claude Desktop / Cursor）

```json
{
  "mcpServers": {
    "stitch": {
      "command": "npx",
      "args": ["-y", "stitch-mcp"],
      "env": {
        "GOOGLE_CLOUD_PROJECT": "YOUR_PROJECT_ID"
      }
    }
  }
}
```

### プロキシモード（開発向け推奨）

トークンの自動更新とデバッグログを提供する。

```json
{
  "mcpServers": {
    "stitch": {
      "command": "npx",
      "args": ["@_davideast/stitch-mcp", "proxy"],
      "env": {
        "STITCH_PROJECT_ID": "<project-id>"
      }
    }
  }
}
```

### 直接HTTP接続

```json
{
  "mcpServers": {
    "stitch": {
      "type": "http",
      "url": "https://stitch.googleapis.com/mcp",
      "headers": {
        "Authorization": "Bearer <token>",
        "X-Goog-User-Project": "<project-id>"
      }
    }
  }
}
```

### 設定ファイルの場所

| クライアント | 設定ファイルパス |
|------------|----------------|
| Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Cursor | Settings > MCP > Add New Server |

## 利用可能なツール

| ツール | 機能 |
|-------|------|
| `extract_design_context` | タイポグラフィ、カラースキーム、レイアウト構造などのデザインパターンを識別 |
| `fetch_screen_code` | 画面のHTML/フロントエンドコードを取得 |
| `fetch_screen_image` | 高解像度のビジュアルキャプチャをダウンロード |
| `generate_screen_from_text` | テキストプロンプトから新しい画面を生成 |
| `create_project` | 新しいワークスペースフォルダを作成 |
| `list_projects` | 利用可能なすべてのプロジェクトを列挙 |
| `list_screens` | 特定のプロジェクト内の画面を表示 |
| `get_project` | プロジェクトのメタデータを取得 |
| `get_screen` | 画面情報を取得 |

## 推奨ワークフロー：Designer Flow

デザインの一貫性を保つための2ステップワークフロー。

1. **抽出フェーズ**: 参照画面を分析し、デザイン特性をキャプチャ
2. **生成フェーズ**: 抽出したデザイン基準を適用しながら新しい画面を作成

このアプローチにより、生成されるインターフェース間でスタイルの整合性が確保される。

## ヘルパーCLIコマンド

`@_davideast/stitch-mcp`パッケージが提供するコマンド。

| コマンド | 目的 |
|---------|------|
| `init [options]` | MCPクライアント選択付きの対話型セットアップ |
| `doctor [--verbose]` | ヘルスチェックと診断 |
| `logout [--force] [--clear-config]` | 認証情報の取り消しと状態のリセット |
| `proxy [--transport] [--port] [--debug]` | MCPプロキシサーバーの実行 |

### ワンコマンドセットアップ（新規ユーザー向け）

```bash
npx @_davideast/stitch-mcp init
```

### セットアップ後の検証

```bash
npx @_davideast/stitch-mcp doctor
```

## 環境変数

| 変数 | 目的 |
|------|------|
| `STITCH_USE_SYSTEM_GCLOUD` | バンドル版の代わりに既存のgcloudを使用 |
| `STITCH_PROJECT_ID` | プロジェクトIDを上書き |
| `GOOGLE_CLOUD_PROJECT` | 代替のプロジェクトID変数 |
| `STITCH_HOST` | カスタムAPIエンドポイント |

## 特徴

- **ゼロ設定**: 一度ログインすれば、どこでも動作
- **クロスプラットフォーム**: Windows、Mac、Linuxで動作
- **無料**: Google Stitch APIは無料で利用可能

## 制限事項

- `stitch-mcp`や`@_davideast/stitch-mcp`などのサードパーティツールは、Googleとは無関係の独立した実験的ツールであり、「AS-IS」で提供される
- メンテナンスや将来の互換性は保証されない
- Stitch自体はベータ版として提供されている
- 認証にはGoogle Cloudプロジェクトとの連携が必要

## 関連リソース

- [stitch-mcp (Kargatharaakash)](https://github.com/Kargatharaakash/stitch-mcp) - ユニバーサルMCPサーバー
- [stitch-mcp (davideast)](https://github.com/davideast/stitch-mcp) - ヘルパーCLIとプロキシサーバー
- [Google ADK MCP Documentation](https://google.github.io/adk-docs/mcp/) - Googleの公式MCP文書
- [Google Cloud MCP Support](https://cloud.google.com/blog/products/ai-machine-learning/announcing-official-mcp-support-for-google-services) - GoogleサービスのMCPサポート発表
