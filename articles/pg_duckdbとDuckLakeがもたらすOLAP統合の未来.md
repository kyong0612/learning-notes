---
title: "pg_duckdbとDuckLakeがもたらすOLAP統合の未来"
source: "https://zenn.dev/nttdata_tech/articles/tzkoba-pgduckdb-ducklake-202506"
author:
  - "こば"
published: 2025-06-27
created: 2025-06-29
description: |
  近年、大手分析系ベンダーがPostgreSQL関連企業を買収し、OLTPとOLAPの統合を進めています。この流れはオープンソースのPostgreSQLにも波及すると予想され、本記事ではその先駆けとして注目される`pg_duckdb`と`DuckLake`を解説し、PostgreSQLにおけるOLAP統合の未来像を探ります。
tags:
  - "PostgreSQL"
  - "DuckDB"
  - "OLAP"
  - "HTAP"
  - "DataLake"
---

## 注目を集めるPostgreSQL＋Analytics

近年、SnowflakeやDatabricksなどの大手分析系（OLAP）ベンダーがPostgreSQL関連企業を買収し、OLTPとOLAPのソリューション統合を進めています。この流れは、オープンソースのPostgreSQLにも波及し、OLAPとの統合が今後確実に訪れると予想されます。本記事では、その先駆けとして注目されるPostgreSQLとDuckDBの統合について、その現状と将来性を探ります。

## PostgreSQLとOLAP

従来、PostgreSQLで分析機能を強化するには、CitusやGoogle AlloyDBのように、PostgreSQL内部にカラムナストアを実装するアプローチが取られてきました。しかし、この方法ではデータレイクに蓄積されたParquetなどのファイルを直接読み込むにはETL処理が必要でした。

この課題を解決し、データレイク上のファイルにPostgreSQLから直接アクセスする可能性を秘めているのが `pg_duckdb` と `DuckLake` です。

## pg_duckdbとは

`pg_duckdb` は、組み込み分析エンジンDuckDBの機能をPostgreSQLに統合する拡張モジュールで、HTAP（Hybrid Transactional/Analytical Processing）の実現を目指しています。`pg_duckdb` を使うと、PostgreSQLから直接オブジェクトストレージ上のデータファイル（CSV, Parquet, JSON, Iceberg, Delta）を読み書きできます。

**アーキテクチャ:**
> 「pg_duckdbのアーキテクチャ」
> ![](https://storage.googleapis.com/zenn-user-upload/6759e462167b-20250623.png)

### 試しに使ってみる

Dockerを使えば簡単に試すことができます。GCSやS3などのオブジェクトストレージに対し、Secretを設定することでアクセスが可能になります。

**1. Parquetファイルの書き込み**
PostgreSQLのテーブルデータを`COPY`コマンドで直接GCSなどのオブジェクトストレージにParquetファイルとして書き出すことができます。

```sql
COPY (SELECT * FROM items) TO 'gs://pg-duckdb-test/items.parquet';
```

これにより、ETLツールが担っていたデータ加工処理の一部を省略できる可能性があります。

**2. Parquetファイルの読み込み**
`read_parquet()`関数を使って、オブジェクトストレージ上のParquetファイルを直接読み込み、PostgreSQLのテーブルと結合するなどの分析クエリを実行できます。

```sql
SELECT * FROM read_parquet('gs://pg-duckdb-test/items.parquet');
```

### pg_duckdbのまとめ

`pg_duckdb`は、数百GB程度のデータを対象に、ETL処理を省略してPostgreSQLから高速な分析を行う用途で期待できるソリューションです。ただし、調査によれば、300GBを超えるような大規模データセットの分析ではスケールしない可能性が指摘されています。

## DuckLakeとは

`pg_duckdb`には、現状では複数ファイルからなるテーブル管理やレコード単位の更新・削除ができないという課題があります。この課題を補完し、`pg_duckdb`をPostgreSQLのストレージエンジンとして完成させる可能性を秘めているのが`DuckLake`です。

`DuckLake`は、SQLエンジンとしてDuckDB、データファイルの格納先としてオブジェクトストレージ、そして**カタログデータベースとしてPostgreSQL**（またはMySQLなど）を利用する構成を取ります。これにより、テーブルのスキーマ、バージョン、データファイルの場所といったメタデータをRDBで管理し、堅牢なデータ管理を実現します。

**アーキテクチャ:**
> 「DuckLake(with PostgreSQL)のアーキテクチャ」
> ![](https://storage.googleapis.com/zenn-user-upload/b9aec8bdcaf5-20250623.png)

DuckLakeを用いることで、オブジェクトストレージ上の複数ファイルを一つのテーブルとして管理し、レコード単位の更新や削除、スナップショット管理が可能になります。

### pg_duckdbとDuckLakeは現時点で連携不可

`pg_duckdb`がDuckLakeフォーマットに対応すれば、PostgreSQLをインターフェースとしたワンストップな分析ツールセットが完成します。

しかし、**2025年6月時点でpg_duckdbはDuckLakeに未対応**です。ただし、GitHubのIssueで`pg_ducklake`という統合が提案されており、これが実現すれば以下のアーキテクチャが想定されます。

> pg_duckdb＋DuckLakeで想定されるアーキテクチャ
> ![](https://storage.googleapis.com/zenn-user-upload/62f54a855324-20250623.png)

## まとめ

`pg_duckdb`と`DuckLake`の統合は、PostgreSQLにデータファイルをオブジェクトストレージへ格納する新たなストレージエンジンをもたらす可能性を秘めています。この仕組みは、PostgreSQLの多機能化とOLAP統合の未来を占う上で非常に興味深い動向と言えるでしょう。
