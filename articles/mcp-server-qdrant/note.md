# mcp-server-qdrant

ref: <https://github.com/qdrant/mcp-server-qdrant>

提供されたURL（<https://github.com/qdrant/mcp-server-qdrant）は、QdrantとLLM（大規模言語モデル）アプリケーションを接続するためのModel> Context Protocol（MCP）サーバーの公式リポジトリです。

## MCPについて

Model Context Protocol（MCP）は、LLMアプリケーションと外部データソース・ツールの間でシームレスな統合を可能にするオープンプロトコルです。Anthropicによって開発され、「AIアプリケーションのためのUSB-C」とも呼ばれています。異なるAIシステムと様々なデータソースの標準化されたコミュニケーション方法を提供し、コンテキスト管理、セキュリティ強化、複雑なワークフローの実現を支援します。

## Qdrantとは

Qdrantは高次元ベクトルの類似性検索に特化したベクトルデータベースです。HNSWグラフなどの技術を使用して、大量のデータから効率的に類似項目を検索できます（サブリニア時間で検索可能）。特にテキストデータの「セマンティック検索」に有効で、以下のような特徴があります：

- 高度な量子化技術によるメモリ使用量削減
- クラウドネイティブな分散設計
- 使いやすいAPI
- エンタープライズグレードのセキュリティ
- さまざまな埋め込みモデルとの統合

## mcp-server-qdrantの機能

このリポジトリはQdrantベクトルデータベース上にセマンティックメモリレイヤーを提供し、主に以下の2つのツールを実装しています：

1. **qdrant-store**: 情報をQdrantデータベースに保存するツール
   - 入力: 保存する情報（文字列）とオプションのメタデータ（JSON）
   - 出力: 確認メッセージ

2. **qdrant-find**: Qdrantデータベースから関連情報を検索するツール
   - 入力: 検索クエリ（文字列）
   - 出力: 関連する保存情報を個別メッセージとして返す

## 使用方法

以下のような方法でインストール・設定が可能です：

1. **uvxを使用**:

```
QDRANT_URL="http://localhost:6333" \
COLLECTION_NAME="my-collection" \
EMBEDDING_MODEL="sentence-transformers/all-MiniLM-L6-v2" \
uvx mcp-server-qdrant
```

2. **Dockerを使用**:

```
docker run -p 8000:8000 \
  -e QDRANT_URL="http://your-qdrant-server:6333" \
  -e QDRANT_API_KEY="your-api-key" \
  -e COLLECTION_NAME="your-collection" \
  mcp-server-qdrant
```

3. **Claude Desktopとの連携**:
Claude Desktopの設定ファイルに追加することで、Claudeが直接Qdrantのベクトルデータベースを検索・活用できるようになります。

## 技術的特徴

- 主にPython実装（97.9%）
- デフォルトで`sentence-transformers/all-MiniLM-L6-v2`埋め込みモデルを使用
- 複数のトランスポートプロトコル（stdio、sse）をサポート
- Apache-2.0ライセンスで提供

このリポジトリは、LLMアプリケーション（特にAnthropicのClaudeなど）とQdrantベクトルデータベースを組み合わせて、強力なセマンティック検索・メモリ機能を持つAIアプリケーションを構築するための優れた参照実装となっています。
