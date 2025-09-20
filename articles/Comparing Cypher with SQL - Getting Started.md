---
title: "Comparing Cypher with SQL - Getting Started"
source: "https://neo4j.com/docs/getting-started/cypher-intro/cypher-sql/"
author:
  - "Neo4j Documentation Team"
published:
created: 2025-09-21
description: "CypherとSQLの違いと類似点を説明し、グラフデータベースとリレーショナルデータベースのクエリ言語の比較を通じて、同等のSQL文をCypherで書く方法を学習できるガイド。Northwindデータセットを使用した実践的な例を含む。"
tags:
  - "clippings"
  - "Cypher"
  - "SQL"
  - "Neo4j"
  - "graph-database"
  - "query-language"
  - "database-comparison"
---

# CypherとSQLの比較

![リレーショナルデータとグラフの比較（Northwindデータセットを使用）](../../_images/relational-vs-graph.svg)

CypherとSQLには[重要な違い](https://neo4j.com/docs/cypher-manual/current/introduction/cypher-overview/#_cypher_and_sql_key_differences)がありますが、両方の言語を比較し、CypherでSQL文の同等の処理を記述することは可能です。この比較をより良く説明するため、[Northwindデータセット](../../appendix/example-data/)を使用します。

> **参考**: グラフデータベースとリレーショナルデータベースの違いと類似点についてより詳しい説明については、[リレーショナルデータベースからグラフデータベースへの移行](../../appendix/graphdb-concepts/graphdb-vs-rdbms/)を参照してください。

## インデックス

インデックスはSQLとCypherの両方で利用できます。これらは特定のノードラベルと属性の組み合わせの検索をより効率的にします。

[Cypherのインデックス](https://neo4j.com/docs/cypher-manual/current/indexes/)は、クエリの開始点を見つけるためだけに使用され、その後のパターンマッチングはすべてグラフ構造を通じて行われます。Cypherは[range、text、point、lookup、full-text、vectorインデックス](https://neo4j.com/docs/cypher-manual/current/indexes/syntax/)をサポートしています。

Northwindデータセットで、`productName`と`unitPrice`にインデックスを追加すると、商品とその価格の検索が速くなります：

| SQL | Cypher |
|-----|--------|
| ```sql<br>CREATE INDEX Product_productName ON products (product_name);<br>CREATE INDEX Product_unitPrice ON products (unit_price);<br>``` | ```cypher<br>CREATE INDEX Product_productName IF NOT EXISTS FOR (p:Product) ON p.productName;<br>CREATE INDEX Product_unitPrice IF NOT EXISTS FOR (p:Product) ON p.unitPrice;<br>``` |

## クエリ例

### レコードの選択と返却

| SQL | Cypher |
|-----|--------|
| SQLでレコードを選択して返すには、productsテーブルからすべてを選択します：<br>```sql<br>SELECT p.* FROM products as p;<br>``` | Cypherでは、すべてのノードを**ラベル**`:Product`でマッチングする単純なパターンを使用し、それらを返します：<br>```cypher<br>MATCH (p:Product) RETURN p;<br>``` |

### フィールドアクセス、順序付け、ページング

すべての属性を返すのではなく、興味のあるもの（例：`ProductName`と`UnitPrice`）をフィルタリングできます。

| SQL | Cypher |
|-----|--------|
| SQLでは、価格で商品を順序付けし、最も高い10商品を返す方法：<br>```sql<br>SELECT p.ProductName, p.UnitPrice<br>FROM products as p<br>ORDER BY p.UnitPrice DESC<br>LIMIT 10;<br>``` | Cypherでは文は似ていますが、パターンマッチング部分が異なります：<br>```cypher<br>MATCH (p:Product)<br>RETURN p.productName, p.unitPrice<br>ORDER BY p.unitPrice DESC<br>LIMIT 10;<br>``` |

**結果例:**

- "Côte de Blaye": 263.5
- "Thüringer Rostbratwurst": 123.79
- "Mishi Kobe Niku": 97.0
- "Sir Rodney's Marmalade": 81.0
- "Carnarvon Tigers": 62.5

> **注意**: Neo4jでは、ラベル、リレーションシップタイプ、プロパティ名は**大文字と小文字を区別**します。

### 名前による単一商品の検索

データベースを照会して単一のアイテム（例：`Chocolade`という名前の商品）を取得する方法はいくつかあります。等価性によるフィルタリングが一例です：

| SQL | Cypher |
|-----|--------|
| SQLでは`WHERE`句を使用してデータをフィルタリングできます：<br>```sql<br>SELECT p.ProductName, p.UnitPrice<br>FROM products AS p<br>WHERE p.ProductName = 'Chocolade';<br>``` | Cypherでは`WHERE`句は`MATCH`文に属します：<br>```cypher<br>MATCH (p:Product)<br>WHERE p.productName = 'Chocolade'<br>RETURN p.productName, p.unitPrice;<br>```<br><br>より短いオプションは、`MATCH`文でラベル`productName`を使用して商品を指定することです：<br>```cypher<br>MATCH (p:Product {productName:'Chocolade'})<br>RETURN p.productName, p.unitPrice;<br>``` |

### 商品のフィルタリング

#### リスト/範囲による フィルタリング

| SQL | Cypher |
|-----|--------|
| SQLでは`IN`演算子を使用できます：<br>```sql<br>SELECT p.ProductName, p.UnitPrice<br>FROM products as p<br>WHERE p.ProductName IN ('Chocolade','Chai');<br>``` | Cypherは`IN`やその他のコレクション関数、述語、変換を含む完全なコレクションサポートを提供します：<br>```cypher<br>MATCH (p:Product)<br>WHERE p.productName IN ['Chocolade','Chai']<br>RETURN p.productName, p.unitPrice;<br>``` |

#### 複数の数値および文字列述語によるフィルタリング

| SQL | Cypher |
|-----|--------|
| 「C」で始まる名前で、価格が100より大きい商品を取得するクエリ：<br>```sql<br>SELECT p.ProductName, p.UnitPrice<br>FROM products AS p<br>WHERE p.ProductName LIKE 'C%'<br>AND p.UnitPrice > 100;<br>``` | Cypherでは`LIKE`演算子は`STARTS WITH`、`CONTAINS`、`ENDS WITH`演算子に置き換えられます：<br>```cypher<br>MATCH (p:Product)<br>WHERE p.productName STARTS WITH 'C'<br>AND p.unitPrice > 100<br>RETURN p.productName, p.unitPrice;<br>```<br><br>正規表現を使用することも可能です：<br>```cypher<br>MATCH (p:Product)<br>WHERE p.productName =~ '^C.*'<br>RETURN p.productName, p.unitPrice<br>``` |

### 商品と顧客の結合

| SQL | Cypher |
|-----|--------|
| SQLで誰が`Chocolade`を購入したかを見るには、4つのテーブルを結合します：<br>```sql<br>SELECT DISTINCT c.CompanyName<br>FROM customers AS c<br>JOIN orders AS o ON (c.CustomerID = o.CustomerID)<br>JOIN order_details AS od ON (o.OrderID = od.OrderID)<br>JOIN products AS p ON (od.ProductID = p.ProductID)<br>WHERE p.ProductName = 'Chocolade';<br>``` | Cypherではテーブルを`JOIN`する必要がありません。代わりに接続をグラフパターンとして表現できます：<br>```cypher<br>MATCH (p:Product {productName:'Chocolade'})<-[:ORDERS]-(:Order)<-[:PURCHASED]-(c:Customer)<br>RETURN DISTINCT c.companyName;<br>``` |

### 各商品の総支出額

商品価格と注文数量を合計することで、顧客の商品別集計ビューが提供されます。SQLとCypherの両方で`sum`、`count`、`avg`、`max`などの集計関数を使用できます。

| SQL | Cypher |
|-----|--------|
| 会社（例：Drachenblut Delikatessen）が商品ごとに支払った合計金額を見るには、`OUTER JOINS`を使用する必要があります：<br>```sql<br>SELECT p.Product_Name, sum(od.Unit_Price * od.Quantity) AS TotalPrice<br>FROM customers AS c<br>LEFT OUTER JOIN orders AS o ON (c.Customer_ID = o.Customer_ID)<br>LEFT OUTER JOIN order_details AS od ON (o.Order_ID = od.Order_ID)<br>LEFT OUTER JOIN products AS p ON (od.Product_ID = p.Product_ID)<br>WHERE c.Company_Name = 'Drachenblut Delikatessen'<br>GROUP BY p.Product_Name;<br>``` | Cypherでは、計算を行うために`ORDERS`リレーションシップの`unitPrice`プロパティを整数に変換し、`OPTIONAL MATCH`を使用して購入情報を検索します：<br>```cypher<br>MATCH (c:Customer {companyName:'Drachenblut Delikatessen'})<br>OPTIONAL MATCH (c)-[:PURCHASED]->(:Order)-[o:ORDERS]->(p:Product)<br>RETURN p.productName, toInteger(sum(o.unitPrice * o.quantity)) AS totalPrice<br>``` |

### 供給商品数

`COUNT`関数を使用して、サプライヤーが提供する商品数をカウントできます。

| SQL | Cypher |
|-----|--------|
| SQLでは集約が明示的で、`GROUP BY`句にすべてのグループ化キーを提供する必要があります：<br>```sql<br>SELECT s.CompanyName AS Supplier, COUNT(p.ProductID) AS NumberOfProducts<br>FROM Suppliers s<br>JOIN Products p ON s.SupplierID = p.SupplierID<br>GROUP BY s.CompanyName<br>ORDER BY NumberOfProducts DESC<br>LIMIT 5;<br>``` | Cypherでは集約のグループ化は暗黙的です。最初の集約関数を使用すると、非集約列が自動的にグループ化キーになります：<br>```cypher<br>MATCH (s:Supplier)<-[:SUPPLIED_BY]-(p:Product)<br>RETURN s.companyName AS Supplier, COUNT(p) AS NumberOfProducts<br>ORDER BY NumberOfProducts DESC<br>LIMIT 5<br>``` |

> **追加情報**: `collect`、`percentileCont`、`stdDev`などの追加の集約関数も利用できます。

### 供給商品リスト

CypherではCOLLECT関数を使用して、他のノードに接続されたすべてのノードを収集できますが、SQLには直接的な同等機能がありません。

| SQL | Cypher |
|-----|--------|
| SQLでサプライヤーが提供する商品のリストが欲しい場合、`STRING_AGG`を使用します：<br>```sql<br>SELECT s.CompanyName AS Supplier,<br>STRING_AGG(p.ProductName, ', ' ORDER BY p.ProductName) AS ProductsSupplied<br>FROM Suppliers s<br>JOIN Products p ON s.SupplierID = p.SupplierID<br>GROUP BY s.CompanyName<br>ORDER BY s.CompanyName<br>LIMIT 5;<br>``` | Cypherでは`collect()`集約関数を使用でき、値をコレクション（リスト、配列）に集約します。これにより、子の値のインライン化されたコレクションを含む親ごとに1行だけが返されます：<br>```cypher<br>MATCH (s:Supplier)-[:SUPPLIES]->(p:Product)<br>RETURN s.companyName AS Supplier, COLLECT(p.productName) AS ProductsSupplied<br>ORDER BY Supplier<br>LIMIT 5<br>``` |

**結果例:**

- "Aux joyeux ecclésiastiques": ["Côte de Blaye", "Chartreuse verte"]
- "Bigfoot Breweries": ["Sasquatch Ale", "Laughing Lumberjack Lager", "Steeleye Stout"]
- "Cooperativa de Quesos 'Las Cabras'": ["Queso Manchego La Pastora", "Queso Cabrales"]

## 重要な違いと利点

### Cypherの主な利点

1. **直感的なパターンマッチング**: ノードとリレーションシップの視覚的表現により、グラフ構造を直感的に表現
2. **JOINの不要**: 複雑な結合操作が不要で、グラフパターンで関係を表現
3. **グラフ特化機能**: 最短経路探索などのグラフ固有の操作をサポート
4. **暗黙的なグループ化**: 集約時のグループ化が自動化

### SQLの特徴

1. **明示的な結合**: テーブル間の関係を明示的にJOINで表現
2. **成熟したエコシステム**: 長年の実績と豊富なツール群
3. **標準化**: ANSI標準に基づく一貫性のある構文

## まとめ

CypherとSQLはそれぞれ異なるデータモデル（グラフvs.リレーショナル）に最適化されたクエリ言語です。グラフデータベースでは関係性の探索や複雑なパターンマッチングが必要な場合にCypherが威力を発揮し、一方でリレーショナルデータベースでは構造化されたテーブル形式のデータ操作にSQLが適しています。

データの性質と用途に応じて適切なデータベースとクエリ言語を選択することが重要です。
