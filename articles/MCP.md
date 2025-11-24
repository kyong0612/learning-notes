---
title: "MCP"
source: "https://www.ultracite.ai/mcp"
author:
  - "[[@haydenbleasel]]"
published:
created: 2025-11-24
description: |
  Model Context Protocol (MCP) を使用してUltraciteをAI開発ツール（Claude Desktop、Cursor、Windsurfなど）と統合する方法についての包括的なガイド。インストール手順、設定方法、使用例、セキュリティに関する情報を含む。
tags:
  - "clippings"
  - "MCP"
  - "Ultracite"
  - "AI開発ツール"
  - "統合"
---

## 概要

**Model Context Protocol (MCP)** は、Claude、Cursor、その他のAI支援ツールが外部データソースやシステムに安全に接続できるようにするオープンスタンダードです。AIツールが現実世界のデータや機能にアクセスできる「ユニバーサルリモート」のようなものです。

UltraciteはMCPをサポートしており、AI開発ワークフローを強化できます。

## インストールガイド

### Step 1: AIツールの選択

MCPをサポートするAI開発ツールを使用していることを確認してください：

- [Claude Desktop](https://claude.ai/download)（無料 - 初心者におすすめ）
- [Cursor](https://www.cursor.com/)（AI搭載コードエディタ）
- [Windsurf by Codeium](https://windsurf.com/)（AI開発プラットフォーム）
- その他のMCP対応ツール

### Step 2: 設定ファイルの場所を確認

使用するAIツールに応じて、以下のいずれかのファイルを編集する必要があります：

- **Claude Desktop**: macOS は `~/Library/Application\ Support/Claude/claude_desktop_config.json`、Windows は `%APPDATA%\Claude\claude_desktop_config.json`
- **Cursor**: `.cursor/mcp.json`
- **Windsurf**: `.codeium/windsurf/mcp_config.json`
- **その他のツール**: 各ツールのMCPドキュメントを確認

### Step 3: Ultracite設定の追加

以下の設定をMCP設定ファイルにコピー＆ペーストしてください：

```json
{
  "mcpServers": {
    "ultracite": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://www.ultracite.ai/api/mcp/mcp"
      ]
    }
  }
}
```

### Step 4: AIツールの再起動

変更を反映するために、AIアプリケーションを閉じて再度開いてください。

### Step 5: 接続の確認

AIアシスタントに以下のように質問して、統合をテストしてください：

> What Ultracite rules are available?

成功すると、AIがUltraciteのルールをリストアップして説明できるようになります。

## 複数のMCPサーバーの使用

Ultraciteを他のMCPサーバーと併用できます：

```json
{
  "mcpServers": {
    "ultracite": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://www.ultracite.ai/api/mcp/mcp"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/project"]
    }
  }
}
```

## 使用例

### 利用可能なルールの探索

AIアシスタントに以下のように質問してください：

> What rules does Ultracite have for React hooks?

期待される応答には、関連するReactフックのリンティングルールとその説明が含まれます。

### ルールカテゴリの理解

> Show me all accessibility rules in Ultracite

AIがUltraciteで設定されているa11yルールをリストアップして説明できます。

### プリセットの比較

> What's the difference between ultracite/core and ultracite/react?

異なるプリセット設定とその使用タイミングについての詳細情報を取得できます。

## セキュリティとプライバシー

### データ処理

- Ultracite MCPサーバーは、公開されているリンティングルールのドキュメントと設定情報のみを提供します
- 個人データやコードはサーバーに送信されません
- すべての通信は、選択したAIツールのセキュリティレイヤーを通じて行われます

### 認証

- 公開ドキュメントへのアクセスに認証は不要です
- 将来のプレミアム機能にはAPIキーが必要になる可能性があります
- 常に公式のUltracite MCPエンドポイントを使用してください

## 重要なポイント

1. **MCPとは**: AIツールが外部データソースに接続するためのオープンスタンダード
2. **統合の利点**: Ultraciteのルールや設定情報をAIアシスタントから直接参照・利用可能
3. **設定の柔軟性**: 複数のMCPサーバーを同時に使用可能
4. **セキュリティ**: 個人データやコードは送信されず、公開ドキュメントのみが提供される
5. **対応ツール**: Claude Desktop、Cursor、Windsurfなど、主要なAI開発ツールに対応
