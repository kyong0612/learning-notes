---
title: "【AWS re:Invent 2025】S3 Tablesでメダリオンアーキテクチャのデータ基盤をつくろう！"
source: "https://kaminashi-developer.hatenablog.jp/entry/2025/12/09/aws-reinvent-s3tables-medallion"
author:
  - "manaty（@manaty226）"
published: 2025-12-09
created: 2025-12-10
description: "AWS re:Invent 2025最終日のワークショップ「Modern batch analytics: Building advanced transactional datalakes with S3 Tables」のレポート。S3 Tablesを使ってメダリオンアーキテクチャ（ブロンズ・シルバー・ゴールド層）のデータ基盤を構築する実践的な内容と、権限設定や最適化戦略についての学びを共有。"
tags:
  - "AWS"
  - "S3 Tables"
  - "Iceberg"
  - "メダリオンアーキテクチャ"
  - "AWS re:Invent 2025"
  - "データ基盤"
  - "Lake Formation"
---

## 概要

カミナシの認証認可チームのmanaty氏によるAWS re:Invent 2025最終日のワークショップ参加レポート。S3 Tablesを使ってメダリオンアーキテクチャに基づくデータ基盤を構築する実践的なセッション。

## メダリオンアーキテクチャとは

データを3層のストレージで管理するデータ基盤アーキテクチャ：

| 層 | 役割 | 内容 |
|---|---|---|
| **ブロンズ層** | 未加工データ | 生データをそのまま保存 |
| **シルバー層** | クレンジング済みデータ | データのクレンジングや複数データの結合を行った「きれいな」データ |
| **ゴールド層** | ユースケース特化 | 報告用ダッシュボードなど具体的なユースケースに合わせたデータ |

> 💡 以前は「データレイク→データウェアハウス→データマート」と呼ばれていたが、レイクハウスにおける論理的な分離設計という意味でメダリオンアーキテクチャと呼ばれるようになった。

![メダリオンアーキテクチャの概要図](https://cdn-ak.f.st-hatena.com/images/fotolife/k/kaminashi-developer/20251208/20251208202127.png)

## ワークショップの内容

### 1. ブロンズ層へのデータ投入

- **Parquet形式**と**CSV形式**の2種類のデータを使用
- **AWS Glue**を使って各データを別々のS3 Tablesに格納
- S3 Tablesのプレビュー機能でcustomer情報のテーブルを確認

![ブロンズ層とシルバー層の構成図](https://cdn-ak.f.st-hatena.com/images/fotolife/k/kaminashi-developer/20251208/20251208202152.png)

![ブロンズ層のデータプレビュー](https://cdn-ak.f.st-hatena.com/images/fotolife/k/kaminashi-developer/20251208/20251208202221.png)

### 2. シルバー層の作成

- 別のGlueジョブで2つのブロンズ層データを結合
- 結合後のデータには`company`カラムが追加される

![シルバー層では結合されてcompanyカラムが追加](https://cdn-ak.f.st-hatena.com/images/fotolife/k/kaminashi-developer/20251208/20251208202454.png)

### 3. Athenaからのクエリ

- S3 TablesのデータをAthenaからクエリ
- **⚠️ 重要**: **Lake Formation**での権限付与が必要
- ワークショップ参加者のほぼ全員がこのステップで詰まった
- ユーザーロールにsuper権限を付与してクエリ実行

![Athenaでのクエリ実行](https://cdn-ak.f.st-hatena.com/images/fotolife/k/kaminashi-developer/20251208/20251208202527.png)

### 4. ゴールド層の作成

- **SageMaker Unified Studio**を使用してゴールド層のS3 Tablesデータベースを新規作成
- SageMaker Unified StudioからのCREATE TABLEクエリは権限エラーで失敗
- Athenaで代わりにクエリを実行することでテーブル作成に成功

![Amazon SageMaker Unified Studio](https://cdn-ak.f.st-hatena.com/images/fotolife/k/kaminashi-developer/20251208/20251208202548.png)

### 5. QuickSightでの可視化（未完）

- 本来はAmazon QuickSightからS3 Tablesのデータを読んでグラフ表示するステップがあった
- 権限エラーでデータにアクセスできず完了せず

## S3 Tablesの最適化

### 最適化パラメータ

S3 Tablesには運用・性能の観点で設定を最適化できるパラメータが存在：

| 機能 | 説明 |
|---|---|
| **コンパクション** | 複数の小さなデータを一つにまとめる |
| **スナップショット** | 過去の時点のデータを管理 |
| **非参照データ削除** | 参照されないデータを自動的に削除 |

### 層ごとの最適化戦略

#### コンパクション戦略

| 層 | 戦略 | 理由 |
|---|---|---|
| ブロンズ層 | なし | 元データの追跡可能性や監査のため |
| シルバー層 | ビンパック | パフォーマンス向上 |
| ゴールド層 | Z-order | パフォーマンス向上 |

#### スナップショット保持期間

| 層 | 保持期間 | 理由 |
|---|---|---|
| ブロンズ層 | 24時間 | 頻繁に更新されるためコスト最適化 |
| シルバー層 | 7日間 | 履歴の再生成を可能にする |
| ゴールド層 | 3日間 | コストと実用のトレードオフ |

### テーブル設定の確認コマンド

```bash
aws s3tables get-table-maintenance-configuration \
  --table-bucket-arn $BRONZE_ARN \
  --namespace $BRONZE_NAMESPACE \
  --name $BRONZE_TABLE
```

## 重要なポイントと学び

### 権限設定の複雑さ

S3 Tablesにアクセスするための権限設定は以下の3つが関係し、複雑：

1. **アイデンティティベースポリシー**（ロールなど）
2. **S3 Tables自身のリソースポリシー**
3. **Lake Formationのパーミッション**

> ⚠️ どの設定が誤っているのか、そもそもどういった権限構成になっているのかもわかりにくいという課題がある。

### Lake Formationのメリット

テーブルごとに権限を分離できるため、データを社内で利活用する際には**最小権限でデータガバナンスを効かせられる**という利点がある。

![Lake Formationの権限設定](https://cdn-ak.f.st-hatena.com/images/fotolife/k/kaminashi-developer/20251208/20251208202633.png)

## 所感

- S3 Tablesのセッションは最終日にも関わらず**満席**で、サービスに対する注目度の高さを感じた
- 最適化戦略は運用しながらユースケースに合った最適値を見つけていく必要がある
- 権限周りの複雑さが課題だが、適切に設定すればデータガバナンスを強化できる
