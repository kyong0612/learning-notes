# MCP サーバーの Streamable HTTP transport を試してみる

ref: <https://azukiazusa.dev/blog/mcp-server-streamable-http-transport/?ref=blog.lai.so>

## はじめに

Model Context Protocol (MCP) では、クライアントとサーバー間の通信トランスポートとして `stdio` と `Streamable HTTP` の2種類が定義されています。TypeScript SDK の v1.10.0 から `Streamable HTTP` トランスポートがサポートされたことを受け、この記事では MCP サーバーを構築し、この新しいトランスポート方式を試します。

## MCP トランスポートの概要

- **既存の課題:** 従来の `stdio` トランスポートは、認証仕様が未成熟でセキュリティ上の懸念があり、ユーザーが手動でパッケージをインストール・実行する必要がありました。
- **Streamable HTTP の登場:** 2025-03-26 バージョンの仕様で OAuth 2.1 ベースの認証仕様と HTTP ストリーミング通信が追加されました。これにより、リモートサーバーでの安全な運用が可能になります。
  - 認証の実装は必須ではありませんが、HTTP ベースのトランスポートでは推奨されています。
  - 旧仕様の HTTP + SSE トランスポートを置き換えるものです。
- **利点:**
  - セッション管理やステートフルなサーバーの構築が可能。
  - リモートサーバーでの実行が容易になり、セキュリティが向上。

## MCP サーバーの構築 (TypeScript + Express)

この記事では、TypeScript と Express を使用して MCP サーバーを構築する手順を解説します。

### 1. プロジェクトのセットアップ

- TypeScript プロジェクトを作成し、必要なパッケージ (`express`, `@modelcontextprotocol/server`) をインストールします。

### 2. ステートレスなサーバーの実装

- `/mcp` エンドポイントで POST リクエストを受け付け、MCP SDK の `transport.handleRequest` メソッドで処理します。
- シンプルな例として、サイコロを振るツール (`roll-dice`) を提供するサーバーを実装します。

```typescript
// src/index.ts (ステートレスサーバーの例 - 抜粋)
import express from 'express';
import { StreamableHttpTransport, ToolSchema, defineTool } from '@modelcontextprotocol/server';

const app = express();
app.use(express.json());

const transport = new StreamableHttpTransport({
  tools: [
    defineTool({
      name: 'roll-dice',
      // ... (ツールの定義)
      handler: async () => {
        const result = Math.floor(Math.random() * 6) + 1;
        return { result };
      },
    }),
  ],
});

app.post('/mcp', async (req, res) => {
  await transport.handleRequest({ body: req.body, headers: req.headers, res });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```

### 3. ステートフルなサーバーの実装

- `StreamableHttpTransport` のコンストラクタに `sessionManager` を渡すことで、セッション管理機能を有効にします。SDK はセッション状態の保存・復元を処理します。

```typescript
// src/index.ts (ステートフルサーバーの例 - 抜粋)
import { StreamableHttpTransport, InMemorySessionManager } from '@modelcontextprotocol/server';
// ... (他の import)

const sessionManager = new InMemorySessionManager(); // インメモリのセッションマネージャーを使用
const transport = new StreamableHttpTransport({
  // ... (ツールの定義)
  sessionManager,
});

// ... (Express の設定とエンドポイント)
```

## MCP クライアントの実装 (TypeScript)

サーバーの動作確認のため、TypeScript SDK を使用してクライアントを実装します。

### 1. プロジェクトのセットアップ

- 別の TypeScript プロジェクトを作成し、必要なパッケージ (`@modelcontextprotocol/client`) をインストールします。

### 2. クライアントの実装

- 標準入力からコマンド (`list-tools`, `call-tool`, `terminate-session`) を受け付けます。
- `StreamableHttpTransport` を初期化し、サーバーに接続します。
- `client.request` メソッドを使用してサーバーにリクエストを送信します。
  - ツール一覧取得: `method: 'tools/list'`
  - ツール実行: `method: 'tools/invoke'`, `params: { name: 'roll-dice' }`
- ステートフルな場合、`transport.sessionId` を保存し、リクエストヘッダー (`Mcp-Session-Id`) に含めて送信します (SDKが自動処理)。
- セッション終了には `transport.terminateSession()` を呼び出します。

```typescript
// src/client/index.ts (クライアントの例 - 抜粋)
import { StreamableHttpTransport, createClient } from '@modelcontextprotocol/client';
import readline from 'readline/promises';

const transport = new StreamableHttpTransport({ url: 'http://localhost:3000/mcp' });
const client = createClient({ transport });
let sessionId: string | undefined; // セッション ID を保持

async function main() {
  // ... (標準入力処理)

  if (!sessionId) {
    await client.connect(); // 初回接続
    sessionId = transport.sessionId; // セッション ID を取得・保存
    console.log(`Connected with session ID: ${sessionId}`);
  } else {
    // 既存のセッション ID を使用して transport を再初期化 (SDKがヘッダーを付与)
    transport.sessionId = sessionId;
  }

  // ... (listTools, callTool, terminateSession の実装)
}

// ... (listTools, callTool, terminateSession の詳細実装)

main();
```

### 実行例

- `list-tools`: サーバーが提供するツール (`roll-dice`) の一覧を表示。
- `call-tool`: サーバーの `roll-dice` ツールを実行し、結果を表示。
- `terminate-session`: サーバーとのセッションを終了。以降のリクエストはエラーとなる。

## まとめ

- MCP の `Streamable HTTP` トランスポートは、従来の `stdio` の課題を解決し、リモートサーバーでの安全かつ柔軟な運用を可能にします。
- TypeScript SDK を利用することで、ステートレスおよびステートフルな MCP サーバーとクライアントを容易に実装できます。
- セッション管理は SDK がサポートしており、`Mcp-Session-Id` ヘッダーを介して行われます。

## Streamable HTTP トランスポートの詳細解説

### Streamable HTTP トランスポートとは？

一言でいうと、**MCP (Model Context Protocol) における、より新しく、安全で、柔軟な通信方法（トランスポート）** のことです。

従来の MCP では、主に `stdio` (標準入出力) という方法でクライアント (例: あなたのPC上のエディタ) とサーバー (例: AIモデルを提供するサーバー) が通信していました。しかし、これにはいくつかの課題がありました。

### なぜ Streamable HTTP が必要になったのか？ (従来の stdio の課題)

1. **セキュリティ:** `stdio` は基本的にローカルマシン内でのプロセス間通信を想定しており、リモートサーバーとの安全な通信（特に認証）の仕組みが十分ではありませんでした。悪意のある第三者に通信を傍受されたり、不正に利用されたりするリスクがありました。
2. **利便性:** リモートの MCP サーバーを利用する場合、ユーザーは自分でサーバープログラムをダウンロードしてきて、手元で実行する必要があり、手間がかかりました。

これらの課題を解決するために、より現代的なウェブ技術に基づいた `Streamable HTTP` トランスポートが開発されました。

### Streamable HTTP の主な特徴と利点

1. **HTTP ストリーミングによる通信:**
    - `stdio` の代わりに、広く使われている **HTTP** を通信の基盤とします。
    - 特に **HTTP ストリーミング** という技術を使います。これは、サーバーからの応答を一度にすべて送り返すのではなく、**データが発生するたびに少しずつ、継続的にクライアントに送り続ける** ことができる通信方式です。これにより、リアルタイム性の高いやり取り (例: AIが思考中の経過を段階的に表示する) が効率的に行えます。
    - 身近な例でいうと、動画ストリーミングサービス (YouTubeなど) で動画が少しずつ読み込まれて再生されるのと似たような仕組みです。

2. **強化された認証:**
    - **OAuth 2.1** という標準的な認証プロトコルに基づいた仕組みが導入されました。これにより、**「誰が」サーバーにアクセスしようとしているのかを安全に確認** できるようになり、リモートサーバーとの通信が格段に安全になりました。

      **補足: 誰にとっての「安全」か？**

      この安全性向上は、主に以下の**両方の立場**にとってのメリットを指します。

      - **MCPサーバー提供者 (開発者):**
          - 不正アクセスやなりすましを防ぎ、サーバーリソースを保護します。
          - サービス提供の信頼性を向上させます。
      - **MCPクライアント利用者 (ユーザー):**
          - 通信の盗聴・改ざんを防ぎます。
          - なりすましサーバーへの接続リスクを低減します。
          - 安心してサービスを利用できます。

3. **セッション管理 (ステートフル通信):**
    - クライアントとサーバー間で **「会話の状態」を維持する** ことが可能になりました。これを **セッション管理** といいます。
    - 例えば、複数のやり取りを通じて文脈を維持する必要があるAIとの対話などで重要になります。`Streamable HTTP` では、`Mcp-Session-Id` という HTTP ヘッダーを使ってセッションを管理します。
    - これにより、サーバー側で「このクライアントは、さっきこんなことを言っていたな」という情報を保持できるようになり、より複雑で連続的な対話が可能になります。

4. **利便性の向上:**
    - 認証が強化されたことで、開発者は安全な MCP サーバーをリモートで公開しやすくなりました。ユーザーは、自分でサーバーをインストール・実行する手間なく、URL を指定するだけでリモートの MCP サービスを利用できるようになる可能性があります。

### まとめ (詳細解説)

`Streamable HTTP` は、MCP における通信方法の進化形です。

- **通信:** HTTP ストリーミングを使うことで、リアルタイムで効率的なデータ交換を実現します。
- **安全性:** OAuth 2.1 ベースの認証で、リモート通信のセキュリティを高めます。
- **柔軟性:** セッション管理により、文脈を維持した継続的な対話 (ステートフル通信) を可能にします。
- **利便性:** 開発者・ユーザー双方にとって、MCP サーバーの利用がより簡単・安全になります。

これにより、MCP を利用した AI ツールやサービスの開発・利用が、より安全かつ高度になることが期待されます。

## 参考

- 記事内で参照されているリンク (省略)

## 理解度チェック (記事より)

- **問題:** ステートフルなサーバーを実装する場合に、セッション ID を管理するために使用される HTTP ヘッダーは何ですか？
- **答え:** `Mcp-Session-Id`
