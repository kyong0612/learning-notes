# DuckDB + Delta Lake

ref: <https://dataengineeringcentral.substack.com/p/duckdb-delta-lake>

## 主な実験内容と結果

**ローカル環境での検証**

- 1000万行のデータを使用してDuckDBとDelta Lakeの性能を検証[1]
- DuckDBは集計クエリの実行に約0.46秒を要し、非常に高速な処理を実現[1]
- 比較対象のDaftは約1.15秒かかり、DuckDBは約3倍高速だった[1]

**AWS S3環境での検証**

- 同じデータセットをS3上で処理した場合の性能を検証
- DuckDBは約7.07秒を要し、ローカル環境と比べて大幅に遅くなった[1]
- DaftはS3環境で約3.71秒と、DuckDBの2倍以上の速さを示した[1]

## 技術的な特徴

**実装の制限**

- 現時点でDuckDBはDelta Lakeに対して読み取り専用のサポートのみ提供[1]
- Delta Lake形式での書き込みには別のツール(Daft等)が必要[1]

**セットアップ方法**

- Docker環境を使用して簡単に構築可能
- DuckDBでDelta Lakeを使用するには以下の手順が必要:

```sql
INSTALL delta;
LOAD delta;
```

## 考察

この実験結果から、DuckDBは以下の特徴を持つことが判明しました:

- ローカル環境では非常に高速な処理が可能[1]
- クラウド環境(S3)では性能が大幅に低下する[1]
- ツールの選択は使用環境に応じて慎重に検討する必要がある[1]

Sources
[1] duckdb-delta-lake <https://dataengineeringcentral.substack.com/p/duckdb-delta-lake>
[2] DuckDB + Delta Lake. <https://dataengineeringcentral.substack.com/p/duckdb-delta-lake>

# Delta Lakeとは

Delta Lakeは、データレイクの信頼性と性能を最適化するために設計されたオープンソースのストレージフレームワークです。

## 基本的な特徴

**アーキテクチャ**

- Parquetファイル形式でデータを保存[1]
- JSONファイル形式のトランザクションログ（Delta Log）でメタデータを管理[2]
- クラウドオブジェクトストレージ上で動作[3]

**主要機能**

- ACIDトランザクションのサポート
- スケーラブルなメタデータ処理
- バッチ処理とストリーミング処理の統合
- タイムトラベル（過去のバージョンへのアクセス）

## 解決する課題

**データレイクの従来の問題点**

- データの信頼性と一貫性の欠如[5]
- メタデータ管理の不足によるデータスワンプ化[6]
- 部分的なトランザクション完了によるデータ破損[6]
- 小さいファイルの大量生成によるパフォーマンス低下[6]

**提供するソリューション**

- トランザクションログによるデータの整合性保証[5]
- 楽観的並行制御による複数クライアントからの同時書き込み対応[5]
- 自動的なファイル最適化とコンパクション処理[5]
- スキーマ検証による品質管理[1]

## 利点

**データ管理の向上**

- データの信頼性と品質の保証[6]
- パフォーマンスの最適化[6]
- スケーラブルなデータ処理[3]
- バッチ処理とストリーミング処理の統合による柔軟な運用[5]

Sources
[1] Delta Lake とは - Azure Databricks - Microsoft Learn <https://learn.microsoft.com/ja-jp/azure/databricks/delta/>
[2] Databricks-03. Deltaテーブルを操作してDelta Lakeを理解する <https://techblog.ap-com.co.jp/entry/2023/03/20/165936>
[3] Delta Lake とは？ ｜ピュア・ストレージ - Pure Storage <https://www.purestorage.com/jp/knowledge/what-is-delta-lake.html>
[4] データレイクとは？メリットや課題、DWH との違い - Databricks <https://www.databricks.com/jp/discover/data-lakes>
[5] データエンジニアが知っておくべきDelta Lakeのしくみ｜ruzgar - note <https://note.com/ruzgar08/n/n6f23f3d70034>
[6] Delta Lake とは何か - connecting the dots <https://ktksq.hatenablog.com/entry/deltalake>
