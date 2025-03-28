# Claude DesktopとQdrantで超お手軽ナレッジベースの構築

ref: <https://zenn.dev/inurun/articles/fc0ec63cad574b>

## 概要

この記事では、Claude DesktopとQdrantというベクトル検索エンジンをModel Context Protocol（MCP）を使って連携させ、簡単なナレッジベースを構築する方法が解説されています。

## TL;DR（要点）

- **qdrant/mcp-server-qdrant**を使えばClaude Desktopからベクトル検索エンジンを操作できる
- ベクトルデータベースなので、LLMとの相性が良い
- 「**ここまでのチャットを整理して保存しておいて**」ができる機能が魅力的

![MCP、Qdrant、Claudeのアイコン](https://storage.googleapis.com/zenn-user-upload/topics/59acb4066e.png)

## 1. Qdrantとは

- ベクトル検索エンジンであり、テキストをベクトル化して保存・検索
- 通常のキーワード検索と異なり、**意味的な類似性**に基づいて結果を返す
- 「先週のミーティングの決定事項」などの自然言語クエリで関連情報を検索可能
- PostgreSQLやSQLiteのようにデータ構造を考える必要がない

## 2. Qdrant MCPの導入方法

### 2.1 前提条件

- Qdrantサーバー
- Node.js
- Docker

### 2.2 Qdrantのインストール

```bash
docker run -d --name qdrant_local -p 6333:6333 -p 6334:6334 -v "$HOME/qdrant_storage:/qdrant/storage:z" qdrant/qdrant
```

#### アクセスポイント

- REST API: <http://localhost:6333/>
- Web UI: <http://localhost:6333/dashboard>

### 2.3 Claudeとの連携設定

`claude_desktop_config.json`ファイルを編集:

```json
{
  "mcpServers": {
    "qdrant": {
      "command": "uvx",
      "args": ["mcp-server-qdrant"],
      "env": {
        "QDRANT_URL": "http://localhost:6333",
        "COLLECTION_NAME": "your-collection",
        "EMBEDDING_MODEL": "sentence-transformers/all-MiniLM-L6-v2"
      }
    }
  }
}
```

主な環境変数:

- **QDRANT_URL**: Qdrantサーバーの URL
- **COLLECTION_NAME**: コレクション名（必須）
- **EMBEDDING_MODEL**: 使用する埋め込みモデル名

## 3. Claude Desktopでの使用例

記事では、Honoフレームワーク（v4.7.0〜v4.7.5）のリリースノートをClaudeに整理してもらい、Qdrantに保存する例が示されています。

![Claude Desktopでの使用例](https://storage.googleapis.com/zenn-user-upload/b69510faaa16-20250324.png)

整理された情報がQdrantに保存され、メタデータも適切に記録されています:

```json
{
  "type": "documentation",
  "topic": "framework_release_notes",
  "framework": "Hono",
  "versions": [
    "4.7.0",
    "4.7.5"
  ],
  "date": "2025-03-24",
  "features": [
    "Proxy Helper",
    "Language Middleware",
    "JWK Auth Middleware",
    "Standard Schema Validator"
  ],
  "category": "web_development",
  "language": "Japanese"
}
```

![保存されたデータのダッシュボード表示](https://storage.googleapis.com/zenn-user-upload/160c21096374-20250324.png)

新規チャットからこの保存された情報を検索・参照できることも確認されています。

![新規チャットからの参照](https://storage.googleapis.com/zenn-user-upload/389cbf64ba2e-20250324.png)

## 4. まとめ

ベクトルデータベースの初心者でも簡単に操作でき、ベストプラクティスや指示を突き詰めていくことで、自分好みのパーソナルなベクトル検索エンジンを構築することができます。

## 主なメリット

1. **意味的な検索**: キーワードではなく意味での検索が可能
2. **チャット内容の整理・保存**: 会話の要約や重要ポイントを保存可能
3. **LLMの知識拡張**: Claudeが知らない情報も保存して後から参照可能
4. **簡単な実装**: 複雑なデータ構造を考えずに使用可能
5. **個人最適化**: 自分に合ったナレッジベースの構築が可能
