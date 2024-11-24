# Building SQL-based Observability With ClickHouse and Grafana

ref: <https://cmtops.dev/posts/building-observability-with-clickhouse/>

この記事は、あるエンジニアがClickHouseとGrafanaを使用して構築した可観測性(Observability)システムについての経験を共有したものです。

## プロジェクトの背景

当初、Elastic Stack(EFK)を使用してNGINXのログ収集を行っていましたが、以下の問題点がありました[1]:

- 14-15日分のログデータに200GBもの容量を消費
- メトリクスの計算が遅い
- データ操作の柔軟性に欠ける
- JSON APIとPainless言語の使いづらさ

## 採用した技術スタック

**最終的な構成:**

- データウェアハウス: ClickHouse
- 可視化: Grafana
- ログコレクター: Fluent BitとVector

**選定の理由:**

- ClickHouseは高性能なデータ処理能力を持ち、SQLライクな強力なクエリ言語を提供[1]
- レプリケーションとHA(High Availability)をサポート
- Grafanaとの統合が優れており、柔軟な可視化が可能[1]

## システムの特徴

**ログ収集の仕組み:**

- Fluent BitとVectorを組み合わせてログを収集・パース
- Vectorは強力なデータ操作言語(VRL)を持ち、安全なパース処理が可能[1]

**可視化の機能:**

- Grafanaのクエリビルダーまたは直接SQLを記述可能
- 時系列データの可視化に優れている
- カスタマイズ可能なダッシュボード[1]

## 課題と制限事項

**主な課題:**

- TTLの設定が特定のバージョンで動作しない問題があった
- アップデートによってクエリが動作しなくなることがあった
- 大量のデータを扱う際のクエリパフォーマンスの最適化が必要[1]

## 今後の改善計画

以下の機能追加を予定しています[1]:

- メッセージキューの導入
- HAまたはレプリケーションのサポート
- 認証ログなど他のインフラコンポーネントのログ取り込み
- 重要イベントのアラート機能
- パフォーマンス最適化

Sources
[1]  <https://cmtops.dev/posts/building-observability-with-clickhouse/>
[2] CMTOPS.DEV <https://cmtops.dev/posts/building-observability-with-clickhouse/>
[3] I spent 3 hours learning the overview of ClickHouse | by Vu Trinh <https://blog.det.life/i-spent-3-hours-learning-the-overview-of-clickhouse-15377361d646?gi=428b6c4185de>
[4] Grafana Enterprise | Observability stack overview <https://grafana.com/products/enterprise/>
[5] Using Grafana | ClickHouse Docs <https://clickhouse.com/docs/en/observability/grafana>
[6] ClickHouse vs Elasticsearch, Which One is Right for You - RisingWave <https://risingwave.com/blog/clickhouse-vs-elasticsearch/>
[7] Maximize the Potential: A Deep Dive into Grafana Pros and Cons <https://edgedelta.com/company/blog/grafana-pros-and-cons>
[8] ClickHouse: Pros and Cons of This Powerful Database System <https://www.devbyte.space/what-is-clickhouse-what-are-its-pros-and-cons/>
