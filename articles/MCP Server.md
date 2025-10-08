---
title: "MCP Server"
source: "https://ui.shadcn.com/docs/mcp"
author:
  - "[[shadcn]]"
published:
created: 2025-10-08
description: "shadcn MCP サーバーを使用して、レジストリからコンポーネントを閲覧、検索、インストールする方法。AI アシスタントが自然言語でshadcn/uiコンポーネントと対話できる。"
tags:
  - "MCP"
  - "shadcn"
  - "AI"
  - "registry"
  - "components"
  - "Claude"
  - "Cursor"
---

## 概要

shadcn MCP Server は、AI アシスタントがレジストリのアイテムと対話できるようにするツールです。コンポーネントの閲覧、検索、プロジェクトへの直接インストールを自然言語で行えます。

例：「acme レジストリのコンポーネントを使ってランディングページを作成して」「shadcn レジストリからログインフォームを探して」

## MCP（Model Context Protocol）とは

MCP は、AI アシスタントが外部データソースやツールに安全に接続できるオープンプロトコルです。shadcn MCP サーバーにより、AI アシスタントは以下にアクセスできます：

- **コンポーネントの閲覧** - 設定されたレジストリから利用可能なコンポーネント、ブロック、テンプレートをリスト表示
- **レジストリ横断検索** - 複数のソース間で名前や機能による特定コンポーネントの検索
- **自然言語でのインストール** - 「ログインフォームを追加して」のような会話形式のプロンプトでコンポーネント追加
- **複数レジストリのサポート** - パブリックレジストリ、プライベート社内ライブラリ、サードパーティソースへのアクセス

## 動作の仕組み

MCP サーバーは、AI アシスタント、コンポーネントレジストリ、shadcn CLI の橋渡しをします：

1. **レジストリ接続** - 設定されたレジストリに接続（shadcn/ui、プライベートレジストリ、サードパーティソース）
2. **自然言語** - 必要なものを平易な言葉で記述
3. **AI 処理** - アシスタントがリクエストをレジストリコマンドに変換
4. **コンポーネント配信** - リソースを取得してプロジェクトにインストール

## サポートされるレジストリ

shadcn MCP サーバーは、shadcn 互換のレジストリすべてで動作します：

- **shadcn/ui Registry** - すべての shadcn/ui コンポーネントを含むデフォルトレジストリ
- **サードパーティレジストリ** - shadcn レジストリ仕様に従う任意のレジストリ
- **プライベートレジストリ** - 社内の内部コンポーネントライブラリ
- **名前空間付きレジストリ** - `@namespace` 構文で設定された複数レジストリ

## クイックスタート

### Claude Code

プロジェクトで以下のコマンドを実行：

```bash
pnpm dlx shadcn@latest mcp init --client claude
```

Claude Code を再起動し、以下のプロンプトを試す：

- shadcn レジストリで利用可能なすべてのコンポーネントを表示
- ボタン、ダイアログ、カードコンポーネントをプロジェクトに追加
- shadcn レジストリのコンポーネントを使用してお問い合わせフォームを作成

**注**: Claude Code で `/mcp` コマンドを使用して MCP サーバーをデバッグできます。

### Cursor

プロジェクトの `.cursor/mcp.json` に以下を追加：

```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}
```

設定追加後、Cursor の設定で shadcn MCP サーバーを有効化します。

### VS Code

プロジェクトの `.vscode/mcp.json` に以下を追加：

```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}
```

設定追加後、`.vscode/mcp.json` を開き、shadcn サーバーの横にある **Start** をクリックします。

### Codex

`~/.codex/config.toml` に以下を追加：

```toml
[mcp_servers.shadcn]
command = "npx"
args = ["shadcn@latest", "mcp"]
```

## レジストリの設定

MCP サーバーは、プロジェクトの `components.json` 設定を通じて複数のレジストリをサポートします。プライベートレジストリやサードパーティプロバイダーを含む様々なソースからコンポーネントにアクセスできます。

```json
{
  "registries": {
    "@acme": "https://registry.acme.com/{name}.json",
    "@internal": {
      "url": "https://internal.company.com/{name}.json",
      "headers": {
        "Authorization": "Bearer ${REGISTRY_TOKEN}"
      }
    }
  }
}
```

**注**: 標準の shadcn/ui レジストリにアクセスするための設定は不要です。

## 認証

認証が必要なプライベートレジストリの場合、`.env.local` に環境変数を設定：

```
REGISTRY_TOKEN=your_token_here
API_KEY=your_api_key_here
```

## プロンプト例

MCP サーバー設定後、自然言語でレジストリと対話できます：

### 閲覧と検索

- shadcn レジストリで利用可能なすべてのコンポーネントを表示
- shadcn レジストリからログインフォームを探して

### アイテムのインストール

- ボタンコンポーネントをプロジェクトに追加
- shadcn コンポーネントを使用してログインフォームを作成
- acme レジストリから Cursor ルールをインストール

### 名前空間の操作

- acme レジストリからコンポーネントを表示
- @internal/auth-form をインストール
- acme レジストリの hero、features、testimonials セクションを使用してランディングページを作成

## トラブルシューティング

### MCP が応答しない

1. **設定確認** - MCP サーバーが適切に設定され、MCP クライアントで有効化されているか確認
2. **MCP クライアントの再起動** - 設定変更後に MCP クライアントを再起動
3. **インストール確認** - プロジェクトに `shadcn` がインストールされているか確認
4. **ネットワーク確認** - 設定されたレジストリにアクセスできるか確認

### レジストリアクセスの問題

1. **components.json 確認** - レジストリ URL が正しいか確認
2. **認証テスト** - プライベートレジストリの環境変数が設定されているか確認
3. **レジストリ確認** - レジストリがオンラインでアクセス可能か確認
4. **名前空間確認** - 名前空間の構文が正しいか確認（`@namespace/component`）

### インストールの失敗

1. **プロジェクト設定確認** - 有効な `components.json` ファイルがあるか確認
2. **パス確認** - ターゲットディレクトリが存在するか確認
3. **権限確認** - コンポーネントディレクトリへの書き込み権限があるか確認
4. **依存関係の確認** - 必要な依存関係がインストールされているか確認

### ツールやプロンプトがない

「No tools or prompts」メッセージが表示される場合、以下を試す：

1. **npx キャッシュをクリア** - `npx clear-npx-cache` を実行
2. **MCP サーバーを再有効化** - MCP クライアントで MCP サーバーを再有効化
3. **ログ確認** - Cursor では、View -> Output で `MCP: project-*` を選択してログを確認

## 関連リソース

- [Registry Documentation](https://ui.shadcn.com/docs/registry) - shadcn レジストリの完全ガイド
- [Namespaces](https://ui.shadcn.com/docs/registry/namespace) - 複数のレジストリソースの設定
- [Authentication](https://ui.shadcn.com/docs/registry/authentication) - プライベートレジストリのセキュリティ確保
- [MCP Specification](https://modelcontextprotocol.io) - Model Context Protocol について学ぶ
