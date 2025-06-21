---
title: "An Introduction to MCP and Authorization | Auth0"
source: "https://auth0.com/blog/an-introduction-to-mcp-and-authorization/"
author:
  - "Juan Cruz Martinez"
published: 2025-04-07
created: 2025-06-21
description: |
  Discover the Model Context Protocol (MCP) and its authorization mechanisms. Learn how to use API keys, OAuth 2.1 implementation, and best practices for secure LLM API connections.
tags:
  - "mcp"
  - "oauth"
  - "authorization"
  - "api-security"
---

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction)は、GPT、Gemini、Claudeのような大規模言語モデル（LLM）を、標準化され、安全で、再利用可能な方法で外部ツールやAPIに接続するメカニズムとして注目を集めています。

## MCPとは？

MCPは、LLMにツールや関数という形でAPIを提供する普遍的な翻訳レイヤーと考えることができます。LLMは言語処理に優れていますが、GitHubやデータベース、ローカルファイルシステムといったサービスと対話するために必要な特定のAPIをネイティブに理解しているわけではありません。MCPは、各ツールの個別のAPIに精通していなくても、LLMがこれらのサービスにアクセスするための標準プロトコルを提供します。

MCPの仕組みをより深く理解するために、その構成要素と相互作用を見ていきましょう。

* **MCP Host**: Claude Desktop、Cursor IDEなど、MCPを通じてデータアクセスを必要とするプログラム。
* **MCP Client**: MCPホスト上で動作し、各クライアントはMCPサーバーと1対1の関係を維持します。
* **MCP Servers**: ホストが呼び出したいツールを実行するサーバー。ローカルまたはリモートでホスト可能です。
* **Local Data Sources**: ローカルで実行されているMCPサーバーがアクセスできる、ファイルやデータベースなどのローカルリソース。
* **Remote Services**: Auth0 API、Google Calendar APIなど、インターネット経由で利用可能な外部システム。

![MCP Components](https://images.ctfassets.net/23aumh6u8s0i/79D5KEvCRl8L4LsAqsKf8X/a7d0e9c5da60ef630661c17130370010/Uploaded_from_MCP_Leadership_Blog)

## MCPの仕組み

MCPの基本的な考え方と構成要素を理解したところで、ホストから基盤となるサービスへ、そして再びホストへという流れでMCPがどのように機能するかを見ていきましょう。

### MCPホストとクライアント

すべてを開始するのはMCPホストです。JSON形式で指定されたMCPサーバーの定義をインポートすることから始まります。

設定例：

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/Desktop",
        "/Users/username/Downloads"
      ]
    }
  }
}
```

この設定により、ホストは`server-filesystem` MCPサーバーを介してユーザーのデスクトップとダウンロードフォルダにアクセスできるクライアントを初期化します。

### トランスポート

MCPのトランスポートは、クライアントとサーバー間の通信手段を提供します。現在、以下の3つのタイプが利用可能です。

1. **Stdio (標準入出力)**: 入出力ストリームを介した通信。ローカル統合やコマンドラインツールに有用です。

    ```js
    const server = new Server({
      name: "my-mcp-server",
      version: "1.0.0"
    });

    const transport = new StdioServerTransport();
    await server.connect(transport);
    ```

2. **SSE (サーバーセントイベント)**: HTTP POSTストリーミングリクエストを介した通信。

    ```js
    const app = express();

    const server = new Server({
      name: "my-mcp-server",
      version: "1.0.0"
    });

    let transport: SSEServerTransport | null = null;

    app.get("/sse", (req, res) => {
      transport = new SSEServerTransport("/messages", res);
      server.connect(transport);
    });

    app.post("/messages", (req, res) => {
      if (transport) {
        transport.handlePostMessage(req, res);
      }
    });

    app.listen(3000);
    ```

3. **カスタムトランスポート**: 開発者は、特定の要件に合わせて独自のトランスポートを定義できます。

    ```js
    interface Transport {
      start(): Promise<void>;
      send(message: JSONRPCMessage): Promise<void>;
      close(): Promise<void>;
      onclose?: () => void;
      onerror?: (error: Error) => void;
      onmessage?: (message: JSONRPCMessage) => void;
    }
    ```

### MCPサーバー

MCPサーバーは、LLMのリクエストに代わってクライアントから送信されたメッセージを受信・処理し、結果をストリーム/出力します。サーバーは以下の3つの機能を提供できます。

* **Resources**: クライアントが読み取り、LLMの対話のコンテキストとして使用できるデータやコンテンツ（ファイル内容、DBレコードなど）を公開します。
* **Prompts**: クライアントがユーザーやLLMをガイドするために使用できる、再利用可能なプロンプトテンプレートやワークフローを定義します。
* **Tools**: 実行可能な機能をクライアントに公開します。これにより、LLMは外部システムと直接対話し、計算を実行し、実世界にアクセスできます。

### 最初のMCPサーバーを作成する

SSEサーバーとして、ランダムな犬の画像を取得するツールを持つMCPサーバーを構築する例です。

```js
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse";
import express from "express";
import { z } from "zod";

const server = new McpServer({
  name: "My Super Cool Thursday MCP Demo Server",
  version: "1.0.0",
});

// 犬種を引数として受け取るツールを定義
server.tool("getRandomDogImage", { breed: z.string() }, async ({ breed }) => {
  const response = await fetch(
    `https://dog.ceo/api/breed/${breed}/images/random`,
  );
  const data = await response.json();
  return {
    content: [
      { type: "text", text: `Your dog image is here: ${data.message}` },
    ],
  };
});

const app = express();
let transport: SSEServerTransport | null = null;

app.get("/sse", (req, res) => {
  transport = new SSEServerTransport("/messages", res);
  server.connect(transport);
});

app.post("/messages", (req, res) => {
  if (transport) {
    transport.handlePostMessage(req, res);
  }
});

app.listen(3000);
console.log("Server is running on http://localhost:3000/sse");
```

このサーバーを実行し、MCPクライアントで `http://localhost:3000/sse` を設定すると、ツールが利用可能になります。

![MCP Server in Action](https://images.ctfassets.net/23aumh6u8s0i/4D2D0eK5cwEsEggmAdXLl/6cc12f781db2db164a40f07d4a781eac/Uploaded_from_MCP_Leadership_Blog)

## MCPのライフサイクル

プロンプトからレスポンスまでのライフサイクルは、接続とメッセージングの2つのフローに分かれます。

### 接続ライフサイクル

1. MCPホストが設定を読み込み、サーバーに`initialize`リクエストを送信。
2. サーバーがプロトコルバージョンと能力（利用可能なツールなど）を応答。
3. クライアントが`initialized`通知を送信。
4. 接続が使用可能になる。

### メッセージングライフサイクル

1. ユーザーがプロンプトを送信すると、LLMがツールコールが必要かを判断。
2. MCPクライアントがツールの実行とパラメータをサーバーに送信。
3. サーバーがリクエストを処理し、結果をクライアントに返す。
4. ホストがツールの応答をLLMのコンテキストとマージし、最終的な応答をユーザーに表示。

## MCPにおける認可

これまでの例では認可は考慮されていませんでしたが、認可が必要なリモートサービスにアクセスする場合はどうすればよいでしょうか。

### APIキーとシークレットによる認可

APIキーは、APIへのリクエストを認証・認可するための単純な文字列トークンです。環境変数などを通じてMCPクライアント起動時にサーバーに渡すことができます。

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

**この方法は、stdioトランスポートを使用するMCPサーバーにのみ推奨されます。**

### OAuth 2.1

2025年3月、MCP仕様はOAuth 2.1を使用した認可を標準化する大きな一歩を踏み出しました。これにより、MCPクライアントとサーバーは認可を委任できます。

新仕様がもたらす主な機能：

1. **ビルトインセキュリティベースライン (PKCE)**: 全クライアントにPKCEを義務付けることで、セキュリティレベルが向上します。
    ![MCP PKCE Flow](https://images.ctfassets.net/23aumh6u8s0i/1b72nvwiL3ZdrozyRmeUVj/6aca35623a9f2c7fe2833a9e9a5e0377/mcp-3__1_.png)
2. **簡素化された接続 (メタデータディスカバリ)**: サーバーが自身のOAuthエンドポイントを自動的に広告できるようにし、手動設定を削減します。
    ![MCP metadata discovery flow](https://images.ctfassets.net/23aumh6u8s0i/4ns7l1655tx1zC85oNYWGl/a522b234cceddb564c55b5a0be573b93/Uploaded_from_MCP_Leadership_Blog)
3. **シームレスなオンボーディング (動的クライアント登録 - DCR)**: MCPクライアントが未知のMCPサーバーにプログラム的に自己登録できるようにし、ユーザーの手間を省きます。
    ![MCP DCR Flow](https://images.ctfassets.net/23aumh6u8s0i/2jJjihIQD9tx1jQk71vnTM/20e968f6f3ebb23124f6762db8160b2d/Uploaded_from_MCP_Leadership_Blog)
4. **既存のIDインフラの活用 (サードパーティ認証)**: MCPサーバーが実際のユーザーログインプロセスを信頼できる第三者のIDプロバイダー（Auth0など）に委任するフローを明示的にサポートします。

認可フローの概要：
![MCP OAuth Flow](https://images.ctfassets.net/23aumh6u8s0i/SThohuyEi51pqc2l0dbyt/27aa3ea282d2c66e280a8633b33c2d88/Uploaded_from_MCP_Leadership_Blog)

## 今後の展望

新仕様はOAuth 2.1を導入しましたが、現状ではMCPサーバーが**リソースサーバーと認可サーバーの両方**として定義されています。この設計は、開発者がディスカバリ、登録、トークンエンドポイントを自ら実装する必要があるため、負担が大きいという課題があります。

### 現在の制限

* MCPサーバーはトークン処理のためのストレージが必要になる。
* MCPサーバーは重要なインフラの一部となり、多くのセキュリティ要件を満たす必要がある。
* 第三者トークンの検証責任を負うことになり、これは非推奨なプラクティスである。

この問題に対処するため、MCPにおける認可の将来像について[議論が進行中](https://github.com/modelcontextprotocol/specification/issues/205)です。

## 結論

MCPが成長し続ける中で、開発者がより安全で信頼性の高い製品を構築できるよう、強力でセキュアな標準を確立することが重要です。Auth0は[Auth for GenAI](http://a0.to/ai-content)を通じて、セキュアなAIアプリケーションとサービスの構築を支援することに深くコミットしています。
