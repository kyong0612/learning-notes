---
title: "Connect to the Developer Knowledge MCP server"
source: "https://developers.google.com/knowledge/mcp"
author:
  - "[[Google for Developers]]"
published:
created: 2026-02-17
description: "Google Developer Knowledge MCPサーバーのセットアップガイド。AI開発ツールからFirebase、Google Cloud、Android、Mapsなどの公式ドキュメントを検索・取得できるリモートMCPサーバーの導入方法と設定手順を解説。"
tags:
  - "clippings"
  - "MCP"
  - "Google Cloud"
  - "AI"
  - "Developer Tools"
  - "Documentation"
---

## 概要

Google Developer Knowledge MCPサーバーは、AI開発ツール（Cursor、Claude Code、Gemini CLIなど）からGoogleの公式開発者ドキュメント（Firebase、Google Cloud、Android、Mapsなど）を直接検索・取得できるリモートMCPサーバーである。最新かつ権威ある情報源に基づいたコード生成やガイダンスを実現する。

## 主なユースケース

- **実装ガイダンス**: Firebase Cloud Messagingを使ったプッシュ通知の実装方法など
- **コード生成と説明**: Cloud StorageバケットをPythonで一覧取得する例など
- **トラブルシューティング**: Google Maps APIキーの「開発目的のみ」ウォーターマーク問題など
- **比較分析と要約**: Cloud RunとCloud Functionsの比較表作成など

## MCPサーバーが提供するツール

| ツール名 | 説明 |
| --- | --- |
| `search_documents` | Googleの開発者ドキュメントを検索し、関連ページとスニペットを返す。完全なページ内容の取得には `get_document` や `batch_get_documents` を使用する |
| `get_document` | `search_documents` の結果にある `parent` を使って、ドキュメントの全文を取得する |
| `batch_get_documents` | 複数ドキュメントの全文を一括取得する |

`search_documents` はドキュメントをAI検索に最適化された小さなチャンクに分割して返す。完全なページ内容が必要な場合は `get_document` / `batch_get_documents` を使用する。

## セットアップ手順

### ステップ1: APIキーの作成

**Google Cloud Console の場合:**
1. [Developer Knowledge API ページ](https://console.cloud.google.com/start/api?id=developerknowledge.googleapis.com)を開く
2. APIを有効化する（特別なIAMロールは不要）
3. APIキーを作成し、Developer Knowledge APIに制限をかける

**gcloud CLI の場合:**

```bash
# APIの有効化
gcloud services enable developerknowledge.googleapis.com --project=PROJECT_ID

# APIキーの作成
gcloud services api-keys create --project=PROJECT_ID --display-name="DK API Key"
```

### ステップ2: MCPサーバーの有効化

```bash
gcloud beta services mcp enable developerknowledge.googleapis.com \
    --project=PROJECT_ID
```

### ステップ3: AIアプリケーションの設定

以下のツールに対応。各ツールの設定ファイルにサーバーURLとAPIキーを追加する。

| ツール | 設定ファイル |
| --- | --- |
| **Cursor** | `.cursor/mcp.json` または `~/.cursor/mcp.json` |
| **Claude Code** | CLI コマンドで追加 |
| **Gemini CLI** | `~/.gemini/settings.json` または `.gemini/settings.json` |
| **Gemini Code Assist** | `~/.gemini/settings.json` または `.gemini/settings.json` |
| **Firebase Studio** | `.idx/mcp.json` |
| **GitHub Copilot (VS Code)** | `.vscode/mcp.json` またはユーザー設定 |
| **Windsurf** | `~/.codeium/windsurf/mcp_config.json` |
| **Antigravity** | `mcp_config.json` |

**Cursor の設定例:**

```json
{
  "mcpServers": {
    "google-developer-knowledge": {
      "url": "https://developerknowledge.googleapis.com/mcp",
      "headers": {
        "X-Goog-Api-Key": "YOUR_API_KEY"
      }
    }
  }
}
```

**Claude Code の設定:**

```bash
claude mcp add google-dev-knowledge --transport http https://developerknowledge.googleapis.com/mcp --header "X-Goog-Api-Key: YOUR_API_KEY"
```

## インストールの確認

設定後、AIツールで以下のようなプロンプトを入力する:

```
How do I list Cloud Storage buckets?
```

`search_documents` などのツール呼び出しが確認できれば、正常に動作している。

## トークン使用量の管理

- `batch_get_documents` は多くのトークンを消費する可能性がある
- 一部のGoogleドキュメントページは非常に大きいため、複数取得するとコスト増加・応答遅延・コンテキストウィンドウのオーバーフローにつながる
- **対策**: 必要な情報だけを対象にした具体的なプロンプトを使用し、広範なリクエスト（例: 「すべてのFirebase製品を比較」）は避ける

## 既知の制限事項

- **ネットワーク依存**: ライブのGoogle Cloudサービスに依存するため、接続が必要
- **英語のみ**: 検索結果は英語のみサポート
- **コンテンツスコープ**: [Corpus reference](https://developers.google.com/knowledge/reference/corpus-reference)に掲載されている公開ページのみが対象。GitHub、OSSサイト、ブログ、YouTubeのコンテンツは含まれない

## トラブルシューティング

- [Developer Knowledge API クォータ](https://developers.google.com/knowledge/quota)の上限を確認
- 有効なAPIキーが設定されているか確認
- MCPの設定ファイルのフォーマットが正しいか確認
- **Model Armor使用時**: `403 PERMISSION_DENIED` エラーが発生する場合、PIJBフィルターを `HIGH_AND_ABOVE` に設定して誤検出を減らす
