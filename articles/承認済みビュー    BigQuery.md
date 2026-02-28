---
title: "承認済みビュー  |  BigQuery"
source: "https://docs.cloud.google.com/bigquery/docs/authorized-views?hl=ja"
author:
  - "Google Cloud"
published:
created: 2026-02-28
description: "BigQuery の承認済みビュー（論理ビュー・マテリアライズドビュー）を使い、データセット内のデータのサブセットを特定ユーザーやグループに安全に共有する方法を解説する Google Cloud 公式ドキュメント。作成・承認・解除の手順を Console / Terraform / bq CLI / API の各方法で説明し、行・列レベルセキュリティとの併用や BigQuery Sharing との連携など高度なトピックもカバーする。"
tags:
  - "clippings"
  - "BigQuery"
  - "承認済みビュー"
  - "アクセス制御"
  - "Google Cloud"
  - "データセキュリティ"
---

## 概要

データ管理者は **承認済みビュー** を作成することで、データセット内のデータのサブセットを特定のユーザーやグループ（プリンシパル）に共有できる。プリンシパルは共有データの表示とクエリが可能だが、**ソースデータセットへの直接アクセスはできない**。

## ビュータイプ

| タイプ | 説明 |
|--------|------|
| **論理ビュー（承認済みビュー）** | BigQuery のデフォルトのビュータイプ |
| **マテリアライズドビュー（承認済みマテリアライズドビュー）** | クエリ結果を定期的にキャッシュに保存し、パフォーマンスと効率を向上させる事前計算ビュー |

大規模・高負荷なクエリに依存する場合はマテリアライズドビューを検討できるが、データのサブセットのみをクエリする場合や他の手法で十分な場合はマテリアライズドビュー不要。

## 承認済みビュー作成手順の概要

以下の手順は論理ビュー・マテリアライズドビュー共通：

1. ソースデータを格納するデータセットを作成する
2. クエリを実行してソースデータセットのテーブルにデータを読み込む
3. 承認済みビューを含むデータセットを作成する
4. SQL クエリから承認済みビューを作成し、アナリストが表示できる列を制限する
5. 承認済みビューにソースデータセットへのアクセス権を付与する
6. 承認済みビューを含むデータセットへのアクセス権をデータアナリストに付与する
7. データアナリストにクエリジョブを実行する権限を付与する

## 代替手段の比較

承認済みビュー以外の方法：

| 方法 | 特徴 |
|------|------|
| **承認済みデータセット** | データセット内のすべてのビューをまとめて共有 |
| **別テーブルへのデータ保存** | 最も安全だが柔軟性は最も低い |
| **列レベルのポリシー（ポリシータグ）** | テーブル内の特定列のアクセス制限 |
| **行レベルのアクセスポリシー** | 柔軟かつ安全 |

> **比較まとめ**: 別テーブル＝最高セキュリティ・最低柔軟性、行レベルポリシー＝柔軟＋安全、承認済みビュー＝柔軟＋最高パフォーマンス

### 承認済みデータセット

個々のビューを承認する代わりに、ビューのコレクションをデータセットにグループ化し、そのデータセットにアクセス権を付与する方法。

- **承認済みデータセット**: 別のデータセットにアクセスできるデータセット
- **共有データセット**: 別のデータセットにアクセスを承認するデータセット
- データセットの ACL には **最大 2,500 個** の承認済みリソース（承認済みビュー・データセット・関数含む）を含められる
- 上限超過の可能性がある場合は、承認済みデータセットへのグループ化を推奨

## 制限事項

- 承認済みビューを削除後、ビューリストから完全に削除されるまで **最大 24 時間** かかる。その間はアクセス不可だが上限カウントの対象
- ソースデータセットと承認済みビューのデータセットは **同じリージョン** に存在する必要がある

## 必要な IAM ロールと権限

### ビューを含むデータセットに対する管理者権限

| 権限 / ロール | 用途 |
|---------------|------|
| `bigquery.tables.create` | ビューの作成 |
| `roles/bigquery.dataEditor` | ビュー作成に必要な権限を含む事前定義ロール |
| `bigquery.datasets.create` | 自身が作成したデータセットにビュー作成が可能 |
| `bigquery.tables.getData` | 所有していないデータのビュー作成時に必要 |

### ビューへのアクセス権を提供するデータセットに対する管理者権限

| 権限 / ロール | 用途 |
|---------------|------|
| `bigquery.datasets.setIamPolicy` | Console でアクセス制御を更新する場合 |
| `bigquery.datasets.update` | データセットプロパティの更新 |
| `roles/bigquery.dataOwner` | 上記権限を含む事前定義ロール |

### ユーザーに付与する権限

| ロール | 対象 |
|--------|------|
| `roles/bigquery.dataViewer` | 承認済みビューを含むデータセット |
| `roles/bigquery.user` | 承認済みビューを含むプロジェクト |

## 承認済みビューの作成方法

### Google Cloud Console

1. BigQuery ページでクエリエディタに承認済みビューのベースとなるクエリを入力
2. **[保存] → [ビューを保存]** でプロジェクト・データセット（ソースとは別）・テーブル名を指定して保存
3. 必要な権限をユーザーに付与
4. エクスプローラでソースデータセットを選択 → **[共有] → [ビューを承認]**
5. `PROJECT_ID.DATASET_ID.VIEW_NAME` 形式で完全修飾名を入力 → **[承認を追加]**

### Terraform

```hcl
# ビューを格納するデータセットの作成
resource "google_bigquery_dataset" "view_dataset" {
  dataset_id  = "view_dataset"
  description = "Dataset that contains the view"
  location    = "us-west1"
}

# 承認するビューの作成
resource "google_bigquery_table" "movie_view" {
  project     = google_bigquery_dataset.view_dataset.project
  dataset_id  = google_bigquery_dataset.view_dataset.dataset_id
  table_id    = "movie_view"
  description = "View to authorize"
  view {
    query          = "SELECT item_id, avg(rating) FROM `movie_project.movie_dataset.movie_ratings` GROUP BY item_id ORDER BY item_id;"
    use_legacy_sql = false
  }
}

# ビューにソースデータセットへのアクセスを承認
resource "google_bigquery_dataset_access" "view_authorization" {
  project    = "movie_project"
  dataset_id = "movie_dataset"
  view {
    project_id = google_bigquery_table.movie_view.project
    dataset_id = google_bigquery_table.movie_view.dataset_id
    table_id   = google_bigquery_table.movie_view.table_id
  }
}

# 承認済みビューにアクセスできるプリンシパルの IAM ポリシー
data "google_iam_policy" "principals_policy" {
  binding {
    role    = "roles/bigquery.dataViewer"
    members = ["group:example-group@example.com"]
  }
}

resource "google_bigquery_table_iam_policy" "authorized_view_policy" {
  project     = google_bigquery_table.movie_view.project
  dataset_id  = google_bigquery_table.movie_view.dataset_id
  table_id    = google_bigquery_table.movie_view.table_id
  policy_data = data.google_iam_policy.principals_policy.policy_data
}
```

Terraform 適用手順: `terraform init` → `terraform plan` → `terraform apply`

## 承認済みビューのユーザー/グループ管理

ビュー承認後に以下のタスクが可能：
- アクセスの拒否
- アクセス権の取り消し
- アクセス権の付与
- アクセスポリシーの表示

## ビューへの承認解除

| 方法 | 手順 |
|------|------|
| **Console** | エクスプローラ → データセット → テーブル → [共有] → [ビューを承認] → [承認を解除] |
| **bq CLI** | `bq rm project_id:dataset:table_id` |
| **API** | `tables.delete` メソッドを呼び出し |

## 割り当てと上限

- 削除した承認済みビューの名前の再利用には **24 時間** の待機が必要（または一意の名前を使用）
- データセットの上限が適用される

## 高度なトピック

### 行レベルのセキュリティとの組み合わせ

論理ビュー・マテリアライズドビューに表示されるデータは、ソーステーブルの**行レベルのアクセスポリシー**に従ってフィルタリングされる。

### 列レベルのセキュリティとの組み合わせ

列レベルのセキュリティの影響はビューが承認済みかどうかに**無関係**に適用される。

### BigQuery Sharing（旧 Analytics Hub）との連携

BigQuery Sharing は以下の機能を持つデータ交換プラットフォーム：

- 共有データセットと関連する承認済みビュー・データセットをサブスクライバーにパブリッシュ可能
- 堅牢なセキュリティ・プライバシーフレームワーク
- 組織の境界を越えた大規模なデータ共有

**リンク済みデータセット**（読み取り専用）は共有データセットへの参照として機能し、サブスクライバーのプロジェクトに作成される。

> **注意**: リンク済みデータセット内のテーブルを参照するマテリアライズドビューはサポートされていない。

## 関連リソース

- [承認済みビューを作成する（チュートリアル）](https://docs.cloud.google.com/bigquery/docs/create-authorized-views?hl=ja)
- [ビューの管理](https://docs.cloud.google.com/bigquery/docs/managing-views?hl=ja)
- [ビューに関する情報の取得](https://docs.cloud.google.com/bigquery/docs/view-metadata?hl=ja)
- [マテリアライズドビューを作成する](https://docs.cloud.google.com/bigquery/docs/materialized-views-create?hl=ja#access_control)
- [論理ビューを作成する](https://docs.cloud.google.com/bigquery/docs/views?hl=ja)
- [承認済みデータセット](https://docs.cloud.google.com/bigquery/docs/authorized-datasets?hl=ja)
- [行レベルのセキュリティの概要](https://docs.cloud.google.com/bigquery/docs/row-level-security-intro?hl=ja)
- [列レベルのアクセス制御の概要](https://docs.cloud.google.com/bigquery/docs/column-level-security-intro?hl=ja)
- [BigQuery Sharing の概要](https://docs.cloud.google.com/bigquery/docs/analytics-hub-introduction?hl=ja)
