---
title: "BigQuery の概要"
source: "https://docs.cloud.google.com/bigquery/docs/introduction?hl=ja"
author: "Google Cloud"
published:
created: 2026-02-28
description: "BigQueryのアーキテクチャ、ストレージ、分析機能、管理機能、Gemini統合、各ロール向けリソースを網羅した公式概要ドキュメント"
tags:
  - "clippings"
  - "BigQuery"
  - "Google Cloud"
  - "データウェアハウス"
  - "サーバーレス"
  - "データ分析"
---

## BigQuery とは

BigQuery は、**フルマネージドの AI 対応データプラットフォーム**。ML、検索、地理空間分析、BI などの組み込み機能を備え、SQL や Python を使用してインフラ管理なしにデータの管理・分析が可能。

### 主な特徴

- **構造化・非構造化データの統一的な扱い**: Apache Iceberg、Delta、Hudi などのオープンテーブル形式をサポート
- **高速クエリ**: テラバイト規模は数秒、ペタバイト規模は数分で処理
- **ストリーミング対応**: 継続的なデータ取り込みと分析をサポート
- **ガバナンス機能**: セマンティック検索、データリネージ、アクセス制御を内蔵（Dataplex Universal Catalog による実現）

---

## アーキテクチャ: ストレージとコンピューティングの分離

BigQuery のアーキテクチャは **2 層構造**で、Google のペタビット規模のネットワークで接続されている。

| レイヤ | 役割 |
|---|---|
| **ストレージレイヤ** | データの取り込み、保存、最適化 |
| **コンピューティングレイヤ** | 分析機能の提供 |

### 分離のメリット

- **リソース競合の排除**: 従来のDBでは読み書きと分析がリソースを共有し競合が発生するが、BigQuery では各レイヤが独立してリソースを動的に割り当て可能
- **独立した改善**: ダウンタイムなしにストレージとコンピューティングを個別に更新・デプロイ
- **フルマネージド**: リソースのプロビジョニングや手動スケーリングが不要。価値提供に集中できる

---

## BigQuery ストレージ

- **カラム型ストレージ形式**: 分析クエリに最適化
- **ACID トランザクション**: データベーストランザクションセマンティクスを完全サポート
- **高可用性**: 複数のロケーションに自動複製

### データ読み込み方法

| 方法 | 対応形式・詳細 |
|---|---|
| **バッチ読み込み** | Avro, Parquet, ORC, CSV, JSON, Datastore, Firestore（ローカルファイルまたは Cloud Storage から） |
| **ストリーミング** | Storage Write API を使用 |

---

## BigQuery による分析

### 対応する分析タイプ

- ビジネスインテリジェンス
- アドホック分析
- 地理空間分析
- 機械学習（記述的・処方的分析）

### 外部データへのアクセス

- **連携クエリ・外部テーブル**: Cloud Storage、Bigtable、Spanner、Google ドライブ（スプレッドシート含む）のデータに対してクエリ実行可能

### 主要な分析機能

| 機能 | 説明 |
|---|---|
| **BigQuery Studio** | Python ノートブック、バージョン管理、データ分析・ML ワークフロー |
| **BigQuery ML** | ML と予測分析 |
| **BI ツール連携** | BI Engine、Looker Studio、Looker、Google スプレッドシート、Tableau、Power BI |
| **ビュー** | 分析結果の共有 |
| **SQL 準拠** | ANSI SQL:2011 準拠。結合、ネスト、分析/集計関数、マルチステートメントクエリ、地理空間分析をサポート |

---

## BigQuery の管理

### セキュリティとガバナンス

- **IAM** による一元的なアクセス制御（Google Cloud 共通のアクセスモデル）
- **多層防御**: 境界セキュリティからきめ細かなアプローチまで対応
- データセット、テーブル、列、行、ビュー単位でのデータ保護

### コスト管理

- **Reservations**: オンデマンド料金と容量ベース料金を切り替え可能
- **ジョブ管理**: データの読み込み、エクスポート、クエリ、コピーなどのアクションを管理

### モニタリング

- ログとリソースのモニタリング
- INFORMATION_SCHEMA によるメタデータ確認（データセット、ジョブ、アクセス制御、Reservations、テーブル）
- テーブルスナップショットによるバックアップ

---

## Gemini in BigQuery

Gemini for Google Cloud の一部として、**AI 搭載アシスタント機能**を提供。

### SQL コードアシスト

- SQL クエリの説明
- SQL クエリの自動補完（プレビュー）
- コメントから SQL への変換（プレビュー）
- Gemini Cloud Assist による SQL 生成（プレビュー）
- SQL 生成ツール

### Python コードアシスト

- BigQuery DataFrames Python コードの生成（プレビュー）
- Python コードの自動補完
- Gemini Cloud Assist による Python コード生成（プレビュー）
- コード生成ツールによる Python コード生成

---

## ロール別ガイダンス

### データアナリスト

- **地理空間分析**: GIS で地理空間データを分析・可視化
- **クエリパフォーマンス最適化**:
  - BI Engine（高速インメモリ分析）
  - マテリアライズドビュー（キャッシュされたビューによるクエリ最適化）
  - パーティション分割テーブル（時間/整数範囲でプルーニング）

### データ管理者

- ログ・リソースのモニタリング
- ジョブ管理
- INFORMATION_SCHEMA の表示
- テーブルスナップショットによるバックアップ
- データセキュリティとガバナンス
- Reservations による費用管理

### データサイエンティスト（BigQuery ML）

- **時系列予測**: Arima+ モデル
- **クラスタリング**: K 平均法
- **分類**: 2 項/多項ロジスティック回帰
- **予測**: 線形回帰

### データデベロッパー

- Storage Write API、Data Transfer Service によるデータ読み込み
- 各種形式でのバッチ読み込み
- C#, Go, Java, Node.js, Python, Ruby のクライアントライブラリ
- ODBC / JDBC 統合

---

## インターフェースと開発ツール

| ツール | 説明 |
|---|---|
| **Google Cloud コンソール** | Web UI |
| **bq コマンドラインツール** | CLI インターフェース |
| **クライアントライブラリ** | Python, Java, JavaScript, Go 等 |
| **REST / RPC API** | データの変換・管理 |
| **ODBC / JDBC ドライバ** | サードパーティツールとの接続 |
| **DML / DDL / UDF** | データの管理・変換 |

---

## 料金と利用開始

### 無料で始める方法

- **BigQuery 無料枠**: 無料でデータの読み込みとクエリを開始
- **BigQuery サンドボックス**: リスクフリーかつ無料で利用可能
- **一般公開データセット**: 大規模な実データでパフォーマンスを体験

### 料金体系

- 分析とストレージの料金
- BigQuery ML、BI Engine、Data Transfer Service の個別料金あり

---

## 参考リソース

- [Google BigQuery: Definitive Guide](https://www.google.com/books/edition/Google_BigQuery_The_Definitive_Guide/-Jq4DwAAQBAJ?hl=ja)（Valliappa Lakshmanan、Jordan Tigani 著）
- [BigQuery サポート](https://docs.cloud.google.com/bigquery/docs/getting-support?hl=ja)
- [Stack Overflow コミュニティ](https://stackoverflow.com/questions/tagged/google-bigquery)
- [リリースノート](https://docs.cloud.google.com/bigquery/docs/release-notes?hl=ja)
