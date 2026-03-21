---
title: "Push events into a running session with channels"
source: "https://code.claude.com/docs/en/channels"
author:
  - "[[Anthropic]]"
  - "[[Claude Code Docs]]"
published: 2026-03-01
created: 2026-03-21
description: "Channelsは、MCPサーバーを介してメッセージ・アラート・Webhookを実行中のClaude Codeセッションにプッシュする機能。TelegramやDiscordからのチャットブリッジ、CIやモニタリングからのWebhookを受信し、Claudeがリアルタイムに反応できる。Research Preview段階でv2.1.80以降が必要。"
tags:
  - "clippings"
  - "claude-code"
  - "channels"
  - "mcp"
  - "telegram"
  - "discord"
  - "webhooks"
  - "real-time-events"
---

## 概要

**Channels**は、MCPサーバーが実行中のClaude Codeセッションにイベントをプッシュする仕組み。ターミナルに張り付いていなくても、外部で起きたことにClaudeがリアルタイムに反応できる。双方向通信に対応し、Claudeはイベントを読んで同じチャネル経由で返信可能。

- **Research Preview** 段階（Claude Code v2.1.80以降が必要）
- claude.aiログインが必須（Console / APIキー認証は非対応）
- Team / Enterprise組織は管理者による明示的な有効化が必要

> セッションが開いている間だけイベントが到着する。常時稼働にはバックグラウンドプロセスまたは永続ターミナルでClaudeを実行する必要がある。

---

## サポートされているチャネル

各チャネルはプラグインとして提供され、[Bun](https://bun.sh/) が必要。

### Telegram

1. **Botの作成**: [BotFather](https://t.me/BotFather) で `/newbot` を送信し、表示名と `bot` で終わるユニークなユーザー名を設定。トークンをコピー。
2. **プラグインのインストール**:
   ```
   /plugin install telegram@claude-plugins-official
   ```
3. **トークンの設定**:
   ```
   /telegram:configure <token>
   ```
   `~/.claude/channels/telegram/.env` に保存される。シェル環境変数 `TELEGRAM_BOT_TOKEN` でも設定可能。
4. **チャネル有効化で再起動**:
   ```bash
   claude --channels plugin:telegram@claude-plugins-official
   ```
5. **アカウントのペアリング**: Telegramでbotにメッセージを送信 → ペアリングコードが返信される → Claude Codeで `/telegram:access pair <code>` → `/telegram:access policy allowlist` でアクセスをロック。

### Discord

1. **Botの作成**: [Discord Developer Portal](https://discord.com/developers/applications) で新規アプリケーションを作成。Bot セクションでトークンを取得。
2. **Message Content Intent の有効化**: Privileged Gateway Intents で Message Content Intent を有効にする。
3. **サーバーへの招待**: OAuth2 > URL Generator で `bot` スコープを選択し、以下の権限を付与:
   - View Channels / Send Messages / Send Messages in Threads
   - Read Message History / Attach Files / Add Reactions
4. **プラグインのインストール**:
   ```
   /plugin install discord@claude-plugins-official
   ```
5. **トークンの設定**:
   ```
   /discord:configure <token>
   ```
6. **チャネル有効化で再起動**:
   ```bash
   claude --channels plugin:discord@claude-plugins-official
   ```
7. **アカウントのペアリング**: DiscordでbotにDMを送信 → ペアリングコード → `/discord:access pair <code>` → `/discord:access policy allowlist`

---

## クイックスタート（Fakechat デモ）

**Fakechat** はlocalhostで動作する公式デモチャネル。認証不要・外部サービス設定不要でチャネルの動作を体験できる。

### 前提条件
- Claude Code がclaude.aiアカウントで認証済み
- [Bun](https://bun.sh/) がインストール済み
- Team/Enterpriseユーザーは管理者がチャネルを有効化済み

### 手順

1. **インストール**:
   ```
   /plugin install fakechat@claude-plugins-official
   ```
2. **チャネル有効化で再起動**:
   ```bash
   claude --channels plugin:fakechat@claude-plugins-official
   ```
3. **メッセージの送信**: `http://localhost:8787` を開いてメッセージを入力。Claude Codeセッションに `channel_message` イベントとして到着し、Claudeが処理して返信。

> **注意**: 権限プロンプトが発生するとセッションが一時停止する。無人運用には `--dangerously-skip-permissions` が使えるが、信頼できる環境でのみ使用すること。

---

## セキュリティ

- 承認済みチャネルプラグインは**送信者許可リスト（allowlist）** を維持
- リストに無いIDからのメッセージはサイレントに破棄
- ペアリングフローで許可リストにIDが追加される
- `--channels` フラグで各セッションで有効にするサーバーを制御
- `.mcp.json` に記載があるだけではメッセージをプッシュできない。`--channels` での指定が必須

---

## Enterprise コントロール

`channelsEnabled` 設定（managed settings内）で制御。

| プランタイプ | デフォルト動作 |
|---|---|
| Pro / Max（組織なし） | チャネル利用可能。ユーザーが `--channels` でセッション単位にオプトイン |
| Team / Enterprise | 管理者が明示的に有効化するまで無効 |

管理者は **claude.ai → Admin settings → Claude Code → Channels** から有効化可能。

---

## Research Preview の制限事項

- 可用性は段階的にロールアウト中
- `--channels` フラグの構文やプロトコル仕様はフィードバックに基づいて変更される可能性あり
- プレビュー期間中、`--channels` は **Anthropic管理の許可リスト** に含まれるプラグインのみ受け付ける
- 自作チャネルのテストには `--dangerously-load-development-channels` を使用
- フィードバックは [Claude Code GitHub repository](https://github.com/anthropics/claude-code/issues) へ

---

## 他のClaude Code機能との比較

| 機能 | 概要 | 適した用途 |
|---|---|---|
| **Claude Code on the web** | GitHubからクローンしたクラウドサンドボックスで新規タスクを実行 | 後で確認する自己完結型の非同期作業の委託 |
| **Claude in Slack** | `@Claude` メンションからWebセッションを生成 | チームの会話コンテキストからタスクを開始 |
| **標準MCP server** | タスク中にClaudeがクエリ。プッシュは無し | システムへのオンデマンド読み取り/クエリアクセスの提供 |
| **Remote Control** | claude.aiやClaudeモバイルアプリからローカルセッションを操作 | デスクから離れている時に進行中のセッションを操作 |
| **Channels** | 非Claudeソースから実行中のローカルセッションにイベントをプッシュ | チャットブリッジ、Webhookレシーバー |

### Channelsのユニークな価値

- **チャットブリッジ**: TelegramやDiscordからスマホでClaudeに質問 → 同じチャットで回答が返る（作業はローカルマシンで実行）
- **Webhookレシーバー**: CI、エラートラッカー、デプロイパイプラインなどからのWebhookを、Claudeがファイルを開いてデバッグ中のセッションで直接受信

---

## 次のステップ

- [自作チャネルの構築](https://code.claude.com/en/channels-reference) — プラグインがまだ無いシステム向け
- [Remote Control](https://code.claude.com/en/remote-control) — イベント転送ではなく、スマホからローカルセッションを直接操作
- [Scheduled tasks](https://code.claude.com/en/scheduled-tasks) — プッシュイベントへの反応ではなくタイマーベースのポーリング
