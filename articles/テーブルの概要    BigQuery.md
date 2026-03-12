---
title: "テーブルの概要  |  BigQuery"
source: "https://docs.cloud.google.com/bigquery/docs/tables-intro?hl=ja"
author:
  - "[[Google Cloud]]"
published:
created: 2026-03-12
description: "BigQuery のテーブルタイプ（標準テーブル、テーブルクローン、テーブルスナップショット、外部テーブル、ビュー、マテリアライズドビュー）の特徴と用途、制限事項、割り当て、料金体系、セキュリティについて解説する Google Cloud 公式ドキュメント。"
tags:
  - "clippings"
  - "BigQuery"
  - "GCP"
  - "データウェアハウス"
  - "テーブル設計"
  - "外部テーブル"
---

## 概要

BigQuery のテーブルは、個々のレコードが行の形式にまとめられ、各レコードは列（フィールド）で構成される。すべてのテーブルは列名・データ型などを記述するスキーマによって定義され、テーブル作成時に指定するか、クエリ/読み込みジョブ時に宣言することもできる。

テーブル名の完全修飾形式:
- **GoogleSQL**: `projectname.datasetname.tablename`
- **bq コマンドラインツール**: `projectname:datasetname.tablename`

## 主要なトピック

### テーブルタイプの分類

BigQuery のテーブルは大きく3つのカテゴリに分類される。

| カテゴリ | 説明 | データの保存先 |
|----------|------|---------------|
| **標準 BigQuery テーブル** | BigQuery ストレージに格納された構造化データ | BigQuery ストレージ（カラムナフォーマット） |
| **外部テーブル** | BigQuery 外部に格納されたデータを参照 | Cloud Storage, S3, Azure Blob 等 |
| **ビュー** | SQL クエリで定義される論理テーブル | クエリ結果（ビュー）/キャッシュ（マテリアライズド） |

### 標準 BigQuery テーブル

| タイプ | 特徴 |
|--------|------|
| **テーブル** | スキーマを持ち、すべてのカラムにデータ型がある基本テーブル |
| **テーブルクローン** | テーブルの軽量な書き込み可能コピー。ベーステーブルとの差分のみ保存 |
| **テーブルスナップショット** | テーブルのポイントインタイムコピー。読み取り専用だがテーブル復元可能。差分のみ保存でストレージ効率が良い |

- [ObjectRef](https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/objectref_functions?hl=ja#objectref) 形式の構造体列を使用して、非構造化データへの参照を標準テーブルに保存することも可能

### 外部テーブル

| タイプ | データソース | テーブルレベルセキュリティ |
|--------|-------------|-------------------------|
| **BigLake テーブル** | Cloud Storage, Amazon S3, Azure Blob Storage | 対応（きめ細かなセキュリティ適用可能） |
| **オブジェクトテーブル** | Cloud Storage（非構造化データ） | - |
| **BigLake 以外の外部テーブル** | Cloud Storage, Google ドライブ, Bigtable | 非対応 |

### ビュー

| タイプ | 特徴 |
|--------|------|
| **ビュー** | SQL クエリで定義される論理テーブル。クエリされるたびに定義クエリが実行される |
| **マテリアライズドビュー** | 事前計算されたビュー。クエリ結果を定期的にキャッシュとして BigQuery ストレージに保存 |

## 重要な事実・データ

### テーブルの制限事項

- Google Cloud コンソールで表示可能なテーブル数: **データセットごとに最大 50,000 件**
- API 呼び出しでは 50,000 件に近づくと列挙パフォーマンスが低下
- テーブルデータのエクスポート先は **Cloud Storage のみ**
- テーブル名はデータセットごとに一意である必要がある

### テーブルの割り当て

以下のジョブタイプごとに割り当てと上限が適用される:

- **コピージョブ**: テーブルのコピー
- **クエリジョブ**: テーブルデータのクエリ
- **抽出ジョブ**: テーブルからのデータエクスポート
- **読み込みジョブ**: テーブルへのデータ読み込み

テーブル固有の割り当てエラー:
- テーブルに対する過剰な数の未処理 DML ステートメント
- テーブルのインポートまたはクエリの追加の割り当てエラー

### テーブルの料金

料金は以下に基づいて発生:
- **ストレージ**: テーブルおよびパーティションに格納されるデータ量
- **クエリ**: データに対して実行するクエリ

**無料のオペレーション**: データの読み込み、コピー、エクスポートは無料（ただし割り当てと上限は適用）

## 結論・示唆

### セキュリティ

- テーブルへのアクセス制御は [IAM](https://docs.cloud.google.com/bigquery/docs/control-access-to-resources-iam?hl=ja) で管理
- 外部テーブルでテーブルレベルのきめ細かなセキュリティが必要な場合は **BigLake テーブル** を選択すべき

### 実践的な示唆

- 大量のテーブルを管理する場合、データセットあたり 50,000 件の制限を意識した設計が必要
- テーブルクローンやスナップショットを活用することで、ストレージコストを抑えつつバックアップやテスト環境を構築可能
- 外部テーブルのセキュリティ要件に応じて BigLake テーブルと非 BigLake 外部テーブルを適切に選択する
- マテリアライズドビューを活用することで、頻繁なクエリのパフォーマンスとコストを最適化できる

## 制限事項・注意点

- 外部テーブルには追加の制限事項あり（[外部テーブル](https://docs.cloud.google.com/bigquery/docs/external-tables?hl=ja#limitations)、[オブジェクトテーブル](https://docs.cloud.google.com/bigquery/docs/object-table-introduction?hl=ja#limitations)、[BigLake テーブル](https://docs.cloud.google.com/bigquery/docs/biglake-intro?hl=ja#limitations) 参照）
- 割り当てエラーのトラブルシューティングは [BigQuery トラブルシューティングページ](https://docs.cloud.google.com/bigquery/docs/troubleshoot-quotas?hl=ja) を参照

---

*Source: [テーブルの概要 | BigQuery](https://docs.cloud.google.com/bigquery/docs/tables-intro?hl=ja)*
