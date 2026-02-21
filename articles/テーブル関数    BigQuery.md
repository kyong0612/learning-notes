---
title: "テーブル関数  |  BigQuery"
source: "https://docs.cloud.google.com/bigquery/docs/table-functions?hl=ja"
author: "Google Cloud"
published:
created: 2026-02-21
description: "BigQueryにおけるテーブル関数（テーブル値関数、TVF）の作成・使用・管理方法を解説する公式ドキュメント。パラメータ付きでテーブルを返すユーザー定義関数の定義方法、テーブルパラメータの活用、承認済みルーティンとしての利用、制限事項などを網羅的にカバーしている。"
tags:
  - "clippings"
  - "BigQuery"
  - "SQL"
  - "テーブル関数"
  - "TVF"
  - "Google Cloud"
---

## テーブル関数とは

テーブル関数（テーブル値関数、TVF: Table-Valued Function）は、**テーブルを返すユーザー定義関数**。テーブルを使用できる場所であればどこでも利用可能。ビューと似ているが、**パラメータを受け取れる**点が異なる。

## テーブル関数の作成

`CREATE TABLE FUNCTION` ステートメントを使用して作成する。関数にはテーブルを生成するクエリが含まれ、クエリ結果を返す。

### 基本的な例

`INT64` パラメータを受け取り、公開データセットに対して年でフィルタリングする関数:

```sql
CREATE OR REPLACE TABLE FUNCTION mydataset.names_by_year(y INT64)
AS (
  SELECT year, name, SUM(number) AS total
  FROM `bigquery-public-data.usa_names.usa_1910_current`
  WHERE year = y
  GROUP BY year, name
);
```

### 複数パラメータの例

年と名前の接頭辞の2つでフィルタリングする関数:

```sql
CREATE OR REPLACE TABLE FUNCTION mydataset.names_by_year_and_prefix(
  y INT64, z STRING)
AS (
  SELECT year, name, SUM(number) AS total
  FROM `bigquery-public-data.usa_names.usa_1910_current`
  WHERE
    year = y
    AND STARTS_WITH(name, z)
  GROUP BY year, name
);
```

### テーブルパラメータ

TVF のパラメータとして**テーブル自体**を渡すことが可能。パラメータ名の後に `TABLE<列名 型, ...>` 形式で必要なスキーマを明示する。

- 渡すテーブル引数は、スキーマで指定された列に加えて**追加の列を含めてもよい**
- 列の順序は任意

```sql
CREATE TABLE FUNCTION mydataset.compute_sales (
  orders TABLE<sales INT64, item STRING>, item_name STRING)
AS (
  SELECT SUM(sales) AS total_sales, item
  FROM orders
  WHERE item = item_name
  GROUP BY item
);
```

### パラメータ名に関する注意

テーブル関数のパラメータ名がテーブル列名と一致すると**曖昧な参照**が発生する。この場合、BigQuery は名前をテーブル列として解釈する。パラメータには列名と異なる名前を使用することが推奨される。

## テーブル関数の使用方法

テーブルが有効な場所であればどこでも呼び出し可能。

### FROM句での呼び出し

```sql
SELECT * FROM mydataset.names_by_year(1950)
  ORDER BY total DESC
  LIMIT 5
```

| year | name   | total |
|------|--------|-------|
| 1950 | James  | 86447 |
| 1950 | Robert | 83717 |
| 1950 | Linda  | 80498 |
| 1950 | John   | 79561 |
| 1950 | Mary   | 65546 |

### JOIN での使用

```sql
SELECT *
  FROM `bigquery-public-data.samples.shakespeare` AS s
  JOIN mydataset.names_by_year(1950) AS n
  ON n.name = s.word
```

### サブクエリでの使用

```sql
SELECT ARRAY(
  SELECT name FROM mydataset.names_by_year(1950)
  ORDER BY total DESC
  LIMIT 5)
```

### テーブルパラメータを持つ関数の呼び出し

テーブル引数には `TABLE` キーワードを付ける必要がある。

```sql
WITH my_orders AS (
    SELECT 1 AS sales, "apple" AS item, 0.99 AS price
    UNION ALL
    SELECT 2, "banana", 0.49
    UNION ALL
    SELECT 5, "apple", 0.99)
SELECT *
FROM mydataset.compute_sales(TABLE my_orders, "apple");

-- 結果: total_sales=6, item="apple"
```

## テーブル関数の一覧表示

テーブル関数はルーティンの一種であり、データセット内のすべてのルーティンを一覧表示する方法で確認可能。

## テーブル関数の削除

`DROP TABLE FUNCTION` ステートメントを使用する。

```sql
DROP TABLE FUNCTION mydataset.names_by_year
```

## 承認済みルーティンとしての利用

テーブル関数はルーティンとして承認でき、基盤となるテーブルへのアクセス権を付与せずにクエリ結果を共有できる。データ集計やテーブル値の検索に活用可能。

## 制限事項

| 制限 | 詳細 |
|------|------|
| **クエリ本文** | `SELECT` ステートメントのみ。DDL・DML は使用不可。副作用が必要な場合はプロシージャを検討 |
| **ロケーション** | 参照するテーブルと同じ場所に保存する必要がある |
| **割り当て** | テーブル関数固有の割り当てと上限が適用される |
