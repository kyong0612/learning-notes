---
title: "Claude Code Plugins - Slack Integration"
source: "https://github.com/anthropics/claude-plugins-official/tree/86c54b5466df97b4d381aaf2735d17a940a4ea02/external_plugins/slack"
author:
  - "Anthropic"
  - "Slack"
published:
created: 2026-02-19
description: "Anthropic公式のClaude Code Pluginsディレクトリに収録されたSlack連携プラグイン。MCPプロトコル経由でSlackワークスペースと統合し、メッセージ検索・チャンネルアクセス・スレッド閲覧などをコーディング中に実行可能にする。"
tags:
  - "clippings"
  - "Claude Code"
  - "Plugin"
  - "Slack"
  - "MCP"
---

## 概要

[claude-plugins-official](https://github.com/anthropics/claude-plugins-official) は、Anthropicが管理するClaude Code用の高品質プラグインのキュレーションディレクトリである。このリポジトリ内の `external_plugins/slack` は、Slackが提供する公式のSlackワークスペース連携プラグインを収録している。

> **注意**: プラグインのインストール・更新・使用前に、必ずそのプラグインを信頼できるか確認すること。Anthropicはプラグインに含まれるMCPサーバー、ファイル、その他のソフトウェアを管理しておらず、意図通りに動作するか、また変更されないかを保証していない。

## リポジトリ構成

```
claude-plugins-official/
├── plugins/              # Anthropic内部開発プラグイン
├── external_plugins/     # サードパーティ製プラグイン
│   ├── asana/
│   ├── context7/
│   ├── firebase/
│   ├── github/
│   ├── gitlab/
│   ├── greptile/
│   ├── laravel-boost/
│   ├── linear/
│   ├── playwright/
│   ├── serena/
│   ├── slack/            # ← 本プラグイン
│   ├── stripe/
│   └── supabase/
└── README.md
```

## Slackプラグインの詳細

### plugin.json（メタデータ）

```json
{
  "name": "slack",
  "description": "Slack workspace integration. Search messages, access channels, read threads, and stay connected with your team's communications while coding. Find relevant discussions and context quickly.",
  "author": {
    "name": "Slack"
  }
}
```

**主な機能:**
- Slackメッセージの検索
- チャンネルへのアクセス
- スレッドの閲覧
- コーディング中にチームのコミュニケーションとの接続維持
- 関連するディスカッションやコンテキストの素早い検索

### .mcp.json（MCP サーバー設定）

```json
{
  "slack": {
    "type": "http",
    "url": "https://mcp.slack.com/mcp",
    "oauth": {
      "clientId": "1601185624273.8899143856786",
      "callbackPort": 3118
    }
  }
}
```

- **接続方式**: HTTP（`https://mcp.slack.com/mcp`）
- **認証方式**: OAuth 2.0（SlackのOAuthクライアントIDを使用、コールバックポート3118）

## インストール方法

Claude Codeのプラグインシステムから直接インストール可能:

```bash
/plugin install slack@claude-plugin-directory
```

または `/plugin > Discover` からブラウズしてインストール。

## プラグインの標準構造

各プラグインは以下の標準的な構造に従う:

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json      # プラグインメタデータ（必須）
├── .mcp.json            # MCPサーバー設定（任意）
├── commands/            # スラッシュコマンド（任意）
├── agents/              # エージェント定義（任意）
├── skills/              # スキル定義（任意）
└── README.md            # ドキュメント
```

## 重要なポイント

- SlackプラグインはMCP（Model Context Protocol）を使用してSlack APIと通信する
- OAuth認証によりユーザーのSlackワークスペースへの安全なアクセスを提供
- Slack公式が開発・提供しているため、APIの安定性と信頼性が高い
- Claude Codeでコーディング中に、関連するSlackの議論やコンテキストをシームレスに参照できる
