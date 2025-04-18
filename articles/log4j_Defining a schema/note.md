# Defining a schema

ref: <https://neo4j.com/docs/getting-started/cypher-intro/schema/>

---

## Neo4jスキーマ定義の概要

### 例題グラフ

まず、例として以下のデータを作成します。

```cypher
CREATE (forrestGump:Movie {title: 'Forrest Gump', released: 1994})
CREATE (robert:Person:Director {name: 'Robert Zemeckis', born: 1951})
CREATE (tom:Person:Actor {name: 'Tom Hanks', born: 1956})
CREATE (tom)-[:ACTED_IN {roles: ['Forrest']}]->(forrestGump)
CREATE (robert)-[:DIRECTED]->(forrestGump)
```

これにより、以下のグラフが作成されます。

![cypher intro schema data arr](https://neo4j.com/docs/getting-started/_images/cypher-intro-schema-data-arr.svg)

### インデックスの使用

グラフデータベースでインデックスを使用する主な目的は、グラフ探索の開始点を見つけることです。開始点が見つかれば、探索はグラフ内構造に依存して高いパフォーマンスを実現します。インデックスはいつでも追加可能です。

* データベースに既存データがある場合、インデックスがオンラインになるまでに時間がかかることがあります。

以下のクエリは、データベース内で俳優を名前で検索する速度を向上させるためのインデックスを作成します。

```cypher
CREATE INDEX example_index_1 FOR (a:Actor) ON (a.name)
```

通常、クエリ時にインデックスを指定する必要はありません。適切なインデックスが自動的に使用されます。

* 特定のクエリで使用するインデックスを指定することも可能です（インデックスヒント）。これはクエリチューニングのオプションの一つです。詳細は[Cypher® manual → Query tuning](https://neo4j.com/docs/cypher-manual/current/query-tuning)を参照してください。

例えば、以下のクエリは自動的に `example_index_1` を使用します。

```cypher
MATCH (actor:Actor {name: 'Tom Hanks'})
RETURN actor
```

**複合インデックス**は、特定のラベルを持つすべてのノードに対して、複数のプロパティにわたるインデックスです。例えば、以下のステートメントは `Actor` ラベルを持ち、`name` と `born` プロパティの両方を持つすべてのノードに対して複合インデックスを作成します。

```cypher
CREATE INDEX example_index_2 FOR (a:Actor) ON (a.name, a.born)
```

`SHOW INDEXES` クエリを使用して、定義されているインデックスを確認できます。

```cypher
SHOW INDEXES YIELD name, labelsOrTypes, properties, type
```

結果例：

```
+----------------------------------------------------------------+
| name              | labelsOrTypes | properties       | type    |
+----------------------------------------------------------------+
| 'example_index_1' | ['Actor']     | ['name']         | 'BTREE' |
| 'example_index_2' | ['Actor']     | ['name', 'born'] | 'BTREE' |
+----------------------------------------------------------------+
```

* インデックスに関する詳細は、[Cypher Manual → Indexes](https://neo4j.com/docs/cypher-manual/current/indexes-for-search-performance#indexes-types-and-limitations) を参照してください。

### 制約の使用

制約は、データがドメインのルールに準拠していることを保証するために使用されます。例えば、「ノードが `Actor` ラベルと `name` プロパティを持つ場合、`name` の値は `Actor` ラベルを持つすべてのノード間で一意でなければならない」といったルールです。

**例1. 一意性制約**

以下の例は、`Movie` ラベルと `title` プロパティを持つノードに対する制約を作成します。この制約は `title` プロパティが一意であることを指定します。

```cypher
CREATE CONSTRAINT constraint_example_1 FOR (movie:Movie) REQUIRE movie.title IS UNIQUE
```

一意性制約を追加すると、そのプロパティに対するインデックスも暗黙的に追加されます。制約が削除されてもインデックスが必要な場合は、明示的にインデックスを作成する必要があります。

* Neo4j 4.4で構文が変更されました。古い構文は `CREATE CONSTRAINT constraint_example_1 ON (movie:Movie) ASSERT movie.title IS UNIQUE Deprecated` です。

データが既に存在するデータベースにも制約を追加できますが、既存データが追加される制約に準拠している必要があります。

`SHOW CONSTRAINTS` Cypher構文を使用して、定義されている制約を確認できます。

**例2. 制約クエリ**

```cypher
SHOW CONSTRAINTS YIELD id, name, type, entityType, labelsOrTypes, properties, ownedIndexId
```

結果例：

```
+-----------------------------------------------------------------------------------------------------+
| id | name                   | type         | entityType | labelsOrTypes | properties | ownedIndexId |
+-----------------------------------------------------------------------------------------------------+
| 4  | 'constraint_example_1' | 'UNIQUENESS' | 'NODE'     | ['Movie']     | ['title']  | 3            |
+-----------------------------------------------------------------------------------------------------+
```

* 上記の一意性制約は、Neo4jのすべてのエディションで利用可能です。Neo4j Enterprise Editionでは追加の制約が利用できます。
* 制約に関する詳細は、[Cypher manual → Constraints](https://neo4j.com/docs/cypher-manual/current/constraints) を参照してください。

---
