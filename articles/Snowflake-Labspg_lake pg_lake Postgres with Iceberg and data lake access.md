---
title: "pg_lake: Postgres with Iceberg and data lake access"
source: "https://github.com/Snowflake-Labs/pg_lake"
author:
  - "Snowflake Labs"
  - "Önder Kalacı"
  - "Aykut Bozkurt"
  - "Marco Slot"
published: 2025-11-06
created: 2025-11-06
description: |
  IcebergとデータレイクファイルをPostgreSQLに統合するオープンソースプロジェクト。Icebergテーブルの作成・変更、S3などのオブジェクトストレージ内のデータファイルの直接クエリとインポート、トランザクション保証を伴う高速クエリ実行、DuckDBエンジンの活用によるパフォーマンス向上を実現。
tags:
  - "postgresql"
  - "iceberg"
  - "data-lake"
  - "duckdb"
  - "parquet"
  - "s3"
  - "lakehouse"
  - "database-extension"
  - "analytics"
  - "sql"
---

## 概要

`pg_lake`は、PostgreSQLにIcebergとデータレイクファイルを統合するオープンソースプロジェクトです。PostgreSQLを、トランザクションをサポートし、Icebergテーブルへの高速クエリが可能なスタンドアロンのレイクハウスシステムとして使用できるようにします。

### 主な機能

- **Icebergテーブルの直接作成と変更**: PostgreSQLから直接Icebergテーブルを作成・変更し、完全なトランザクション保証のもとで他のエンジンからもクエリ可能
- **オブジェクトストレージ内のデータファイルのクエリとインポート**: Parquet、CSV、JSON、Iceberg形式のデータファイルに対するクエリとインポート
- **クエリ結果のエクスポート**: COPYコマンドを使用してParquet、CSV、JSON形式でオブジェクトストレージにエクスポート
- **地理空間フォーマットの読み込み**: GDALがサポートするGeoJSON、Shapefileなどの形式に対応
- **組み込みのマップ型**: 半構造化データやキーバリューデータ向けの組み込みマップ型
- **異なるテーブル形式の統合**: ヒープ、Iceberg、外部Parquet/CSV/JSONファイルを同一のSQLクエリと変更で組み合わせ可能（完全なトランザクション保証とSQL制限なし）
- **テーブル列と型の自動推論**: Iceberg、Parquet、JSON、CSVファイルなどの外部データソースから自動推論
- **DuckDBクエリエンジンの活用**: PostgreSQLを離れることなく高速実行を実現

## セットアップ方法

### Dockerを使用する場合

簡単にテスト環境を構築できるDocker環境が提供されています。

### ソースからビルドする場合

必要なコンポーネントをビルドしてインストール後、PostgreSQL内で`pg_lake`を初期化します。

#### エクステンションの作成

```sql
CREATE EXTENSION pg_lake CASCADE;
```

これにより、必要な全てのエクステンション（`pg_lake_table`、`pg_lake_engine`、`pg_extension_base`、`pg_lake_iceberg`、`pg_lake_copy`）がインストールされます。

#### pgduck_serverの実行

`pgduck_server`は、Postgresワイヤープロトコルを実装し、内部でDuckDBを使用してクエリを実行するスタンドアロンプロセスです。デフォルトでポート`5332`のUnixドメインソケットでリスニングします。

```bash
pgduck_server
```

重要な設定オプション:

- `--memory_limit`: メモリ制限（デフォルトはシステムメモリの80%）
- `--init_file_path <path>`: 起動時に実行するSQLファイル
- `--cache_dir`: リモートファイル（S3など）のキャッシュディレクトリ

#### S3への接続設定

DuckDBのシークレットマネージャーを利用し、AWSとGCPのクレデンシャルチェーンに従います。クラウド認証情報を適切に設定した後、Icebergテーブルの保存場所を設定します:

```sql
SET pg_lake_iceberg.default_location_prefix TO 's3://testbucketpglake';
```

## 使用例

### Icebergテーブルの作成

```sql
CREATE TABLE iceberg_test USING iceberg
AS SELECT
    i as key, 'val_'|| i as val
FROM
    generate_series(0,99)i;
```

クエリ実行:

```sql
SELECT count(*) FROM iceberg_test;
-- 結果: 100
```

メタデータ位置の確認:

```sql
SELECT table_name, metadata_location FROM iceberg_tables;
```

### S3との間でのCOPY

Parquet、CSV、改行区切りJSON形式でデータを直接インポート/エクスポート可能。形式はファイル拡張子から自動推論されます。

```sql
-- PostgreSQLからS3へのエクスポート（Parquet形式）
COPY (SELECT * FROM iceberg_test) TO 's3://testbucketpglake/parquet_data/iceberg_test.parquet';

-- S3からPostgreSQLへのインポート
COPY iceberg_test FROM 's3://testbucketpglake/parquet_data/iceberg_test.parquet';
```

### S3上のファイルに対する外部テーブルの作成

列名や型を指定せずに、ファイルから直接外部テーブルを作成できます。

```sql
-- パス下のファイルを使用（*で全ファイル指定可能）
CREATE FOREIGN TABLE parquet_table()
SERVER pg_lake
OPTIONS (path 's3://testbucketpglake/parquet_data/*.parquet');

-- 列はファイルから自動推論される
SELECT count(*) FROM parquet_table;
-- 結果: 100
```

## アーキテクチャ

`pg_lake`インスタンスは2つの主要コンポーネントで構成されます:

1. **pg_lake拡張機能を持つPostgreSQL**: クエリプランニング、トランザクション境界、実行のオーケストレーションを処理
2. **pgduck_server**: PostgreSQLワイヤープロトコルを実装する独立したマルチスレッドプロセス。DuckDBとduckdb_pglake拡張機能を実行

ユーザーはPostgreSQLに接続してSQLクエリを実行し、`pg_lake`拡張機能がPostgreSQLのフックと統合します。クエリ実行の一部は、DuckDBの高並列カラム指向実行エンジンを通じて`pgduck_server`に委譲されます。

この分離により、PostgreSQLのプロセス内にDuckDBを直接埋め込むことで生じるスレッディングとメモリ安全性の制限を回避し、標準のPostgreSQLクライアントを使用してクエリエンジンと直接対話できます。

### コンポーネント

`pg_lake`はモジュール設計に従い、相互運用する一連のコンポーネントで構成されています:

- **pg_lake_iceberg**: Iceberg仕様を実装するPostgreSQL拡張機能
- **pg_lake_table**: オブジェクトストレージ内のファイルをクエリするための外部データラッパー
- **pg_lake_copy**: データレイクとの間でのCOPYを実装
- **pg_lake_engine**: 異なるpg_lake拡張機能の共通モジュール
- **pg_extension_base**: 他の拡張機能の基礎となる構成要素
- **pg_extension_updater**: 起動時に全拡張機能を更新する拡張機能
- **pg_lake_benchmark**: レイクテーブルのベンチマークを実行する拡張機能
- **pg_map**: ジェネリックマップ型ジェネレータ
- **pgduck_server**: DuckDBをロードし、PostgreSQLプロトコル経由で公開するスタンドアロンサーバー
- **duckdb_pglake**: DuckDBに不足しているPostgreSQL関数を追加するDuckDB拡張機能

## 開発の歴史

- **2024年初頭**: Crunchy DataでIcebergをPostgreSQLに統合する目的で開発開始
- **2024年**: 外部クエリエンジン（DuckDB）の統合に注力
- **2024年**: Crunchy Bridgeの顧客向けに「Crunchy Bridge for Analytics」として提供開始
- **2024年11月**: Iceberg v2プロトコルの包括的な実装を完了し、「Crunchy Data Warehouse」として再ローンチ
- **2025年6月**: Crunchy DataがSnowflakeに買収
- **2025年11月**: Snowflakeがプロジェクトを`pg_lake`としてオープンソース化

## ライセンス

Apache 2.0ライセンスのもとで公開されています。

### 依存関係に関する注意

`pg_lake`は、サードパーティプロジェクトのApache AvroとDuckDBに依存しています。ビルド時に、`pg_lake`の機能を提供するためにAvroと特定のDuckDB拡張機能にパッチを適用します。これらのプロジェクトのソースコードは元のライセンスのもとで維持されます。

## リポジトリ統計

- **Stars**: 920
- **Forks**: 29
- **主要言語**: C (53.7%)、Python (41.7%)、C++ (2.8%)
- **ライセンス**: Apache-2.0
