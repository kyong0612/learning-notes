---
title: "vercel-labs/dev3000: Captures your web app's complete development timeline - server logs, browser events, console messages, network requests, and automatic screenshots - in a unified, timestamped feed for AI debugging."
source: "https://github.com/vercel-labs/dev3000"
author:
  - "[[elsigh]]"
published:
created: 2025-09-12
description: |
  Captures your web app's complete development timeline - server logs, browser events, console messages, network requests, and automatic screenshots - in a unified, timestamped feed for AI debugging.
tags:
  - "web"
  - "ai"
  - "devtools"
  - "debugging"
  - "observability"
---

`dev3000` は、Webアプリケーション開発の完全なタイムライン（サーバーログ、ブラウザイベント、コンソールメッセージ、ネットワークリクエスト、自動スクリーンショットなど）を、AIによるデバッグのために統一されたタイムスタンプ付きフィードにキャプチャするツールです。

## 概要

`dev3000` は、開発セッションの包括的なログを作成し、AIアシスタントが容易に理解できるようにします。バグや問題が発生した際に、AI（例：Claude）はサーバー出力、ブラウザコンソール、ネットワークリクエスト、スクリーンショットをすべて時系列で確認できます。

このツールは、実際のブラウザでアプリケーションを監視し、以下の情報をキャプチャします。

* サーバーログとコンソール出力
* ブラウザのコンソールメッセージとエラー
* ネットワークリクエストとレスポンス
* ナビゲーション、エラー、主要なイベント時の自動スクリーンショット

ログは `http://localhost:3684/logs` で視覚的なタイムラインとして表示されます。

![dev3000 Logs Viewer](https://github.com/vercel-labs/dev3000/raw/main/logs.jpg)

## クイックスタート

インストールと実行は以下のコマンドで行います。

```sh
pnpm install -g dev3000
dev3000
```

## AIとの連携

`dev3000` は、MCP（Model Context Protocol）サーバーを介してClaudeなどのAIツールと連携できます。

```sh
claude mcp add dev3000 http://localhost:3684/api/mcp/mcp
```

連携後、以下のようなプロンプトでデバッグを依頼できます。

```
Use your dev3000 tools to help debug my app
```

![dev3000 CLI](https://github.com/vercel-labs/dev3000/raw/main/www/public/cli.gif)

## 監視モード

`dev3000` には2つの監視モードがあります。

### 1. Playwrightによるブラウザ自動化（デフォルト）

デフォルトでは、Playwrightが制御するChromeインスタンスを起動し、包括的な監視を行います。

### 2. Chrome拡張機能

より軽量なアプローチとして、`dev3000` のChrome拡張機能をインストールし、既存のブラウザセッションを監視することも可能です。この場合、`--servers-only` フラグを付けて `dev3000` を起動します。

| 機能 | Playwright (デフォルト) | Chrome拡張機能 |
| :--- | :--- | :--- |
| **セットアップ** | 自動 | 手動インストールが必要 |
| **パフォーマンス** | 高いリソース使用量 | 軽量 |
| **ブラウザ制御** | 完全な自動化をサポート | 監視のみ |
| **UX** | 別のブラウザウィンドウ | 既存のブラウザ |
| **スクリーンショット** | イベント時に自動 | 拡張機能から手動 |
| **最適な用途** | 自動テスト、CI/CD | 開発時のデバッグ |

## オプション

`dev3000` は以下のコマンドラインオプションをサポートしています。

```
dev3000 [options]

  -p, --port <port>         Your app's port (default: 3000)
  --mcp-port <port>         MCP server port (default: 3684)
  -s, --script <script>     Package.json script to run (default: dev)
  --servers-only            Run servers only, skip browser launch (use with Chrome extension)
  --profile-dir <dir>       Chrome profile directory (default: /tmp/dev3000-chrome-profile)
```
