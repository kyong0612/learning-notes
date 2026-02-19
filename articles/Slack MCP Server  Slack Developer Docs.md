---
title: "Slack MCP Server | Slack Developer Docs"
source: "https://docs.slack.dev/ai/slack-mcp-server/"
author: "Slack"
published:
created: 2026-02-19
description: "Slack公式のMCPサーバーに関する開発者ドキュメント。MCPの概要、Slackが提供するMCPサーバーの機能（チャンネル検索、メッセージ送受信、Canvas管理、ユーザー管理）、認証方式、開発手順、利用可能なクライアントについて解説する。"
tags:
  - "MCP"
  - "Slack"
  - "AI"
  - "OAuth"
  - "API"
---

## MCPの概要

**Model Context Protocol（MCP）** は、AIエージェントが外部データ・ツール・サービスを一貫かつ安全に発見・利用するためのオープン標準。MCPは3つのコンポーネントで構成される。

| コンポーネント | 役割 |
|---|---|
| **MCP Server** | 外部ツールやデータソースへのゲートウェイ。APIラッパーとして機能し、クライアントに利用可能な操作を通知し、リクエストを実行する |
| **MCP Client** | ホスト側の通信ハンドラー。AIの内部リクエストを標準MCP形式に変換し、サーバーと1対1で接続する |
| **MCP Host** | ユーザー向けアプリケーション。ユーザー体験の管理とコミュニケーションフローの調整を担う |

### MCPとAPIの違い

| 観点 | API | MCP |
|---|---|---|
| 最適化対象 | ソフトウェア間通信、決定論的統合 | AIモデルとデータ間の通信、エージェント的インタラクション |
| 実装方法 | 開発者がドキュメントを読み、特定エンドポイントを呼び出すコードを記述 | エージェントが実行時にサーバーへ「どんなツールがあるか？」と問い合わせ可能。同じ入力でも実行ごとに異なる出力になりうる |
| 出力形式 | 機械可読（JSON）、エンティティID | 人間可読（Markdown）、エンティティ名がhydrateされた状態 |

---

## Slack MCPサーバーの機能

### チャンネル・ユーザー・メッセージの検索

- **チャンネル検索** — チャンネル名・説明でフィルタリング。メタデータ取得可能
- **ユーザー検索** — 名前（部分一致）・メール・ユーザーIDでフィルタリング。詳細情報やステータス取得可能
- **メッセージ・ファイル検索** — 日付・ユーザー・コンテンツタイプでフィルタリング

### メッセージの取得と送信

- **スレッド読み取り** — 完全なスレッド会話の取得
- **チャンネル読み取り** — チャンネルの完全なメッセージ履歴の取得
- **メッセージの下書き** — AIクライアント内でメッセージの作成・フォーマット・プレビュー
- **メッセージ送信** — Slack内の任意の会話にメッセージを送信

### Canvas管理

- **Canvas読み取り** — CanvasをMarkdownファイルとしてエクスポート
- **Canvas作成・更新** — リッチフォーマットのドキュメントを作成・共有

### ユーザー管理

- カスタムプロフィールフィールドやステータスを含む完全なユーザープロフィール情報へのアクセス

### ユースケース例

- Slackのコンテンツを外部AIエージェントに提供し、複数製品にまたがるプロジェクトの完全なコンテキストを与える
- Slack外のコンテンツをメッセージやCanvasを通じてSlackに取り込み、同僚と議論する
- チーム内のSlack履歴を検索し、質問への回答・過去の意思決定の発見・現在のプロジェクトへのコンテキスト提供を行うAIアシスタントを構築

---

## トランスポートプロトコルとエンドポイント

- **プロトコル**: JSON-RPC 2.0 over Streamable HTTP
- **エンドポイント**: `https://mcp.slack.com/mcp`
- SSEベースの接続やDynamic Client Registrationは**非対応**

---

## アプリIDの要件

MCPクライアントは登録済みのSlackアプリに紐づく固定アプリIDを持ち、ハードコードする必要がある。これにより以下が可能になる：

- 利用状況の可視化とサポートの提供
- ログ・レート制限・アクセス制御のためのリクエスト関連付け
- 管理者による標準的なSlackアプリ承認プロセスでの管理

**制限事項**: ディレクトリ公開アプリまたは内部アプリのみがMCPを使用可能。未掲載アプリは使用禁止。

---

## セキュリティに関する注意事項

- 他のMCPサーバーと同時に接続・利用する際は注意が必要。各サーバーは独自のセキュリティ・安定性・使用特性を持つ
- MCP活動は[監査ログ](https://docs.slack.dev/reference/audit-logs-api/methods-actions-reference/#mcp-server)で確認可能
- Slack Marketplaceに公開済みのアプリと内部アプリのみがMCPを使用可能

---

## 認証とトークン処理

Slackは**Confidential OAuth**をMCPクライアント向けにサポート。アプリの `client_id` と `client_secret` が必要。

### OAuthメタデータディスカバリー

MCPクライアントがOAuth 2.0 Authorization Server Metadata（RFC 8414）をサポートしている場合、以下のURLで自動検出可能：

- `https://mcp.slack.com/.well-known/oauth-authorization-server`
- `https://mcp.slack.com/.well-known/oauth-protected-resource`

> **注意**: PKCEサポートは近日対応予定。デスクトップクライアントでPKCEを使用する場合はSlackサポートへ連絡が必要。

### OAuthエンドポイント

| 用途 | URL |
|---|---|
| トークンエンドポイント（ユーザートークン） | `https://slack.com/api/oauth.v2.user.access` |
| 認可エンドポイント（ユーザートークン） | `https://slack.com/oauth/v2_user/authorize` |

### MCPツール別に必要なOAuthスコープ

| MCPツール | 必要なユーザースコープ |
|---|---|
| ユーザープロフィール/メール | `users:read`, `users:read.email` |
| Canvas作成・更新 | `canvases:read`, `canvases:write` |
| チャンネル/スレッド読み取り | `channels:history`, `groups:history`, `mpim:history`, `im:history` |
| メッセージ送信 | `chat:write` |
| ユーザー検索 | `search:read.users` |
| ファイル検索 | `search:read.files` |
| メッセージ/チャンネル検索 | `search:read.public`, `search:read.private`, `search:read.mpim`, `search:read.im` |

---

## 開発手順（Bolt for JavaScript テンプレート使用）

### 1. アプリの作成

[アプリ設定](https://api.slack.com/apps?new_app=1)から「From a manifest」を選択し、[テンプレートのmanifest.json](https://github.com/slack-samples/bolt-js-slack-mcp-server/blob/main/manifest.json)を使用。

アプリ設定のAgents & AI Appsセクションで **Model Context Protocol** を有効化する。

### 2. スコープの追加

OAuth & Permissionsで、使用するMCPツールに応じたユーザースコープを追加。

### 3. リダイレクトURLの追加

リダイレクトURLを登録。テスト用には[ngrok](https://ngrok.com/docs/what-is-ngrok#getting-started-expose)が推奨される。

```
https://<subdomain>.ngrok-free.app/slack/oauth_redirect
```

### 4. インストールと実行

```sh
git clone https://github.com/slack-samples/bolt-js-slack-mcp-server.git
cd bolt-js-slack-mcp-server
```

`.env.sample` を `.env` にリネームし、環境変数を設定。OpenAI APIキーも必要。

```sh
npm install
npm start
```

### 5. イベントサブスクリプションの更新

Event SubscriptionsのURLを更新：

```
https://<subdomain>.ngrok-free.app/slack/events
```

### MCPサーバーの呼び出し例

**OpenAI（テンプレートアプリでの例）:**

```js
const llmResponse = await openai.responses.create({
    model: 'gpt-4o-mini',
    input: `System: ${DEFAULT_SYSTEM_CONTENT}\n\n${parsedThreadHistory}\nUser: ${message.text}`,
    tools: [
        {
            type: 'mcp',
            server_label: 'slack',
            server_url: 'https://mcp.slack.com/mcp',
            headers: {
                Authorization: `Bearer ${context.userToken}`,
            },
            require_approval: 'never',
        },
    ],
    stream: true,
});
```

**Anthropic:**

```js
const response = await client.beta.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: DEFAULT_SYSTEM_CONTENT,
    messages: [
        ...parsedThreadHistory,
        { role: "user", content: message.text }
    ],
    mcp_servers: [
        {
            type: 'url',
            url: `https://mcp.slack.com/mcp`,
            name: 'slack',
        }
    ],
});
```

---

## 利用可能なクライアント

コーディング不要でSlack MCPサーバーにアクセスできるパートナーアプリケーション：

- [Cursor](https://cursor.com/)
- [Perplexity](https://perplexity.ai/)
- [Claude Code](https://code.claude.com/)
- [Claude.ai](https://claude.ai/)

---

## 関連リソース

- [AI機能を持つアプリの開発ドキュメント](https://docs.slack.dev/ai/developing-ai-apps)
- [Real Time Search API](https://docs.slack.dev/apis/web-api/real-time-search-api) — AIに接続せずにSlackデータを検索するためのAPI
