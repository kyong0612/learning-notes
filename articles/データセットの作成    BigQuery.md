---
title: "データセットの作成  |  BigQuery"
source: "https://docs.cloud.google.com/bigquery/docs/datasets?hl=ja"
author:
  - "[[Google Cloud]]"
published:
created: 2026-03-07
description: "BigQueryでデータセットを作成する方法を包括的に解説するGoogle Cloud公式ドキュメント。Google Cloudコンソール、SQL、bq CLI、Terraform、REST API、各種クライアントライブラリ（C#, Go, Java, Node.js, PHP, Python, Ruby）を使った作成手順、必要な権限、命名規則、制限事項、セキュリティについてカバーしている。"
tags:
  - "clippings"
  - "BigQuery"
  - "GCP"
  - "データセット"
  - "Google Cloud"
  - "Terraform"
  - "SQL"
---

## 概要

このドキュメントは、BigQueryでデータセットを作成するための複数の方法を網羅的に解説している。データセットはBigQueryにおけるテーブルやビューを格納する最上位のコンテナであり、プロジェクト内で一意の名前を持つ必要がある。作成方法として、Google Cloudコンソール、SQL（`CREATE SCHEMA`）、bq CLIコマンド、Terraform、REST API、および各種プログラミング言語のクライアントライブラリが提供されている。

## 主要なトピック

### データセットの制限事項

- データセット名は**プロジェクトごとに一意**である必要がある
- **ロケーションは作成時にのみ設定可能**（作成後の変更不可）
- 1つのクエリで参照するすべてのテーブルは**同じロケーション**に存在する必要がある
- テーブルのコピー時も、コピー元とコピー先は同じロケーションが必要
- ストレージ課金モデルの変更後、再変更には**14日間**の待機が必要
- 外部データセットでは一部オプション（大文字小文字区別、テーブル有効期限、レプリカ、タイムトラベル等）が非サポート

### 必要な権限

データセット作成には `bigquery.datasets.create` IAM権限が必要。以下の事前定義ロールに含まれる：

| ロール | 説明 |
|--------|------|
| `roles/bigquery.admin` | BigQuery管理者 |
| `roles/bigquery.user` | BigQueryユーザー |
| `roles/bigquery.dataOwner` | データオーナー |
| `roles/bigquery.dataEditor` | データエディタ |

### データセットの作成方法

#### 1. Google Cloudコンソール

GUIベースで作成。データセットID、ロケーション、詳細オプション（テーブル有効期限、タイムトラベル期間、ストレージ課金モデル、暗号化キー、照合順序、大文字小文字区別の有無、タグなど）を設定可能。

#### 2. SQL（CREATE SCHEMA）

```sql
CREATE SCHEMA PROJECT_ID.DATASET_ID
  OPTIONS (
    default_kms_key_name = 'KMS_KEY_NAME',
    default_partition_expiration_days = PARTITION_EXPIRATION,
    default_table_expiration_days = TABLE_EXPIRATION,
    description = 'DESCRIPTION',
    labels = [('KEY_1','VALUE_1'),('KEY_2','VALUE_2')],
    location = 'LOCATION',
    max_time_travel_hours = HOURS,
    storage_billing_model = BILLING_MODEL);
```

主要パラメータ：
- **`location`**: データセットのリージョン（作成後変更不可）
- **`storage_billing_model`**: `PHYSICAL`（物理バイト）または `LOGICAL`（論理バイト、デフォルト）
- **`max_time_travel_hours`**: 48〜168時間（24の倍数、デフォルト168時間＝7日間）
- **`default_table_expiration_days`**: テーブルのデフォルト存続期間（最小0.042日＝1時間）
- **`default_partition_expiration_days`**: パーティションのデフォルト存続期間

#### 3. bq CLIコマンド

```bash
bq --location=LOCATION mk \
    --dataset \
    --default_table_expiration=TABLE_EXPIRATION \
    --description="DESCRIPTION" \
    PROJECT_ID:DATASET_ID
```

- デフォルトプロジェクト以外は `PROJECT_ID:DATASET_ID` 形式で指定
- `-d` は `--dataset` のショートカット
- 作成確認は `bq ls` コマンドで実施

使用例：
```bash
bq --location=US mk -d \
    --default_table_expiration 3600 \
    --description "This is my dataset." \
    mydataset
```

#### 4. Terraform

`google_bigquery_dataset` リソースを使用。

```hcl
resource "google_bigquery_dataset" "default" {
  dataset_id                      = "mydataset"
  default_partition_expiration_ms = 2592000000  # 30 days
  default_table_expiration_ms     = 31536000000 # 365 days
  description                     = "dataset description"
  location                        = "US"
  max_time_travel_hours           = 96 # 4 days

  labels = {
    billing_group = "accounting",
    pii           = "sensitive"
  }
}
```

Terraformでは以下のパターンも対応：
- **アクセス権の付与**: `google_bigquery_dataset_iam_policy` リソースで IAM ポリシーを設定
- **CMEK（顧客管理暗号鍵）**: `google_kms_crypto_key` と `google_kms_key_ring` を組み合わせて暗号化設定
- **承認済みオブジェクト**: `google_bigquery_dataset_access` リソースを使用

#### 5. REST API

`datasets.insert` メソッドにデータセットリソースを渡して呼び出す。

#### 6. クライアントライブラリ

C#, Go, Java, Node.js, PHP, Python, Ruby の各言語でサンプルコードが提供されている。いずれもアプリケーションのデフォルト認証情報（ADC）を使用して認証を行う。

**Python の例：**
```python
from google.cloud import bigquery

client = bigquery.Client()
dataset = bigquery.Dataset("project_id.dataset_id")
dataset.location = "US"
dataset = client.create_dataset(dataset, timeout=30)
```

### データセットの命名規則

- **使用可能文字**: 英字（大文字・小文字）、数字、アンダースコア
- **最大長**: 1,024文字
- **大文字小文字**: デフォルトで区別される（`mydataset` と `MyDataset` は共存可能）
- **使用不可文字**: スペース、特殊文字（`-`, `&`, `@`, `%` など）

#### 非表示のデータセット

- 名前がアンダースコア（`_`）で始まるデータセット
- テーブルやビューのクエリは通常通り可能
- 承認済みビュー・承認済みルーティン・承認済みデータセットのソースとして使用不可
- Data Catalog / Dataplex Universal Catalog に表示されない

### データセットのセキュリティ

- アクセス制御は IAM を使用してデータセットレベルで管理
- データ暗号化は「保存データの暗号化」として提供（デフォルトのGoogle管理鍵またはCMEK）

## 重要な事実・データ

- **タイムトラベル期間**: 48〜168時間（2〜7日間）、デフォルト168時間、24時間の倍数で設定
- **課金モデル変更**: 反映まで24時間、再変更は14日間待機必要
- **テーブル有効期限の最小値**: SQL版は0.042日（1時間）、bq CLI版は3,600秒（1時間）
- **データセット名の最大長**: 1,024文字
- **対応クライアントライブラリ**: C#, Go, Java, Node.js, PHP, Python, Ruby の7言語

## 結論・示唆

### 実践的な示唆

- データセット作成前に**ロケーションを慎重に選択**すること（後から変更不可）
- IaCを活用する場合は**Terraform**での管理が推奨される（アクセス権設定もコード化可能）
- 自動化やCI/CDパイプラインでは **bq CLI** や **クライアントライブラリ** が適している
- セキュリティ要件がある場合は **CMEK（Cloud KMS）** による暗号化を検討
- パーティション分割テーブルでは、テーブルレベルの有効期限がデータセットレベルの設定より優先される

## 制限事項・注意点

- ロケーションは作成後に変更できないため、マルチリージョン戦略を事前に検討する必要がある
- 外部データセット（Spanner、AWS Glue連携）は通常のデータセットとオプションが異なる
- Terraformで作成した場合、プロジェクトレベルの基本ロールのメンバーに自動的にアクセス権が付与される
- ストレージ課金モデルの変更には24時間かかり、14日間のクールダウン期間がある
- 定額制スロットコミットメントがある場合、物理ストレージ課金への登録不可

---

*Source: [データセットの作成 | BigQuery](https://docs.cloud.google.com/bigquery/docs/datasets?hl=ja)*
