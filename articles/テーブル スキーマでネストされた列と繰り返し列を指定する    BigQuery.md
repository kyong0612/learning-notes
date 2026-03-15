---
title: "テーブル スキーマでネストされた列と繰り返し列を指定する  |  BigQuery"
source: "https://docs.cloud.google.com/bigquery/docs/nested-repeated?hl=ja"
author:
  - "[[Google Cloud Documentation]]"
published:
created: 2026-03-15
description: "BigQueryでネストされた列（RECORD/STRUCT）と繰り返し列（REPEATED/ARRAY）を使用してテーブルスキーマを定義・操作する方法を、サンプルコードとクエリ例を交えて解説する公式ドキュメント。"
tags:
  - "clippings"
  - "BigQuery"
  - "Google Cloud"
  - "Schema"
  - "STRUCT"
  - "ARRAY"
---

## ネストされた列と繰り返し列を定義する

BigQuery では、以下の2種類の複合データ構造をスキーマで定義できる。

| 概念 | スキーマでの設定 | GoogleSQL での型 | 説明 |
|---|---|---|---|
| **ネストされたデータ** | データ型を `RECORD` に設定 | `STRUCT`（順序付きフィールドのコンテナ） | 複数のフィールドを1つの列にまとめる |
| **繰り返しデータ** | モードを `REPEATED` に設定 | `ARRAY` | 同一型の値を配列として格納する |

### 組み合わせパターン

- `RECORD` 列に `REPEATED` モードを設定 → **`STRUCT` 型の配列**（`ARRAY<STRUCT<...>>`）
- `RECORD` 内のフィールドを繰り返し → **`ARRAY` を含む `STRUCT`**（`STRUCT<..., field ARRAY<...>>`）
- **配列の中に直接配列を格納することはできない**（`ARRAY<ARRAY<...>>` は不可）

## 制限事項

- スキーマ内の `RECORD` 型のネストは**最大15レベル**まで。スカラーか配列ベースかに依存しない。
- `RECORD` 型は `UNION`、`INTERSECT`、`EXCEPT DISTINCT`、`SELECT DISTINCT` と互換性がない。

## サンプル スキーマ

人物情報テーブルの例。`addresses` フィールドがネストかつ繰り返しの代表的パターン。

### JSON データ例

```json
{"id":"1","first_name":"John","last_name":"Doe","dob":"1968-01-22","addresses":[{"status":"current","address":"123 First Avenue","city":"Seattle","state":"WA","zip":"11111","numberOfYears":"1"},{"status":"previous","address":"456 Main Street","city":"Portland","state":"OR","zip":"22222","numberOfYears":"5"}]}
{"id":"2","first_name":"Jane","last_name":"Doe","dob":"1980-10-16","addresses":[{"status":"current","address":"789 Any Avenue","city":"New York","state":"NY","zip":"33333","numberOfYears":"2"},{"status":"previous","address":"321 Main Street","city":"Hoboken","state":"NJ","zip":"44444","numberOfYears":"3"}]}
```

- `[ ]` で囲まれた部分が**繰り返しデータ**（複数のアドレス）
- 各アドレス内の複数フィールド（status, address, city 等）が**ネストされたデータ**

### スキーマ定義（JSON）

```json
[
    { "name": "id",         "type": "STRING", "mode": "NULLABLE" },
    { "name": "first_name", "type": "STRING", "mode": "NULLABLE" },
    { "name": "last_name",  "type": "STRING", "mode": "NULLABLE" },
    { "name": "dob",        "type": "DATE",   "mode": "NULLABLE" },
    {
        "name": "addresses",
        "type": "RECORD",
        "mode": "REPEATED",
        "fields": [
            { "name": "status",        "type": "STRING", "mode": "NULLABLE" },
            { "name": "address",       "type": "STRING", "mode": "NULLABLE" },
            { "name": "city",          "type": "STRING", "mode": "NULLABLE" },
            { "name": "state",         "type": "STRING", "mode": "NULLABLE" },
            { "name": "zip",           "type": "STRING", "mode": "NULLABLE" },
            { "name": "numberOfYears", "type": "STRING", "mode": "NULLABLE" }
        ]
    }
]
```

## テーブル作成方法

### SQL（CREATE TABLE）

```sql
CREATE TABLE IF NOT EXISTS mydataset.mytable (
  id STRING,
  first_name STRING,
  last_name STRING,
  dob DATE,
  addresses
    ARRAY<
      STRUCT<
        status STRING,
        address STRING,
        city STRING,
        state STRING,
        zip STRING,
        numberOfYears STRING>>
) OPTIONS (
    description = 'Example name and addresses table');
```

### bq コマンドライン

JSON スキーマファイルを作成し、`bq` コマンドラインツールで指定する。

### クライアントライブラリ（Go / Java / Node.js / Python）

各言語のクライアントライブラリを使い、スキーマオブジェクトを構築してテーブルを作成する。

**Python の例:**

```python
from google.cloud import bigquery

client = bigquery.Client()
table_id = "your-project.your_dataset.your_table_name"

schema = [
    bigquery.SchemaField("id", "STRING", mode="NULLABLE"),
    bigquery.SchemaField("first_name", "STRING", mode="NULLABLE"),
    bigquery.SchemaField("last_name", "STRING", mode="NULLABLE"),
    bigquery.SchemaField("dob", "DATE", mode="NULLABLE"),
    bigquery.SchemaField(
        "addresses", "RECORD", mode="REPEATED",
        fields=[
            bigquery.SchemaField("status", "STRING", mode="NULLABLE"),
            bigquery.SchemaField("address", "STRING", mode="NULLABLE"),
            bigquery.SchemaField("city", "STRING", mode="NULLABLE"),
            bigquery.SchemaField("state", "STRING", mode="NULLABLE"),
            bigquery.SchemaField("zip", "STRING", mode="NULLABLE"),
            bigquery.SchemaField("numberOfYears", "STRING", mode="NULLABLE"),
        ],
    ),
]
table = bigquery.Table(table_id, schema=schema)
table = client.create_table(table)
```

## ネストされた列へのデータ挿入

`INSERT` 文で `ARRAY<STRUCT<...>>` リテラルを使用する。

```sql
INSERT INTO mydataset.mytable (id, first_name, last_name, dob, addresses)
VALUES ("1", "Johnny", "Dawn", "1969-01-22",
    [("current", "123 First Avenue", "Seattle", "WA", "11111", "1")])
```

## ネストされた列と繰り返し列のクエリ

### 配列添字演算子で特定位置の要素を取得

```sql
SELECT
  first_name,
  last_name,
  addresses[OFFSET(0)].address
FROM mydataset.mytable;
```

| first_name | last_name | address |
|---|---|---|
| John | Doe | 123 First Avenue |
| Jane | Doe | 789 Any Avenue |

### UNNEST + CROSS JOIN で全要素を展開

```sql
SELECT
  first_name,
  last_name,
  a.address,
  a.state
FROM mydataset.mytable CROSS JOIN UNNEST(addresses) AS a
WHERE a.state != 'NY';
```

| first_name | last_name | address | state |
|---|---|---|---|
| John | Doe | 123 First Avenue | WA |
| John | Doe | 456 Main Street | OR |
| Jane | Doe | 321 Main Street | NJ |

## ネストされた列と繰り返し列の変更

テーブル作成後も、ネストされた新しいフィールドのレコードへの追加や、ネストされたフィールドのモードの緩和（例: `REQUIRED` → `NULLABLE`）などのスキーマ変更がサポートされている。

## ネストされた列と繰り返し列を使用するタイミング

**BigQuery は非正規化データに最適。** リレーショナル（正規化）スキーマではなく、ネストされた列と繰り返し列を活用してデータを非正規化することが推奨される。

### 正規化 vs 非正規化の比較例

**正規化（2テーブル構成）:**

`books` テーブル:
| title | author_ids | num_pages |
|---|---|---|
| Example Book One | [123, 789] | 487 |
| Example Book Two | [456] | 89 |

`authors` テーブル:
| author_id | author_name | date_of_birth |
|---|---|---|
| 123 | Alex | 01-01-1960 |
| 456 | Rosario | 01-01-1970 |
| 789 | Kim | 01-01-1980 |

**非正規化（単一テーブル）:**

```sql
CREATE TABLE mydataset.denormalized_books(
  title STRING,
  authors ARRAY<STRUCT<id INT64, name STRING, date_of_birth STRING>>,
  num_pages INT64)
AS (
  SELECT
    title,
    ARRAY_AGG(STRUCT(author_id, author_name, date_of_birth)) AS authors,
    ANY_VALUE(num_pages)
  FROM mydataset.books, UNNEST(author_ids) id
  JOIN mydataset.authors ON id = author_id
  GROUP BY title
);
```

| title | authors | num_pages |
|---|---|---|
| Example Book One | [{123, Alex, 01-01-1960}, {789, Kim, 01-01-1980}] | 487 |
| Example Book Two | [{456, Rosario, 01-01-1970}] | 89 |

**メリット:** 定期的な `JOIN` が不要になり、パフォーマンスの低下なしにリレーションシップを維持できる。

### 対応するソース形式

ネストされたデータと繰り返しデータの読み込みに対応するソース形式:
- JSON ファイル
- Avro ファイル
- Firestore エクスポートファイル
- Datastore エクスポートファイル

## 重複レコードの除去

`ROW_NUMBER()` ウィンドウ関数を使って重複を除去するパターン:

```sql
CREATE OR REPLACE TABLE mydataset.mytable AS (
  SELECT * EXCEPT(row_num) FROM (
    SELECT *,
      ROW_NUMBER() OVER (PARTITION BY last_name, first_name ORDER BY dob) row_num
    FROM mydataset.mytable
  ) temp_table
  WHERE row_num = 1
)
```

## テーブルのセキュリティ

テーブルへのアクセス制御は IAM を使用して行う。詳細は [IAM を使用してリソースへのアクセスを制御する](https://docs.cloud.google.com/bigquery/docs/control-access-to-resources-iam?hl=ja) を参照。
