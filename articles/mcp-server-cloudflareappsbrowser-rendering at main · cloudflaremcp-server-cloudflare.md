---
title: "mcp-server-cloudflare/apps/browser-rendering at main · cloudflare/mcp-server-cloudflare"
source: "https://github.com/cloudflare/mcp-server-cloudflare/tree/main/apps/browser-rendering"
author:
  - "Cloudflare"
published: 2024-11-27
created: 2025-12-31
description: "Cloudflare Browser Rendering API を統合した MCP サーバー。AI クライアントが Web コンテンツと対話し、HTML 取得、Markdown 変換、スクリーンショット撮影を可能にする。"
tags:
  - "MCP"
  - "Cloudflare"
  - "Browser Rendering"
  - "TypeScript"
  - "Web Scraping"
---

## 概要

Cloudflare Browser Rendering MCP Server は、Model Context Protocol (MCP) を通じて Cloudflare の Browser Rendering API を利用できるようにするサーバーです。AI クライアントが OAuth 認証を介してリモート接続し、Web コンテンツと対話することを可能にします。

## プロジェクトの目的

このプロジェクトは、LLM（大規模言語モデル）クライアントが自然言語を通じて Cloudflare のサービスと対話できるようにする MCP サーバーコレクションの一部です。特に Browser Rendering サーバーは、Web ページの取得、Markdown への変換、スクリーンショットの撮影といった機能を提供します。

## 主要な機能

このサーバーは以下の3つの主要なツールを提供します：

1. **get_url_html_content**
   - 指定された URL の HTML コンテンツを取得

2. **get_url_markdown**
   - Web ページのコンテンツを取得し、Markdown 形式に変換

3. **get_url_screenshot**
   - Web ページのスクリーンショットをキャプチャ
   - ビューポートサイズをオプションで指定可能

## 技術スタック

- **言語**: TypeScript (88.2%)
- **パッケージマネージャ**: pnpm
- **テストフレームワーク**: Vitest
- **リンター**: ESLint
- **デプロイツール**: Wrangler (Cloudflare Workers 用)
- **アーキテクチャ**: モノレポ構造

## 依存関係

- Model Context Protocol (MCP) SDK
- Cloudflare Browser Rendering API
- OAuth 認証機能
- TypeScript ランタイム環境

## インストール手順

### リモートサーバーをサポートする MCP クライアントの場合

以下の URL を使用します：

```
https://browser.mcp.cloudflare.com
```

### 手動設定が必要なクライアントの場合

設定ファイルに以下を追加します：

```json
{
  "mcpServers": {
    "cloudflare": {
      "command": "npx",
      "args": ["mcp-remote", "https://browser.mcp.cloudflare.com/mcp"]
    }
  }
}
```

## 使用方法

### 前提条件

ツールを使用する前に、以下の手順が必要です：

1. アクティブな Cloudflare アカウントを持っている
2. `accounts_list` を使用してアカウントを一覧表示
3. `set_active_account` を使用してアクティブなアカウントを設定
4. Cloudflare ダッシュボードで適切な権限を持つ API トークンを作成

### 使用例

- **HTML の取得**: 任意の URL から HTML コンテンツを取得
- **Markdown 変換**: Web ページを Markdown 形式に変換して読みやすくする
- **スクリーンショット**: カスタマイズ可能なビューポートで Web ページのスクリーンショットをキャプチャ

## リポジトリ情報

- **ライセンス**: Apache-2.0
- **スター数**: 3.2k
- **フォーク数**: 312
- **コントリビューター数**: 48人
- **リリース数**: 275
- **コミット数**: 324 (main ブランチ)
- **作成日**: 2024年11月27日
- **ステータス**: アクティブに保守中

## プロジェクト構造

このプロジェクトは、15以上の専門的な MCP サーバーを含むモノレポの一部として、`/apps/browser-rendering/` ディレクトリに配置されています。pnpm ワークスペースを使用して管理されており、各サーバーは独立した機能を提供します。

## 特徴

- OAuth 認証によるセキュアなリモート接続
- TypeScript による型安全な実装
- Cloudflare のグローバルネットワークを活用した高速なブラウザレンダリング
- MCP プロトコルによる標準化されたインターフェース
- OpenAI の Responses API などの LLM クライアントとの統合が容易
