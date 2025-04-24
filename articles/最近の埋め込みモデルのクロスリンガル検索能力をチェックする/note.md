# 最近の埋め込みモデルのクロスリンガル検索能力をチェックする

ref: <https://note.com/oshizo/n/nf289df40859a>

## 記事の要約

### 背景

* 筆者は最近、英語と日本語が混在するクエリで日本語のドキュメントを検索するタスク（クロスリンガル検索）を経験。
* 日本語クエリと比較して英語クエリの検索精度が低い傾向が見られた。
* これを機に、最近の有力な埋め込みモデルのクロスリンガル検索能力を比較検討。

### 結論（先行提示）

* **日本語クエリ-日本語ドキュメント重視**: `cl-nagoya/ruri-v3-310m`
* **英語クエリを含めたバランス重視**: Cohere `embed-v4.0` (マルチモーダル対応も魅力)
* **注意**: データセット1つでの簡易評価のため、参考情報として捉え、実際のタスクで評価することを推奨。

### 最近リリースされた埋め込みモデル (2025/4時点)

* **日本語モデル**:
  * `cl-nagoya/ruri-v3-310m`: 日本語ModernBERTベース、JMTEBスコア最強。
  * `pfnet/plamo-embedding-1b`: plamo-1bベース。
* **マルチリンガルモデル**:
  * `intfloat/multilingual-e5-large`: 長らく利用されてきたモデル。
  * `BAAI/bge-m3`: dense/sparse/colbertの3機能を持つ。
  * `jinaai/jina-embeddings-v3`: タスク特化LoRA付き。商用利用はAPIのみ。
* **API**:
  * OpenAI `text-embedding-3-large`: 2024/1リリース。
  * Cohere `embed-v4.0`: **マルチモーダル対応** (PDF画像も直接埋め込み可能)。
  * Google `text-multilingual-embedding-002`: 2024/5リリース。
  * Google `gemini-embedding-exp-03-07`: 2025/3リリースのプレビュー版。

### 評価方法

* **データセット**: JMTEBの`JaGovFaqs` (日本の官公庁QAデータセット) を使用。
  * クエリ: 3,420件 (DeepSeek V3 APIで英訳)
  * コーパス: 22,794件 (日本語のまま)
* **タスク**: 英語クエリで日本語文書を検索するクロスリンガル検索タスク。
* **評価指標**: Sentence Transformersの`InformationRetrievalEvaluator`を使用し、`nDCG@10`で評価。

### 評価結果と考察

(画像: 評価結果の散布図 - 縦軸: JA-JA検索スコア, 横軸: EN-JA検索スコア)

* **`ruri-v3`シリーズ**:
  * 日本語検索(JA-JA)に非常に強い。
  * クロスリンガル検索(EN-JA)ではAPIモデルよりやや劣る。
  * モデルサイズが大きいほどEN-JAスコアが向上し、`x=y`のライン（日本語検索との差が小さい）に近づく。小さいモデルほど英訳の影響が大きい。
* **OpenAI `text-embedding-3-large`**:
  * `x=y`ラインに最も近く、英訳によるスコア低下が少ない (0.72 → 0.68)。
* **Cohere `embed-v4.0`**:
  * EN-JAとJA-JAの合計スコアが最も高い。
  * マルチモーダル対応で幅広いユースケースに期待。

### 評価対象外としたモデル

* **Google `gemini-embedding-exp-03-07`**: プレビュー版でレート制限が厳しく、評価困難。
* **`pfnet/plamo-embedding-1b`**: 公開されているスコア(0.79)を再現できず(筆者環境では0.55)。原因不明のため除外。
