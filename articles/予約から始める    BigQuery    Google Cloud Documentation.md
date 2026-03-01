---
title: "予約から始める  |  BigQuery  |  Google Cloud Documentation"
source: "https://docs.cloud.google.com/bigquery/docs/reservations-get-started?hl=ja"
author:
  - "[[Google Cloud]]"
published:
created: 2026-03-01
description: "BigQuery の予約（Reservations）機能を使い始めるためのチュートリアル。自動スケーリング予約の作成、プロジェクトの予約への割り当て、不要になった予約の削除までの手順をGoogle Cloud コンソール上で順を追って解説する。"
tags:
  - "clippings"
  - "BigQuery"
  - "GCP"
  - "Reservations"
  - "ワークロード管理"
  - "スロット"
---

## 概要

BigQuery の**予約（Reservations）**機能を使い始めるためのチュートリアル。予約を使うことで、BigQuery のスロット（計算リソース）をプロジェクトに割り当て、ワークロードのコストやパフォーマンスを管理できる。本ドキュメントでは、自動スケーリング予約の作成からプロジェクトの割り当て、クリーンアップ（削除）までの一連の手順をカバーしている。

前提知識として [ワークロード管理の概要](https://docs.cloud.google.com/bigquery/docs/reservations-intro?hl=ja) の理解が推奨されている。

## 主要なトピック

### 前提条件

予約を利用する前に、以下の準備が必要：

- **Google Cloud プロジェクト**の選択または作成
  - プロジェクト作成には `roles/resourcemanager.projectCreator` ロールが必要
- **課金の有効化**
- **BigQuery Reservation API の有効化**
  - API 有効化には `roles/serviceusage.serviceUsageAdmin` ロールが必要
- **スロット割り当ての確認**
  - 購入するリージョンに十分なスロット割り当てがあること
  - 不足する場合は割り当て増加のリクエストが必要

#### 必要なIAMロール

| 操作 | 必要なロール |
|------|-------------|
| 予約の作成・割り当て・削除 | BigQuery リソース編集者 (`roles/bigquery.resourceEditor`) |

カスタムロールや他の事前定義ロールからも必要な権限を取得可能。

### 自動スケーリング予約の作成

`US` マルチリージョンに `prod` という名前の予約を作成する手順：

1. Google Cloud コンソールで **[BigQuery]** ページに移動
2. ナビゲーションメニューの **[容量管理]** をクリック
3. **[予約を作成]** をクリック
4. 以下を設定：
   - **予約名**: `prod`
   - **ロケーション**: `us`（米国の複数のリージョン）
   - **エディション**: Standard（[BigQuery エディション](https://docs.cloud.google.com/bigquery/docs/editions-intro?hl=ja) 参照）
   - **最大予約サイズ**: S（100 スロット）
5. 残りはデフォルト設定のまま **[保存]** をクリック

> SQL または bq ツールでの作成方法は「[専用スロットを使用して予約を作成する](https://docs.cloud.google.com/bigquery/docs/reservations-tasks?hl=ja#create_a_reservation_with_dedicated_slots)」を参照。

### プロジェクトを予約に割り当てる

作成した `prod` 予約にプロジェクトを割り当てると、そのプロジェクトから実行されるクエリジョブは `prod` 予約のスロットプールを使用する。

1. **[BigQuery]** → **[容量管理]** → **[スロットの予約]** タブを開く
2. `prod` 予約の **[操作]** → **[割り当ての作成]** をクリック
3. **[組織、フォルダ、プロジェクトを選択]** でプロジェクトを選択
4. **[作成]** をクリック

**割り当て対象の条件**: 管理プロジェクトと同じ組織・同じリージョンのプロジェクトであること。

> SQL または bq ツールでの割り当て方法は「[プロジェクトまたはフォルダを予約に割り当てる](https://docs.cloud.google.com/bigquery/docs/reservations-assignments?hl=ja#assign_my_prod_project_to_prod_reservation)」を参照。

### クリーンアップ（リソース削除）

課金を止めるには以下のいずれかを実施：

#### 方法1: プロジェクトの削除

Google Cloud コンソールの **[リソースの管理]** ページからプロジェクトごと削除する。

#### 方法2: 予約の削除

1. **[BigQuery]** → **[容量管理]** → **[スロットの予約]** タブを開く
2. `prod` 予約の **[ノードを切り替える]** をクリック
3. 各割り当てを **[操作]** → **[削除]** で削除
4. `prod` 予約自体を **[操作]** → **[削除]** で削除

> SQL または bq ツールでの削除方法は「[予約を削除する](https://docs.cloud.google.com/bigquery/docs/reservations-tasks?hl=ja#delete_a_reservation)」を参照。

## 重要な事実・データ

- **自動スケーリング**: 予約のスロット数は需要に応じて自動的にスケーリングされる（最大サイズを指定）
- **最小サイズ単位**: S（100 スロット）が選択肢として存在
- **コミットメント**: スロットのコミットメント購入も可能（詳細は [スロット コミットメント](https://docs.cloud.google.com/bigquery/docs/reservations-workload-management?hl=ja#slot_commitments) を参照）
- **エディション**: Standard を選択（Enterprise、Enterprise Plus も選択可能）

## 制限事項・注意点

- **割り当て後の待機時間**: 予約割り当てを作成した場合、**5分以上待ってからクエリを実行すること**。そうしないとクエリがオンデマンド料金で課金される可能性がある
- **予約削除時の影響**: 予約を削除すると、その予約のスロットで**実行中のジョブが失敗する**。削除前に処理中のジョブが完了していることを確認する必要がある
- **スロット割り当て制限**: 購入するリージョンに十分なスロット割り当てが必要。不足する場合は割り当て増加をリクエストする

## 次のステップ

- [Reservations を使用したワークロード管理](https://docs.cloud.google.com/bigquery/docs/reservations-workload-management?hl=ja) - BigQuery Reservations でワークロードを管理する方法の詳細

---

*Source: [予約から始める | BigQuery | Google Cloud Documentation](https://docs.cloud.google.com/bigquery/docs/reservations-get-started?hl=ja)*
