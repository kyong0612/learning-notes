---
title: "BigQuery Sharing の概要"
source: "https://docs.cloud.google.com/bigquery/docs/analytics-hub-introduction?hl=ja"
author:
  - "Google Cloud"
published: 2026-01-06
created: 2026-01-08
description: "BigQuery Sharing（旧 Analytics Hub）は、堅牢なセキュリティとプライバシー フレームワークを備え、組織の境界を越えてデータと分析情報を大規模に共有できるデータ交換プラットフォームです。ゼロコピーでのデータ共有、パブリッシュ/サブスクライブモデル、VPC Service Controls対応などの機能を提供します。"
tags:
  - "BigQuery"
  - "Analytics-Hub"
  - "データ共有"
  - "Google-Cloud"
  - "データエクスチェンジ"
---

## 概要

BigQuery Sharing（旧 Analytics Hub）は、組織の境界を越えてデータと分析情報を大規模に共有できる**データ交換プラットフォーム**です。

### 主な特徴

- 堅牢なセキュリティとプライバシーフレームワーク
- ゼロコピーでのデータ共有（データを複製せずに共有）
- Google 提供のデータセットを含むキュレートされたデータライブラリへのアクセス
- サードパーティと Google のデータセットを使用した分析・ML イニシアチブの強化

## アーキテクチャ

BigQuery Sharing は、Google Cloud データリソースの**パブリッシュ / サブスクライブモデル**に基づいて構築されています。

### サポートされるリソース

| リソースタイプ | 説明 |
|--------------|------|
| BigQuery データセット | 共有データセットとして利用 |
| Pub/Sub トピック | ストリーミングデータ共有に利用 |

## IAM ロールと権限

| ロール | 主な機能 |
|-------|---------|
| **Analytics Hub 管理者** | データエクスチェンジの作成・更新・削除・共有、他のユーザーへの権限付与 |
| **Analytics Hub パブリッシャー** | リスティングの作成・管理、データの共有・収益化 |
| **Analytics Hub サブスクライバー** | リスティングへのサブスクライブ、共有データの利用 |
| **Analytics Hub 閲覧者** | 共有リソースの閲覧、アクセスリクエスト |

## パブリッシャーのワークフロー

![Analytics Hub パブリッシャーのワークフロー](https://docs.cloud.google.com/static/bigquery/images/analytics-hub-publisher-workflow.svg?hl=ja)

### 1. 共有リソースの準備

#### 共有データセット（BigQuery）

以下のオブジェクトを含む BigQuery データセットを共有可能：

- 承認済みビュー / データセット
- BigQuery ML モデル
- 外部テーブル
- マテリアライズドビュー
- ルーティン（UDF、テーブル関数、SQL ストアドプロシージャ）
- テーブル / テーブルスナップショット
- ビュー

**セキュリティ機能**：

- 列レベルのセキュリティ
- 行レベルのセキュリティ

#### 共有トピック（Pub/Sub）

ストリーミングデータ共有のための Pub/Sub トピック。

### 2. データエクスチェンジの設定

データエクスチェンジは、**セルフサービスのデータ共有を可能にするコンテナ**です。

| タイプ | 説明 |
|-------|------|
| **限定公開** | 特定のユーザー/グループのみがアクセス可能（デフォルト） |
| **一般公開** | すべての Google Cloud ユーザーがアクセス可能 |

### 3. リスティングの作成

リスティングは、パブリッシャーがデータエクスチェンジに掲載する**共有リソースへの参照**です。

**含められる情報**：

- リソースの説明
- サンプルクエリ / サンプルメッセージデータ
- 関連ドキュメントへのリンク
- 連絡先情報

| リスティングタイプ | 説明 |
|------------------|------|
| **公開リスティング** | すべての Google Cloud ユーザーと共有 |
| **限定公開リスティング** | 個人/グループと直接共有 |

## サブスクライバーのワークフロー

![BigQuery Sharing サブスクライバーのワークフロー](https://docs.cloud.google.com/static/bigquery/images/analytics-hub-subscriber-workflow.svg?hl=ja)

### リンクされたリソース

リスティングをサブスクライブすると、以下のリソースが作成されます：

| リソースタイプ | 説明 |
|--------------|------|
| **リンク済みデータセット** | 読み取り専用の BigQuery データセット。共有データセットへのポインタとして機能 |
| **リンクされた Pub/Sub サブスクリプション** | 共有トピックのメッセージにアクセス可能 |

## 下り（外向き）データオプション

パブリッシャーは、サブスクライバーによるデータエクスポートを制限可能：

**制限時に無効化される機能**：

- コピー、クローン、エクスポート、スナップショット API
- テーブルエクスプローラへの接続
- BigQuery Data Transfer Service
- `CREATE TABLE AS SELECT` / `CREATE VIEW AS SELECT`

## 制限事項

### 主な制限

| 項目 | 制限 |
|------|------|
| 共有データセットあたりのリンク済みデータセット | 最大 1,000 個 |
| 共有トピックあたりの Pub/Sub サブスクリプション | 最大 10,000 個 |

### パブリッシャーの制限

- VPC Service Controls 境界内のプロジェクトでの共有データ公開は非推奨
- クエリプランで共有ビュークエリが表示される（機密情報を含めない）
- Data Catalog へのインデックス登録に最大 18 時間かかる場合あり

### サブスクライバーの制限

- リンク済みデータセット内のテーブルを参照するマテリアライズドビューは非サポート
- リンク済みデータセットテーブルのスナップショット作成は非サポート
- 1TB を超える JOIN ステートメントは失敗する可能性あり
- 複数リージョンリスティングは共有データセットのみサポート

## サポートされているリージョン

### 主要リージョン

**南北アメリカ**：

- us-central1（アイオワ）🍃
- us-west1（オレゴン）🍃
- us-east4（北バージニア）
- southamerica-east1（サンパウロ）🍃

**アジア太平洋**：

- asia-northeast1（東京）
- asia-northeast2（大阪）
- asia-southeast1（シンガポール）
- australia-southeast1（シドニー）

**ヨーロッパ**：

- europe-west1（ベルギー）🍃
- europe-north1（フィンランド）🍃
- europe-west2（ロンドン）🍃

### マルチリージョン

| マルチリージョン | 説明 |
|----------------|------|
| `EU` | 欧州連合加盟国内のデータセンター |
| `US` | 米国内のデータセンター |

### BigQuery Omni リージョン

- AWS: `aws-us-east-1`, `aws-us-west-2`, `aws-eu-west-1` など
- Azure: `azure-eastus2`

## 料金

| 項目 | 課金対象 |
|------|---------|
| データエクスチェンジ/リスティング管理 | **無料** |
| BigQuery ストレージ | パブリッシャー |
| BigQuery クエリ | サブスクライバー |
| Pub/Sub パブリッシュスループット | パブリッシャー |
| Pub/Sub サブスクライブスループット | サブスクライバー |

## コンプライアンス

対応する認証・コンプライアンス：

- ISO 27001 / 27017 / 27018
- SOC 1 / 2 / 3
- PCI
- HIPAA
- HITRUST

## 使用例

### 小売業者のサプライチェーンデータ共有

1. **管理者**：Forecasting プロジェクトでデータエクスチェンジを作成、パブリッシャーとサブスクライバーのロールを付与
2. **パブリッシャー**：需要予測データセットのリスティングを作成、使用状況の指標を追跡
3. **サブスクライバー（ベンダー）**：リスティングをサブスクライブし、リンク済みデータセットに対してリアルタイムでクエリを実行

## 関連リンク

- [リスティングとデータエクスチェンジを表示して登録する](https://docs.cloud.google.com/bigquery/docs/analytics-hub-view-subscribe-listings?hl=ja)
- [Analytics Hub のロールを付与する](https://docs.cloud.google.com/bigquery/docs/analytics-hub-grant-roles?hl=ja)
- [データエクスチェンジを管理する](https://docs.cloud.google.com/bigquery/docs/analytics-hub-manage-exchanges?hl=ja)
- [リスティングを管理する](https://docs.cloud.google.com/bigquery/docs/analytics-hub-manage-listings?hl=ja)
- [VPC Service Controls のルール](https://docs.cloud.google.com/bigquery/docs/analytics-hub-vpc-sc-rules?hl=ja)
