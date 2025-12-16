---
title: "Cloud RunのサーバーレスVPCアクセスをDirect VPC Egressに安全に切り替える"
source: "https://blog.g-gen.co.jp/entry/modifying-serverless-vpc-access-for-direct-vpc-egress"
author:
  - "佐々木 駿太"
published: 2024-08-26
created: 2025-12-16
description: "Cloud Run サービスが VPC に接続する際に使用するサーバーレス VPC アクセスを Direct VPC Egress に置き換える方法を、タグ付きリビジョンやトラフィック分割を活用して安全に移行する手順を解説。"
tags:
  - "Cloud Run"
  - "VPC"
  - "Direct VPC Egress"
  - "サーバーレスVPCアクセス"
  - "Google Cloud"
---

## 概要

Cloud Run サービスの VPC 接続方式を「サーバーレス VPC アクセス」から「Direct VPC Egress」に安全に切り替える方法を解説した記事。タグ付きリビジョンやトラフィック分割を活用し、サービスを停止せずに移行できる。

## Cloud Run から VPC にトラフィックを送信する方法

### サーバーレス VPC アクセスと Direct VPC Egress

Cloud Run のコンテナインスタンスは VPC の外で実行されるが、以下のようなケースで VPC への接続が必要となる：

- Cloud SQL、AlloyDB、Memorystore などの VPC リソースへのプライベートアクセス

これらのケースでは、**サーバーレス VPC アクセス** または **Direct VPC Egress** を構成して、Cloud Run から VPC への送信トラフィックを中継させる。

### Direct VPC Egress を採用するケース（推奨）

| 観点 | サーバーレス VPC アクセス | Direct VPC Egress |
|------|---------------------------|-------------------|
| **料金** | コネクタインスタンス（Compute Engine VM）の起動時間分発生 | 柔軟なスケーリングでコストメリットあり |
| **スケーリング** | 2〜10台の範囲でスケールアウト可能だが、**スケールインは不可**（再作成が必要） | 柔軟にスケーリング |
| **パフォーマンス** | — | **低レイテンシ・高スループット** |

> **推奨**: Cloud Run から VPC への接続は、基本的には **Direct VPC Egress** の使用が推奨される

### サーバーレス VPC アクセスを採用するケース

Direct VPC Egress には制限事項があり、以下の場合はサーバーレス VPC アクセスを使用する：

1. **コールドスタートの影響が許容できない場合**
   - 第2世代の実行環境で Direct VPC Egress を使用するとコールドスタートが長くなる可能性がある

2. **IP アドレスが枯渇している環境**
   - Direct VPC Egress: 最大コンテナインスタンス数の **4倍** の IP アドレスが推奨
   - サーバーレス VPC アクセス: コネクタインスタンスの数のみ IP アドレスが必要

## サンプル構成

Cloud Run → サーバーレス VPC アクセス → VPC → Cloud NAT → インターネット（外部サービス）という構成を使用。

### 切り替え前

```
Cloud Run → サーバーレス VPC アクセス コネクタ → VPC → Cloud NAT → インターネット
```

### 切り替え後

```
Cloud Run → Direct VPC Egress → VPC → Cloud NAT → インターネット
```

## 移行手順

### Step 1: Direct VPC Egress を使用するリビジョンをデプロイ

1. Cloud Run の詳細画面から「新しいリビジョンの編集とデプロイ」を開く
2. **ネットワーキング**タブで「VPC に直接トラフィックを送信する」を選択
3. 接続先の VPC とサブネットを選択
4. **重要**: 「このリビジョンをすぐに利用する」の**チェックを外す**
   - これにより、新しいリビジョンに受信トラフィックをルーティングしない

### Step 2: 新しいリビジョンの VPC 接続を確認

#### 方法1: タグ付きリビジョンを使用（推奨）

タグ付きリビジョンを使用すると、トラフィックをルーティングしないリビジョンでも専用 URL でアクセス可能。

```bash
# 新しいリビジョンの名前を確認
gcloud run revisions list --service={サービス名} --region={リージョン}

# タグを付与（例: dev）
gcloud run services update-traffic {サービス名} \
    --region={リージョン名} \
    --set-tags=dev={新しいリビジョンの名前}
```

出力例：

```
URL: https://ipcheck-xxxxxxxxxx-an.a.run.app
Traffic:
  100% ipcheck-00001-kk6
  0%   ipcheck-00002-fzg
         dev: https://dev---ipcheck-xxxxxxxxxx-an.a.run.app
```

タグ付きリビジョンの URL（`https://dev---...`）にアクセスして動作確認。

#### 方法2: トラフィック分割を使用

本番トラフィックの一部を新しいリビジョンにルーティングしてテスト。

```bash
# 90%を既存リビジョン、10%を新しいリビジョンにルーティング
gcloud run services update-traffic {サービス名} \
    --region={リージョン} \
    --to-revisions={以前のリビジョン名}=90,{新しいリビジョン名}=10
```

### Step 3: 新しいリビジョンにトラフィックを移行

動作確認後、全トラフィックを新しいリビジョンにルーティング：

```bash
gcloud run services update-traffic {サービス名} \
    --region={リージョン} \
    --to-latest \
    --remove-tags=dev
```

> **安全性**: リビジョン切り替え時、切り替え前のリビジョンで処理中のリクエストは処理完了まで破棄されない

### Step 4: サーバーレス VPC アクセスを削除

コネクタインスタンスは使用されていなくても料金が発生するため、忘れずに削除：

```bash
gcloud compute networks vpc-access connectors delete {サーバーレスVPCアクセスの名前} --region={リージョン}
```

## 補足: CLI の意図しない挙動（2024年8月時点）

CLI でサーバーレス VPC アクセスから Direct VPC Egress に切り替える場合の注意点：

```bash
gcloud run services update {サービス名} \
    --clear-vpc-connector \
    --network={接続するVPC} \
    --subnet={接続するサブネット} \
    --region={リージョン} \
    --no-traffic \
    --tag=dev \
    --vpc-egress=all-traffic
```

**問題**: `--vpc-egress=all-traffic` フラグが機能せず、`--vpc-egress=private-ranges-only` の設定でデプロイされてしまうケースがある。

**影響**: Cloud NAT を使用する場合、「すべてのトラフィックを VPC にルーティングする」に設定する必要があるが、意図した設定にならない。

**推奨**: この問題が解消されるまで、**コンソールから切り替えを実施**することを推奨。

## まとめ

| 項目 | 内容 |
|------|------|
| **推奨接続方式** | Direct VPC Egress（コスト・パフォーマンス面で有利） |
| **移行の安全性** | タグ付きリビジョン or トラフィック分割で無停止移行可能 |
| **注意点** | CLI の不具合があるためコンソールでの操作を推奨（2024年8月時点） |
| **移行後の作業** | サーバーレス VPC アクセスのコネクタを削除してコスト削減 |
