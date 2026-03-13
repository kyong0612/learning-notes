---
title: "テーブルの作成と使用  |  BigQuery"
source: "https://docs.cloud.google.com/bigquery/docs/tables?hl=ja"
author:
  - "[[Google Cloud Documentation]]"
published:
created: 2026-03-13
description: "BigQuery における標準（組み込み）テーブルの作成・管理方法を包括的に解説する公式ドキュメント。テーブルの命名規則、スキーマ定義、クエリ結果からの作成、アクセス制御、INFORMATION_SCHEMA を用いたメタデータ取得、テーブル一覧表示まで、コンソール・SQL・bq CLI・Terraform・各種クライアントライブラリのコード例を網羅している。"
tags:
  - "clippings"
  - "BigQuery"
  - "Google Cloud"
  - "データウェアハウス"
  - "SQL"
  - "テーブル管理"
---

## 概要

このドキュメントでは、BigQuery で**標準（組み込み）テーブル**を作成して使用する方法を解説している。クラスタ化テーブルやパーティション分割テーブルの作成は別ドキュメントで扱われる。

テーブル作成後に可能な操作:
- テーブルのメタデータ取得
- データセット内のテーブル一覧表示
- テーブルに関する情報の取得
- テーブルデータへのアクセス制御

テーブルの更新・コピー・削除については「[テーブルの管理](https://docs.cloud.google.com/bigquery/docs/managing-tables?hl=ja)」を参照。

---

## 必要なロールと権限

### IAM ロール

| ロール | 説明 |
|---|---|
| **BigQuery データ編集者** (`roles/bigquery.dataEditor`) | テーブルを作成するデータセットに対して付与 |
| **BigQuery ジョブユーザー** (`roles/bigquery.jobUser`) | データ読み込みやクエリ結果のテーブル保存時にプロジェクトに対して付与 |

### 必要な権限（詳細）

| 権限 | 用途 |
|---|---|
| `bigquery.tables.create` | テーブルを作成するデータセットに対して |
| `bigquery.tables.updateData` | クエリ結果でテーブルに追加・上書きする場合 |
| `bigquery.jobs.create` | データ読み込みやクエリ結果の保存時 |
| `bigquery.tables.getData` | クエリ結果をテーブルとして保存する際に参照するテーブル・ビューに対して |

---

## テーブルの命名規則

- データセットごとに**一意**である必要がある
- Unicode カテゴリ L（文字）、M（マーク）、N（数字）、Pc（アンダースコア等）、Pd（ダッシュ）、Zs（スペース）の文字を使用可能
- UTF-8 で **1,024 バイト以下**
- 有効な例: `table 01`、`ग्राहक`、`00_お客様`、`étudiant-01`
- デフォルトで**大文字・小文字を区別**する（`mytable` と `MyTable` は別テーブル）
- 連続するドット演算子（`.`）は暗黙的に削除される
- 一部のテーブル名と接頭辞は予約済み

---

## テーブルの作成方法

BigQuery では以下の方法でテーブルを作成できる:

1. **`CREATE TABLE` DDL ステートメント**
2. **データ読み込み時**に同時作成
3. **外部データソース**を参照するテーブルを定義
4. **クエリ結果**から作成
5. **クライアントライブラリ**を使用
6. **`tables.insert` API** メソッドを呼び出し
7. **Google Cloud コンソール**または **`bq mk`** コマンド

### 1. スキーマ定義を含む空のテーブルを作成する

#### SQL での作成例

```sql
CREATE TABLE mydataset.newtable (
  x INT64 OPTIONS (description = 'An optional INTEGER field'),
  y STRUCT <
    a ARRAY <STRING> OPTIONS (description = 'A repeated STRING field'),
    b BOOL
  >
) OPTIONS (
    expiration_timestamp = TIMESTAMP '2023-01-01 00:00:00 UTC',
    description = 'a table that expires in 2023',
    labels = [('org_unit', 'development')]);
```

#### bq CLI での作成例

**インラインスキーマ**:

```bash
bq mk \
 -t \
 --expiration 3600 \
 --description "This is my table" \
 --label organization:development \
 mydataset.mytable \
 qtr:STRING,sales:FLOAT,year:STRING
```

**JSON スキーマファイル**:

```bash
bq mk \
 --table \
 --expiration 3600 \
 --description "This is my table" \
 --label organization:development \
 mydataset.mytable \
 /tmp/myschema.json
```

> **注意**: コマンドラインでスキーマを指定する場合、`RECORD`（STRUCT）型、列の説明、列モードは指定できない。これらが必要な場合は JSON スキーマファイルを使用する。

#### Terraform での作成例

```hcl
resource "google_bigquery_dataset" "default" {
  dataset_id                      = "mydataset"
  default_partition_expiration_ms = 2592000000  # 30 days
  default_table_expiration_ms     = 31536000000 # 365 days
  description                     = "dataset description"
  location                        = "US"
  max_time_travel_hours           = 96 # 4 days
}

resource "google_bigquery_table" "default" {
  dataset_id          = google_bigquery_dataset.default.dataset_id
  table_id            = "mytable"
  deletion_protection = false # set to "true" in production

  schema = <<EOF
[
  {
    "name": "ID",
    "type": "INT64",
    "mode": "NULLABLE",
    "description": "Item ID"
  },
  {
    "name": "Item",
    "type": "STRING",
    "mode": "NULLABLE"
  }
]
EOF
}
```

#### クライアントライブラリでの作成例（Python）

```python
from google.cloud import bigquery

client = bigquery.Client()

schema = [
    bigquery.SchemaField("full_name", "STRING", mode="REQUIRED"),
    bigquery.SchemaField("age", "INTEGER", mode="REQUIRED"),
]

table = bigquery.Table(table_id, schema=schema)
table = client.create_table(table)
```

### 2. クエリ結果からテーブルを作成する

#### SQL での作成例

```sql
CREATE TABLE mydataset.trips AS (
  SELECT
    bike_id,
    start_time,
    duration_minutes
  FROM
    bigquery-public-data.austin_bikeshare.bikeshare_trips
);
```

#### bq CLI での作成例

```bash
bq query \
--destination_table mydataset.mytable \
--use_legacy_sql=false \
'SELECT name, number
FROM `bigquery-public-data`.usa_names.usa_1910_current
WHERE gender = "M"
ORDER BY number DESC'
```

宛先テーブルの書き込み設定:
- `--replace`: 既存テーブルを上書き
- `--append_table`: 既存テーブルに追加
- フラグなし: テーブルが空の場合のみ書き込み（デフォルト）

### 3. 外部データソースを参照するテーブル

BigQuery ストレージにデータを格納せず、Cloud Storage やその他の Google Cloud データベースなどの外部データソースを直接クエリできる。詳細は「[外部データソースの概要](https://docs.cloud.google.com/bigquery/external-data-sources?hl=ja)」を参照。

### 4. データ読み込み時にテーブルを作成

- 新しいテーブルやパーティションへのデータ読み込み
- 既存テーブルへの追加・上書き
- 空テーブルを事前作成する必要なし
- スキーマの手動指定または[自動検出](https://docs.cloud.google.com/bigquery/docs/schema-detect?hl=ja)が可能

### 5. マルチモーダルテーブル

[ObjectRef](https://docs.cloud.google.com/bigquery/docs/objectref-columns?hl=ja) 列を使用して、構造化データと非構造化データ（画像など）のメタデータを同一テーブルに保存できる。非構造化データ自体は Cloud Storage に保存される。

---

## テーブルへのアクセス制御

アクセス権は以下のレベルで IAM ロールを付与して制御する（範囲が大きい順）:

1. **プロジェクト / フォルダ / 組織** レベル
2. **データセット** レベル
3. **テーブルまたはビュー** レベル

### データアクセスの制限方法

| 方式 | 説明 |
|---|---|
| [行レベルのセキュリティ](https://docs.cloud.google.com/bigquery/docs/row-level-security-intro?hl=ja) | 行単位でのアクセス制限 |
| [列データマスキング](https://docs.cloud.google.com/bigquery/docs/column-data-masking-intro?hl=ja) | 列データのマスク処理 |
| [列レベルのセキュリティ](https://docs.cloud.google.com/bigquery/docs/column-level-security-intro?hl=ja) | 列単位でのアクセス制限 |

> **重要**: IAM で保護されているリソースを使用したアクセスは**追加型**。上位レベルのアクセス権がなくても、下位レベルで個別に付与できる。「拒否」権限は設定不可。

---

## テーブルに関する情報を取得する

### 取得方法

- `INFORMATION_SCHEMA` ビューへのクエリ
- `tables.get` API メソッド
- `bq show` コマンド
- Google Cloud コンソール
- クライアントライブラリ

### 必要な権限

`bigquery.tables.get` が必要。以下のロールに含まれる:
`bigquery.admin`、`bigquery.dataEditor`、`bigquery.dataOwner`、`bigquery.dataViewer`、`bigquery.metadataViewer`

### bq CLI での情報取得例

```bash
# すべての情報を表示
bq show --format=prettyjson mydataset.mytable

# スキーマ情報のみ表示
bq show --schema --format=prettyjson myotherproject:mydataset.mytable
```

---

## INFORMATION_SCHEMA によるメタデータ取得

### TABLES ビュー

データセット内のテーブル・ビューごとに1行を返す。

主要なカラム:

| 列名 | 説明 |
|---|---|
| `table_catalog` | プロジェクト ID |
| `table_schema` | データセット名 |
| `table_name` | テーブル・ビュー名 |
| `table_type` | `BASE TABLE`、`VIEW`、`MATERIALIZED VIEW`、`EXTERNAL`、`SNAPSHOT`、`CLONE` |
| `managed_table_type` | `NATIVE`、`BIGLAKE`（プレビュー） |
| `is_insertable_into` | DML INSERT 対応可否 |
| `creation_time` | 作成時間 |
| `ddl` | テーブルの再作成に使用できる DDL |

#### 使用例

```sql
SELECT
  table_catalog, table_schema, table_name, table_type,
  is_insertable_into, creation_time, ddl
FROM
  mydataset.INFORMATION_SCHEMA.TABLES;
```

### TABLE_OPTIONS ビュー

テーブルのオプション（有効期限、説明、ラベル等）ごとに1行を返す。

主要なオプション:
- `description`: テーブルの説明
- `expiration_timestamp`: 有効期限
- `friendly_name`: わかりやすい名前
- `labels`: ラベル配列
- `kms_key_name`: Cloud KMS 暗号鍵名
- `require_partition_filter`: パーティションフィルタ必須かどうか
- `tags`: IAM タグ配列

#### 使用例：有効期限の一覧取得

```sql
SELECT *
FROM mydataset.INFORMATION_SCHEMA.TABLE_OPTIONS
WHERE option_name = 'expiration_timestamp';
```

### COLUMNS ビュー

テーブル内の列ごとに1行を返す。

主要なカラム:

| 列名 | 説明 |
|---|---|
| `column_name` | 列名 |
| `ordinal_position` | 列の位置（1始まり） |
| `is_nullable` | NULL 許可可否 |
| `data_type` | GoogleSQL データ型 |
| `is_partitioning_column` | パーティショニング列かどうか |
| `clustering_ordinal_position` | クラスタリング列の位置 |
| `column_default` | デフォルト値 |

### COLUMN_FIELD_PATHS ビュー

`RECORD`（STRUCT）列内のネストされた列ごとに1行を返す。`field_path` でネストされたフィールドのパス（例: `author.name`）を確認できる。

### TABLE_STORAGE ビュー

テーブルのストレージ使用量に関するメタデータを返す。

主要なカラム:

| 列名 | 説明 |
|---|---|
| `total_rows` | 合計行数 |
| `total_logical_bytes` | 論理バイト合計 |
| `active_logical_bytes` | 90日未満の論理バイト |
| `long_term_logical_bytes` | 90日以上の論理バイト |
| `total_physical_bytes` | 物理バイト合計（タイムトラベルデータ含む） |
| `time_travel_physical_bytes` | タイムトラベル用物理バイト |
| `fail_safe_physical_bytes` | フェイルセーフ用物理バイト |

#### 使用例：ストレージコスト比較予測

論理課金モデルと物理課金モデルの料金差を予測するクエリが提供されている。圧縮率（`active_compression_ratio`）を算出し、今後30日間のコスト差を見積もることが可能。

---

## データセット内のテーブルを一覧表示する

### 必要な権限

`bigquery.tables.list` が必要。以下のロールに含まれる:
`bigquery.admin`、`bigquery.dataOwner`、`bigquery.dataEditor`、`bigquery.dataViewer`、`bigquery.metadataViewer`、`bigquery.user`

### bq CLI での一覧表示例

```bash
# デフォルトプロジェクトのデータセット内テーブル一覧
bq ls --format=pretty mydataset

# 50件を超えるテーブルを表示
bq ls --format=pretty --max_results 60 mydataset

# 別プロジェクトのデータセット
bq ls --format=pretty myotherproject:mydataset
```

---

## 外部テーブルのオプション（CREATE EXTERNAL TABLE）

外部テーブル作成時には多数のオプションが指定可能:

| オプション | 説明 |
|---|---|
| `format` | データ形式（AVRO, CSV, JSON, PARQUET, ORC 等） |
| `uris` | 外部データの URI 配列。ワイルドカード対応 |
| `encoding` | 文字エンコード（デフォルト UTF-8） |
| `field_delimiter` | CSV フィールド区切り文字 |
| `skip_leading_rows` | スキップする先頭行数 |
| `max_bad_records` | 許容する不良レコード数 |
| `max_staleness` | BigLake テーブルのメタデータキャッシュ鮮度（30分〜7日） |
| `hive_partition_uri_prefix` | Hive パーティション URI プレフィックス |
| `require_hive_partition_filter` | パーティションフィルタ必須化 |
| `reference_file_schema_uri` | 参照スキーマファイルの URI |

---

## 制限事項・注意点

- bq CLI のインラインスキーマでは `RECORD` 型・列の説明・列モード指定が不可（JSON スキーマファイルを使用すること）
- IAM の「拒否」権限は設定できない
- テーブルの有効期限設定はデータセットのデフォルト有効期限を上書きする
- テーブル名の一部の接頭辞は予約されている
- `TABLE_STORAGE` の `total_physical_bytes` にはフェイルセーフのバイト数は含まれない
