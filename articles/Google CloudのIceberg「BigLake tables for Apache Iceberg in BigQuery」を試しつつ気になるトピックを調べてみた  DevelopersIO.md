---
title: "Google CloudのIceberg「BigLake tables for Apache Iceberg in BigQuery」を試しつつ気になるトピックを調べてみた | DevelopersIO"
source: "https://dev.classmethod.jp/articles/google-cloud-iceberg-biglake-tables-for-apache-iceberg-in-bigquery/"
author:
  - "[[渡部晃季]]"
published: 2025-06-25
created: 2025-12-11
description: "BigLake tables for Apache Iceberg in BigQueryを試しつつ、メタデータリフレッシュ・制限事項・タイムトラベルについて調査しました。また最後にBigQuery標準テーブルとIceberg(BigLake tables for Apache Iceberg in BigQuery)の相違点について整理しました。"
tags:
  - "Google Cloud"
  - "BigQuery"
  - "Apache Iceberg"
  - "BigLake"
  - "データレイクハウス"
---

## 概要

Google CloudでApache Icebergを扱う選択肢の一つ「BigLake tables for Apache Iceberg in BigQuery」について、実際に作成・操作しながら、メタデータリフレッシュ、制限事項、タイムトラベルの挙動を検証した記事。

---

## 本ブログの結論

| トピック | 結果 |
|---------|------|
| メタデータリフレッシュの必要性 | **必要**。GCS上のmetadataフォルダは自動更新されないため、`EXPORT TABLE METADATA`の実行が必要 |
| 公式ドキュメントの制限事項 | **正確**。`ALTER TABLE RENAME TO`は使用不可能を確認 |
| タイムトラベル | BigQuery標準機能の`FOR SYSTEM_TIME AS OF`で実現可能 |

---

## Google CloudのIceberg対応（2種類）

### 1. BigLake tables for Apache Iceberg in BigQuery

- BigQueryからGCSに作成するIcebergテーブル
- **マネージド機能**:
  - 小さいファイル問題の解決
  - 自動クラスタリング
  - 不要ファイルのガベージコレクション
  - メタデータファイルの最適化
- AWSでいう「S3 Tables」に相当

### 2. Apache Iceberg read-only external tables

- Sparkなどで作成したIcebergテーブルをBigQueryから外部テーブルとして読み込む
- カスタム性あり、マネージド最適化機能なし
- AWSでいう「汎用S3バケットに置いたIcebergテーブル」に相当

---

## BigLake tables for Apache Iceberg in BigQueryの作成手順

### 1. GCSバケットの作成

```bash
export PROJECT_ID="<プロジェクトID>"
export BUCKET_NAME="watanabe-koki-iceberg-bucket-01"
export LOCATION="us-central1"

gcloud storage buckets create gs://${BUCKET_NAME} --project=${PROJECT_ID} --location=${LOCATION} \
  --uniform-bucket-level-access \
  --public-access-prevention
```

### 2. クラウドリソース接続の作成

```bash
export REGION="us-central1"
export CONNECTION_ID="iceberg-gcs-connection"

bq mk --connection --location=${REGION} --project_id=${PROJECT_ID} \
    --connection_type=CLOUD_RESOURCE ${CONNECTION_ID}
```

### 3. サービスアカウントへの権限付与

```bash
export SERVICE_ACCOUNT_ID=$(bq show --connection --format=json ${PROJECT_ID}.${REGION}.${CONNECTION_ID} | jq -r '.cloudResource.serviceAccountId')

gcloud storage buckets add-iam-policy-binding gs://${BUCKET_NAME} \
  --member="serviceAccount:${SERVICE_ACCOUNT_ID}" \
  --role="roles/storage.objectAdmin"
```

### 4. Icebergテーブルの作成

```sql
CREATE TABLE `<プロジェクトID>.cm_watanabe_dataset.sample_iceberg_table` (
  id INT64,
  name STRING,
  email STRING,
  created_at TIMESTAMP,
  age INT64,
  is_active BOOL
)
CLUSTER BY id
WITH CONNECTION `<プロジェクトID>.us-central1.iceberg-gcs-connection`
OPTIONS (
  file_format = 'PARQUET',
  table_format = 'ICEBERG',
  storage_uri = 'gs://watanabe-koki-iceberg-bucket-01/iceberg-tables/sample_table/'
);
```

---

## 検証結果詳細

### メタデータリフレッシュについて

**問題点**: データを`INSERT`/`DELETE`してもGCSの`metadata`フォルダは自動更新されない

**解決策**: `EXPORT TABLE METADATA`の実行が必要

```sql
EXPORT TABLE METADATA FROM `<プロジェクトID>.cm_watanabe_dataset.sample_iceberg_table`;
```

**重要なポイント**:

- BigQueryを経由したアクセスであれば、いつでもメタデータが更新された状態でアクセス可能
- GCSのIcebergテーブルに直接読み込みしたい場合は、ETLの前後処理や定期的なリフレッシュが必要
- 自動更新を有効にするには `bigquery-tables-for-apache-iceberg-help@google.com` への問い合わせが必要（更新操作ごとにコスト発生）

### 制限事項の確認

`ALTER TABLE RENAME TO`は**使用不可能**:

```sql
ALTER TABLE `<プロジェクトID>.cm_watanabe_dataset.sample_iceberg_table`
RENAME TO sample_iceberg_table2;
-- エラーになる
```

公式ドキュメントの制限事項は正確に整備されている。

### タイムトラベル

BigQuery標準機能の`FOR SYSTEM_TIME AS OF`で履歴データにアクセス可能:

```sql
SELECT *
FROM `<プロジェクトID>.cm_watanabe_dataset.sample_iceberg_table`
  FOR SYSTEM_TIME AS OF TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 2 HOUR);
```

※スナップショットのバージョン指定クエリは不可

---

## BigQuery標準テーブル vs Iceberg（BigLake tables）比較

| 観点 | BigQuery標準テーブル | BigLake tables for Apache Iceberg |
|------|---------------------|-----------------------------------|
| **データ形式** | 内部的に隠蔽されたデータ | ストレージ上にファイルとして出力 |
| **データアクセス** | BigQuery経由のみ | 複数エンジンから直接アクセス可能（ただしBQ経由の書き込み以外は非推奨） |
| **コスト構造** | BigQueryのコスト体系 | 各エンジンのコスト体系 |
| **機能** | 全BigQuery機能を使用可能 | [制限事項](https://cloud.google.com/bigquery/docs/iceberg-tables#limitations)あり |

---

## 結論・所感

- Google CloudでIcebergを検討する場合、メンテナンス対応が盛り込まれている**BigLake tables for Apache Iceberg in BigQueryが第一選択肢**
- BigQueryの機能がリッチなため、Google Cloudでデータ管理する際にIcebergを選択するメリットは薄い可能性
- 自分たちの目的に応じてデータ保存形式を検討することが重要

---

## 参考資料

- [Enhancing BigLake for Iceberg Lakehouses | Google Cloud Blog](https://cloud.google.com/blog/products/data-analytics/enhancing-biglake-for-iceberg-lakehouses?hl=en)
- [BigQueryでApache Icebergを扱う | DevelopersIO](https://dev.classmethod.jp/articles/apache-iceberg-bigquery-cm_google_cloud_adcal_2024/)
- [BigLake tables for Apache Iceberg | Google Cloud 公式ドキュメント](https://cloud.google.com/bigquery/docs/iceberg-tables)
