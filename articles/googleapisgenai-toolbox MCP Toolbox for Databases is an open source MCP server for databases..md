---
title: "googleapis/genai-toolbox: MCP Toolbox for Databases"
source: "https://github.com/googleapis/genai-toolbox"
author:
  - "googleapis"
published:
created: 2025-07-14
description: |
  MCP Toolbox for Databases is an open source MCP server for databases. It enables you to develop tools easier, faster, and more securely by handling the complexities such as connection pooling, authentication, and more.
tags:
  - "mcp"
  - "databases"
  - "llms"
  - "genai"
  - "toolbox"
  - "go"
---

[![logo](https://github.com/googleapis/genai-toolbox/raw/main/logo.png)](https://github.com/googleapis/genai-toolbox/blob/main/logo.png)

# MCP Toolbox for Databases

MCP Toolbox for Databasesは、データベース用のオープンソースMCP（Mission Critical Platform）サーバーです。接続プーリングや認証などの複雑な処理を代行することで、開発者はより簡単、迅速、かつ安全にツールを開発できます。

> **Note:** MCP Toolbox for Databasesは現在ベータ版であり、安定版（v1.0）がリリースされるまでは互換性のない変更が行われる可能性があります。

## なぜToolboxか？ (Why Toolbox?)

Toolboxは、AIエージェントがデータベースのデータにアクセスするためのツール構築を支援し、以下の利点を提供します。

* **開発の簡素化**: 10行未満のコードでツールをエージェントに統合し、ツールを複数のエージェントやフレームワークで再利用し、新しいバージョンのツールを容易にデプロイできます。
* **パフォーマンスの向上**: 接続プーリングや認証などのベストプラクティスを実装しています。
* **セキュリティの強化**: 統合された認証により、データへのより安全なアクセスが可能です。
* **エンドツーエンドの可観測性**: OpenTelemetryを標準でサポートし、メトリクスとトレーシングをすぐに利用できます。

### ⚡ AIデータベースアシスタントでワークフローを強化

IDEをMCP Toolboxでデータベースに接続することで、複雑で時間のかかるデータベースタスクをAIアシスタントに委任し、開発を高速化できます。

* **平易な英語でのクエリ**: IDEから自然言語でデータと対話できます。
* **データベース管理の自動化**: AIアシスタントがクエリ生成、テーブル作成、インデックス追加などを処理します。
* **コンテキスト対応のコード生成**: リアルタイムのデータベーススキーマを深く理解したアプリケーションコードとテストを生成します。
* **開発オーバーヘッドの削減**: 手作業でのセットアップや定型的なコードを大幅に削減します。

## 全体アーキテクチャ (General Architecture)

Toolboxは、アプリケーションのオーケストレーションフレームワークとデータベースの間に位置し、ツールの変更、配布、呼び出しを行うコントロールプレーンを提供します。これにより、ツールを中央で管理し、アプリケーションを再デプロイすることなくツールを更新できます。

[![architecture](https://github.com/googleapis/genai-toolbox/raw/main/docs/en/getting-started/introduction/architecture.png)](https://github.com/googleapis/genai-toolbox/blob/main/docs/en/getting-started/introduction/architecture.png)

## はじめに (Getting Started)

### サーバーのインストール

最新バージョンは[リリースページ](https://github.com/googleapis/genai-toolbox/releases)で確認できます。インストール方法は以下の通りです。

**バイナリ**

```bash
# see releases page for other versions
export VERSION=0.9.0
curl -O https://storage.googleapis.com/genai-toolbox/v$VERSION/linux/amd64/toolbox
chmod +x toolbox
```

**コンテナイメージ**

```bash
# see releases page for other versions
export VERSION=0.9.0
docker pull us-central1-docker.pkg.dev/database-toolbox/toolbox/toolbox:$VERSION
```

**ソースからコンパイル**

```bash
go install github.com/googleapis/genai-toolbox@v0.9.0
```

### サーバーの実行

`tools.yaml` を設定し、`toolbox` を実行してサーバーを起動します。

```bash
./toolbox --tools-file "tools.yaml"
```

### アプリケーションの統合

サーバーが起動したら、各種フレームワーク用のクライアントSDKを使用してツールをアプリケーションにロードできます。

* **Python** ([Github](https://github.com/googleapis/mcp-toolbox-sdk-python))
* **Javascript/Typescript** ([Github](https://github.com/googleapis/mcp-toolbox-sdk-js))
* **Go** ([Github](https://github.com/googleapis/mcp-toolbox-sdk-go))

各言語（Python, JS/TS, Go）には、Core SDKのほか、LangChain/LangGraph, LlamaIndex, Genkitなどのフレームワークに特化したSDKが用意されています。

**Python (Core SDK) の例:**

```python
from toolbox_core import ToolboxClient
# update the url to point to your server
async with ToolboxClient("http://127.0.0.1:5000") as client:
    # these tools can be passed to your application!
    tools = await client.load_toolset("toolset_name")
```

## 設定 (Configuration)

Toolboxの主な設定は `tools.yaml` ファイルで行います。

### Sources

`sources`セクションで、Toolboxがアクセスするデータソースを定義します。

```yaml
sources:
  my-pg-source:
    kind: postgres
    host: 127.0.0.1
    port: 5432
    database: toolbox_db
    user: toolbox_user
    password: my-password
```

### Tools

`tools`セクションで、エージェントが実行できるアクション（ツールの種類、ソース、パラメータなど）を定義します。

```yaml
tools:
  search-hotels-by-name:
    kind: postgres-sql
    source: my-pg-source
    description: Search for hotels based on name.
    parameters:
      - name: name
        type: string
        description: The name of the hotel.
    statement: SELECT * FROM hotels WHERE name ILIKE '%' || $1 || '%';
```

### Toolsets

`toolsets`セクションで、まとめてロードしたいツールのグループを定義できます。

```yaml
toolsets:
    my_first_toolset:
        - my_first_tool
        - my_second_tool
```

## バージョン管理 (Versioning)

このプロジェクトは[セマンティックバージョニング](https://semver.org/)を使用しています (`MAJOR.MINOR.PATCH`)。

## 貢献 (Contributing)

貢献は歓迎されています。詳細は[CONTRIBUTING.md](https://github.com/googleapis/genai-toolbox/blob/main/CONTRIBUTING.md)を参照してください。

## コミュニティ (Community)

開発者と繋がるには[Discordコミュニティ](https://discord.gg/GQrFB3Ec3W)に参加してください。
