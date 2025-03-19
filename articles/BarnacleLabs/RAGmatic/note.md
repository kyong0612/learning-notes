# BarnacleLabs/RAGmatic

ref: <https://github.com/BarnacleLabs/RAGmatic>

## 概要

RAGmatic（BarnacleLabs/RAGmatic）は、PostgreSQLデータベース内のデータに対して自動的にベクトル埋め込み（embeddings）を生成・更新するためのライブラリです。このツールは特に検索拡張生成（Retrieval-Augmented Generation/RAG）システムの構築をより簡単にすることを目的としています。

## 主な特徴

1. **継続的な埋め込み更新**：PostgreSQLテーブルの変更を監視し、データが変更されるたびに自動的に埋め込みを更新します。

2. **ロバスト性**：イベント駆動型のトリガーがACID保証付きの埋め込みジョブを作成し、キューベースのワーカーがバックグラウンドでそれらを処理します。

3. **柔軟性**：独自の埋め込みパイプラインを使用して、任意のモデルプロバイダーと連携できます。すべてのカラムを使用したり、必要に応じてチャンキングしたり、メタデータで埋め込みを強化したりできます。

4. **PostgreSQL上で動作**：[pgvector](https://github.com/pgvector/pgvector)を利用したシームレスなベクトル検索とハイブリッド検索が可能です。

5. **重複排除**：既存のチャンクの高価な再埋め込みを避けるための重複排除機能が内蔵されています。

6. **複数の埋め込みパイプライン**：テーブルごとに複数の埋め込みパイプラインを実行して比較し、独自の評価を作成できます。

7. **複雑なデータ型のサポート**：JSONB、画像、BLOBデータなどの複雑なデータ型をサポートしています。

## 動作の仕組み

1. RAGmaticはデータベーストリガーを使用して、選択したテーブルの変更を`ragmatic_<pipeline_name>`という新しいPostgreSQLスキーマで追跡します。

2. `RAGmatic.create()`でトラッキングを設定すると、通常通りにデータベースを使用することができます。

3. テーブルへの変更は検出され、RAGmaticのワーカーによって処理されます。チャンキングと埋め込み生成は完全に設定可能で、不必要な再埋め込みを避けるためにデータの重複排除も行われます。

4. 処理された埋め込みは`ragmatic_<pipeline_name>.chunks`テーブルにpgvectorのベクトルデータ型として保存されます。これらのベクトルはpgvectorの[`vector_similarity_ops`](https://github.com/pgvector/pgvector?tab=readme-ov-file#querying)関数を使用してSQLで検索でき、既存のテーブルと結合して結果をフィルタリングすることもできます。

## 利用方法

基本的な利用手順：

1. ライブラリのインストール：

```bash
npm install ragmatic
```

2. テーブルのトラッキング設定：

```typescript
import RAGmatic from "ragmatic";
import { chunk } from "llm-chunk";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const blogPostsToEmbeddings = await RAGmatic.create<BlogPost>({
  connectionString: process.env.DATABASE_URL!,
  name: "blog_posts_openai",
  tableToWatch: "blog_posts",
  embeddingDimension: 1536,
  recordToChunksFunction: async (post: any) => {
    return chunk(post.content, {
      minLength: 100,
      maxLength: 1000,
      overlap: 20,
      splitter: "sentence",
    }).map((chunk, index) => ({
      text: chunk,
      title: post.title,
    }));
  },
  chunkToEmbeddingFunction: async (chunk: ChunkData) => {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: `title: ${chunk.title} content: ${chunk.text}`,
    });
    return {
      embedding: embedding.data[0].embedding,
      text: `title: ${chunk.title} content: ${chunk.text}`,
    };
  },
});
```

3. 埋め込みパイプラインの開始：

```typescript
await blogPostsToEmbeddings.start();
```

4. データの検索：

```typescript
// クエリのベクトル埋め込みを生成
const query = "pgvectorはPostgreSQLのベクトル拡張機能です";
const queryEmbedding = await generateEmbedding(query);
const threshold = 0.5;
const topK = 4;

// chunksテーブルとblog_postsテーブルを結合してタイトルを取得
const result = await client.query(
  `WITH similarity_scores AS (
    SELECT 
      c.text AS chunk_text,
      c.docId,
      1 - (cosine_distance(c.embedding, $1)) AS similarity
    FROM ragmatic_blog_posts_openai.chunks c
    LEFT JOIN blog_posts b ON c.docId = b.id
  )
  SELECT similarity, chunk_text, docId, b.title
  FROM similarity_scores
  WHERE similarity > $2
  ORDER BY similarity DESC
  LIMIT $3;
  `,
  [queryEmbedding, threshold, topK],
);
```

## サンプル例と高度な機能

リポジトリには次のような例が含まれています：

1. **シンプルなRAG**：基本的なRAGシステムの実装例

2. **FirecrawlとOpenAIを使用したウェブサイトクローリングと検索**：より高度な実装例

3. **HyDE（Hypothetical Document Embeddings）**：検索結果を改善するための高度なテクニックの実装例。HyDEは元のクエリよりも保存されたドキュメントに潜在空間でより類似した仮想的なドキュメントを生成する手法です。

## 最新の開発状況

リポジトリは活発に開発が行われており、最新のコミットは2025年3月14日に行われています。現在のバージョンは0.0.5で、継続的に改良が進められています。

## 技術的な特徴

- TypeScriptで実装されています
- Node.js v20以上が必要です
- PostgreSQLデータベースとpgvector拡張機能が必要です
- 複数の埋め込みモデルと連携可能です（例：OpenAIのモデル）
- DrizzleライブラリによるSQLクエリのサポート

RAGmaticは、pgvectorだけでは提供されていない埋め込みの自動更新と柔軟な埋め込みパイプラインを提供することで、RAGシステムの構築と維持を簡素化しています。
