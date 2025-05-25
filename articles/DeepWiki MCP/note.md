---
title: "DeepWiki MCP"
source: "https://docs.devin.ai/work-with-devin/deepwiki-mcp"
author:
  - "Cognition AI (Devin Docs)"
published:
created: 2025-05-25
description: "DeepWiki MCPサーバーの使用方法について。GitHubリポジトリのドキュメントへのプログラマティックアクセスと検索機能を提供する無料のMCPサービス。"
tags:
  - "MCP"
  - "Model Context Protocol"
  - "DeepWiki"
  - "Devin"
  - "API"
  - "documentation"
  - "AI tools"
  - "repository search"
---

# DeepWiki MCP

DeepWiki MCPサーバーは、DeepWikiのリポジトリドキュメント（Devin Wiki）と検索機能（Devin Search）へのプログラマティックアクセスを提供します。

## MCPとは？

[Model Context Protocol](https://modelcontextprotocol.io/introduction)（MCP）は、AIアプリケーションがMCP対応のデータソースやツールに安全に接続できるオープンスタンダードです。MCPは、AIアプリケーション用のUSB-Cポートのようなもので、AIアプリを異なるサービスに接続するための標準化された方法と考えることができます。

## DeepWiki MCPサーバー

DeepWiki MCPサーバーは、**無料**で、**リモート**、**認証不要**のサービスです。

**ベースサーバーURL:** `https://mcp.deepwiki.com/`

### 利用可能なツール

DeepWiki MCPサーバーは3つの主要なツールを提供します：

1. **`read_wiki_structure`** - GitHubリポジトリのドキュメントトピックの一覧を取得
2. **`read_wiki_contents`** - GitHubリポジトリに関するドキュメントを表示
3. **`ask_question`** - GitHubリポジトリに関する質問を行い、AI駆動の文脈に基づいた回答を取得

### ワイヤープロトコル

DeepWiki MCPサーバーは2つのワイヤープロトコルをサポートしています：

#### SSE（Server-Sent Events）- `/sse`

- **URL:** `https://mcp.deepwiki.com/sse`
- 公式MCP仕様バージョン
- Claudeでサポート
- **ほとんどの統合で推奨**

#### Streamable HTTP - `/mcp`

- **URL:** `https://mcp.deepwiki.com/mcp`
- 新しいプロトコル、CloudflareとOpenAIで動作
- レガシーの`/sse`バージョンもサポート

最大限の互換性のため、まず`/sse`エンドポイントを試すことが推奨されます。

## 関連リソース

- **[リモートMCPサーバーをClaudeに接続する](https://support.anthropic.com/en/articles/11175166-about-custom-integrations-using-remote-mcp)**
- **[DeepWiki MCPサーバーを使用するためのOpenAIのドキュメント](https://platform.openai.com/docs/guides/tools-remote-mcp)**
- **[DeepWiki](/work-with-devin/deepwiki)**
- **[Devin Wiki](/work-with-devin/devin-wiki)**  
- **[Devin Search](/work-with-devin/devin-search)**

## 重要なポイント

### 無料サービス

DeepWiki MCPサーバーは完全に無料で利用でき、認証も必要ありません。これにより、開発者はすぐにサービスを統合して使い始めることができます。

### プライベートリポジトリ対応

プライベートリポジトリに対するDeepWiki機能が必要な場合は、[Devin.ai](https://devin.ai/)でDevinアカウントにサインアップする必要があります。

### 技術的詳細

- MCPは「AIアプリケーション用のUSB-C」として機能する標準化されたプロトコル
- 2つの異なるワイヤープロトコル（SSEとStreamable HTTP）をサポート
- Claude、OpenAI、Cloudflareなどの主要なAIプラットフォームと互換性
