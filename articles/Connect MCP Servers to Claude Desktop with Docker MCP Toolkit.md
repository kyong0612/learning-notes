---
title: "Connect MCP Servers to Claude Desktop with Docker MCP Toolkit"
source: "https://www.docker.com/blog/connect-mcp-servers-to-claude-desktop-with-mcp-toolkit/"
author: "Ajeet Singh Raina"
published: 2025-10-27
created: 2025-11-05
description: "DockerのMCPツールキットを使用してClaude DesktopとMCPサーバーを接続し、隔離されたコンテナ環境でAIアシスト開発を実現する包括的なガイド。実際の開発タスクを安全に実行し、従来4時間かかる作業を約10分に短縮する方法を実例とともに解説。"
tags:
  - "AI/ML"
  - "Docker"
  - "MCP"
  - "Claude"
  - "Docker Desktop"
  - "開発ツール"
  - "コンテナ化"
  - "セキュリティ"
---

## 概要

この記事は、Claude DesktopとDocker MCP Toolkitを統合し、AIアシスト開発ワークフローを実現する方法を解説しています。この設定により、Claudeが隔離されたDockerコンテナ内で実際の開発タスクを安全に実行できるようになります。

**最終更新:** 2025年11月3日

## 主要コンセプト

### Model Context Protocol (MCP)

ClaudeのようなAIエージェントがツール、API、サービスと接続し、会話を超えた実際のアクションを実行するための標準化されたブリッジです。

### Docker MCP Toolkit

Claudeがローカルシステムにリスクを与えることなく作業できる、セキュリティ強化されたコンテナ環境を提供します。完全な再現性と監査証跡を備えています。

## 前提条件

- **RAM:** 最小8GB（推奨16GB）
- **Docker Desktop:** インストール済みであること
- **Claude Desktop:** claude.ai/desktopからサインアップ

## セットアップ手順

### ステップ1-2: Claude Desktopのインストール

Claude Desktopをインストールし、設定でDocker MCP Toolkitを有効化します。

### ステップ3-4: MCPクライアントとしての接続

Docker Desktopインターフェース経由でClaude DesktopをMCPクライアントとして接続します。

### ステップ5: 設定ファイルの確認

以下の場所にある`claude_desktop_config.json`ファイルで設定を確認します：

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

## MCPサーバー設定

ガイドでは5つのMCPサーバーのセットアップを詳述しています：

### 1. Firecrawl

Webスクレイピングとスクリーンショット分析を提供（firecrawl.devからAPIキーが必要）。

### 2. GitHub Official

OAuthまたはパーソナルアクセストークンによるリポジトリ管理。

### 3. Sequential Thinking

動的な問題解決とコードデバッグ機能。

### 4. Node.js Sandbox

Dockerソケットマウンティングによる隔離されたJavaScript実行環境。

### 5. Context7

ライブラリのリアルタイムドキュメントアクセス。

## 技術アーキテクチャ

`docker mcp gateway run`コマンドは以下を起動します：

- **Docker MCP Gateway:** 中央ルーター
- **Claude Desktopクライアント:** MCPサーバーとの接続
- **ツールリクエストルーティング:** 隔離されたコンテナ経由
- **リソース制限:** 実行ごとに512MB RAM、0.75 CPUコア

## 実践的なデモ: UIコンポーネント生成ワークフロー

この記事では、スクリーンショットから本番環境対応のReactコンポーネントへ変換する6フェーズのワークフローを紹介しています：

### Phase 0: 戦略的計画

Sequential Thinkingを使用してコンポーネント要件を分析し、テストカバレッジを見積もります。

### Phase 1: デザインリサーチ

カラーパレット、スペーシング、タイポグラフィ、レイアウトパターンを抽出します。

### Phase 2: ドキュメントリサーチ

React、Next.js、Jest、テストライブラリの最新ベストプラクティスを取得します。

### Phase 3: コンポーネントコード生成

TypeScript型定義と本番環境対応の構造を持つコードを生成します。

### Phase 4: 包括的なJestテスト

レンダリング、インタラクション、アクセシビリティをカバーする40以上のテストケースを作成します。

### Phase 5: 検証

Node.js Sandboxを使用して、隔離されたコンテナ内で依存関係をインストールしテストを実行します。

### Phase 6: デバッグ

Sequential Thinkingを使用して失敗を分析し、すべてのテストが通過するまで反復します。

## Node.js Sandboxアーキテクチャ

Docker-out-of-Docker (DooD)パターンを実装し、`/var/run/docker.sock`をマウントすることで、サンドボックスコンテナがコード実行用の一時的な兄弟コンテナを生成できます。

### 設定例

```json
{
  "mcpServers": {
    "node-code-sandbox": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-v", "/var/run/docker.sock:/var/run/docker.sock",
        "-v", "/Users/USERNAME/Desktop/sandbox-output:/root",
        "mcp/node-code-sandbox"
      ],
      "env": {
        "SANDBOX_MEMORY_LIMIT": "512m",
        "SANDBOX_CPU_LIMIT": "0.75"
      }
    }
  }
}
```

## 実証された結果

デモワークフローで生成されたもの：

- デザイン仕様に一致する完全に機能するReactコンポーネント
- すべての機能をカバーする41個の合格Jestテスト
- 設定ファイルを含む本番環境対応のプロジェクト構造
- デプロイされたコードを持つGitHubリポジトリ

**所要時間の比較:** 従来4時間の開発サイクルが約10分に短縮されました。

## セキュリティと信頼性のメリット

- **隔離実行:** コードがローカルシステムに影響を与えることなく隔離されたコンテナで実行
- **完全な再現性:** 環境間での完全な再現性
- **監査証跡:** 完全なログ記録と監査機能
- **リソース制限:** 暴走プロセスを防止
- **自動クリーンアップ:** コンテナの蓄積を防止する自動クリーンアップ

## 重要なポイント

1. MCPはAIの推論能力と実践的な開発実行を橋渡しする
2. Dockerコンテナ化がセキュリティと再現性を保証する
3. 複数フェーズのワークフローが複雑な開発タスクを自動化できる
4. 統合には最小限の手動設定のみが必要
5. Claudeは情報源ではなく、協力的な開発パートナーになる

## リソースとリンク

- **Docker Desktop:** [docker.com/products/docker-desktop](https://docker.com/products/docker-desktop/)
- **MCPカタログ:** [hub.docker.com/mcp](https://hub.docker.com/mcp)
- **MCP Toolkit:** [Docker MCP Toolkit](https://hub.docker.com/open-desktop?url=https://open.docker.com/dashboard/mcp)
- **サンプルリポジトリ:** [github.com/ajeetraina/resources-browser-component](https://github.com/ajeetraina/resources-browser-component)
