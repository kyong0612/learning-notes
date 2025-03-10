# Why Observability Requires a Distributed Column Store

ref: <https://www.honeycomb.io/blog/why-observability-requires-distributed-column-store>

以下が生のMarkdown形式での出力です：

## なぜ観測性に分散カラムストアが必要なのか

### データベースと観測性

Honeycombは、非常に高速な性能で知られています。何十億もの行のデータを処理し、数千のフィールドにわたる高カーディナリティデータを比較しながら、迅速にクエリの回答を得ることができます。これが可能なのは、Honeycomb専用に構築された分散カラムストアのおかげです。

この記事では、分散カラムストアとは何か、その機能、そしてなぜ分散カラムストアが観測性を達成するための基本要件であるのかについて紹介します。

---

## なぜデータストアを構築するのか？

Honeycombでは、豊富なコンテキストを持つ幅広いイベントを構築する必要性や、高カーディナリティデータを調査する必要性、そしてシステムを探求する際に高速なクエリが重要である理由について頻繁に議論します。しかし、これらすべてはバックエンドなしでは実現できません。それでは、Honeycombのバックエンドを支えているものとは何でしょうか？

Honeycombのバックエンドの核となるのは、専用に構築された分散カラムストアです。我々はその高速性と信頼性を実現するために多大な労力を費やしてきました。その「秘密のソース」は実はそれほど秘密ではなく、Facebookの「Scuba」にそのルーツとインスピレーションを見出すことができます。2017年、Honeycombの元エンジニアであるSam Stokes氏が、講演「なぜ私たちは独自の分散カラムストアを構築したのか」でHoneycombの内部について見事な概要を説明しました。

HoneycombのCTOであるCharity Majorsは、ブログ記事「観測ツールを作りたいのなら」で「観測性を持つためには、分散カラムストアを使う必要がある」とまで述べています。

では、分散カラムストアが特別である理由は何でしょうか？そしてなぜ、観測性を実現するためにHoneycombが独自のカラムストアを構築する必要があったのでしょうか？

---

## Honeycombの設計と機能の関係

Honeycombの中核となる機能と目指すべき性能は、以下のようなアーキテクチャ上の意思決定に強く影響を与えています：

1. **固定的なスキーマがない**  
   これにより、イベントをできるだけ広い形で作成できます。

2. **インデックスを使用しない**  
   データを書き込む前にどのカラムを「高速」にするかを決める必要がありません。

3. **クエリは常に高速であるべき**  
   事前に集計したデータ（例えばメトリクス）に頼ることなく、アプリケーションの動作を理解できます。

特に最後の点については、より深く掘り下げる価値があります。  
**生データを保存してクエリすること**が、そのデータの潜在能力を最大限に引き出す鍵となります。Honeycombでは、データを事前に集計したり破棄したりすることは一切ありません。どの次元を調査する必要があるかは、予測不能な問題をデバッグするまで分からないためです。バックエンドのデータストアは、トレースに付随する豊富なコンテキストを任意の方法で任意のタイミングで処理できる能力を持つ必要があります。このデータを効率的に保存し、迅速に処理する唯一の方法は、カラム指向のデータベースを使用することです。

---

## 行指向 vs. カラム指向

カラムストアは単なるデータベースの一種です。概念的には、データベースはテーブルという形でデータを整理します。テーブルはカラム（列）でラベル付けされ、行で構成されます。

Honeycombでは、各データセットは個別のテーブルとして保存され、カラムはイベントから抽出されたフィールドに対応しています。各スパン（単位）はテーブル内の1行として書き込まれます。例えば、HTTPリクエストのデータセットでは、リクエストメソッド、URLパス、クエリ文字列などのフィールドを持つスパンが含まれます。これを以下のようなテーブルで表せます：

| method | path         | query              |
|--------|--------------|--------------------|
| GET    | /            |                    |
| GET    | /search      | ?q=cool%20stuff    |
| POST   | /comment     |                    |

---

### 書き込みの比較

Honeycombでは、イベントが到着するたびにテーブルに新しい行が追加されます。例えば、新しいイベント`{"method": "GET", "path": "/comments", "query": "?page=2"}`が来ると、次のようにテーブルが更新されます：

| method | path         | query              |
|--------|--------------|--------------------|
| GET    | /            |                    |
| GET    | /search      | ?q=cool%20stuff    |
| POST   | /comment     |                    |
| GET    | /comments    | ?page=2            |

行指向データベースでは、新しい行のすべてのカラムが連続的に書き込まれます。一方、カラム指向データベースでは、それぞれのカラムファイルに個別の行が追加されます。

さらに、新しいフィールド（カラム）が追加された場合の対応も異なります。行指向のデータベースではスキーマを変更し、すべての行を再フォーマットする必要があります。しかし、カラム指向では、新しいカラム用のファイルを作成するだけで済みます。これにより、Honeycombではスキーマを事前定義する必要がなく、柔軟に新しいデータを取り込むことが可能になります。

---

### 読み取りの比較

データが書き込まれた後、次はそれをクエリする必要があります。クエリの効率性は、データのレイアウトに大きく依存します。

- **行指向データベース**は、1つの行内のすべてのカラムを読み取るクエリに適しています。例えば、`SELECT * FROM users WHERE id = 1;`のようなクエリです。
- **カラム指向データベース**は、特定のカラムから多くの行を読み取るクエリに適しています。例えば、`SELECT AVG(duration_ms) FROM requests;`のような集計クエリです。

Honeycombでは、後者のような「多くの行から少数のカラムをクエリする」操作が中心です。そのため、カラム指向の構造が最適です。

---

## 観測性の本質

観測性は単なる「モニタリング」や「デバッグ」の新しい言葉ではありません。観測性の核心は、データをあらゆる次元で切り分けて新たな理解を得る能力にあります。以下がそれを可能にする要素です：

1. **スキーマを事前定義する必要がないこと**  
   データの取り込みを迅速化し、新たなコンテキストを簡単に追加できます。

2. **インデックスを使用しないこと**  
   すべてのクエリが高速である必要があるため、特定のカラムに最適化する必要がありません。

3. **非集計データを保存すること**  
   データを事前に集計することなく、必要な次元で任意に操作できます。

これらの特性が組み合わさることで、Honeycombは何十億もの行のデータを迅速に処理し、予測不可能な質問にも答える能力を提供します。これが観測性の真の価値です。
