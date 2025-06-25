---
title: "KOBA789/human-in-the-loop: An MCP (Model Context Protocol) server that allows AI assistants to ask questions to humans via Discord."
source: "https://github.com/KOBA789/human-in-the-loop"
author:
  - "[[KOBA789]]"
published:
created: 2025-06-25
description: "An MCP (Model Context Protocol) server that allows AI assistants to ask questions to humans via Discord. - KOBA789/human-in-the-loop"
tags:
  - "clippings"
  - "mcp"
  - "human-in-the-loop"
  - "ai-agent"
  - "discord"
  - "rust"
---
# Human-in-the-Loop MCP Server

An MCP (Model Context Protocol) server that allows AI assistants to ask questions to humans via Discord.

[![Screenshot 2025-06-23 at 18 25 43](https://private-user-images.githubusercontent.com/239637/457828345-dcdbb1a7-cb71-446e-b44d-bfe637059acb.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTA4NTI2OTUsIm5iZiI6MTc1MDg1MjM5NSwicGF0aCI6Ii8yMzk2MzcvNDU3ODI4MzQ1LWRjZGJiMWE3LWNiNzEtNDQ2ZS1iNDRkLWJmZTYzNzA1OWFjYi5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwNjI1JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDYyNVQxMTUzMTVaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT03YjgzMmU2ZTRjZDNkMzc2ZDQ3NTljNWNmNWU0NmQ5MjQ5M2E4NWRkNjVmNzc2OGZmOTRkZjc1Y2I1ZDgyNGQ1JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.JSSC0o7ptWTKK-SJtnR1PMrMBJf9GxIec0SuE-Uf9aQ)](https://private-user-images.githubusercontent.com/239637/457828345-dcdbb1a7-cb71-446e-b44d-bfe637059acb.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTA4NTI2OTUsIm5iZiI6MTc1MDg1MjM5NSwicGF0aCI6Ii8yMzk2MzcvNDU3ODI4MzQ1LWRjZGJiMWE3LWNiNzEtNDQ2ZS1iNDRkLWJmZTYzNzA1OWFjYi5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwNjI1JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDYyNVQxMTUzMTVaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT03YjgzMmU2ZTRjZDNkMzc2ZDQ3NTljNWNmNWU0NmQ5MjQ5M2E4NWRkNjVmNzc2OGZmOTRkZjc1Y2I1ZDgyNGQ1JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.JSSC0o7ptWTKK-SJtnR1PMrMBJf9GxIec0SuE-Uf9aQ)

## 概要 (Overview)

このMCPサーバーは、AIアシスタントが作業中に人間の入力や判断を必要とするときに使用されます。例えば、以下のようなケースで役立ちます。

- LLMにドキュメントを作成させる際に、AIが構造を設計し、人間が具体的な内容を提供する
- AIが不確かな決定について確認を必要とする場合
- 専門的な知識や個人情報が必要な場合

## 要件 (Requirements)

- Rust (1.70以上)
- Discordアカウントとボット
- MCP互換のAIクライアント (Claude Desktop, Copilot Editsなど)

## セットアップ (Setup)

### 1. Discordボットの作成

1. [Discord Developer Portal](https://discord.com/developers/applications)にアクセスします。
2. 新しいアプリケーションを作成します。
3. Botセクションでボットを作成し、トークンを取得します。
4. 必要な権限を設定します:
    - `Send Messages`
    - `Create Public Threads`
    - `Read Message History`

### 2. インストール

```sh
cargo install --git https://github.com/KOBA789/human-in-the-loop.git
```

## MCPクライアントとの連携 (Connecting with MCP Clients)

### Claude Desktopでの設定

`claude_desktop_config.json`に以下を追加します。

```json
{
  "mcpServers": {
    "human-in-the-loop": {
      "command": "human-in-the-loop",
      "args": [
        "--discord-channel-id", "your-channel-id",
        "--discord-user-id", "your-user-id"
      ],
      "env": {
        "DISCORD_TOKEN": "your-discord-bot-token"
      }
    }
  }
}
```

### Claude Codeでの設定

Claude Code (claude.ai/code)の場合、MCP設定に以下を追加します。

```json
{
  "human-in-the-loop": {
    "command": "human-in-the-loop",
    "args": [
      "--discord-channel-id", "your-channel-id",
      "--discord-user-id", "your-user-id"
    ]
  }
}
```

Claude Codeを実行する前に、環境変数としてDiscordトークンを設定します。

```sh
export DISCORD_TOKEN="your-discord-bot-token"
claude
```

**注**: サーバーは自動的に`DISCORD_TOKEN`環境変数からDiscordトークンを読み取ります。必要に応じて`--discord-token`引数で渡すことも可能です。

## 使用方法 (Usage)

AIアシスタントは`ask_human`ツールを使用して人間に質問できます。

**会話例:**

> **Human:** ドキュメントの概要を作成してください。必要に応じて質問しても構いません。
> **Assistant:** 承知しました。ドキュメントの概要を作成します。まずいくつか質問させてください。
> `[ask_humanツールを使用]`

AIはDiscordに質問を投稿し、指定されたユーザーにメンションします。ユーザーがDiscordで返信すると、その応答がAIに返されます。

## 仕組み (How It Works)

1. AIアシスタントが`ask_human`ツールを呼び出します。
2. MCPサーバーが指定されたDiscordチャンネルにスレッドを作成します（または既存のスレッドを使用）。
3. 質問を投稿し、指定されたユーザーにメンションします。
4. ユーザーの返信を待ちます。
5. 返信内容をAIアシスタントに返します。

## Discord IDの取得方法 (Finding Discord IDs)

### チャンネルIDの取得

1. Discordで開発者モードを有効にします（設定 → 詳細設定 → 開発者モード）。
2. チャンネルを右クリックし、「IDをコピー」を選択します。

### ユーザーIDの取得

1. ユーザーを右クリックし、「IDをコピー」を選択します。

## ロードマップ (Roadmap)

- **MCP Elicitationへの将来的な移行**: MCPのElicitation実装がより広く普及し、標準化され次第、UIをDiscordからネイティブのMCP Elicitationに移行する予定です。これにより、MCP互換クライアント内でより統合された体験が提供されます。

## ライセンス

[MIT license](https://github.com/KOBA789/human-in-the-loop/blob/main/LICENSE)

## 言語 (Languages)

- [Rust 100.0%](https://github.com/KOBA789/human-in-the-loop/search?l=rust)
