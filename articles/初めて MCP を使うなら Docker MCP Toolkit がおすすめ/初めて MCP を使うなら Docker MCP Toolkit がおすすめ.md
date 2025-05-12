---
title: "初めて MCP を使うなら Docker MCP Toolkit がおすすめ"
source: "https://qiita.com/falya128/items/23020ddba7a7d1ce2e1f"
author:
  - "falya128"
published: 2025-05-09
created: 2025-05-12
description: |
  Docker Desktop の新機能である Docker MCP Toolkit があれば、非常に簡単な手順で MCP ツールを利用できます。今回は MCP クライアントに Cline を用いて Docker MCP Toolkit を利用する方法を解説していきたいと思います。
tags:
  - "Docker"
  - "AI"
  - "VSCode"
  - "MCP"
  - "cline"
  - "clippings"
---

## 概要

Docker Desktop の新機能「Docker MCP Toolkit」を利用すると、簡単な手順でMCP（Multi-Cognitive-Processors）ツールを使用できます。この記事では、MCPクライアントとして Cline を使用し、Docker MCP Toolkit を活用する方法を解説します。

## Docker MCP Toolkit で利用可能なMCPサーバ

2025年5月10日時点で、109のMCPサーバが利用可能です。主要なものとしては以下があります。

* **Filesystem MCP Server**: ローカルファイルの操作
* **Fetch MCP Server**: Webコンテンツの取得
* **Playwright MCP Server**: ブラウザ操作
* **LINE MCP Server**: メッセージ送信
* **PostgreSQL readonly MCP Server**: データベース取得
* **GitHub MCP Server**: バージョン管理
* **Brave Search MCP Server**: 情報検索

## 設定手順

1. **Docker Desktop の Extensions から「Docker MCP Toolkit」をインストールします。**
    [![](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/339770/ea9d0195-4196-4e8b-9df9-1f334ccb8f34.png)](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F339770%2Fea9d0195-4196-4e8b-9df9-1f334ccb8f34.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=7bf55ed6480c606144acc5ca728203a1)

2. **MCP Toolkit を開き、使用したいMCPサーバを有効化します。**
    [![](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/339770/efbd117e-842c-4626-8eb3-1e2b86980a6f.png)](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F339770%2Fefbd117e-842c-4626-8eb3-1e2b86980a6f.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=5819f242ecf6d41ab8687896dafa3273)

3. **MCPクライアント（例: Cline）の設定を行います。**
    Cline の MCP Settings に、各MCPサーバのREADMEに記載されている設定内容を追記します。
    以下は Fetch MCP Server の設定例です。

    ```json
    {
      "mcpServers": {
        "fetch": {
          "command": "docker",
          "args": [
            "run",
            "-i",
            "--rm",
            "mcp/fetch"
          ]
        }
      }
    }
    ```

4. **動作確認を行います。**
    有効化したMCPサーバが利用可能になっていることを確認します。
    [![](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/339770/3c35b70f-346d-43ef-88d4-114d986fb014.png)](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F339770%2F3c35b70f-346d-43ef-88d4-114d986fb014.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=cb3d5fb721d507fcc7eb2e15b8fcf25d)
    例えば、Fetch MCP Server を用いてWebコンテンツが取得できることを確認できます。
    [![](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/339770/76174dcd-4942-4714-94e2-1f0151e8dba7.png)](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F339770%2F76174dcd-4942-4714-94e2-1f0151e8dba7.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=16faf7de2bb410a88dfdad7d83ea773c)

## まとめ

Docker Desktop がインストールされていれば、追加のインストールや複雑なコマンド実行なしに、スムーズにMCPサーバを利用開始できます。この手軽さから、MCPツールを初めて試す方には特におすすめです。

---
*元のQiita記事のフッター部分は要約に含めませんでした。*
