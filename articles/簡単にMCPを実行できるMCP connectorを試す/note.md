---
title: "簡単にMCPを実行できるMCP connectorを試す"
source: "https://zenn.dev/nikechan/articles/4a87c0b7550df0"
author:
  - "ニケちゃん"
published: 2025-05-23
created: 2025-05-24
description: |
  AnthropicのメッセージAPIから直接MCPサーバーに接続できる新機能「MCP connector」の使い方と実装例を紹介。クライアントアプリなしでMCPサーバーを利用する方法をPythonサンプルコードで解説。
tags:
  - MCP
  - Model Context Protocol
  - Anthropic
  - Claude
  - API
  - Python
---

# 簡単にMCPを実行できるMCP connectorを試す

## 概要

通常、MCPサーバーを利用するにはそのクライアントアプリ（Claude Desktop、Cursor、Mastraなど）が必要ですが、AnthropicのメッセージAPIから発表された**MCP connector**を使用すれば、クライアントアプリなしで直接MCPサーバーに接続できるようになりました。

## 実装方法

### セットアップ

必要なパッケージをインストール：

```bash
pip install anthropic
```

環境変数の設定：

```bash
ANTHROPIC_API_KEY=xxx
```

### サンプルコード

```python
import os
import anthropic
import sys

def main():
    # 環境変数からキーを取得
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY環境変数を設定してください。")

    # Client を初期化
    client = anthropic.Anthropic(
        api_key=api_key,
    )

    # コマンドライン引数から content を取得
    if len(sys.argv) < 2:
        print("ユーザメッセージを指定してください。")
        sys.exit(1)
    user_content = sys.argv[1]

    response = client.beta.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        messages=[
            {
                "role": "user",
                "content": user_content,
            }
        ],
        mcp_servers=[
            {
                "type": "url",
                "url": "https://mcp.deepwiki.com/sse",
                "name": "deepwiki",
            },
            {
                "type": "url",
                "url": "https://xxxxx.workers.dev/mcp",
                "name": "my-mcp-worker",
            },
        ],
        betas=["mcp-client-2025-04-04"],
    )

    # レスポンス表示
    print("=== Claude の応答 ===")
    for content in response.content:
        if content.type == "text":
            print(content.text)
        elif content.type == "mcp_tool_use":
            print("tool use: ", content.name)

if __name__ == "__main__":
    main()
```

### 設定の詳細

MCP connectorの特別な設定は**mcp_servers**と**betas**パラメータのみです。

#### mcp_serversの設定形式

```json
{
  "type": "url",
  "url": "https://example-server.modelcontextprotocol.io/sse",
  "name": "example-mcp",
  "tool_configuration": {
    "enabled": true,
    "allowed_tools": ["example_tool_1", "example_tool_2"]
  },
  "authorization_token": "YOUR_TOKEN"
}
```

**必須パラメータ:**

- `type`: 現在は"url"のみ対応
- `url`: MCPサーバーのURL
- `name`: サーバー名

**オプションパラメータ:**

- `tool_configuration`: 使用するツールの指定
- `authorization_token`: 認証用トークン

**重要な制限事項:**

- 現在サポートされる形式はSSE形式またはStreamable HTTP形式のみ
- ローカルのstdin形式MCPサーバーは非対応

## 実際の使用例

### 利用できるツールの確認

```bash
python main.py 使用できるツールを教えて下さい。
```

**実行結果:**
利用可能な4つのツールが表示されます：

1. **deepwiki_read_wiki_structure** - GitHubリポジトリのドキュメントトピック一覧取得
2. **deepwiki_read_wiki_contents** - GitHubリポジトリのドキュメント内容表示
3. **deepwiki_ask_question** - GitHubリポジトリについての質問機能
4. **my-mcp-worker_dice_roll** - サイコロロール機能（1-100面対応）

### GitHubリポジトリの解析例

```bash
python main.py tegnike/aituber-kitリポジトリについて端的に解説してください
```

DeepWiki MCPを使用して`tegnike/aituber-kit`リポジトリの詳細な解析結果が返され、AIVTuber作成ツールキットの機能や特徴が包括的に説明されます。

### サイコロ機能の使用例

```bash
python main.py サイコロを振ってください
```

**実行結果:**

```
サイコロを振りますね！
tool use: dice_roll
サイコロの結果は **5** でした！🎲
```

## 使用したMCPサーバー

### SSE形式

- **DeepWiki MCP**: GitHubリポジトリのドキュメント解析機能を提供
  - URL: `https://mcp.deepwiki.com/sse`

### Streamable HTTP形式

- **Cloudflare Workers MCP**: サイコロロール機能を提供
  - カスタム実装（azukiazusaさんの記事を参考）

## まとめ

MCP connectorの導入により、従来のクライアントアプリケーションに依存せず、AnthropicのメッセージAPI経由で直接MCPサーバーにアクセスできるようになりました。これにより、MCPの活用がより柔軟で幅広いユースケースに対応可能となっています。

**主な利点:**

- クライアントアプリケーション不要
- 既存のAPIワークフローに統合可能
- 複数のMCPサーバーを同時利用可能
- シンプルな設定とコード実装

**制限事項:**

- URL形式（SSE/Streamable HTTP）のみサポート
- ローカルstdin形式MCPサーバーは非対応
- betasパラメータが現在必須
