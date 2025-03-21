# DuckDB Is Not a Data Warehouse

ref: <https://materializedview.io/p/duckdb-is-not-a-data-warehouse>

- **ソーシャルメディアの移行**: 著者はTwitterからBlueskyに移行し、このプラットフォームに満足を表し、フォロワーにも参加を呼びかけている。
- **「Materialized View」ニュースレターの1周年**: 「Materialized View」ニュースレターは1周年を迎え、50記事以上を投稿し、4,000人を超えるサブスクライバーを獲得し、読者から好評を得ている。
- **P99 CONF での発表**: 著者とRohan Desaiがp99 CONFで発表を行い、その講演がオンラインで公開されており、SlateDBの内部について学ぶための資料となっている。
- **DuckDBの概要**: DuckDBはSQLiteと比較されるが、列指向のデータ向けに設計されており、ポータビリティと速度、リモートストレージへの接続による分析が可能である。
- **企業による採用**: OktaやMotherDuckなどの企業がデータ変換やETLプロセスにDuckDBを活用しており、データエンジニア間での人気が高まっている。
- **データウェアハウスとしての限界**: 著者はDuckDBがSnowflakeやBigQueryなどの従来のデータウェアハウスの代替にはならないと主張している。主な理由は、デプロイモデルと拡張性の問題である。
- **企業向けの使いやすさの懸念**: DuckDBは個別のインストールが必要で、大規模なクエリの処理に限界があるため、企業全体での展開は現実的ではない。
- **MotherDuckの役割**: MotherDuckはクラウドデータウェアハウジングにおけるDuckDBの機能向上を目指しているが、既存のデータウェアハウスやPostgreSQLの拡張機能との競争に直面している。
- **コスト面での考慮**: MotherDuckへの移行の主な理由はコスト削減であるが、データウェアハウスの変更は複雑で高コストな作業となる。
- **DuckDBに関する結論**: 著者はDuckDBを完全なデータウェアハウスではなく、中間層としての有効性を強調し、小規模アプリケーションでの活用が適切であると述べている。

```
根拠は以下の通りです:1

DuckDB は SQLite のようなポータブルな列指向データベースで、ローカルのラップトップや、アプリケーション内、ブラウザ上で動作できる。

DuckDB は Apache Parquet ファイルや Apache Iceberg テーブルなどのリモートストレージにアクセスできる。

これらの特性から、DuckDB は分析やデータエンジニアリングの分野で人気を集めている。

しかし、DuckDB は企業のデータウェアハウスとして使うには適していない。理由は以下の通り:

DuckDB は中央集権的な展開モデルがなく、ユーザー全員にインストールするのは現実的ではない。

DuckDB には大規模なクエリを処理する能力がない。企業にとって重要な財務の照合やレコメンデーションシステムなどの大規模なクエリを実行できない。

DuckDB 自体は優れたミドルウェアだが、データウェアハウスとしての機能は不足している。MotherDuck がこれらの機能を追加しているが、結局のところ Snowflake や BigQuery のようなクラウドデータウェアハウスになっている。

したがって、著者は DuckDB を企業のデータウェアハウスとして使うのは適切ではないと主張しています。1
```
