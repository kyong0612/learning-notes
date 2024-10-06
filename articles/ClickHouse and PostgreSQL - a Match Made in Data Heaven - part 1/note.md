# ClickHouse and PostgreSQL - a Match Made in Data Heaven - part 1

ref: <https://clickhouse.com/blog/migrating-data-between-clickhouse-postgres>

1. 導入:
   - PostgreSQLはOLTP(オンライントランザクション処理)に適したリレーショナルデータベース
   - ClickHouseはOLAP(オンライン分析処理)に特化したカラム指向データベース
   - 両者は補完的な関係にあり、組み合わせて使用することで効果的なアーキテクチャを構築可能[1]

2. ユースケース:
   - 不動産リスティングウェブサイトを想定
   - PostgreSQLをトランザクションデータの真実の源として使用
   - ClickHouseを分析ワークロード用に使用[1]

3. ClickHouseからPostgreSQLにアクセスする方法:
   - postgresql関数を使用
   - PostgreSQLテーブルエンジンを使用してテーブルをミラーリング
   - PostgreSQLデータベースエンジンを使用してデータベース全体をミラーリング[1]

4. パフォーマンス比較:
   - 同じクエリをPostgreSQLとClickHouseで実行し、パフォーマンスを比較
   - ClickHouseは分析クエリで大幅に高速なパフォーマンスを示す[1]

5. データ移行:
   - PostgreSQLからClickHouseへのデータ移行方法を説明
   - INSERT INTO ... SELECT FROM構文を使用[1]

6. 結論:
   - ClickHouseとPostgreSQLは補完的な関係にあり、効果的に組み合わせて使用可能
   - ClickHouseの分析性能とPostgreSQLのトランザクション処理能力を活用できる[1]

この記事は、ClickHouseとPostgreSQLの統合機能を活用して、トランザクションデータの管理と高速な分析クエリの実行を両立させる方法を詳細に解説しています。開発者やデータエンジニアにとって、両データベースの長所を活かしたシステム設計の参考になる内容となっています[1]。

Citations:
[1] <https://clickhouse.com/blog/migrating-data-between-clickhouse-postgres>
[2] <https://clickhouse.com/blog/migrating-data-between-clickhouse-postgres>
---

## Querying Postgres from ClickHouse

ClickHouseからPostgreSQLにアクセスする方法は主に3つあります：

1. postgresql関数の使用
2. PostgreSQL テーブルエンジンの使用
3. PostgreSQL データベースエンジンの使用

特に重要なのは以下の点です：

1. postgresql関数:
   - クエリごとに接続を作成し、データをClickHouseにストリーミングします。
   - 単純なWHERE句はできる限りPostgreSQLにプッシュダウンされます。
   - マッチする行が返された後、集計、JOIN、ソート、LIMIT句はClickHouseで実行されます。

2. PostgreSQLテーブルエンジン:
   - PostgreSQLの全テーブルをClickHouseにミラーリングできます。
   - 実装上はpostgresql関数と同じですが、クエリ構文が大幅に簡略化されます。

3. パフォーマンスに関する重要な点:
   - ClickHouseは単純なフィルター句（=, !=, >, >=, <, <=, IN）をプッシュダウンできます。
   - ClickHouse固有の関数を使用すると、プッシュダウンが妨げられ、全テーブルスキャンが発生する可能性があります。
   - バンド幅と接続性がパフォーマンスに大きく影響します。

4. クエリの最適化:
   - postgresql関数やテーブルエンジンを使用する際は、PostgreSQLへのクエリ回数に注意が必要です。
   - PostgreSQLのインデックスを活用してClickHouseにストリーミングするデータ量を最小限に抑えることが重要です。

5. 具体的な例:
   - 資料では、UK house price datasetを使用して、ClickHouseからPostgreSQLにクエリを実行する具体的な例が示されています。
   - これらの例では、クエリのパフォーマンスや最適化の方法が詳細に説明されています。

この統合により、ClickHouseの高速な分析処理能力とPostgreSQLのトランザクション処理能力を組み合わせた効果的なアーキテクチャを構築できることが示されています[1][2]。

Citations:
[1] <https://clickhouse.com/blog/migrating-data-between-clickhouse-postgres>
[2] <https://clickhouse.com/blog/migrating-data-between-clickhouse-postgres>
