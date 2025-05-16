---
title: "metatool-ai/metatool-app"
source: "https://github.com/metatool-ai/metatool-app"
author:
  - "metatool-ai"
published:
created: 2025-05-16
description: |
  MetaMCPは、すべてのMCPを管理するため統合されたミドルウェアMCPです。これを実現するために、GUIフルスタックアプリ（このリポジトリ）とローカルMCPプロキシを使用します。（最新のnpmリポジトリmcp-server-metamcpを参照してください）
tags:
  - "クリッピング"
  - "MCP"
  - "MetaMCP"
  - "middleware"
  - "GUI"
  - "docker"
  - "open-source"
---
[github.devで開く](https://github.dev/) [新しいgithub.devタブで開く](https://github.dev/) [codespaceで開く](https://github.com/codespaces/new/metatool-ai/metatool-app?resume=1)

MetaMCPは、すべてのMCPを管理するための統一されたミドルウェアMCPです。これを実現するために、GUIフルスタックアプリ（このリポジトリ）とローカルMCPプロキシを使用します。（最新のnpmリポジトリ [mcp-server-metamcp](https://github.com/metatool-ai/mcp-server-metamcp) を参照してください）

主な機能のハイライト：

- 複数のMCPサーバー統合をまとめて管理するためのGUIアプリ。
- MetaMCPはMCPサーバーであるため、任意のMCPクライアント（例：Claude Desktop、Cursorなど）をサポートします。
- MCP下でのプロンプト、リソース、ツールをサポートします。
- マルチワークスペースをサポート：例えば、DB1のワークスペースをアクティブ化したり、別のワークスペースのDB2に切り替えたりすることで、DB1のコンテキストがMCPクライアントに混入するのを防ぎます。
- ツールレベルでのオン/オフ切り替え。

このアプリはセルフホスト可能で、無料でオープンソースです。クラウドバージョンもあります。クラウドバージョンを使用してこのアプリがどのように機能するかを試すことができますが、Dockerに慣れている場合はセルフホストすることを実際にお勧めします。これにより、低遅延で無制限のアクセスが可能になり、エンドツーエンドでの完全なプライベート操作が保証されます。

デモビデオは [https://metamcp.com/](https://metamcp.com/) で確認できます。以下は概要のスクリーンショットです。

[![MetaMCP概要スクリーンショット](https://github.com/metatool-ai/metatool-app/raw/main/screenshot.png)](https://github.com/metatool-ai/metatool-app/blob/main/screenshot.png) [![MetaMCPツール管理スクリーンショット](https://github.com/metatool-ai/metatool-app/raw/main/tool_management.png)](https://github.com/metatool-ai/metatool-app/blob/main/tool_management.png)

## 検証済みプラットフォーム

- Windows（MCP公式TypeScript SDK 1.8.0以降、これに合わせて更新済みで動作します） [#15](https://github.com/metatool-ai/metatool-app/issues/15)
- Mac
- Linux

## インストール

MetaMCPアプリのこのセルフホスト可能バージョンを開始する最も簡単な方法は、リポジトリをクローンし、Docker Composeを使用して実行することです。

```
git clone https://github.com/metatool-ai/metatool-app.git
cd metatool-app
cp example.env .env
docker compose up --build -d
```

次に、ブラウザで [http://localhost:12005](http://localhost:12005/) を開いてMetaMCPアプリを開きます。

npx（Node.jsベースのmcp）とuvx（Pythonベースのmcp）をグローバルにインストールすることをお勧めします。uvのインストールについては、[https://docs.astral.sh/uv/getting-started/installation/](https://docs.astral.sh/uv/getting-started/installation/) を確認してください。

MetaMCPに接続する推奨の方法は、SSEエンドポイント経由です。

```
http://localhost:12007/sse (Authorization: Bearer <your-api-key>ヘッダー付き)
```

または、ヘッダーを設定できない場合は、このURLベースのエンドポイントを使用できます。

```
http://localhost:12007/api-key/<your-api-key>/sse
```

APIキーは、MetaMCPアプリのAPIキーページから取得できます。

ワークスペースがデフォルトのリモートモードであっても、これらの方法を使用できます。

Claude Desktopの場合、設定jsonは次のようになります。

```
{
  "mcpServers": {
    "MetaMCP": {
      "command": "npx",
      "args": ["-y", "@metamcp/mcp-server-metamcp@latest"],
      "env": {
        "METAMCP_API_KEY": "<your api key>",
        "METAMCP_API_BASE_URL": "http://localhost:12005"
      }
    }
  }
}
```

#### Cursorの設定

Cursorの場合、環境変数を入力するのが簡単ではないため、代わりに引数を使用できます。

```
