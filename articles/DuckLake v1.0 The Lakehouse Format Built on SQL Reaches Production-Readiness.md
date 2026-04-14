---
title: "DuckLake v1.0: The Lakehouse Format Built on SQL Reaches Production-Readiness"
source: "https://ducklake.select/2026/04/13/ducklake-10/"
author:
  - "[[The DuckDB team]]"
published: 2026-04-13
created: 2026-04-14
description: "DuckLake v1.0がプロダクション対応のレイクハウスフォーマット仕様として正式リリース。SQLデータベースにメタデータを格納する独自アーキテクチャにより、Data Inlining、ソートテーブル、バケットパーティショニング、VARIANT/GEOMETRY型サポート、削除ベクトルなどの新機能を搭載。DuckDB v1.5.2のducklake拡張として利用可能。"
tags:
  - "clippings"
  - "DuckDB"
  - "DuckLake"
  - "Lakehouse"
  - "Data Engineering"
  - "SQL"
  - "Parquet"
  - "Iceberg"
  - "Object Storage"
---

## 概要

DuckLake v1.0は、SQLデータベースにメタデータを格納するレイクハウスフォーマットの初のプロダクション対応リリースである。2025年5月のマニフェスト公開から約1年を経て、安定した仕様、機能豊富なリファレンス実装（DuckDB `ducklake`拡張）、および将来の開発ロードマップとともにリリースされた。後方互換性が保証されており、DuckDB v1.5.2で利用可能。

DuckLakeの最大の特徴は、Delta LakeやIcebergがオブジェクトストレージ上の散在するファイルにメタデータを保存するのに対し、**すべてのメタデータをSQLデータベース（カタログ）に格納する**点にある。カタログとしてSQLite、PostgreSQL、DuckDB自身をサポートする。

## 主要なトピック

### DuckLakeの基本アーキテクチャ

- データはオブジェクトストレージに保存し、データベースとしてアクセス可能
- メタデータはSQLデータベース（カタログ）に一元管理
- カタログDBの要件：SQL対応、主キーサポート、データのテーブル永続化
- [DuckLake仕様](https://ducklake.select/docs/stable/specification/introduction.html)がメタデータテーブル構造、データ型、操作方法を定義

### これまでの進化

- 既存Parquetファイルのディープコピーなしでの追加
- Iceberg互換性の導入
- `GEOMETRY`型および`VARIANT`型のサポート
- DuckDBからDuckLakeへの移行スクリプト

### ユースケース

- **ストリーミング取り込み**: データインライニング機能を使い、小さな更新をカタログDBにステージングしてデータレイクへのストリーミングを実現
- **認証不要の読み取り専用レイクハウス**: ストレージとパブリックHTTPSエンドポイントのみで軽量に構築可能
- **マルチプレイヤー構成**: 複数のDuckDBインスタンスがPostgreSQLカタログを介して同一DuckLakeに同時アクセス

### コミュニティ採用状況

- DuckDBの**トップ10コア拡張**にランクイン
- 対応クライアント：Apache DataFusion、Apache Spark、Trino、Pandas DataFrame
- MotherDuckが[ホスティングDuckLakeサービス](https://motherduck.com/docs/integrations/file-formats/ducklake/)を提供
- 数十社で本番環境での利用実績
- [O'Reilly DuckLake書籍](https://duckdb.org/library/ducklake-the-definitive-guide/)が執筆中

## v1.0の新機能

### Data Inlining（データインライニング）

DuckLakeのフラッグシップ機能。小さなINSERT/DELETE/UPDATE操作をカタログDBに直接格納し、「小ファイル問題」を回避する。

- **デフォルトで有効**、閾値は10行
- INSERT、DELETE、UPDATEの完全なインラインサポート
- `CHECKPOINT`でインラインデータをオブジェクトストレージにフラッシュ

```sql
CREATE TABLE lake.t (id INT, status VARCHAR);
INSERT INTO lake.t VALUES (1, 'en route'), (2, 'shipped');
DELETE FROM lake.t WHERE id = 1;
UPDATE lake.t SET status = 'delivered' WHERE id = 2;
FROM ducklake_list_files('lake', 't'); -- returns empty
CHECKPOINT; -- flushes data
```

### Sorted Tables（ソートテーブル）

高カーディナリティカラム（ID、タイムスタンプ等）に対するクエリパフォーマンスを向上させる機能。

- `SET SORTED BY`でカラム名または**任意のSQL式**によるソート指定が可能
- Row GroupおよびFileレベルのプルーニングが改善
- コンパクション、フラッシュ、挿入時にソートを適用（挿入時のソートは無効化可能）

```sql
CREATE TABLE lake.sorted_t (id INT, payload JSON);
ALTER TABLE lake.sorted_t SET SORTED BY (id ASC);
```

### Bucket Partitioning（バケットパーティショニング）

高カーディナリティカラムに対するパーティショニングの代替手段。

- **murmur3ハッシュ**によるIceberg完全互換の実装
- カラム値のハッシュ値をバケット数で剰余演算して割り当て
- 他のパーティション変換と組み合わせ可能

```sql
ALTER TABLE lake.events SET PARTITIONED BY (bucket(8, user_name));
```

### GEOMETRY型サポートの強化

- ファイルレベルのバウンディングボックス統計情報によるフィルタプッシュダウン
- `&&`演算子（重なるバウンディングボックスのチェック）を使用した空間プルーニング
- STRUCT、LIST、MAP内へのネスト対応
- データインライニングにも対応

### VARIANT型サポート

JSONの上位互換となるセミ構造化データ型。

- `DATE`、`TIMESTAMP`など**JSONより多くの型をサポート**
- 文字列ではなく**バイナリエンコード形式**で保存
- プリミティブ型への**シュレッディング（分解保存）**が可能で、フィルタ・射影プッシュダウンによる高速クエリ
- 将来的にJSONを置き換える型として位置づけ

```sql
CREATE TABLE lake.events (id INT, payload VARIANT);
INSERT INTO lake.events VALUES 
    (1, {'user': 'alice', 'ts': TIMESTAMP '2024-01-01'}), 
    (2, {'user': 'bob', 'ts': TIMESTAMP '2024-01-02', 'rand': 'value'});
SELECT * FROM lake.events WHERE payload.user = 'bob';
```

### Deletion Vectors（削除ベクトル）- 実験的

- Iceberg v3仕様の削除ベクトルを実装
- **Puffinファイル**としてローリングビットマップで保存
- Icebergとのデータレベル互換を維持
- 現在は実験的機能

```sql
CALL lake.set_option('write_deletion_vectors', true, table_name => 't');
```

## 重要な事実・データ

- **108件のPR**がv1.0ターゲット設定以降にマージ
  - **68件**: 信頼性と正確性に関する修正
  - **12件**: 内部リファクタリング
  - **12件**: パフォーマンス改善
- **COUNT(\*)最適化**: ファイル行数統計からの応答により、S3バックテーブルで**8倍〜258倍の高速化**
- `duckdb_views()`クエリが**約70倍高速化**（AST解析-シリアライズの往復を排除）
- データインラインのデフォルト閾値: **10行**

## 将来のロードマップ

### DuckLake v1.1（短期計画）

1. **Variant Inlining**: ネイティブにVariant型をサポートしないカタログ（PostgreSQL等）でもVariantインラインを可能にする仕様変更
2. **Multi-Deletion Vector Puffin Files**: 単一Puffinファイルに複数の削除ベクトルを格納し、タイムトラベル情報を保持しつつ小ファイル問題を最小化

### DuckLake v2.0（長期構想）

1. **Git-like Branching**: データのブランチ作成とマージ機能（コードに対するGitのように）
2. **Permission-based Roles**: DuckLake内での直接的なロール・権限管理（現在はPostgres/S3の設定で可能だが簡素化を目指す）
3. **Incremental Materialized Views**: DuckLakeテーブルの変更追跡による差分リフレッシュ対応のマテリアライズドビュー

## 結論・示唆

### 著者の結論

DuckLake v1.0は安定した仕様と機能豊富なリファレンス実装を備え、プロダクション利用に耐えるレイクハウスフォーマットとして成熟した。わずか1年でトップ10拡張入り、数十社の本番採用、複数エンジンのクライアント対応という急速なエコシステム成長を遂げている。

### 実践的な示唆

- データインラインにより小規模な更新が多いワークロード（IoTストリーミング等）での利用価値が高い
- PostgreSQLカタログによるマルチプレイヤー構成は、チームでのデータコラボレーションに有用
- Iceberg互換により既存のIceberg資産からの段階的移行が可能
- VARIANT型は今後のセミ構造化データ管理の標準となる可能性
- v2.0のGit-likeブランチングが実現すれば、データのバージョン管理ワークフローが大きく変わる

## 制限事項・注意点

- **Deletion Vectorsは実験的機能**であり、今後のリリースで改善予定
- **Variant Inlining**はDuckDBカタログでのみ動作し、PostgreSQL/SQLiteカタログでは現時点で未対応（v1.1で対応予定）
- **空間ファイルレベルプルーニング**はGEOMETRY型で未実装（TODO）
- v2.0は「すぐには来ない」とされ、現在の機能セットの成熟と仕様の安定性に注力する方針
- コミュニティのニーズにより機能の追加・優先順位の変更が発生する可能性あり

---

*Source: [DuckLake v1.0: The Lakehouse Format Built on SQL Reaches Production-Readiness](https://ducklake.select/2026/04/13/ducklake-10/)*
