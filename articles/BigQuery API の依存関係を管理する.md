---
title: "BigQuery API の依存関係を管理する"
source: "https://docs.cloud.google.com/bigquery/docs/service-dependencies?hl=ja"
author: "Google Cloud"
published:
created: 2026-03-04
description: "BigQuery が依存する Google Cloud サービスと API の一覧、およびそれらのサービスを無効にした場合の BigQuery 機能への影響を解説するドキュメント。管理者向けにデフォルト有効・無効のサービス分類と、コードアセット管理の手動有効化手順を提供する。"
tags:
  - "clippings"
  - "BigQuery"
  - "Google Cloud"
  - "API管理"
  - "サービス依存関係"
related:
  - "[[転送を承認する]]"
  - "[[承認済みデータセット]]"
  - "[[承認済みルーティン]]"
  - "[[承認済みビュー]]"
  - "[[承認済みビューを作成する]]"
---

## 概要

BigQuery が依存する Google Cloud サービスと API について説明するドキュメント。これらのサービスを無効にした場合の BigQuery の動作への影響を整理しており、**管理者向け**の内容となっている。

プロジェクトでサービスを有効・無効にする前に、依存関係を把握することが重要。

---

## サービスの分類

BigQuery に関連するサービスは、以下の3カテゴリに分類される。

| カテゴリ | 説明 |
|---|---|
| **デフォルトで有効** | 新規 Google Cloud プロジェクトで自動的に有効化される |
| **BigQuery Unified API で有効化** | `bigqueryunified.googleapis.com` を有効にすると一括で有効化される |
| **デフォルトで無効** | 対応機能を使うには手動で有効化が必要 |

---

## 1. デフォルトで有効になるサービス

以下の9つのサービスが新規プロジェクトでデフォルト有効となる。

### `analyticshub.googleapis.com`
- **依存機能**: データクリーンルーム、リスティング公開、サブスクリプション管理、データエクスチェンジ公開
- **無効化時の影響**: サブスクリプション新規作成不可、エクスチェンジ・リスティング・データクリーンルームの作成・管理不可、他プロバイダのエクスチェンジ検索不可

### `bigqueryconnection.googleapis.com`
- **依存機能**: BigQuery metastore、外部テーブル・データセット、連携クエリ
- **無効化時の影響**: BigLake テーブル・オブジェクトテーブルのクエリ不可、リモート関数・リモートモデル作成不可、外部接続管理不可

### `bigquerymigration.googleapis.com`
- **依存機能**: SQL クエリの変換、データ移行の評価
- **無効化時の影響**: 既存タスク・評価の使用不可、新規作成不可
- **注意**: データ移行完了後は通常無効化可能

### `bigquerydatapolicy.googleapis.com`
- **依存機能**: データマスキング
- **無効化時の影響**: ポリシーは削除されないが、マスキング適用テーブルへのクエリが失敗する。ポリシー管理不可

### `bigquerydatatransfer.googleapis.com`
- **依存機能**: スケジュールされたデータ転送
- **無効化時の影響**: 既存データ転送が停止、管理不可

### `bigqueryreservation.googleapis.com`
- **依存機能**: 容量ベースのワークロード管理
- **無効化時の影響**: スロット自動スケーリング停止、障害復旧フェイルオーバー不可、スロット使用状況モニタリング不可、容量コミットメント・予約・割り当ての作成・管理不可

### `bigquerystorage.googleapis.com`
- **依存機能**: 変更データキャプチャ、バッチデータ読み込み、ストリーミングデータ取り込み
- **無効化時の影響**: Storage Read API / Storage Write API でのデータアクセス不可

### `dataform.googleapis.com`
- **依存機能**: データキャンバス、データの準備、Dataform、Colab ノートブック、保存したクエリ、BigQuery パイプライン
- **無効化時の影響**: 上記すべての機能がアクセス不可、既存のスケジュール設定されたパイプライン・ノートブック・Dataform プロジェクトが停止、新規作成不可

### `dataplex.googleapis.com`
- **依存機能**: データキャンバス、テーブル・データセットの分析情報、データリネージ表示、データ品質スキャン、プロファイル分析情報、BigQuery Sharing リスティング検索、予測入力、リソースエクスプローラ
- **無効化時の影響**: データアセット検索不可、リネージグラフでの詳細確認不可、プロファイル分析情報・データ品質スキャンのアクセス不可、共有リスティング検索不可

### BigQuery API 自体を無効にした場合

BigQuery API を無効にすると、以下のサービスも連鎖的に無効になる:

- `telecomdatafabric.googleapis.com`
- `servicebroker.googleapis.com`
- `dataprep.googleapis.com`
- `cloudapis.googleapis.com`
- `container.googleapis.com`
- `binaryauthorization.googleapis.com`

---

## 2. BigQuery Unified API によって有効にされるサービス

`bigqueryunified.googleapis.com` を有効にすると、以下のサービスが一括で有効になる。Google がこのコレクション内のサービスを更新する可能性があり、個々のサービスは個別に無効化可能。

### `aiplatform.googleapis.com`
- **依存機能**: BigQuery ML リモートモデル、Colab ノートブック
- **無効化時の影響**: 既存ノートブックのアクセス・編集は可能だが実行不可、既存 BigQuery ML リモートモデルが動作停止

### `bigqueryunified.googleapis.com`
- **依存機能**: BigQuery 依存関係の一括管理
- **無効化時の影響**: 将来の依存関係がプロジェクトで自動的に有効にならなくなる

### `compute.googleapis.com`
- **依存機能**: Dataproc と Vertex AI のランタイム環境
- **無効化時の影響**: Dataproc API が無効化、Colab ノートブック・リモート ML モデル・Apache Spark ジョブが停止（ソースコードは維持）

### `dataproc.googleapis.com`
- **依存機能**: Spark ストアドプロシージャ、Serverless Spark SQL/PySpark、オープンソースエンジンクエリ
- **無効化時の影響**: BigQuery ワークロードでの Spark 実行不可、Serverless ワークロード実行不可、Dataproc クラスタ作成不可

### `datastream.googleapis.com`
- **依存機能**: 変更データキャプチャと BigQuery へのレプリケーション
- **無効化時の影響**: すべてのデータストリームが一時停止しアクセス不可

---

## 3. デフォルトで無効になっているサービス

以下のサービスは手動で有効化が必要。

### `cloudaicompanion.googleapis.com`
- **依存機能**: Gemini in BigQuery（コード補完・生成・説明）
- **無効化時の影響**: Gemini 機能が動作しなくなる

### `composer.googleapis.com`
- **依存機能**: ワークロードのスケジュール設定
- **無効化時の影響**: 既存の Cloud Composer 環境が停止しエラー状態、既存 DAG がスケジュールページに表示されず停止

### `datalineage.googleapis.com`
- **依存機能**: データリネージのキャプチャと表示
- **無効化時の影響**: リネージグラフ表示不可、データリネージのキャプチャ停止

---

## 4. BigQuery コードアセットの手動有効化

ノートブックや保存済みクエリなどのコードアセット管理には、以下の3つの API を有効にする必要がある:

1. **Vertex AI API**
2. **Dataform API**
3. **Compute Engine API**

### 前提条件

- IAM の**オーナーロール**（`roles/owner`）が必要

### 有効化手順

1. BigQuery ページに移動
2. エディタペインのタブバーで `+` 横の矢印 → [ノートブック] → [BigQuery テンプレート] を選択
3. バナーの [有効にする] をクリック
4. [機能を有効にする] ペインで:
   - [コア機能の API] セクションで API を有効化 → [次へ]
   - [Python ノートブック] で [すべて有効にする]
   - [バージョン履歴と共有] で [有効にする]
5. （任意）権限設定: オーナー/作成者のプリンシパルを設定
6. （任意）[その他の API] で BigQuery DataFrames 用 API を有効化

### 制限事項

- **2024年3月以前**はこれらの API がデフォルトで自動有効化されていなかったため、旧スクリプトの更新が必要な場合がある
- 組織ポリシーの制約により追加 API の有効化を制限可能
- 個別の API はいつでも無効化可能

---

## 重要なポイント

- **サービス無効化の影響は不可逆的ではない**が、進行中のジョブ（ストリーミング、スケジュール転送等）は即座に停止する
- **BigQuery API 自体の無効化**は6つの関連サービスも連鎖的に無効化するため、特に注意が必要
- **BigQuery Unified API** はワンクリックで主要な依存サービスを有効化できる便利な手段
- コードアセット管理には `roles/owner` が必要で、組織ポリシーによるアクセス制限も設定可能
