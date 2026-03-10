---
title: "マネージド障害復旧に移行する  |  BigQuery"
source: "https://docs.cloud.google.com/bigquery/docs/disaster-recovery-migration?hl=ja"
author: "Google Cloud"
published:
created: 2026-03-10
description: "BigQuery のクロスリージョン レプリケーション（CRR）からマネージド障害復旧（DR）へ移行する手順と、費用・機能面での影響を解説する Google Cloud 公式ドキュメント。"
tags:
  - "clippings"
  - "BigQuery"
  - "disaster-recovery"
  - "cross-region-replication"
  - "Google Cloud"
  - "高可用性"
---

## 概要

BigQuery の**クロスリージョン レプリケーション（CRR）**と**マネージド障害復旧（DR）**は、いずれもデータの可用性と障害復旧を強化する機能だが、リージョン停止時の挙動が異なる。

- **CRR**: プライマリ リージョンが停止してもセカンダリ レプリカを昇格できない。ストレージのみを複製。
- **DR**: プライマリ リージョン停止時にセカンダリ レプリカへの**フェイルオーバーが可能**。ストレージ＋コンピューティング容量の両方を複製し、より包括的な保護を提供。

## CRR と DR の機能比較

| 機能 | CRR | DR |
|---|---|---|
| **初期レプリケーション** | CRR でデータセットを複製 | CRR で複製済みのデータを DR に移行 |
| **レプリケーション方式** | 標準レプリケーション | **ターボ レプリケーション** |
| **プロモーション単位** | データセット レベル | **予約レベル**（1つのフェイルオーバー予約に多数のデータセットを接続可能） |
| **プロモーション方法** | UI または SQL DDL（CLI/API/Terraform 非対応） | UI または SQL DDL（CLI/API/Terraform 非対応） |
| **フェイルオーバー モード** | ソフト フェイルオーバー | **ハード フェイルオーバー** |
| **エディション要件** | 任意の容量モデル | **Enterprise Plus エディション** |
| **書き込みアクセス** | 任意の容量モデルで書き込み可能（セカンダリは読み取り専用） | Enterprise Plus 予約のジョブのみ書き込み可能（セカンダリは読み取り専用） |
| **読み取りアクセス** | 任意の容量モデルで読み取り可能 | 任意の容量モデルで読み取り可能 |

## 移行への影響

### 費用への影響

- **コンピューティング費用が増加**: DR は Enterprise Plus エディションからの書き込みのみサポートするため、コンピューティング費用が高くなる。
- **ターボ レプリケーション追加費用**: リージョンペアに応じた追加費用が発生する。
- **ストレージ料金**: CRR と DR で同一（変更なし）。
- **読み取り費用**: 既存ジョブの読み取り費用は変わらない。

### 機能への影響

- DR は**予約レベルでのフェイルオーバーのみ**サポート。データセット レベルのフェイルオーバーに依存する既存ジョブは**失敗する**。
- データセットが DR 予約に接続されると、**Enterprise Plus エディションのクエリのみ**がデータセットに書き込み可能。Enterprise Plus を使用していない既存の書き込みジョブは**失敗する**。

## 前提条件

- BigQuery が有効なアクティブな Google Cloud プロジェクト
- CRR でデータセットを作成・複製済み
- データセットのプライマリ/セカンダリ ロケーションが DR で使用するロケーションと一致
- DR 操作に必要な権限を保持

## 移行手順

### Step 1: フェイルオーバー予約を作成する

プライマリ リージョンに Enterprise Plus エディションのフェイルオーバー予約を作成する。プライマリ/セカンダリ リージョンは、移行対象の CRR データセットのリージョンと一致させる必要がある。

**SQL での作成例:**

```sql
CREATE RESERVATION
  `ADMIN_PROJECT_ID.region-LOCATION.RESERVATION_NAME`
OPTIONS (
  slot_capacity = NUMBER_OF_BASELINE_SLOTS,
  edition = ENTERPRISE_PLUS,
  secondary_location = SECONDARY_LOCATION);
```

**パラメータ:**
- `RESERVATION_NAME`: 予約名（英小文字、数字、ダッシュのみ）
- `SECONDARY_LOCATION`: セカンダリ ロケーション（フェイルオーバー先）
- `NUMBER_OF_BASELINE_SLOTS`: ベースライン スロット数
- `LOCATION`: 予約のロケーション
- `ADMIN_PROJECT_ID`: 管理プロジェクトの ID

### Step 2: データセットを予約に接続する

クロスリージョン データセットをフェイルオーバー予約に接続し、フェイルオーバーを有効化する。

```sql
ALTER SCHEMA
  `DATASET_NAME`
SET OPTIONS (
  failover_reservation = ADMIN_PROJECT_ID.RESERVATION_NAME);
```

### Step 3: 構成を確認する

`INFORMATION_SCHEMA.SCHEMATA_REPLICAS` ビューをクエリして、データセットが正しいリージョンの正しい予約に接続されていることを確認する。

## 実践例

プロジェクト `myproject`、データセット `mydataset`（プライマリ: `us-central1`、セカンダリ: `us-west1`）の場合:

**1. Enterprise Plus 予約の作成:**

```sql
CREATE RESERVATION `myproject.region-us-central1.myreservation`
OPTIONS (
  slot_capacity = 0,
  edition = ENTERPRISE_PLUS,
  autoscale_max_slots = 50,
  secondary_location = 'us-west-1');
```

**2. データセットの接続:**

```sql
ALTER SCHEMA
  `myproject.mydataset`
SET OPTIONS (
  failover_reservation = 'myproject.myreservation');
```

**3. 接続確認:**

```sql
SELECT
  failover_reservation_project_id, failover_reservation_name
FROM
  `myproject`.`region-us-west1`.INFORMATION_SCHEMA.SCHEMATA_REPLICAS
WHERE
  schema_name = 'mydataset';
```

## 重要なポイント

- CRR → DR 移行の最大のメリットは、リージョン停止時の**フェイルオーバー機能**と**コンピューティング容量の複製**。
- 移行には **Enterprise Plus エディション**が必須であり、費用増加を伴う。
- 既存の書き込みジョブが Enterprise Plus 以外で動作している場合、移行後に**失敗する可能性**がある点に注意が必要。
- データセット レベルのプロモーションから**予約レベルのプロモーション**に変更される。

## 関連リンク

- [クロスリージョン データセット レプリケーション](https://docs.cloud.google.com/bigquery/docs/data-replication?hl=ja)
- [マネージド障害復旧](https://docs.cloud.google.com/bigquery/docs/managed-disaster-recovery?hl=ja)
- [BigQuery 料金](https://cloud.google.com/bigquery/pricing?hl=ja)
