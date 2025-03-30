# Why We're All-In on MCP

ref: <https://mastra.ai/blog/mastra-mcp>

## 概要

このブログ記事は、Mastra.aiが2025年3月5日に公開した「Why We're All-In on MCP」（なぜ私たちはMCPに全力投球するのか）を詳細に要約したものです。記事ではAIエージェントのツール統合の課題と、Anthropic社が主導するModel Context Protocol（MCP）の可能性について説明しています。

## AIエージェントのツール統合の現状

AIエージェント向けのツール統合は現在、非常に混乱した状態にあります。開発者にとっても、断片化されたエコシステムを扱うのは困難です。例えば「MCP Calendar統合」を検索すると、10種類の異なる実装が見つかりますが、どれが最良なのかを判断する方法がありません。

LLM（大規模言語モデル）とツールを統合しようとした経験がある人なら、このような問題を理解できるでしょう。ツールの発見、インストール、設定は、まだ解決されていない課題です。Mastraはユーザーに最適なソリューションを提供するため、この問題について深く研究してきました。

## 新興ツール標準の概要

### Agents.json（Wildcard社）

Agents.jsonはOpenAPIを拡張したオープン仕様で、LLMのためのAPI操作を最適化しています。Wildcard AIによって構築され、APIの設計方法（開発者向け）とLLMがそれらを効果的に使用するために必要なものとの間の乖離という基本的な課題に対応しています。

### Composio

Composioは独自のツール仕様と包括的な既製統合ライブラリを持っています。最近まで、Composioはアーキテクチャの柔軟性よりも高品質なツールへの即時アクセスを優先するチーム向けのオプションでしたが、最近MCPサポートを追加したことを発表しました。

### Model Context Protocol（MCP）

MCPの強みは、Anthropicによって管理されているものの、OSSコミュニティのために、そしてその助けを借りて作られたオープンスタンダードであることです。MCPはAIアプリケーション用の「USB-Cポート」のようなもので、LLMと外部データソースやツールを接続するための標準化されたインターフェースを提供します。

## MCPの現在の課題

MCPは技術的には印象的ですが、そのエコシステムには以下の3つの主な課題があります：

1. **発見**：MCPツールを見つけるための中央集権的または標準化された方法がありません。各プロバイダーが独自の検索メカニズムを構築しており、断片化を生んでいます。

2. **品質**：中央レジストリや検証プロセスがないため、ツールの品質には大きなばらつきがあります。NPMのパッケージスコアリングや検証バッジに相当するものはありません。

3. **設定**：各プロバイダーが独自の設定スキーマとAPIを持っているため、フレームワークがプロバイダー固有の抽象化を作成せずに一貫した設定エクスペリエンスを提供するのが難しくなっています。

Shopify CEOのTobi Lütke氏も最近指摘したように、MCPは「LLMツールのUSB-C」として大きな可能性を持っていますが、まだ不完全です。彼の比喩に従えば、MCPは現在、ケーブルとワイヤープロトコルを定義していますが、プラグが欠けています。

コミュニティはこれらの課題に積極的に取り組んでおり、MCPのGitHubリポジトリでは以下の重要な議論が行われています：

- 公式レジストリ仕様：レジストリの機能方法に関する標準
- `.well-known/mcp.json`ディレクトリ仕様：分散型MCPサーバー検出のための標準

## エコシステムリーダーからの洞察

MastraはMCPの世界を前進させている企業（OpenTools、PulseMCP、MCP.run、Smithery）と会談し、各社がMCPパズルの異なる部分を解決していることを発見しました：

- OpenToolsは検索とキュレーションに焦点を当て、新しい公式レジストリを補完しています
- PulseMCPはレジストリの統合がレジストリの冗長な作業をどのように削減するかについての洞察を提供しています
- MCP.runはWebAssemblyを通じて安全で高性能なMCPホスティングを構築しており、新しいMCPレジストリAPIをサポートする予定です
- SmitheryはHenry氏のJenni.aiでの以前の成功から実践的な実装経験をもたらし、新しいMCP APIもサポートする予定です

## Mastraが MCPに賭ける理由

AIツール統合標準の環境を評価した結果、Mastraは以下の理由からMCPが説得力のある利点を提供していると考えています：

1. **オープンスタンダード**：MCPはベンダーロックインなしで実装できる業界全体のプロトコルとして設計されています。

2. **業界での採用**：Zed、Replit、Codeium/Windsurf、Sourcegraph、Cursor、Block/Squareなどの著名な企業が本番環境でMCPを実装しています。

3. **エコシステムの互換性**：MCPのアーキテクチャは他の標準がブリッジサーバーを実装することを可能にし（Composioの最近の統合で実証されたように）、エコシステムが進化するにつれて柔軟性を提供します。

4. **活発な開発**：コミュニティは提案された公式レジストリと`.well-known/mcp.json`仕様を通じて現在の制限に対処しています。

## MCPに関する市場の見方

より広いエコシステムは有望な勢いの兆しを示しています。Clineの運営責任者であるNik Pash氏は「MCPドミノ効果」と呼ぶものを概説し、MCPを無視した企業が「目が覚めるような衝撃を受ける」と述べました。これは、より多くの企業が公式サーバーをリリースし、ユーザーがシームレスなAI統合の力を理解するようになるためです。

Pash氏はまた、起業家的機会を強調し、MCPサーバーの構築と収益化が「現在、信じられないほどのチャンス」であり、「競争がなく、広々とした空間があり、VCが最初にそこに到達するソロファウンダーにお金を投げようと懇願している」と述べています。

現在問題はありますが、それらは解決されつつあり、MCPはまさにそのときを迎えようとしています。

## Mastraの提案：フレームワークフレンドリーなMCP

研究の一環として、MastraはエージェントフレームワークがどのようにMCPレジストリと対話できるかについての概念実証を構築しました。

### 1. レジストリクライアント

フレームワークはツールレジストリと対話するための標準化されたクライアント実装を必要としています。これにより、レジストリに関するメタデータ、利用可能なサーバー、MCPサーバースキーマを照会することができます。

```tsx
import { RegistryClient } from "@mcp/registry";

const registry = new RegistryClient({
  url: "https://example-tools.com/.well-known/mcp.json",
});

const directory = await registry.connect();
console.log("Connected to registry:", directory.name, directory.homepage);

const allServers = await registry.listServers();
console.log("\nAvailable servers:", allServers);
```

### 2. 設定と検証のためのサーバー定義

各MCPサーバーは標準フォーマットで設定スキーマを公開する必要があります：

```tsx
// レジストリからサーバー定義を検索
const stripeServer = await registry.getServerDefinition({ id: "stripe" });
// サーバーのスキーマを使用して設定UIを構築
const userInput = await example.buildServerUI(stripeServer.schemas);
// ユーザー入力がサーバー定義に正しいことを検証
const validConfig = stripeServer.parseConfig(userInput);
```

このパターンにより、フレームワークは動的UIを構築し、MCPサーバーに接続を試みる前に設定を検証することができます。

### フレームワークレベルの設定

Mastraは`mcp.json`仕様の上に構築し、仕様を実装する任意のレジストリに接続するためのAPIを公開する予定です。

```tsx
import { MCPConfiguration } from "@mastra/mcp";

const configuration = new MCPConfiguration({
  registry: "https://mcp.run/.well-known/mcp.json",
  servers: {
    googleCalendar: {
      // <- Google Calendar MCPサーバー用のTypeScriptによるIDE自動補完
    },
    // <- 接続されたレジストリで利用可能なすべてのサーバーを自動補完
  },
});
```

## 現在のMastraでMCPを使用する方法

概念実証レジストリクライアントはまだ開発中ですが、Mastraの`MastraMCPClient` APIを通じて既に任意のMCPサーバーにMastraを接続することができます。これにより、レジストリインフラが成熟するのを待たずにMCPエコシステムにアクセスできます。

### Stdio MCPサーバーへの接続

標準入出力（stdio）トランスポートを使用するMCPサーバーに接続する方法は以下の通りです：

```tsx
import { Agent } from "@mastra/core/agent";
import { MastraMCPClient } from "@mastra/mcp";
import { anthropic } from "@ai-sdk/anthropic";

// Sequential Thinkingサーバーを例として：
// https://smithery.ai/server/@smithery-ai/server-sequential-thinking
// MCPクライアントを初期化
const sequentialThinkingClient = new MastraMCPClient({
  name: "sequential-thinking",
  server: {
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-sequential-thinking"],
  },
});

// Mastra Agentを作成
const agent = new Agent({
  name: "Reasoning agent",
  instructions:
    "You solve problems by breaking them down into sequential steps. Use the sequential thinking tool to walk through your reasoning process step by step.",
  model: anthropic("claude-3-5-sonnet-latest"),
});

// MCPサーバーに接続し、ツールを取得して使用する実装例...
```

### SSE MCPサーバーへの接続

Server-Sent Events（SSE）を使用するMCPサーバーについても、サーバーのURLを渡すことで接続が可能です。

## MCPとMastraの将来

Mastraは、MCPの統合をシームレスにすることに取り組んでいます。ロードマップには以下が含まれています：

1. `.well-known/mcp.json`を使用した標準化されたインストールと設定フローの構築
2. 仕様が進化するにつれて新しいMCP機能のサポートを追加
3. MCPサーバーの発見、インストール、設定を容易にするプリミティブの作成

現在のAIエージェントのツール統合の状態は、パッケージ管理の初期段階に似ています。`npm install`がJavaScriptパッケージ管理を変革したように、MCPはAIエージェントが世界とどのように対話するかを変革する可能性があります。MCPを標準化することで、ツールの発見、設定、安全な使用が容易なエコシステムを作り出すことができます。
