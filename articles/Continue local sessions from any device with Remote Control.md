---
title: "Continue local sessions from any device with Remote Control"
source: "https://code.claude.com/docs/en/remote-control"
author:
  - "[[Anthropic]]"
published:
created: 2026-02-26
description: "Remote Controlは、ローカルで実行中のClaude Codeセッションにスマートフォン・タブレット・他のブラウザからアクセスできる機能。セッションはローカルで動作し続け、クラウドには移行しない。Pro/Maxプラン向けのリサーチプレビューとして提供中。"
tags:
  - "clippings"
  - "claude-code"
  - "remote-control"
  - "developer-tools"
  - "anthropic"
  - "mobile"
---

## 概要

**Remote Control** は、ローカルマシンで実行中の Claude Code セッションを、スマートフォン・タブレット・別のPCのブラウザから操作できる機能。[claude.ai/code](https://claude.ai/code) および Claude モバイルアプリ（[iOS](https://apps.apple.com/us/app/claude-by-anthropic/id6473753684) / [Android](https://play.google.com/store/apps/details?id=com.anthropic.claude)）で利用可能。

> **現在のステータス**: Pro および Max プラン向けのリサーチプレビュー。Team・Enterprise プランでは利用不可。

## 主な特徴

- **中断からの復帰**: ノートPCがスリープしたりネットワークが切断されても、マシンがオンラインに復帰すると自動的に再接続
- **複数デバイスからの同時操作**: 会話が全接続デバイス間で同期され、ターミナル・ブラウザ・スマートフォンから交互にメッセージ送信可能
- **ローカル環境のフル活用**: ファイルシステム、MCPサーバー、ツール、プロジェクト設定がすべて利用可能

### Claude Code on the web との違い

| | Remote Control | Claude Code on the web |
|---|---|---|
| **実行場所** | ローカルマシン | Anthropic管理のクラウドインフラ |
| **ローカルリソース** | MCP、ツール、プロジェクト設定がすべて利用可能 | ローカルリソースにアクセス不可 |
| **ユースケース** | ローカル作業の継続 | ローカルセットアップなしでのタスク開始、未クローンリポジトリでの作業、並列タスク実行 |

## 要件

1. **ワークスペースの信頼**: プロジェクトディレクトリで `claude` を一度実行し、ワークスペース信頼ダイアログを承認
2. **認証**: `claude` を実行し `/login` で claude.ai にサインイン
3. **サブスクリプション**: Pro または Max プランが必要（APIキーは非対応）

## セッションの開始方法

### 新規セッション

```bash
claude remote-control
```

プロジェクトディレクトリで実行すると、ターミナル上にセッションURLが表示される。スペースキーでQRコードを表示してスマートフォンから素早くアクセス可能。

**利用可能なフラグ:**
- `--sandbox` / `--no-sandbox`: サンドボックスの有効/無効（デフォルトは無効）
- `--verbose`: 詳細なログ表示

### 既存セッションからの開始

Claude Code セッション中に以下を実行:

```
/remote-control
```

（短縮形: `/rc`）

現在の会話履歴を引き継いだ Remote Control セッションが開始される。`/rename` で事前にセッション名を付けておくと、デバイス間でのセッション検索が容易になる。

## 接続方法

Remote Control セッションがアクティブになったら、以下の方法で別デバイスから接続:

1. **セッションリストから**: [claude.ai/code](https://claude.ai/code) またはClaudeアプリでセッション名を検索（オンラインのセッションには緑のステータスドットが表示）
2. **QRコードから**: ターミナルに表示されるQRコードをスキャン
3. **URLから**: ターミナルに表示されるセッションURLをブラウザで開く

### 全セッションで自動有効化

Claude Code 内で `/config` を実行し、**Enable Remote Control for all sessions** を `true` に設定すると、毎回のセッションで自動的に Remote Control が有効になる。

## 接続とセキュリティ

- ローカルの Claude Code セッションは**アウトバウンドHTTPSリクエストのみ**を行い、インバウンドポートは一切開かない
- Remote Control 開始時に Anthropic API に登録し、ポーリングで動作
- すべてのトラフィックは **TLS経由で Anthropic API** を通過（通常の Claude Code セッションと同じトランスポートセキュリティ）
- 複数の**短命なクレデンシャル**を使用し、各クレデンシャルは単一の目的にスコープされ独立して有効期限切れ

## 制限事項

- **長時間のネットワーク障害**: マシンが起動中でもネットワークに約10分以上到達できない場合、セッションがタイムアウトしてプロセスが終了する
- **ターミナルを開いたままにする必要**: ローカルプロセスとして動作するため、ターミナルを閉じるか `claude` プロセスを停止するとセッションが終了する
- **同時リモートセッションは1つのみ**: 各 Claude Code セッションは1つのリモート接続のみサポート

## 関連リソース

- [Data usage](https://code.claude.com/en/data-usage) - ローカル/リモートセッション中のデータフロー
- [Security](https://code.claude.com/en/security) - セキュリティモデルにおける Remote Control の位置づけ
- [CLI reference](https://code.claude.com/en/cli-reference) - `claude remote-control` を含むフラグ・コマンドの一覧
- [Authentication](https://code.claude.com/en/authentication) - `/login` のセットアップとクレデンシャル管理
- [Claude Code on the web](https://code.claude.com/en/claude-code-on-the-web) - クラウド環境でのセッション実行
