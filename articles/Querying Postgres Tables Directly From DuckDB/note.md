# Querying Postgres Tables Directly From DuckDB

ref: <https://duckdb.org/2022/09/30/postgres-scanner.html>

## 概要

DuckDBは、PostgreSQLに保存されているテーブルを直接クエリできるようになり、データを複製することなく複雑な分析クエリを高速化できるようになりました[1][2]。

## 背景

- PostgreSQLはOLTP（オンライントランザクション処理）に適していますが、OLAP（オンライン分析処理）には適していません[1]。
- 従来は、分析のためにデータを別のシステムにコピーする必要がありましたが、これには同期の問題やストレージの二重化などの課題がありました[1]。

## Postgres Scannerの特徴

1. DuckDBの拡張機能として実装されています[1]。

2. PostgreSQLのバイナリ転送モードを利用して、効率的にデータを読み取ります[1]。

3. インストールと使用方法:

   ```sql
   INSTALL postgres_scanner;
   LOAD postgres_scanner;
   CALL postgres_attach('dbname=myshinydb');
   ```

4. PostgreSQLのテーブルをDuckDBのビューとして登録し、SQLで直接クエリできます[1]。

## 実装の詳細

1. 並列化: PostgreSQLの「TID Scan」を利用して、テーブルの読み取りを並列化しています[1]。

2. トランザクションの同期: `pg_export_snapshot()`を使用して、一貫性のある読み取りを保証しています[1]。

3. プロジェクションとセレクションのプッシュダウン: DuckDBのクエリ最適化機能を活用して、PostgreSQLへの問い合わせを最適化しています[1]。

## パフォーマンス

TPC-Hベンチマークを使用して、DuckDB、PostgreSQL、DuckDB with Postgres Scannerのパフォーマンスを比較しています。結果として、Postgres Scannerを使用したDuckDBは、多くのクエリでPostgreSQLよりも高速であることが示されています[1][2]。

## その他の使用例

1. ライブデータとキャッシュデータの組み合わせ[1]
2. PostgreSQLテーブルをParquetファイルに簡単に書き出せる機能[1]

## 結論

Postgres ScannerはPostgreSQLのデータを直接読み取り、複雑なOLAPクエリを高速に処理できます。これにより、データの複製なしに分析処理を効率化できます[1][2]。

この新機能は、OLTPとOLAPのワークロードを効率的に扱いたいユーザーにとって非常に有用なツールとなる可能性があります。

Citations:
[1] <https://duckdb.org/2022/09/30/postgres-scanner.html>
[2] <https://duckdb.org/2022/09/30/postgres-scanner.html>

---

### DuckDBのPostgreSQL連携ではBinary Transfer Modeというのを使っている

```
Instead, we use the rarely-used binary transfer mode of the Postgres client-server protocol. This format is quite similar to the on-disk representation of Postgres data files and avoids some of the otherwise expensive to-string and from-string conversions. For example, to read a normal int32 from the protocol message, all we need to do is to swap byte order (ntohl).

The Postgres scanner connects to PostgreSQL and issues a query to read a particular table using the binary protocol. In the simplest case (see optimizations below), to read a table called lineitem, we internally run the query:

COPY (SELECT * FROM lineitem) TO STDOUT (FORMAT binary);

This query will start reading the contents of lineitem and write them directly to the protocol stream in binary format.
```

### pushdown・projection

- SELECT文の、カラム指定・WHERE文はDuckDB側ではなく、PostgreSQL側で動作させる（pushdown）ことが可能

```
D SELECT key FROM postgres_scan_pushdown('postgresql://postgres:admin@localhost:5433/postgres', 'public', 't1') WHERE key = 'common_key';
┌────────────┐
│    key     │
│  varchar   │
├────────────┤
│ common_key │
└────────────┘
```

```
        COPY (SELECT "key", "not_key" FROM "public"."t1" WHERE ctid BETWEEN '(0,0)'::tid AND '(4294967295,0)'::tid  AND ("key" = 'common_key' AND "key" IS NOT NULL)) TO STDOUT (FORMAT binary);
```

- WHEREのpushdownは行わない（＝DuckDB側で絞り込み）も可能

```
D SELECT key FROM postgres_scan('postgresql://postgres:admin@localhost:5433/postgres', 'public', 't1') WHERE key = 'common_key';
┌────────────┐
│    key     │
│  varchar   │
├────────────┤
│ common_key │
└────────────┘
```

```
        COPY (SELECT "key" FROM "public"."t1" WHERE ctid BETWEEN '(0,0)'::tid AND '(4294967295,0)'::tid ) TO STDOUT (FORMAT binary);
```
