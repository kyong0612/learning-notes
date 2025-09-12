---
title: "modelcontextprotocol/registry: A community driven registry service for Model Context Protocol (MCP) servers."
source: "https://github.com/modelcontextprotocol/registry/tree/main"
author:
  - "Adam Jones (Anthropic)"
  - "Tadas Antanavicius (PulseMCP)"
  - "Toby Padilla (GitHub)"
published: 2025-09-08
created: 2025-09-12
description: |
  Model Context Protocol (MCP) サーバーのためのコミュニティ主導のレジストリサービスです。MCPレジストリは、MCPクライアントに対して、MCPサーバーのリストをアプリストアのように提供します。
tags:
  - "mcp"
  - "mcp-servers"
  - "registry"
  - "golang"
---

## MCP レジストリ

MCPレジストリは、MCPクライアントに対して、MCPサーバーのリストをアプリストアのように提供します。

- **📤 MCPサーバーを公開する**: [docs/guides/publishing/publish-server.md](https://github.com/modelcontextprotocol/registry/blob/main/docs/guides/publishing/publish-server.md)
- **⚡️ ライブAPIドキュメント**: [registry.modelcontextprotocol.io/docs](https://registry.modelcontextprotocol.io/docs)
- **👀 エコシステムのビジョン**: [docs/explanations/ecosystem-vision.md](https://github.com/modelcontextprotocol/registry/blob/main/docs/explanations/ecosystem-vision.md)
- 📖 **完全なドキュメント**: [docs](https://github.com/modelcontextprotocol/registry/blob/main/docs)

### 開発状況

- **2025-09-08 更新**: レジストリはプレビュー版としてローンチされました。システムは安定してきていますが、これはまだプレビューリリースであり、破壊的変更やデータリセットが発生する可能性があります。
- **現在の主要メンテナー**:
  - Adam Jones (Anthropic) [@domdomegg](https://github.com/domdomegg)
  - Tadas Antanavicius (PulseMCP) [@tadasant](https://github.com/tadasant)
  - Toby Padilla (GitHub) [@toby](https://github.com/toby)

### コントリビューション

コラボレーションには、Discord、GitHub Discussions、Issues、Pull Requestsなどのチャネルがあります。

#### クイックスタート

**前提条件**:

- Docker
- Go 1.24.x
- golangci-lint v2.4.0

**サーバーの実行**:

- **Dockerを使用（推奨）**: `make dev-compose` を実行すると、`localhost:8080` で完全な開発環境が起動します。
- **Dockerなし**: `make build` と `make dev-local` でビルドして実行します。
- **ビルド済みDockerイメージ**: GitHub Container Registryから `latest`、`main`、特定のバージョンなどのタグで利用可能です。

**サーバーの公開**:
CLIツールが提供されています。`make publisher` でビルドし、`./bin/mcp-publisher --help` で使い方を確認できます。詳細は[パブリッシャーガイド](https://github.com/modelcontextprotocol/registry/blob/main/docs/guides/publishing/publish-server.md)を参照してください。

**その他のコマンド**:
`make check` を実行して、リントとテストを実行します。その他のコマンドについては `make help` を使用してください。

### アーキテクチャ

#### プロジェクト構造

リポジトリは、アプリケーションのエントリポイント（`cmd`）、データ（`data`）、デプロイ（`deploy`）、ドキュメント（`docs`）、内部アプリケーションコード（`internal`）、公開パッケージ（`pkg`）、スクリプト、テスト用のディレクトリで構成されています。

```
├── cmd/         # アプリケーションのエントリポイント
├── data/        # シードデータ
├── deploy/      # デプロイ設定 (Pulumi)
├── docs/        # ドキュメント
├── internal/    # プライベートなアプリケーションコード
├── pkg/         # 公開パッケージ
├── scripts/     # 開発・テスト用スクリプト
└── tests/       # 統合テスト
```

#### 認証

レジストリは、サーバーを公開するために複数の認証方法をサポートしています:

- GitHub OAuth
- GitHub OIDC (GitHub Actions用)
- DNS認証
- HTTP認証

システムは名前空間の所有権を検証します。例えば、`io.github.domdomegg/my-cool-mcp` を公開するには、GitHubで `domdomegg` としてログインしているか、そのリポジトリのGitHub Action内にいる必要があります。

### 詳細なドキュメント

詳細については、[完全なドキュメント](https://github.com/modelcontextprotocol/registry/blob/main/docs)を参照してください。
