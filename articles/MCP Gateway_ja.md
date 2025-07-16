---
title: "MCP Gateway"
source: "https://docs.docker.com/ai/mcp-gateway/"
author:
published: 2025-07-09
created: 2025-07-16
description: "DockerのMCP Gatewayは、コンテナ化されたMCPサーバーを通じてAIツールの安全で一元的かつスケーラブルなオーケストレーションを提供し、開発者、運用担当者、セキュリティチームを支援します。"
tags:
  - "clippings"
  - "MCP Gateway"
  - "Docker"
  - "AI tools"
  - "container orchestration"
  - "enterprise security"
---
MCP Gatewayは、開発環境と本番環境全体で[Model Context Protocol (MCP)](https://spec.modelcontextprotocol.io/)サーバーを安全にオーケストレーションおよび管理するための、Dockerのオープンソースでエンタープライズ対応のソリューションです。これは、組織が[Docker MCPカタログ](https://hub.docker.com/mcp)のMCPサーバーをMCPクライアントに、セキュリティ、可視性、制御を損なうことなく接続できるよう設計されています。

複数のMCPサーバーを単一の安全なエンドポイントに統合することで、MCP Gatewayは以下の利点を提供します：

- デフォルトで安全：MCPサーバーは、制限された権限、ネットワークアクセス、およびリソース使用量を持つ隔離されたDockerコンテナで実行されます。
- 統一管理：1つのゲートウェイエンドポイントがすべてのMCPサーバーの構成、認証情報、およびアクセス制御を一元化します。
- エンタープライズ向けの可観測性：組み込みの監視、ロギング、フィルタリングツールにより、AIツールアクティビティの完全な可視性とガバナンスを確保します。

## MCP Gatewayは誰のために設計されているか？

MCP Gatewayは、さまざまなグループが遭遇する問題を解決します：

- 開発者：Docker Composeを使用してMCPサーバーをローカルおよび本番環境にデプロイし、プロトコル処理、認証情報管理、セキュリティポリシーの組み込みサポートを利用できます。
- セキュリティチーム：エンタープライズグレードの分離と、AIツールの動作とアクセスパターンへの可視性を実現します。
- 運用担当者：ローカル開発環境から本番インフラストラクチャまで、一貫した低タッチ操作で簡単にスケールできます。

## 主な機能

- サーバー管理：複数のサーバーからMCPツール、リソース、プロンプトのリスト表示、検査、呼び出し
- コンテナベースのサーバー：適切な分離を持つDockerコンテナとしてMCPサーバーを実行
- シークレット管理：Docker Desktopを介したAPIキーと認証情報の安全な処理
- 動的検出と再読み込み：実行中のサーバーからのツール、プロンプト、リソースの自動検出
- 監視：組み込みのロギングとコールトレース機能

## MCP Gatewayのプレリリース版をインストール

Docker Desktopを使用している場合、MCP Gatewayはすぐに利用できます。プレリリース版をテストするには、次の手順を使用してください。

### 前提条件

- [MCP Toolkit機能が有効になっている](https://docs.docker.com/ai/mcp-catalog-and-toolkit/toolkit/#enable-docker-mcp-toolkit)Docker Desktop
- Go 1.24以上（開発用）

### ビルド済みバイナリを使用したインストール

最新のバイナリを[GitHubリリースページ](https://github.com/docker/mcp-gateway/releases/latest)からダウンロードできます。

関連するバイナリの名前を変更し、OSに対応する宛先にコピーします：

| OS | バイナリ名 | 宛先フォルダ |
| --- | --- | --- |
| Linux | `docker-mcp` | `$HOME/.docker/cli-plugins` |
| macOS | `docker-mcp` | `$HOME/.docker/cli-plugins` |
| Windows | `docker-mcp.exe` | `%USERPROFILE%\.docker\cli-plugins` |

またはシステム全体にインストールするために、これらのフォルダのいずれかにコピーします：

- `/usr/local/lib/docker/cli-plugins` または `/usr/local/libexec/docker/cli-plugins`
- `/usr/lib/docker/cli-plugins` または `/usr/libexec/docker/cli-plugins`

> 注意
>
> バイナリを実行可能にするために`chmod +x`が必要な場合があります：

> ```bash
> chmod +x ~/.docker/cli-plugins/docker-mcp
> ```

これで`mcp`コマンドを使用できます：

```bash
docker mcp --help
```

## MCP Gatewayの使用

実行：

```bash
docker mcp gateway run
```

すべてのコマンドと設定オプションを表示するには、[mcp-gatewayリポジトリ](https://github.com/docker/mcp-gateway?tab=readme-ov-file#usage)をご覧ください。

- [Docker MCPツールキットとカタログ](https://docs.docker.com/ai/mcp-catalog-and-toolkit/)

## アーキテクチャとセキュリティ

MCP Gatewayアーキテクチャは、複数層のセキュリティと分離を提供します：

- **コンテナ分離**：各MCPサーバーは制限された権限を持つ独自のDockerコンテナで実行されます
- **ネットワーク制限**：各サーバーの制御されたネットワークアクセス
- **リソース制限**：リソース枯渇を防ぐためのCPUとメモリ使用量の制約
- **認証情報管理**：Docker Desktop統合を通じたAPIキーの安全な処理

## エンタープライズ機能

### 可観測性とガバナンス

- すべてのAIツールアクティビティの包括的なロギング
- デバッグと監査のためのコールトレース
- セキュリティコンプライアンスのためのアクティビティフィルタリング
- ツールの動作とアクセスパターンへの完全な可視性

### スケーラビリティ

- ローカル開発から本番環境へのシームレスな移行
- スケーリングのための低タッチ操作
- 環境間での一貫した動作

## はじめに

1. **MCP Toolkitを有効化**：Docker DesktopでMCP Toolkit機能が有効になっていることを確認
2. **MCP Gatewayをインストール**：GitHubリリースからバイナリをダウンロードしてインストール
3. **サーバーを設定**：Docker MCPカタログからMCPサーバーをセットアップ
4. **Gatewayを実行**：`docker mcp gateway run`を実行して統一エンドポイントを開始
5. **アクティビティを監視**：可視性のために組み込みの監視ツールを使用

## 重要な考慮事項

- MCP Gatewayは「デフォルトで安全」になるよう設計されています
- すべてのMCPサーバーは適切な分離のためにコンテナ化される必要があります
- 認証情報とシークレットはDocker Desktopの安全なストレージを通じて管理されます
- 動的検出により、新しいツール、プロンプト、リソースが自動的に検出されます

## 関連ドキュメント

- [Model Context Protocol仕様](https://spec.modelcontextprotocol.io/)
- [Docker Hub上のDocker MCPカタログ](https://hub.docker.com/mcp)
- [MCP Gateway GitHubリポジトリ](https://github.com/docker/mcp-gateway)
