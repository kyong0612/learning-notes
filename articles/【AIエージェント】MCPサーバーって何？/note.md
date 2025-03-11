# 【AIエージェント】MCPサーバーって何？

ref: <https://zenn.dev/tomo0108/articles/6b472b4c9cacfa>

## 1. MCPサーバーの基本概念

### MCPとは

- Model Context Protocol（モデル・コンテキスト・プロトコル）の略称
- Anthropic社が提唱したオープンソースのプロトコル
- 「AIにツールを持たせるための標準プロトコル」という位置づけ
- AI用のUSB-Cポートのような役割を果たす標準インターフェース

### 機能と目的

- AIモデル（LLM）が外部のデータソースやツールに標準化された方法でアクセスできるようにする
- AI開発にプラグ＆プレイに近い感覚で機能追加が可能になる
- AIが様々な外部システムと連携するための共通基盤を提供

## 2. MCP対応製品とツール

### MCP対応AIホスト

- Anthropicの提供するClaude
- IDE拡張のCursor
- VS CodeのエージェントCline

### 対応ツールの種類

- **ファイルシステム操作**: ローカルファイルの安全な読み書き
- **データベース問い合わせ**: PostgresやSQLiteからのクエリ実行
- **Git/GitHub操作**: リポジトリの検索、Issue管理
- **ウェブ検索・スクレイピング**: Brave検索API、Puppeteerでのブラウザ自動操作
- **チャットの送受信**: Slack、Discord、Teams連携
- **クラウド操作**: AWS、Cloudflare、Docker、Kubernetes管理

## 3. MCPの利点

### 標準化のメリット

- 共通インターフェースによる接続でLLM側は同じ手順で異なるツールを扱える
- 他社製LLMへの乗り換え時もツール側のコードが再利用可能
- コミュニティ製の便利ツールをそのまま使用できる
- データを社内に留めたままAIに処理させることが可能

### AIエージェントの可能性

- 複雑なワークフローを構築するための新インフラとしての位置づけ
- 様々な社内システムとの連携を標準的な方法で実現

## 4. MCP実装方法と問題点

### 自前でMCPサーバーを作成する方法

- 公式SDK（Python版・TypeScript版など）が用意されている
- 記事では「数十行のコードでカスタムツールをサーバー化できる」と説明されている
- 記事で提供されているTypeScriptのサンプルコード例：

```typescript
import { Server } from "@modelcontextprotocol/sdk/server";
import { StdioServerTransport, CallToolRequestSchema, ListToolsRequestSchema, McpError, ErrorCode } from "@modelcontextprotocol/sdk";

// 1. サーバーを初期化（名前とバージョンを設定）
const server = new Server({ name: "my-mcp-server", version: "1.0.0" }, { capabilities: { tools: {} } });

// 2. ツール一覧要求が来たときに応答するハンドラを登録
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [\
      {\
        name: "calculate_sum",\
        description: "Add two numbers together",       // ツールの説明\
        inputSchema: {                                // 入力のパラメータ仕様をJSON Schemaで定義\
          type: "object",\
          properties: {\
            a: { type: "number" },\
            b: { type: "number" }\
          },\
          required: ["a", "b"]\
        }\
      }\
    ]
  };
});

// 3. ツール実行要求が来たときのハンドラを登録
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "calculate_sum") {
    const { a, b } = request.params.arguments;       // リクエストからパラメータ取得
    return { toolResult: a + b };                    // 計算結果をレスポンスとして返す
  }
  // 定義していないツール名が呼ばれた場合の例外
  throw new McpError(ErrorCode.ToolNotFound, "Tool not found");
});

// 4. サーバーを起動（標準入出力経由でホストと通信するモード）
const transport = new StdioServerTransport();
await server.connect(transport);
```

### サンプルコードの品質問題

- 上記コードには複数の技術的問題がある：
  - 構文エラー：不必要なバックスラッシュ（`\`）が各行に挿入され、実行時エラーの原因となる
  - 型安全性の欠如：TypeScriptの利点である型チェックが適切に活用されていない
  - 不十分なエラーハンドリング：入力値の検証が不足している
  - セキュリティ考慮の欠如：不正な入力に対する防御が不十分
  - 設定の柔軟性がない：環境変数やコンフィグファイルからの設定読み込みなどが実装されていない

### AIにMCPサーバーを認識させる方法

- AIのMCP設定ファイルにサーバー情報を登録する必要がある
- 記事で示されているJSON設定例：

```json
{
  "mcpServers": {
    "my-mcp-server": {
      "command": "node",
      "args": [ "/Users/あなたのユーザ名/mcp-server/build/index.js" ]
    }
  }
}
```

- この設定も基本的なものにとどまり、実運用に必要なセキュリティ設定や環境変数の取り扱いが考慮されていない

### 既存のMCPサーバーの利用

- すでに多くのMCPサーバーが公開されており自由に使える
- Graphlit社の提供するオープンソースMCPサーバーは社内データの一括インデックス化が可能
- SlackやGmail、Podcastなど様々な情報源をAIが検索・取得できるようになる

## 5. 業務改善でのMCP活用例

### 社内システム連携のシナリオ

- 社内Jiraチケットを集計して進捗レポートを作成するAI
- 様々な社内システム（Wiki、Slack等）との連携が必要なケース
- 従来はそれぞれのAPIを個別に実装する必要があったが、MCPではツールを後付けで追加可能

### メリット

- 人間が複数システム間でのコピー&ペースト作業を省略できる
- 「売上データまとめてグラフ作って」といった指示でAIが必要なツールを自動的に使用

## 6. Web開発でのMCP活用例

### 開発支援のシナリオ

- ブラウザを自動操作してバグを見つけて修正するAI
- Clineのようなツールはヘッドレスブラウザを起動して自動的に問題を検知・修正

### 主な活用ツール

- **FileSystemツール**: プロジェクトファイルの読み書き、設定ファイル編集
- **Terminal/Shellツール**: コマンド実行（npm run dev、pytest等）、エラー検知と修正
- **Git操作ツール**: ブランチ切替や差分取得、過去コミットの参照

## 7. MCPの現状と展望

### 現在の状況

- 標準規格として各社が採用し始めている
- 一部は実用段階だがまだ発展途上
- ツールの品質やセキュリティは玉石混交

### 将来性

- USB-Cのように統一規格となればAIエージェントとツールの接続方式が標準化される
- エコシステムの形成により、業務改善からWeb開発まで幅広い領域で活用が進む可能性

## 8. 実装時の注意点

- 記事で紹介されている実装例はあくまで概念理解のための入門レベルであり、そのまま実運用には適さない
- 実際の開発では以下の点に注意すべき：
  - 公式ドキュメントを参照し、最新の仕様に沿った実装を行う
  - 適切な型定義と型チェックを活用してコードの堅牢性を高める
  - 入力値の検証とエラーハンドリングを徹底する
  - セキュリティリスクを評価し、適切な保護措置を講じる
  - 環境変数や設定ファイルを活用して柔軟な設定を可能にする

この記事は、MCPの概念と可能性を紹介する点では価値があるものの、技術的な実装詳細については不正確さや品質の問題があります。MCPに興味を持った開発者は、基本概念を理解した後、公式ドキュメントや信頼できるリソースで最新かつ堅牢な実装方法を学ぶことが強く推奨されます。
