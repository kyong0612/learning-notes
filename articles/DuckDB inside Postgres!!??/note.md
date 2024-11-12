# DuckDB inside Postgres!!??

ref: <https://dataengineeringcentral.substack.com/p/duckdb-inside-postgres>

## 背景と期待

- PostgreSQLはOLTP(オンライントランザクション処理)に強いが、大規模なOLAP(分析処理)では性能が低下する傾向がある[1]
- DuckDBは高速な分析処理エンジンとして知られている[1]
- pg_duckdbは、PostgreSQL内でDuckDBエンジンを使用することで分析クエリのパフォーマンスを向上させることを目指している[1]

## 検証結果

**50万レコードでのテスト:**

- PostgreSQL単体: 実行時間 約4秒
- pg_duckdb: 実行時間 約7.9秒[1]

**100万レコードでのテスト:**

- PostgreSQL単体: 実行時間 約46秒
- pg_duckdb: 実行時間 約73秒[1]

## 主な発見

- 予想に反して、pg_duckdbはPostgreSQL単体よりも遅い結果となった[1]
- データ量が増えても、パフォーマンスギャップは縮まらなかった[1]
- DuckDBの公式発表では、インデックスなしの環境でのベンチマークを行っており、実際の使用環境とは異なる条件でテストしていた[1]

## pg_duckdbの真の価値

著者は、pg_duckdbの真の価値は単純なクエリ実行の高速化ではなく、以下の機能にあると指摘しています:

- Icebergなどのデータセットの読み取り
- クラウドストレージへのデータ出力
- PostgreSQLとDuckDBの機能を組み合わせた新しいデータ処理方法の実現[1]

この検証は、新しいツールやテクノロジーの宣伝文句を実環境でテストすることの重要性を示しています[1]。

Sources
[1] duckdb-inside-postgres <https://dataengineeringcentral.substack.com/p/duckdb-inside-postgres>
[2] DuckDB inside Postgres!!?? <https://dataengineeringcentral.substack.com/p/duckdb-inside-postgres>
