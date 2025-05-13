---
title: "Findyの爆速開発を支える生成AI活用 ~MCPサーバー作成編~"
source: "https://tech.findy.co.jp/entry/2025/05/12/070000"
author:
  - "戸田 (Toda)"
published: 2025-05-12
created: 2025-05-13
description: |
  ファインディ株式会社のTech Leadである戸田氏による、同社の開発組織におけるMCPサーバーの導入、TypeScript SDKを用いた独自実装、Nxによるモノレポ管理、そして動的プロンプト生成、Devin連携、Figma Lintなどの具体的な活用実績を紹介する記事。
tags:
  - "clippings"
  - "MCP"
  - "AI"
  - "Findy"
  - "TypeScript"
  - "Nx"
  - "Devin"
  - "Figma"
---

## Findyの爆速開発を支える生成AI活用 ~MCPサーバー作成編~

ファインディ株式会社のTech Lead、戸田氏による、同社でのMCP (Model Context Protocol) サーバー活用事例を紹介する記事。

### MCPとは

* **概要**: アプリケーションが大規模言語モデル（LLM）に情報やツールへのアクセス方法を提供するための新しい**オープンプロトコル**。
* **比喩**: USB-Cがデバイス接続を標準化するように、MCPはAIモデルと多様なデータソース/ツールを**標準化された方法**で接続する。
* **従来との違い**:
  * 従来のAPI連携: サービスごとに個別実装が必要（「ドアごとに別の鍵」）。
  * MCP: 単一の標準化されたコネクタとして機能し、一度の統合で複数サービスにアクセス可能。**AI連携開発を大幅に簡素化**し、より**動的な機能提供**を可能にする。
* **公式ドキュメント**: [modelcontextprotocol.io](https://modelcontextprotocol.io/introduction)
* **MCPサーバー**: MCP規格に則って作成されたサーバー。

### 導入

* **Findyでの利用**: 公式MCPサーバーを開発リポジトリに追加して利用開始。
* **公式サーバー例**:
  * **GitHub MCP**: Pull requestやIssue情報を取得しLLMへ渡す ([github.com/github/github-mcp-server](https://github.com/github/github-mcp-server))。
  * **Sentry MCP**: 不具合詳細を取得しLLMへ。Copilot/Agentによる原因特定・コード修正支援 ([github.com/getsentry/sentry-mcp](https://github.com/getsentry/sentry-mcp))。
  * **AWS Documentation MCP**: Copilot等からAWSに関する質問を投げ、ドキュメント内容を検索・LLMへ渡す ([github.com/awslabs/mcp/.../README.md](https://github.com/awslabs/mcp/blob/main/src/aws-documentation-mcp-server/README.md))。
* **設定**: 各種AIエージェントの設定ファイルに追記し、サーバーを起動するだけ。
* **VSCodeでのGitHub MCP設定例**:

    ```json
    {
      "servers": {
        "github": {
          "command": "docker",
          "args": [
            "run", "-i", "--rm", "-e", "GITHUB_PERSONAL_ACCESS_TOKEN",
            "ghcr.io/github/github-mcp-server"
          ],
          "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_ACCESS_TOKEN>" }
        }
      }
    }
    ```

* **効果**: 多くのプロダクト/サービスで公開されており、開発生産性向上の強力なツールとなる。

### 実装

* **動機**: 既存サーバーの組み合わせ活用から、自社独自のMCPサーバー開発へ。
* **SDK**: 公式の **TypeScript SDK** (`@modelcontextprotocol/sdk`) を利用 ([github.com/modelcontextprotocol/typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk))。SDK利用によりサーバー内部実装に集中可能。
* **ツール定義 (`mcpServer.tool`)**:
    1. `tool名` (文字列)
    2. `toolの説明` (文字列)
    3. `toolのパラメータ定義` (Zodスキーマなど)
    4. `toolの実装` (async関数)
* **実装例 (計算サーバー)**:

    ```typescript
    import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
    import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
    import { z } from "zod";

    const mcpServer = new McpServer({ name: "Sample", version: "0.0.1" });
    mcpServer.tool("addition", "足し算", { a: z.number(), b: z.number() },
      async ({ a, b }) => ({ content: [{ type: "text", text: String(a + b) }] })
    );
    // ... multiplicationも同様 ...
    // ... サーバー起動処理 ...
    ```

* **モノレポ管理 (Nx)**:
  * **課題**: 用途ごとにサーバーを分けるとリポジトリが分散し、共通コード管理が困難。
  * **解決策**: 以前から活用していた **Nx** ([tech.findy.co.jp/...](https://tech.findy.co.jp/entry/2024/08/05/090000)) を利用し、MCPサーバー実装をモノレポで管理。
  * **メリット**: 複数サーバーで利用可能な共通関数（例: 外部APIクライアント）を作成・管理可能。**社内エコシステム**を実現。
* **セットアップ簡略化 (Nx Generator)**:
  * Nx の **generator 機能** ([tech.findy.co.jp/...](https://tech.findy.co.jp/entry/2024/12/24/070000)) を活用。
  * モノレポとMCPサーバーの初期設定をコマンド数回で完了。
  * **効果**: 社内エンジニアのMCPサーバー作成ハードルを大幅に低減。

### 実績

* **成果**: 社内エコシステム整備により、**数名のエンジニアで3日間で10個のMCPサーバーと30個のtool**を実装・配布。
* **具体例**:
    1. **動的にプロンプトテキストを作成して返すサーバー**:
        * **機能**: パラメータに応じて動的にプロンプトテキストを生成して返す。
        * **ユースケース**: チーム内共通プロンプトの動的切り替え、他MCPサーバーから取得したデータを埋め込んだプロンプト生成など。LLMにそのまま渡して実行可能。
    2. **Devinと連携するサーバー**:
        * **背景**: 完全自律型AIエンジニア Devin がAPI (α版) を公開 ([docs.devin.ai/api-reference/overview](https://docs.devin.ai/api-reference/overview))。
        * **機能**: MCPサーバーからDevin APIを実行し、情報取得やセッション作成/停止を行う。
        * **効果**: エンジニアが作業中にSlackやDevin画面を確認せずともDevinを管理可能に。外部API実行による情報取得・データ操作の例。
    3. **Figmaデータのlintを行うサーバー**:
        * **背景**: デザインプラットフォーム Figma がAPIを公開 ([www.figma.com/developers/api](https://www.figma.com/developers/api))。
        * **機能**: MCPサーバーからFigma APIを実行し、対象データを取得・解析。デザインルール（指定外フォント使用、規定外px数など）に準拠しているかチェック (lint)。
        * **効果**: ルール違反時に警告を返す。外部APIからのデータ取得・解析・加工の例。

### セキュリティ面の考慮

* **アクセストークン管理**:
  * 外部API実行に必要なアクセストークンは、MCPサーバー実行時に**環境変数**を使って渡す。
  * 利用するトークンの**権限を最小限に絞り**、環境変数で隠蔽することで安全性を確保。
* **外部MCPサーバー利用時の注意**:
  * 公式以外のMCPサーバー（いわゆる**野良MCPサーバー**）利用時は注意が必要。
  * **リスク**: 悪意のあるサーバーにアクセストークンを渡すと、情報漏洩やデータ改ざんの可能性。
  * **推奨**: 利用前に**内部実装を確認**し、実行される処理を把握すること。

### まとめ

* **コストパフォーマンス**: MCPサーバー実装の**ハードルとコストは非常に低い**一方、**リターンは非常に大きい**。
* **推奨**: 公式ドキュメントを参考に、簡単なMCPサーバーの実装を試してみることを推奨。

---

(元記事末尾の採用情報は省略)
