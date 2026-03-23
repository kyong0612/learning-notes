---
title: "louislva/claude-peers-mcp: Allow all your Claude Codes to message each other ad-hoc!"
source: "https://github.com/louislva/claude-peers-mcp"
author:
  - "Louis Arge (@louislva)"
published: 2026-03-21
created: 2026-03-23
description: "複数のClaude Codeインスタンス間でリアルタイムにメッセージをやり取りできるMCPサーバー。ローカルのブローカーデーモンとSQLiteを使い、ピア検出・メッセージング・作業状況の共有を実現する。"
tags:
  - "clippings"
  - "MCP"
  - "Claude Code"
  - "multi-agent"
  - "developer-tools"
  - "TypeScript"
---

## 概要

**claude-peers-mcp** は、同一マシン上で実行されている複数の Claude Code インスタンスが互いを発見し、リアルタイムでメッセージをやり取りできるようにする MCP（Model Context Protocol）サーバーである。5つのセッションを異なるプロジェクトで並行して走らせているとき、どの Claude からでも他のインスタンスを発見してメッセージを即座に送信できる。

```
  Terminal 1 (poker-engine)          Terminal 2 (eel)
  ┌───────────────────────┐          ┌──────────────────────┐
  │ Claude A              │          │ Claude B             │
  │ "send a message to    │  ──────> │                      │
  │  peer xyz: what files │          │ <channel> arrives    │
  │  are you editing?"    │  <────── │  instantly, Claude B │
  │                       │          │  responds            │
  └───────────────────────┘          └──────────────────────┘
```

## セットアップ手順

### 1. インストール

```bash
git clone https://github.com/louislva/claude-peers-mcp.git ~/claude-peers-mcp
cd ~/claude-peers-mcp
bun install
```

### 2. MCP サーバーの登録

すべての Claude Code セッションで claude-peers を利用可能にする：

```bash
claude mcp add --scope user --transport stdio claude-peers -- bun ~/claude-peers-mcp/server.ts
```

### 3. チャンネル付きで Claude Code を起動

```bash
claude --dangerously-skip-permissions --dangerously-load-development-channels server:claude-peers
```

ブローカーデーモンは最初のセッション起動時に自動で立ち上がる。

> **Tip:** エイリアスを設定すると便利：
>
> ```bash
> alias claudepeers='claude --dangerously-load-development-channels server:claude-peers'
> ```

### 4. 2つ目のセッションで動作確認

別のターミナルで同じコマンドで Claude Code を起動し、以下を試す：

- `List all peers on this machine` — 実行中の全インスタンスが表示される（作業ディレクトリ、gitリポジトリ、作業概要付き）
- `Send a message to peer [id]: "what are you working on?"` — 指定のインスタンスに即座にメッセージが届き、応答が返る

## 提供ツール

| ツール | 機能 |
| --- | --- |
| `list_peers` | 他の Claude Code インスタンスを検出。`machine`、`directory`、`repo` のスコープで絞り込み可能 |
| `send_message` | ID指定で他インスタンスにメッセージ送信（channel push により即時到達） |
| `set_summary` | 自分の作業内容を記述（他のピアから `list_peers` で閲覧可能） |
| `check_messages` | メッセージの手動確認（channel モード未使用時のフォールバック） |

## アーキテクチャ

**ブローカーデーモン** が `localhost:7899` 上で動作し、SQLite データベースを持つ。各 Claude Code セッションは MCP サーバーを生成し、ブローカーに登録して1秒ごとにメッセージをポーリングする。受信メッセージは [claude/channel](https://code.claude.com/docs/en/channels-reference) プロトコルを介してセッションにプッシュされ、即座に Claude に到達する。

```
                    ┌───────────────────────────┐
                    │  broker daemon            │
                    │  localhost:7899 + SQLite  │
                    └──────┬───────────────┬────┘
                           │               │
                      MCP server A    MCP server B
                      (stdio)         (stdio)
                           │               │
                      Claude A         Claude B
```

**主要な特徴：**
- ブローカーは最初のセッション開始時に自動起動
- 停止したピアは自動的にクリーンアップ
- 通信はすべて **localhost のみ**（外部ネットワーク不要）

## Auto-summary 機能

環境変数 `OPENAI_API_KEY` を設定すると、各インスタンスが起動時に `gpt-5.4-nano` を使って作業概要を自動生成する（コストはごく僅か）。作業ディレクトリ、git ブランチ、最近のファイルに基づいて概要が作られ、他のインスタンスが `list_peers` で確認できる。

API キーがない場合は、Claude が `set_summary` ツールで自身の概要を設定する。

## CLI コマンド

ターミナルからの直接操作も可能：

```bash
cd ~/claude-peers-mcp

bun cli.ts status            # ブローカーのステータス + 全ピア表示
bun cli.ts peers             # ピア一覧
bun cli.ts send <id> <msg>   # Claude セッションにメッセージ送信
bun cli.ts kill-broker       # ブローカー停止
```

## 設定（環境変数）

| 環境変数 | デフォルト値 | 説明 |
| --- | --- | --- |
| `CLAUDE_PEERS_PORT` | `7899` | ブローカーのポート番号 |
| `CLAUDE_PEERS_DB` | `~/.claude-peers.db` | SQLite データベースのパス |
| `OPENAI_API_KEY` | — | 設定すると gpt-5.4-nano による自動サマリーが有効化 |

## 要件・制限事項

- **[Bun](https://bun.sh/)** ランタイムが必要
- **Claude Code v2.1.80+** が必要
- **claude.ai ログイン** が必須（channel 機能は API キー認証では動作しない）
- 通信は localhost に限定されるため、リモートマシン間の連携は不可
- `--dangerously-skip-permissions` や `--dangerously-load-development-channels` フラグの使用が前提（セキュリティ上の考慮が必要）