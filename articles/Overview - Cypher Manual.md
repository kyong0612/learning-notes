---
title: "Overview - Cypher Manual"
source: "https://neo4j.com/docs/cypher-manual/current/introduction/cypher-overview/#_cypher_and_sql_key_differences"
author:
  - "Neo4j Inc."
published: "2011"
created: 2025-09-21
description: "Neo4j CypherはSQL相当のグラフクエリ言語として2011年に作成された宣言的グラフクエリ言語の概要とSQLとの主要な違いについて解説"
tags:
  - "clippings"
  - "cypher"
  - "neo4j"
  - "graph-database"
  - "sql-comparison"
  - "query-language"
---

## Cypher概要

## Cypherとは？

CypherはNeo4jの宣言的グラフクエリ言語です。2011年にNeo4jのエンジニアによって、グラフデータベースのためのSQL相当の言語として作成されました。SQLと同様に、Cypherはユーザーがグラフから*何を*取得するかに集中できるようにし、*どのように*取得するかを考える必要がありません。このため、Cypherは効率的で表現力豊かなクエリを可能にし、以前は未知だったデータの接続やクラスターを明らかにすることで、プロパティグラフデータベースの可能性を最大限に引き出すことを可能にします。

Cypherはパターンと関係性をマッチングする視覚的な方法を提供します。以下のようなASCIIアート風の構文に依存しています：`(nodes)-[:CONNECT_TO]→(otherNodes)`。丸括弧は円形のノードを表し、`-[:ARROWS]→`は関係性を表します。クエリを書くことは、実質的にグラフ内のデータを通るパターンを描くようなものです。言い換えると、ノードとその関係性などのエンティティは、クエリに視覚的に組み込まれています。これにより、Cypherは読み書きの両方において非常に直感的な言語となっています。

## CypherとSQL：主要な違い

CypherとSQLは多くの点で似ています。例えば、`WHERE`や`ORDER BY`など、多くの同じキーワードを共有しています。しかし、両者の間にはいくつかの重要な違いがあります：

### スキーマの柔軟性

**Cypherはスキーマ柔軟**です。[インデックスと制約](../../constraints/)を使用して部分的なスキーマを強制することは可能であり推奨されますが、CypherとNeo4jは、SQLやリレーショナルデータベースよりも大きなスキーマ柔軟性を提供します。

具体的には、Neo4jデータベース内のノードと関係性は、同じグラフ内の他のノードや関係性がそのプロパティを持っているからといって、特定のプロパティセットを持つ必要がありません（そのプロパティに[プロパティ存在制約](../../constraints/managing-constraints/#create-property-existence-constraints)が作成されていない限り）。

これは、ユーザーがデータを表現するために固定スキーマを使用する必要がなく、グラフが進化するにつれて新しい属性と関係性を追加できることを意味します。

### クエリの順序

SQLクエリはユーザーが返したいものから始まりますが、Cypherクエリはreturn句で終わります。例えば、以下の2つのクエリ（両方とも7より大きい評価を持つ映画のタイトルをデータベースから検索）を考えてみてください。最初はSQLで、2番目はCypherで書かれています：

**SQLの場合：**

```sql
SELECT movie.name
FROM movie
WHERE movie.rating > 7
```

**Cypherの場合：**

```cypher
MATCH (movie:Movie)
WHERE movie.rating > 7
RETURN movie.title
```

### Cypherクエリはより簡潔

直感的でホワイトボードのような句の構築方法により、Cypherクエリは同等のSQLクエリよりも簡潔になることが多いです。例えば、以下の2つのクエリ（両方とも映画「The Matrix」の俳優の名前をデータベースから検索）を考えてみてください。最初はSQLで、2番目はCypherで書かれています：

**SQLの場合：**

```sql
SELECT actors.name
FROM actors
    LEFT JOIN acted_in ON acted_in.actor_id = actors.id
    LEFT JOIN movies ON movies.id = acted_in.movie_id
WHERE movies.title = "The Matrix"
```

**Cypherの場合：**

```cypher
MATCH (actor:Actor)-[:ACTED_IN]->(movie:Movie {title: 'The Matrix'})
RETURN actor.name
```

## CypherとAPOC

Neo4jはAPOC（Awesome Procedures on Cypher）Coreライブラリをサポートしています。APOC Coreライブラリは、データ統合、グラフアルゴリズム、データ変換などの分野でCypherクエリ言語の使用を拡張するユーザー定義プロシージャと関数へのアクセスを提供します。

詳細については、[APOC Coreページ](/docs/apoc/current/)をご覧ください。

---

## 重要なポイント

1. **宣言的言語**：Cypherは「何を」取得するかに焦点を当て、「どのように」を抽象化します
2. **視覚的パターンマッチング**：ASCII art風の構文により、グラフパターンを視覚的に表現できます
3. **スキーマ柔軟性**：SQLと比較して、より柔軟なスキーマ設計が可能です
4. **簡潔性**：複雑な関係性クエリをより少ないコードで表現できます
5. **拡張性**：APOCライブラリにより機能を大幅に拡張可能です
