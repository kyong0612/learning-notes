---
title: "clawdbot/clawdbot: Your own personal AI assistant. Any OS. Any Platform. The lobster way. 🦞"
source: "https://github.com/clawdbot/clawdbot"
author:
  - "[[steipete]]"
  - "Peter Steinberger"
published:
created: 2026-01-23
description: "Clawdbotは、あらゆるOS・プラットフォームで動作するオープンソースのパーソナルAIアシスタント。Claude Opus 4.5をベースに、メール管理、カレンダー、メッセージング、フライトチェックインなど実用的なタスクを自動化し、WhatsApp、Telegram、Discordなどのチャットアプリから操作可能。"
tags:
  - "clippings"
  - "AI"
  - "assistant"
  - "open-source"
  - "automation"
  - "Claude"
  - "productivity"
---

## 概要

**Clawdbot**は、Peter Steinberger（@steipete）が開発したオープンソースのパーソナルAIアシスタントプラットフォーム。「The lobster way 🦞」をブランドコンセプトに、あらゆるOS・プラットフォームで動作する包括的なAIアシスタントシステムを提供する。

### プロジェクト統計
- **GitHub Stars**: 5.9k+
- **Forks**: 901
- **Commits**: 7,295+
- **公式サイト**: clawd.bot, clawdbot.com, clawd.me

---

## 主要機能

### コア機能
- **マルチエージェントルーティング**: 複数のエージェントを連携させたループ処理
- **拡張可能なスキル・プラグインアーキテクチャ**: カスタムスキルの追加が可能
- **メモリ管理システム**: セッション間で永続的な記憶を維持
- **OAuth統合**: 各種サービスとの安全な認証連携
- **音声通話機能**: ボイスコール対応
- **ダッシュボード & CLI**: 管理・監視ツール
- **ブラウザ統合**: Chrome/Chromiumの制御
- **セキュリティ & DNS機能**: 安全な運用環境

### チャンネル対応
- **ブラウザ**: Webインターフェース
- **メッセージング**: WhatsApp、Telegram、Discord
- **音声**: ウェイクワード検出、音声通話

---

## 統合可能なサービス（50+）

### 生産性ツール
| サービス | 機能 |
|---------|------|
| Microsoft 365 | Email、Calendar、OneDrive、To Do（Graph API経由） |
| Gmail | Pub/Subによるメールトリガー自動化 |
| Apple Notes & Reminders | メモ・リマインダー連携 |
| Notion | ワークスペース統合 |
| Obsidian | ナレッジベース連携 |
| Bear Notes | ノート管理 |
| Things 3 | タスク管理 |
| Trello | プロジェクト管理 |
| GitHub | リポジトリ・Issues管理 |

### 自動化・ユーティリティ
- **Cron**: スケジュールタスク
- **Webhooks**: 外部トリガー連携
- **1Password**: セキュアな認証情報管理
- **Weather**: 天気予報
- **Canvas**: ビジュアルワークスペース
- **Voice**: 音声機能

---

## インストール方法

複数のインストールオプションをサポート：

| 方法 | 説明 |
|------|------|
| **Installer** | 標準インストール |
| **Docker** | コンテナ化デプロイ |
| **Bun** | JavaScriptランタイムインストール |
| **Nix** | 宣言的パッケージ管理 |
| **Ansible** | インフラ自動化（Tailscale VPN、UFWファイアウォール対応） |

---

## 関連プロジェクト

clawdbot organizationが管理する関連リポジトリ：

- **clawdhub**: Clawdbot用スキルディレクトリ
- **clawdinators**: NixOSモジュールによるインフラ管理
- **clawdbot-ansible**: Tailscale VPNとUFWファイアウォールを含む自動ハードニングインストール

---

## 技術スタック

- **AIモデル**: Claude Opus 4.5
- **アーキテクチャ**: マルチエージェント、プラグイン拡張可能
- **セキュリティ**: サンドボックスCLI、OAuth認証、DNS・ゲートウェイ管理

---

## 実用例

Clawdbotは以下のような実用的なタスクを実行可能：

1. **メール管理**: 受信トレイのクリア、返信の自動化
2. **カレンダー管理**: 予定の確認・調整
3. **メッセージング**: 各種チャットアプリからの操作
4. **フライトチェックイン**: 自動チェックイン処理
5. **タスク管理**: To Do、Things 3、Trelloとの連携

---

## ドキュメント

- [公式ドキュメント](https://docs.clawd.bot/)
- [Getting Started](https://docs.clawd.bot/getting-started)
- [Tools リファレンス](https://docs.clawd.bot/tools)
- [CLI リファレンス](https://docs.clawd.bot/cli)
