# Spanner Graph と LangChain を使用して GraphRAG アプリケーションを構築する

ref: <https://cloud.google.com/blog/ja/products/databases/using-spanner-graph-with-langchain-for-graphrag>

---

## 概要

- **Spanner Graph**はグラフ・リレーショナル・検索・AI機能を統合し、無制限のスケーラビリティを実現。
- **GraphRAG**は相互接続データから高関連な分析情報を抽出するQAシステム構築の先端技術。
- **LangChain**とSpanner Graphの統合により、関係認識型RAGシステムの開発が容易に。

---

## RAGとGraphRAGの違い

- RAG（検索拡張生成）は外部データソースを推論時に参照し、より正確な応答を生成。
- ベクトルベースRAGは関連コンテンツ取得に強いが、データの関係性（例：商品の依存関係）を捉えにくい。
- **GraphRAG**はナレッジグラフ＋ベクトル検索で、関係性を含むリッチな文脈をLLMに提供。

---

## 小売アプリケーション構築例

### シナリオ

- 商品仕様・バンドル・セール等の大量データに、商品・カテゴリ・顧客などの関係が含まれる。
- GraphRAGはこれらの関係をグラフで表現し、つながりをたどって充実した情報を提供。

### ステップ1: ナレッジグラフ構築

- LangChainの`LLMGraphTransformer`で非構造化ドキュメント→グラフ変換。
- ノードタイプ例: Product, Bundle, Deal, Category, Segment
- 関係タイプ例: In_Bundle, Is_Accessory_Of, Is_Upgrade_Of, Has_Deal
- プロパティ例: name, price, weight, deal_end_date, features
- コード例：

```python
# ドキュメントを読み込む
loader = DirectoryLoader('...')
documents = loader.load()
# グラフに変換
llm_transformer = LLMGraphTransformer(
  llm=ChatVertexAI(),
  allowed_nodes=["Product", "Bundle", "Deal", "Category", "Segment"],
  allowed_relationships=["In_Category","In_Bundle", "Is_Accessory_Of", "Is_Upgrade_Of", "Has_Deal"],
  node_properties=["name", "price", "weight", "deal_end_date", "features"],
)
graph_documents = llm_transformer.convert_to_graph_documents(documents)
```

- ベクトルエンベディング生成例：

```python
embedding_service = VertexAIEmbeddings()
for graph_document in graph_documents:
  for node in graph_document.nodes:
    if "features" in node.properties:
      node.properties["embedding"] = embedding_service.embed_query(node.properties["features"])
```

- Spanner組み込みのエンベディング生成も利用可能。

### ステップ2: Spanner Graphへ保存

- `SpannerGraphStore`でグラフをSpanner Graphに保存。
- 重複ノード・エッジの調整で整合性向上。
- コード例：

```python
from langchain_google_spanner import SpannerGraphStore
# 初期化
graph_store = SpannerGraphStore(
  instance_id=INSTANCE,
  database_id=DATABASE,
  graph_name=GRAPH_NAME,
)
# 保存
graph_store.add_graph_documents(graph_documents)
```

### ステップ3: グラフの調査

- [Spanner Graph Notebook](https://github.com/cloudspannerecosystem/spanner-graph-notebook)でスキーマ・データを可視化。
- 例：

```python
%%spanner_graph --project PROJECT --instance INSTANCE --database DATABASE
GRAPH retail_graph
MATCH p = ()->()
RETURN TO_JSON(p) AS path_json
LIMIT 200;
```

- ![グラフスキーマ例](https://storage.googleapis.com/gweb-cloudblog-publish/original_images/1_scaled_graph_2.gif)

### ステップ4: コンテキスト取得

- `SpannerGraphVectorContextRetriever`で自然言語質問から関連ノードをベクトル検索し、近傍サブグラフを探索。
- コード例：

```python
retriever = SpannerGraphVectorContextRetriever.from_params(
  graph_store,
  VertexTextEmbedding(),
  label_expr="Product",
  expand_by_hops=1,
)
question = "I am looking for a beginner drone. Please give me some recommendations."
context = retriever.invoke(question)
```

- ![近傍サブグラフ例](https://storage.googleapis.com/gweb-cloudblog-publish/original_images/2_neighborhood.gif)

---

## GraphRAGと従来RAGの比較

| 従来のRAG | GraphRAG |
|---|---|
| SkyHawk Zephyr Drone/Starter Packageを初心者向けに推奨。129.99ドル。基本スペック・操作性・耐久性を説明。 | SkyHawk Zephyr Droneの詳細（HDカメラ、長時間飛行等）＋セール価格（109.99ドル）、バンドル商品、アクセサリー、アップグレード（2.0/199.99ドル）まで提示。 |

**GraphRAGの強み**

- アクセサリーや関連セール、アップグレード情報など、よりリッチな文脈を自動で抽出。
- 推薦の根拠や選択肢が明確。

---

## まとめ・活用方法

- Spanner GraphとLangChainの組み合わせで、エンタープライズグレードの信頼性・スケーラビリティ・分散グラフ処理を活かしたGraphRAG開発が容易。
- [GitHubリポジトリ](https://github.com/googleapis/langchain-google-spanner-python?tab=readme-ov-file#spanner-graph-store-usage)や[ノートブックチュートリアル](https://github.com/googleapis/langchain-google-spanner-python/blob/main/docs/graph_rag.ipynb)で詳細を確認可能。
- [Spanner Graphの機能](https://cloud.google.com/spanner/docs/graph/overview?hl=ja)や[クイックセットアップガイド](https://cloud.google.com/spanner/docs/graph/set-up?hl=ja)も参照。

---

## 参考・関連リンク

- [Spanner Graph スキーマ](https://cloud.google.com/spanner/docs/graph/schema-overview?hl=ja)
- [Vertex AI テキストエンベディング](https://cloud.google.com/spanner/docs/ml-tutorial-embeddings?hl=ja)
- [Spanner Graph Notebook](https://github.com/cloudspannerecosystem/spanner-graph-notebook)
- [GraphRAGユースケースノートブック](https://github.com/googleapis/langchain-google-spanner-python/blob/main/docs/graph_rag.ipynb)

---

## 制限事項

- 本記事は2025年3月22日時点の内容を抄訳。
- 実装やAPIは今後変更される可能性あり。
