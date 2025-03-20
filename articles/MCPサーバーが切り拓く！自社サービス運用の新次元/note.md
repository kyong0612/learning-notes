# MCPサーバーが切り拓く！自社サービス運用の新次元

ref: # <https://www.m3tech.blog/entry/future-with-mcp-servers>

## 1. MCPとは（ざっくり）

MCP（Model Context Protocol）は、Anthropic社によって策定されたAIエージェントが外部サービスから情報を参照したり連携するためのプロトコルです。「MCPサーバー」はGitHubやPostgreSQLなどのリソースをMCPプロトコルで利用できるようにするプロキシのようなサーバーです。Claude DesktopやCursorなどのMCPクライアントはこれらのサーバーを利用してナレッジの参照やプルリクエストの作成などが行えます。

## 2. MCPサーバーの実装方法

MCPサーバーの実装にはPythonとTypeScriptのSDKが提供されています。以下は基本的な実装例です：

```javascript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListResourcesRequestSchema, ReadResourceRequestSchema } from "@modelcontextprotocol/sdk/server/schemas.js";

const server = new Server({
  name: "example-server",
  version: "1.0.0",
}, {
  capabilities: {
    resources: {}
  }
});

// リソースの一覧を提供するハンドラー
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "file:///example.txt",
        name: "Example Resource",
      },
    ],
  };
});

// 特定のリソースの内容を提供するハンドラー
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  if (request.params.uri === "file:///example.txt") {
    return {
      contents: [
        {
          uri: "file:///example.txt",
          mimeType: "text/plain",
          text: "This is the content of the example resource.",
        },
      ],
    };
  } else {
    throw new Error("Resource not found");
  }
});

// サーバーの起動
const transport = new StdioServerTransport();
await server.connect(transport);
```

## 3. 技術検証：Q&A検索機能の実装

社内システムでのMCP活用可能性を探るため、遠隔健康医療相談サービス「AskDoctors」のQ&A検索機能をMCPサーバーとして実装する検証が行われました。以下はその実装例です：

```javascript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import { searchAskDoctors, searchSchema } from "./tools/index.js";

const server = new Server(
  {
    name: "askdoctors-mpc-server",
    version: "0.0.1",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

server.setRequestHandler(ListToolsRequestSchema, async (request) => {
  return {
    tools: [
      {
        name: "askdoctors_search",
        description:
          "Search for medical information and advice from AskDoctors",
        inputSchema: zodToJsonSchema(searchSchema),
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  switch (name) {
    case "askdoctors_search":
      try {
        const content = await searchAskDoctors(args);
        return { content: [{ type: "text", text: JSON.stringify(content) }] };
      } catch (e) {
        console.error("Error in askdoctors_search:", e);
        throw e;
      }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("AskDoctors MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
```

### 動作確認方法

MCPには便利な動作確認用ツールが用意されています：

```
npx @modelcontextprotocol/inspector npm run dev
```

ブラウザで <http://localhost:5173> にアクセスするとインスペクターが起動します。

### VS Code での検証環境構築

MCP サーバーをDockerイメージとして構築するための例：

```dockerfile
FROM node:22.12-alpine AS builder
COPY . /app
WORKDIR /app
RUN --mount=type=cache,target=/root/.npm npm install
RUN --mount=type=cache,target=/root/.npm npm run build
RUN --mount=type=cache,target=/root/.npm-production npm ci --ignore-scripts --omit-dev

FROM node:22.12-alpine AS release
WORKDIR /app
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json
ENV NODE_ENV=production
RUN --mount=type=cache,target=/root/.npm-production npm ci --ignore-scripts --omit-dev
ENTRYPOINT ["node", "dist/index.js"]
```

ビルドコマンド：

```
docker build -t askdoctors-mcp-server .
```

Roo Codeでの設定例：

```json
{
  "mcpServers": {
    "askdoctors": {
      "command": "docker",
      "args": [
        "run", "--rm", "-i",
        "-e", "ASKDOCTORS_BASE_URL",
        "-e", "ASKDOCTORS_ACCESS_TOKEN",
        "askdoctors-mcp-server"
      ],
      "env": {
        "ASKDOCTORS_BASE_URL": "http://host.docker.internal:3000",
        "ASKDOCTORS_ACCESS_TOKEN": "*****************************************"
      },
      "disabled": false,
      "alwaysAllow": []
    }
  }
}
```

## 4. 将来的な活用可能性

### 1. ガイドラインやヘルプの検索機能

- リソースの統合：社内ガイドラインやヘルプドキュメントをMCPサーバーのリソースとして登録
- 高度な検索：自然言語で質問するとガイドラインや関連ドキュメントを迅速に提示
- 業務最適化：特定の業務シナリオに応じたプロンプトを設定し、情報アクセスを効率化

### 2. カスタマーサポート業務での活用

- 情報アクセスの効率化：CS担当者が関連ガイドラインを即座に参照できる
- 対応品質の均一化：全担当者が同じ情報源にアクセスし一貫性を保つ
- トレーニングの効率化：新任担当者の学習・参照を迅速化
- 業務の一元化：問い合わせのやり取りもMCPのtools機能として実装し、MCPクライアントのみで業務完結が可能

## 5. まとめ

MCPサーバーの導入により、自社サービスのガイドラインやヘルプドキュメントへのアクセスが統一化され、業務効率が大幅に向上する可能性が示されました。特にカスタマーサポート部門では、迅速かつ一貫性のある対応が可能となり、顧客満足度の向上にも貢献すると考えられます。

注記：現在AskDoctorsにMCPサーバーとしての機能や外部から検索可能なAPIなどはなく、本記事では筆者のローカル環境で実装したAPIを利用した検証結果を紹介しています。
