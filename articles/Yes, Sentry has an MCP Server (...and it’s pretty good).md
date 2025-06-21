---
title: "Yes, Sentry has an MCP Server (...and it's pretty good)"
source: "https://blog.sentry.io/yes-sentry-has-an-mcp-server-and-its-pretty-good/"
author:
  - "Cody De Arkland"
published: 2025-06-10
created: 2025-06-21
description: |
  Sentryが提供するMCP（Model Context Protocol）サーバーについて解説。MCPの概要、SentryのMCPサーバーの特長（リモートホスト、OAuthサポート、ツールコールなど）、そしてLLMのコンテキスト拡張におけるその重要性を説明します。
tags:
  - "MCP"
  - "Sentry"
  - "AI"
  - "Observability"
  - "Ecosystem"
---

![Yes, Sentry has an MCP Server (...and it's pretty good)](https://images.ctfassets.net/em6l9zw4tzag/6GazyjpeW0KYN3VNSFxETJ/478c4ade7d3950b35f3e45780dbad131/Code-Cov-Test-Analytics.jpg?w=630&h=236&q=50&fm=webp)

## 概要

AI分野で注目を集める**MCP (Model Context Protocol)** は、LLMとの対話に外部コンテキストを標準化して取り込むためのオープンプロトコルです。多くのエディタやLLMプロバイダーが対応を進める中、Sentryも公式にMCPサーバーを提供開始しました。このサーバーは、[mcp.sentry.dev](https://mcp.sentry.dev/) から直接、または[公式ドキュメント](https://docs.sentry.io/product/sentry-mcp/)を通じて利用可能です。

SentryのMCPサーバーは以下の最新機能をサポートしています。

- **リモートホスト型（推奨）とローカルSTDIOモード**: 利便性が高く、常に最新機能を利用できるリモートホスト型を推奨。
- **OAuthサポート**: 既存のSentry組織アカウントで安全にログイン可能。
- **Streamable HTTP**: クライアントが未対応の場合はSSE（Server-Sent Events）に自動でフォールバック。
- **16種類のツールコール**: プロジェクト情報、課題の検索・作成、DSNの管理に加え、SentryのAIエージェント**Seer**を呼び出して根本原因の特定や修正を行うことが可能。

### 設定方法

OAuthをサポートするほとんどのプロバイダーでは、以下の設定をMCP設定ファイルに追加することで利用できます。

```javascript
{
 "mcpServers": {
   "Sentry": {
     "url": "https://mcp.sentry.dev/mcp"
   }
 }
}
```

OAuth未対応のクライアントの場合は、従来のnpx経由での設定も引き続き利用可能です。

```javascript
{
  "mcpServers": {
    "sentry": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote@latest",
        "https://mcp.sentry.dev/mcp"
      ]
    }
  }
}
```

設定後、OAuth認証を行うと、LLM内でSentryのツールが利用可能になります。

![](https://images.ctfassets.net/em6l9zw4tzag/4xrVb48B4wpK5poyO0JaiQ/5d6d0ccbcd4728cd1cbfb2cae173ab6c/image2.png?w=349&h=156&q=50&fm=webp)

## なぜSentryはMCPサーバーを構築したのか？

アプリケーションの障害発生時、エラーの背景にあるコンテキスト（コードの場所、パフォーマンスの問題点など）は極めて重要です。MCPは、その重要なコンテキストをLLMに提供するための架け橋となります。

SentryはMCPサーバーを構築するにあたり、以下の要件を重視しました。

1. **低フリクションなサービス提供**: ユーザーができるだけ簡単に利用できること。
2. **OAuthサポート**: APIトークン管理の手間を省き、安全な認証を実現すること。
3. **スケーラビリティ**: 大規模なユーザー負荷に対応できること。

これらの要件を満たすため、SentryはCloudflareの技術（Workers, Durable Objects, OAuthプロバイダーライブラリ）を活用し、スケーラブルなリモートホスト型ソリューションを迅速に構築しました。

## なぜコンテキストが重要か？

LLMは学習データに含まれない最新の情報（例: ライブラリの最新バージョン）を知らないため、そのままでは古い情報に基づいた回答を生成しがちです。MCPのツールコールは、外部からリアルタイムで正確な情報をLLMに提供し、この問題を解決します。

MCPツールコールの例:

```javascript
const server = new MCPServer({
  name: "Sentry",
  version: "1.0.0"
})

server.tool(
  "list_projects",
  "This call finds all the projects that are available to a user's organization in Sentry",
  {
    organization_slug: z
      .string()
      .describe("The slug of the organization to list projects from")
  },
  async ({ organization_slug }: { organization_slug: string }) => {
    const apiUrl: string = `https://sentry.io/api/0/organizations/${organization_slug}/projects/`
    // fetch call to get results, parse them out, dump them into a response
    return response 
  }
)
```

このツールは、LLMがユーザーのSentryプロジェクト一覧を把握できるようにします。単純な情報取得に見えますが、ツールコールは連鎖させて使用されることが多く、例えばSentryのAIエージェント「Seer」による課題修正を実行するには、複数のツールコールを組み合わせて必要なコンテキストを収集する必要があります。

![ツールコール連鎖の図](https://images.ctfassets.net/em6l9zw4tzag/2qgV1rASJtcViFeMwobyAZ/311df19f6a5fd972f3f0dfbea4a06ae7/image1.png?w=500&h=151&q=50&fm=webp)

MCPは、複数のプラットフォームからコンテキストを統合する「つなぎ合わせる層」として機能し、LLMが不正確な推測（ハルシネーション）をすることを防ぎます。

## Sentry MCPとSeerの使い分け

Sentry MCPとAIエージェントSeerは、どちらもAIを活用したツールですが、目的が異なります。

- **Sentry MCP**: デバッグ自体が目的ではなく、外部ソースから**コンテキストをLLMに取り込む**ためのプロトコル。
- **Seer**: アプリケーションの**破壊原因を理解し、修正策を提案する**ために特化して構築されたAIエージェント。

両者は補完的な関係にあり、MCPを通じてSeerの分析処理をキックすることも可能です。これらは異なる問題を解決するための、異なるツールです。

![Seerのダッシュボード画面](https://images.ctfassets.net/em6l9zw4tzag/1Z2h35i8MYY0oJceeIQeB3/97d15f917ea41bf86455f57a2b05db0a/image3.jpg?w=500&h=253&q=50&fm=webp)

## 今後の展望

MCPはまだ発展途上のプロトコルであり、課題も存在しますが、その人気と機能は急速に拡大しています。Sentryは、ユーザーがMCPを使ってどのようなワークフローを実現したいかを学習し、初期設定から課題調査、自動解決に至るまで、サービスの改善を続けていく方針です。

問題を発見した場合は、[GitHubプロジェクト](https://github.com/getsentry/sentry-mcp/issues)へのフィードバックが歓迎されています。
