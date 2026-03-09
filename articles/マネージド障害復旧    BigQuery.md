---
title: "マネージド障害復旧  |  BigQuery"
source: "https://docs.cloud.google.com/bigquery/docs/managed-disaster-recovery?hl=ja"
author: "Google Cloud"
published:
created: 2026-03-09
description: "BigQueryのマネージド障害復旧の概要と、リージョン障害時にクロスリージョン データセット レプリケーションとEnterprise Plus予約を用いてビジネス継続性を維持する方法を解説するドキュメント。"
tags:
  - "clippings"
  - "BigQuery"
  - "disaster-recovery"
  - "Google Cloud"
  - "cross-region-replication"
  - "Enterprise Plus"
---

## 概要

BigQuery のマネージド障害復旧は、リージョン全体が停止した場合の障害復旧シナリオに対応する機能。[クロスリージョン データセット レプリケーション](https://docs.cloud.google.com/bigquery/docs/data-replication?hl=ja)によってストレージのフェイルオーバーを管理する。**Enterprise Plus エディション**でのみ利用可能。

ユーザーはセカンダリ リージョンにデータセット レプリカを作成し、コンピューティングとストレージのフェイルオーバー動作を設定することで、リージョン停止中もビジネスの継続性を維持できる。

## フェイルオーバーの種類

### ハード フェイルオーバー

- セカンダリ リージョンの予約とデータセット レプリカを**即座にプライマリに昇格**
- 現在のプライマリ リージョンが**オフラインでも続行**可能
- レプリケーション未完了データの同期を待たないため、**データ損失の可能性あり**
- レプリカの `replication_time` 値より前にソースリージョンでcommitしたジョブは、フェイルオーバー後に再実行が必要な場合がある
- デフォルトのフェイルオーバーモード

### ソフト フェイルオーバー

- プライマリで commit された予約とデータセットの変更が**すべてセカンダリに複製されるまで待機**してからフェイルオーバーを完了
- **プライマリとセカンダリの両方が使用可能**である必要がある
- 実行中は予約と接続されたデータセットの更新不可（読み取りは可能）
- `softFailoverStartTime` が設定され、完了時にクリアされる

## 障害復旧の有効化要件

1. **Enterprise Plus エディションの予約**をプライマリ リージョンで作成
2. ペアに設定されたリージョンのスタンバイ コンピューティング容量は予約に含まれる
3. データセットを予約に接続することでフェイルオーバーが有効化
4. データセット接続条件：バックフィル完了済み＋プライマリ/セカンダリのロケーションペアが予約と一致
5. フェイルオーバー予約に接続後は、Enterprise Plus 予約のみがそのデータセットに書き込み可能
6. フェイルオーバー予約に接続されたデータセットからの読み取りはどの容量モデルでも可能

> **注意**: フェイルオーバーは積極的に行う必要があるが、**10分間に1回を超える頻度では実行不可**。

## ターボ レプリケーション

障害復旧では[ターボ レプリケーション](https://docs.cloud.google.com/storage/docs/availability-durability?hl=ja#turbo-replication)を使用してリージョン間のデータ レプリケーションを高速化する。

- 最初のバックフィル オペレーションには**適用されない**
- バックフィル完了後、帯域幅割り当て内でユーザーエラーがなければ、**15分以内**にセカンダリ レプリカにデータセットをレプリケーション

### 目標復旧時間（RTO）

- フェイルオーバー開始後の RTO は **5分**
- 5分以内にセカンダリ リージョンで容量が使用可能になる

### 目標復旧時点（RPO）

- データセットごとに定義
- セカンダリ レプリカをプライマリから **15分以内** に確保することを目標
- 帯域幅割り当て内＋ユーザーエラーなしが条件

## 制限事項

- [クロスリージョン データセット レプリケーション](https://docs.cloud.google.com/bigquery/docs/data-replication?hl=ja#limitations)と同じ制限が適用
- フェイルオーバー後の自動スケーリングはセカンダリ リージョンの予約ベースラインのみ使用可能
- `INFORMATION_SCHEMA.RESERVATIONS` ビューにフェイルオーバー詳細は含まれない
- 同一管理プロジェクトで複数フェイルオーバー予約を使用し、異なるセカンダリ ロケーションのデータセットが接続されている場合、別のフェイルオーバー予約のデータセットを混在させない
- 既存予約をフェイルオーバー予約に変換する場合、予約割り当ては **1,000件以下**
- フェイルオーバー予約に接続可能なデータセットは **1,000件以下**
- ソフト フェイルオーバーは両リージョン使用可能な場合のみトリガー可能
- 予約レプリケーション中の一時的エラー時はソフト フェイルオーバー不可
- ソフト フェイルオーバー中のジョブは予約スロットを使用しない場合あり（開始前と完了後は使用）

## 利用可能なロケーション

フェイルオーバー予約で選択可能なリージョンペア：

| 地域コード | 主なリージョン |
|---|---|
| **ASIA** | 台湾 (`ASIA-EAST1`) / シンガポール (`ASIA-SOUTHEAST1`) |
| **AU** | シドニー (`AUSTRALIA-SOUTHEAST1`) / メルボルン (`AUSTRALIA-SOUTHEAST2`) |
| **CA** | モントリオール (`NORTHAMERICA-NORTHEAST1`) / トロント (`NORTHAMERICA-NORTHEAST2`) |
| **DE** | フランクフルト (`EUROPE-WEST3`) / ベルリン (`EUROPE-WEST10`) |
| **EU** | EU マルチリージョン / ワルシャワ / フィンランド / マドリッド / ベルギー / フランクフルト / オランダ / ミラノ / パリ |
| **IN** | ムンバイ (`ASIA-SOUTH1`) / デリー (`ASIA-SOUTH2`) |
| **US** | US マルチリージョン / アイオワ / サウスカロライナ / 北バージニア / コロンバス / ダラス / オレゴン / ロサンゼルス / ソルトレイクシティ / ラスベガス |

**制約**: リージョンペアは同一地域コード内で選択する必要がある（例：USとEUは混在不可）。

**マルチリージョン使用不可ペア**:
- `eu-west4` - `eu` マルチリージョン
- `eu-west1` - `eu` マルチリージョン
- `us-west1` - `us` マルチリージョン
- `us-central1` - `us` マルチリージョン

## 料金

| 項目 | 内容 |
|---|---|
| **コンピューティング容量** | Enterprise Plus エディションの購入が必要。課金はプライマリ リージョンのみ。セカンダリの予約ベースライン容量は追加料金なし |
| **ターボ レプリケーション** | 物理バイト数とレプリケーションされた物理GiB数に基づく課金 |
| **ストレージ** | セカンダリもプライマリと同じ料金 |
| **アイドルスロット** | フェイルオーバーされていない限り、セカンダリ コンピューティング容量は使用不可 |
| **ステイル読み取り** | セカンダリでの実施には追加コンピューティング容量の購入が必要 |

## 設定手順

### 1. Enterprise Plus 予約の作成

**SQL例:**

```sql
CREATE RESERVATION
  `ADMIN_PROJECT_ID.region-LOCATION.RESERVATION_NAME`
OPTIONS (
  slot_capacity = NUMBER_OF_BASELINE_SLOTS,
  edition = ENTERPRISE_PLUS,
  secondary_location = SECONDARY_LOCATION);
```

### 2. データセットを予約に接続

**SQL例:**

```sql
ALTER SCHEMA
  `DATASET_NAME`
SET OPTIONS (
  failover_reservation = ADMIN_PROJECT_ID.RESERVATION_NAME);
```

### 3. フェイルオーバーの開始

**SQL例:**

```sql
ALTER RESERVATION
  `ADMIN_PROJECT_ID.region-LOCATION.RESERVATION_NAME`
SET OPTIONS (
  is_primary = TRUE, failover_mode = FAILOVER_MODE);
```

`FAILOVER_MODE` は `HARD`（デフォルト）または `SOFT` を指定。

### 4. データセットの予約解除

```sql
ALTER SCHEMA
  `DATASET_NAME`
SET OPTIONS (
  failover_reservation = NULL);
```

## モニタリング

レプリカの状態確認：

```sql
SELECT
  schema_name, replica_name, creation_complete,
  replica_primary_assigned, replica_primary_assignment_complete
FROM
  `region-LOCATION`.INFORMATION_SCHEMA.SCHEMATA_REPLICAS
WHERE schema_name = "my_dataset"
```

フェイルオーバー対象データセットで失敗するジョブの検出（過去7日間）には、`INFORMATION_SCHEMA.JOBS` と `INFORMATION_SCHEMA.RESERVATIONS` を結合するクエリを使用する。

## 関連リンク

- [クロスリージョン データセット レプリケーション](https://docs.cloud.google.com/bigquery/docs/data-replication?hl=ja)
- [BigQuery の信頼性](https://docs.cloud.google.com/bigquery/docs/reliability-intro?hl=ja)
- [DR 計画の基本](https://docs.cloud.google.com/architecture/dr-scenarios-planning-guide?hl=ja)
- [Enterprise Plus エディション](https://docs.cloud.google.com/bigquery/docs/editions-intro?hl=ja)
- [ワークロード管理の概要](https://docs.cloud.google.com/bigquery/docs/reservations-intro?hl=ja)
