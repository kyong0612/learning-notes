---
title: "MCP を介した Crashlytics の AI アシスタント  |  Firebase Crashlytics"
source: "https://firebase.google.com/docs/crashlytics/ai-assistance-mcp?hl=ja&authuser=0#claude"
author:
  - "[[Firebase]]"
published:
created: 2025-11-18
description: |
  Model Context Protocol（MCP）を介して Firebase Crashlytics の AI アシスタンス機能を使用するための包括的なガイド。Gemini CLI、Claude Code、Cursor などの MCP 対応 AI 開発ツールで Crashlytics データと対話し、問題の管理、優先順位付け、デバッグ、修正を効率化する方法を説明。Firebase MCP サーバーの設定方法、crashlytics:connect コマンドを使ったガイド付きワークフロー、自由形式の会話型デバッグ、利用可能な MCP ツールのリファレンスを含む。試験運用版機能。
tags:
  - "MCP"
  - "Crashlytics"
  - "AI"
  - "Firebase"
  - "デバッグ"
  - "Model Context Protocol"
  - "clippings"
---

# MCP を介した Crashlytics の AI アシスタント

## 概要

**試験運用版:** Crashlytics の MCP 機能は試験運用版です。そのため、SLA または非推奨ポリシーの対象ではなく、下位互換性のない方法で変更される可能性があります。

Firebase Crashlytics MCP ツールとプロンプトを使用すると、Gemini CLI、Claude Code、Cursor などの MCP 対応の AI 搭載開発ツールを使用して Crashlytics データとやり取りできます。これらの Crashlytics MCP ツールとプロンプトは、AI ツールに重要なコンテキストを提供し、問題の管理、優先順位付け、デバッグ、修正を支援します。

**重要:** 現在利用可能な Crashlytics MCP ツールとプロンプトは、すでに Crashlytics を使用しているアプリで使用するためのものです。

### MCP とは

[Model Context Protocol（MCP）](https://modelcontextprotocol.io/about)は、AI ツールが外部のツールやデータソースにアクセスするための標準化された方法です。

## Firebase MCP サーバーの設定

### 前提条件

環境が次の要件を満たしていることを確認します。

* [Node.js](https://www.nodejs.org/) と npm が正常にインストールされていること。Node.js をインストールすると、npm コマンドツールが自動的にインストールされます。
* AI 搭載の開発ツールが MCP インテグレーションをサポートしていること。

Unity プロジェクトと連携している場合は、[Crashlytics MCP ツールとプロンプトが読み込まれない](#crashlytics-mcp-ツールとプロンプトが読み込まれない)をご覧ください。

### 各 AI ツールの設定方法

#### Gemini CLI / Gemini Code Assist

Firebase Extensions をインストールすることをおすすめします。

```bash
gemini extensions install https://github.com/gemini-cli-extensions/firebase/
```

Firebase Extensions をインストールすると、Firebase MCP サーバーが自動的に構成されます。

手動設定する場合は、`.gemini/settings.json` または `~/.gemini/settings.json` に以下を追加：

```json
{
  "mcpServers": {
    "firebase": {
      "command": "npx",
      "args": ["-y", "firebase-tools@latest", "mcp"]
    }
  }
}
```

#### Firebase Studio

`.idx/mcp.json` を編集または作成：

```json
{
  "mcpServers": {
    "firebase": {
      "command": "npx",
      "args": ["-y", "firebase-tools@latest", "mcp"]
    }
  }
}
```

#### Claude Code

アプリフォルダで次のコマンドを実行：

```bash
claude mcp add firebase npx -- -y firebase-tools@latest mcp
```

インストール確認：

```bash
claude mcp list
```

#### Claude Desktop

`claude_desktop_config.json` を編集（Claude > 設定 > 開発者 > 構成を編集）：

```json
{
  "mcpServers": {
    "firebase": {
      "command": "npx",
      "args": ["-y", "firebase-tools@latest", "mcp"]
    }
  }
}
```

#### Cline

`cline_mcp_settings.json` を編集（MCP サーバー アイコン > MCP サーバーを構成）：

```json
{
  "mcpServers": {
    "firebase": {
      "command": "npx",
      "args": ["-y", "firebase-tools@latest", "mcp"],
      "disabled": false
    }
  }
}
```

#### Cursor

[インストールボタン](https://cursor.com/en/install-mcp?name=firebase&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsImZpcmViYXNlLXRvb2xzQGxhdGVzdCIsIm1jcCJdfQ==)をクリックするか、手動で設定：

* **特定のプロジェクト**: `.cursor/mcp.json` を編集
* **すべてのプロジェクト（グローバル）**: `~/.cursor/mcp.json` を編集

```json
"mcpServers": {
  "firebase": {
    "command": "npx",
    "args": ["-y", "firebase-tools@latest", "mcp"]
  }
}
```

#### VS Code Copilot

単一プロジェクト: `.vscode/mcp.json`

```json
"servers": {
  "firebase": {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "firebase-tools@latest", "mcp"]
  }
}
```

すべてのプロジェクト: ユーザー設定を編集

```json
"mcp": {
  "servers": {
    "firebase": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "firebase-tools@latest", "mcp"]
    }
  }
}
```

#### Windsurf

`~/.codeium/windsurf/mcp_config.json` を編集：

```json
"mcpServers": {
  "firebase": {
    "command": "npx",
    "args": ["-y", "firebase-tools@latest", "mcp"]
  }
}
```

**注:** Firebase MCP サーバーは MCP ツールを呼び出す際、そのサーバーが実行されている環境で Firebase CLI を認証するのと同じユーザー認証情報を使用します。環境に応じて、ログイン ユーザーまたは[アプリケーションのデフォルト認証情報](https://cloud.google.com/docs/authentication/application-default-credentials?authuser=0&hl=ja)が使用されます。

## crashlytics:connect によるガイド付きワークフロー（推奨）

Crashlytics は、アプリの Crashlytics の問題の優先順位付けと修正に役立つ、会話型で柔軟なガイド付きワークフローを提供します。たとえば、AI ツールにより、問題の取得、問題の説明、考えられる修正の特定、さらにはコードの変更が行われます。

このガイド付きワークフローは、`crashlytics:connect` MCP コマンドで使用できます。

**注:** すべての AI ツールがこのような MCP コマンドをサポートしているわけではありませんが、引き続き、[自由形式の会話を使用して問題をデバッグ](#自由形式の会話型デバッグ)できます。

### コマンドにアクセスして使用する

1. まだ行っていない場合は、[Firebase MCP サーバーを設定](#firebase-mcp-サーバーの設定)してから、AI ツールを起動します。
2. `crashlytics:connect` MCP コマンドを実行します。

   ほとんどの AI ツールでは、このワークフローに簡単にアクセスする方法が用意されています。たとえば、Gemini CLI を使用している場合は、スラッシュ コマンド `/crashlytics:connect` を実行します。
3. AI ツールを使用して、Crashlytics の問題の優先順位付けと修正を行います。たとえば、次のようにします。

   * 優先度の高い問題のリストを表示します。
   * ID または URL を指定して、特定の問題をデバッグします。
   * クラッシュに関する詳細情報をリクエストします。
   * 提案された根本原因の推論をエージェントに尋ねます。

## 自由形式の会話型デバッグ

[`crashlytics:connect` によるガイド付きワークフロー](#crashlyticsconnect-によるガイド付きワークフロー推奨)を使用してデバッグを最適に行うことをおすすめしますが、Crashlytics MCP ツールにアクセスできる AI ツールとの自由形式の会話を使用して問題をデバッグすることもできます。これは、MCP プロンプト（スラッシュ コマンドやカスタム コマンドとも呼ばれます）をまだサポートしていない AI ツールでは特に重要です。

[Firebase MCP サーバーを設定](#firebase-mcp-サーバーの設定)したら、次の例をお試しください。

### 問題とクラッシュのコンテキストを取得する

AI ツールが Crashlytics MCP ツールにアクセスできる場合、ユーザー数やイベント数、スタック トレース、メタデータ、アプリのバージョン情報など、Crashlytics の重要な問題データを取得できます。

**プロンプトの例:**

* `A customer reported an issue during login when using our latest release. What Crashlytics issues do I have that could be related to this login trouble?`

  * この質問に答えるために、AI ツールはおそらくコードを読み取ってログインが発生する場所を把握し、さまざまな Crashlytics MCP ツールを使用して問題データを取得します。その後、AI ツールは、ログインフローに関連する問題が最新バージョンに存在するかどうかを判断しようとします。

* `The previous on-call engineer was investigating issue abc123 but wasn't able to resolve it. She said she left some notes -- let's pick up where she left off.`

  * この質問に答えるために、AI ツールはさまざまな Crashlytics MCP ツールを使用して、問題のコンテキストと問題に投稿されたメモを取得します。また、問題の調査を再開するために、クラッシュの例を取得することもあります。

### デバッグ調査を文書化する

問題のデバッグを行う際は、自分自身やチームのために記録を保持すると役立つことがよくあります。Crashlytics は Firebase コンソールでこの機能を提供しています。また、Crashlytics MCP ツールを搭載した AI ツールは、たとえば、調査の要約、有用なメタデータ（Jira や GitHub の問題へのリンクなど）を含むメモの追加、問題の修正後のクローズなどにも役立ちます。

**プロンプトの例:**

* `Add a note to issue abc123 summarizing this investigation and the proposed fix.`
* `We weren't able to get to the bottom of this issue today, summarize what we learned and attach it to issue abc123 to pick back up later.`
* `Close issue abc123 and leave a note including the link to the PR that fixed the issue.`

## Crashlytics MCP ツールのリファレンス

次の表に、Firebase MCP サーバーから使用できる Crashlytics MCP ツールを示します。

[Firebase MCP サーバーを設定](#firebase-mcp-サーバーの設定)すると、AI ツールでこれらの MCP ツールを使用して、問題の把握、デバッグ、管理を行うことができます。これらの MCP ツールは、`crashlytics:connect` ガイド付きワークフローと AI ツールとの自由形式の会話の両方で使用されます。

ほとんどのユースケースでは、これらの MCP ツールは LLM 専用であり、人間のデベロッパーが直接使用するものではありません。LLM は、AI ツールとのやり取りに基づいて、これらの MCP ツールを使用するタイミングを決定します。

**注:** この情報は、次のコマンドを使用して表示することもできます。`npx firebase-tools@latest mcp --generate-tool-list`

### Crashlytics の問題を管理する

| ツール名 | 特徴グループ | 説明 |
| --- | --- | --- |
| crashlytics_create_note | crashlytics | Crashlytics の問題にメモを追加します。 |
| crashlytics_delete_note | crashlytics | Crashlytics の問題のメモを削除します。 |
| crashlytics_update_issue | crashlytics | Crashlytics の問題の状態を更新します。 |

### Crashlytics データを取得する

| ツール名 | 特徴グループ | 説明 |
| --- | --- | --- |
| crashlytics_get_issue | crashlytics | Crashlytics の問題のデータを取得します。このデータをデバッグの出発点として使用できます。 |
| crashlytics_list_events | crashlytics | 指定されたフィルタに一致する最新のイベントを一覧表示します。問題のサンプル クラッシュと例外を取得するために使用できます。これには、スタック トレースやデバッグに役立つその他のデータが含まれます。 |
| crashlytics_batch_get_events | crashlytics | リソース名で特定のイベントを取得します。問題のサンプル クラッシュと例外を取得するために使用できます。これには、スタック トレースやデバッグに役立つその他のデータが含まれます。 |
| crashlytics_list_notes | crashlytics | Crashlytics の問題のすべてのメモを一覧表示します。 |
| crashlytics_get_top_issues | crashlytics | イベントと影響を受けた個別のユーザーの数を、*問題*別にグループ化してカウントします。グループはイベント数の降順で並べられます。指定されたフィルタに一致するイベントのみがカウントされます。 |
| crashlytics_get_top_variants | crashlytics | イベントと影響を受けた個別のユーザーの数を、問題の*バリアント*別にグループ化してカウントします。グループはイベント数の降順で並べられます。指定されたフィルタに一致するイベントのみがカウントされます。 |
| crashlytics_get_top_versions | crashlytics | イベントと影響を受けた個別のユーザーの数を、*バージョン*別にグループ化してカウントします。グループはイベント数の降順で並べられます。指定されたフィルタに一致するイベントのみがカウントされます。 |
| crashlytics_get_top_apple_devices | crashlytics | イベントと影響を受けた個別のユーザーの数を、Apple *デバイス*別にグループ化してカウントします。グループはイベント数の降順で並べられます。指定されたフィルタに一致するイベントのみがカウントされます。iOS、iPadOS、MacOS アプリケーションが対象です。 |
| crashlytics_get_top_android_devices | crashlytics | イベントと影響を受けた個別のユーザーの数を、Android *デバイス*ごとにグループ化してカウントします。グループはイベント数の降順で並べられます。指定されたフィルタに一致するイベントのみがカウントされます。Android アプリケーションにのみ関連します。 |
| crashlytics_get_top_operating_systems | crashlytics | イベントと影響を受けた個別のユーザーの数を、*オペレーティング システム*別にグループ化してカウントします。グループはイベント数の降順で並べられます。指定されたフィルタに一致するイベントのみがカウントされます。 |

## その他の情報

### データの使用方法

データ ガバナンスは、使用する AI 搭載の開発ツールによって決定され、その AI ツールで定義された条件が適用されます。

### 料金

Firebase では、Crashlytics MCP ツールとプロンプトの使用や、公開 API からの Crashlytics データの取得に対して料金は発生しません。

費用は、使用する AI 搭載の開発ツールによって決まります。AI ツールで使用される Crashlytics データの量によって決まる場合もあります。Firebase には、コンテキストに読み込まれるデータ量を明示的に制御する方法はありませんが、モデルに適切なデフォルトのガイダンスが用意されています。

## トラブルシューティングとよくある質問

### Crashlytics MCP ツールとプロンプトが読み込まれない

Firebase MCP サーバーは、インストールされている依存関係を検査して、コードベースが Crashlytics を使用しているかどうかを認識しようとします。この機能は Unity プロジェクトではまだサポートされておらず、他のプラットフォーム用の一部の非標準の依存関係管理システムは対象外です。

Crashlytics MCP ツールとプロンプトが読み込まれない場合は、回避策として、Firebase MCP サーバーを手動でインストールし、`--only crashlytics` 引数を使用して Crashlytics MCP ツールとプロンプトを読み込むことができます。

---

**最終更新日:** 2025-11-18 UTC
