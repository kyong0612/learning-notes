---
title: "Cloud Run Worker Poolsを使ってみた"
source: "https://blog.g-gen.co.jp/entry/using-cloud-run-worker-pools"
author:
  - "佐々木 駿太"
published: 2025-06-24
created: 2025-07-05
description: |
  Cloud Runの新しいPullベース実行モデルであるWorker Poolsを紹介し、Pub/Subからのメッセージを処理する具体的な使用例を通して、その設定方法と動作を解説する記事。
tags:
  - "Cloud Run"
  - "Google Cloud"
  - "Google Cloud Next '25"
  - "速報記事"
---

この記事では、Cloud Runの新しい実行モデルである **Cloud Run Worker Pools** の概要と、Pub/Subと連携させた具体的な使用方法について解説します。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/g/ggen-sugimura/20250624/20250624083139.png)

> **注意**: 当記事の内容は、2025年6月26日時点のパブリックプレビュー版のサービスに関するものであり、一般提供（GA）の際に変更される可能性があります。

## Cloud Run Worker Poolsとは

**Cloud Run Worker Pools**は、Google Cloud Next '25で発表されたCloud Runの新たな実行モデルです。従来のHTTPリクエスト駆動（Pushベース）とは異なり、タスクやメッセージを能動的に取得する**Pullベース**のモデルを採用しています。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/g/ggen-sugimura/20250626/20250626230451.png)
*Cloud Run Worker Pools の実行モデル*

### 想定ユースケース

このPullベースモデルにより、以下のようなユースケースがサーバーレスで実現可能になります。

- Pub/Subのpullサブスクリプションからのメッセージ処理
- Kafkaキューからのタスク処理
- GitHub ActionsのRunnerホスティング

これにより、従来はGKEクラスタでワーカーを管理していたような処理も、サーバーレスのメリットを享受しつつ実装できます。

## 実践: Pub/Subと連携するWorker Poolの作成

本記事では、Pub/SubトピックからメッセージをPullして処理するWorker Poolを構築する手順を解説します。

### 1. Pub/Subの作成

まず、gcloud CLIを使用してPub/Subのトピックとpullサブスクリプションを作成します。

```sh
# Pub/Sub トピックの作成
$ gcloud pubsub topics create worker-pools-topic

# Pub/Sub サブスクリプションの作成
$ gcloud pubsub subscriptions create worker-pools-sub --topic=worker-pools-topic
```

### 2. コンテナの準備

#### 使用するコード (Go)

Pub/SubのStreaming Pull APIを使用してメッセージを継続的に取得し、ログに出力するGoアプリケーションを作成します。

```go
package main

import (
    "context"
    "fmt"
    "io"
    "log"
    "os"

    "cloud.google.com/go/pubsub" // Pub/Sub クライアントライブラリ
)

// メッセージを StreamingPull する関数
func pullMessages(w io.Writer, c context.Context, projectId, subId string) error {

    // Pub/Sub Client
    client, err := pubsub.NewClient(c, projectId)
    if err != nil {
        return fmt.Errorf("pubsub.NewClient: %v", err)
    }
    defer client.Close()

    // サブスクリプションの参照
    sub := client.Subscription(subId)

    // メッセージを Pull し続ける
    err = sub.Receive(c, func(_ context.Context, msg *pubsub.Message) {
        fmt.Fprintf(w, "%v\n", string(msg.Data)) // メッセージを標準出力に出力
        msg.Ack()
    })
    if err != nil {
        return fmt.Errorf("sub.Receive: %v", err)
    }

    return nil
}

func main() {
    ctx := context.Background()

    // 環境変数からプロジェクト ID と PubSub トピック ID を取得
    projectId := os.Getenv("PROJECT_ID")
    subId := os.Getenv("SUBSCRIPTION_ID")

    err := pullMessages(os.Stdout, ctx, projectId, subId)
    if err != nil {
        log.Fatal(err)
    }
}
```

#### コンテナイメージの作成

Dockerfileを使用せず、Cloud BuildのBuildpack機能でコンテナイメージをビルドします。

```sh
# Cloud Build で Buildpack を使用してコンテナイメージをビルド
$ gcloud builds submit --pack image=<Artifact Registory のパス>
```

### 3. Cloud Run Worker Poolsのデプロイ

ベータ版のgcloudコマンドを使い、Worker Poolをデプロイします。

```sh
# Cloud Run Worker Pools のデプロイ
$ gcloud beta run worker-pools deploy hello-worker-pools \
    --region=asia-northeast1 \
    --image=<Artifact Registory のパス> \
    --set-env-vars=PROJECT_ID=<Pub/Subがあるプロジェクト ID>,SUBSCRIPTION_ID=worker-pools-sub \
    --scaling=3
```

**重要なポイント:**

- `--scaling`: Worker Poolsは現在、手動スケーリングのみをサポートしており、ここで起動インスタンス数を指定します。今回は動作検証のため`3`に設定します。

### 4. コンソールでの確認

デプロイ後、Google Cloudコンソールからサービスの状態を確認できます。ただし、プレビュー段階ではCLIでデプロイしたサービスの表示と削除のみが可能です。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/g/ggen-sugimura/20250624/20250624090737.png)
*Cloud Run Worker Pools の詳細画面*

### 5. 動作確認

Pub/Subコンソールからテストメッセージを送信し、Worker Poolが正常に動作するか確認します。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/g/ggen-sugimura/20250624/20250624090731.png)
*トピックへのメッセージ発行*

ログを確認すると、Worker Poolがメッセージを能動的にPullしていることがわかります。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/g/ggen-sugimura/20250624/20250624090727.png)
*Cloud Run Worker Pools のログ*

さらに、ログエクスプローラで`label.instanceId`フィールドを確認することで、3つのコンテナインスタンス間でメッセージが分散処理されていることが確認できました。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/g/ggen-sugimura/20250624/20250624090734.png)
*各インスタンスでのメッセージ処理数の確認*

## 結論

Cloud Run Worker Poolsは、サーバーレス環境でPullベースの非同期処理を実装するための強力な選択肢です。特に、Pub/SubやKafkaなどのメッセージキューと連携するワークロードに適しており、これまでGKEなどで管理していたワーカー処理をシンプルに構築できる可能性を秘めています。
