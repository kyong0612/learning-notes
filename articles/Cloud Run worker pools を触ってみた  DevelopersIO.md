---
title: "Cloud Run worker pools を触ってみた | DevelopersIO"
source: "https://dev.classmethod.jp/articles/google-cloud-run-worker-pools/"
author:
  - "hanzawa.yuya"
published: 2025-07-14
created: 2025-07-14
description: |
  Cloud Runの新しい実行モデルである`worker pools`の概要を紹介し、Pub/Subと連携させてデプロイ・動作確認する手順を解説します。常駐型バックグラウンド処理に適したこの新機能の特徴と利点がまとめられています。
tags:
  - "Google Cloud"
  - "Cloud Run"
  - "Pub/Sub"
---

## 概要

[Cloud Run worker pools](https://cloud.google.com/run/docs/deploy-worker-pools) は、Cloud Run の services, jobs, functions に続く第4の実行モデルです。長時間稼働する「常駐型」のバックグラウンド処理に特化しており、以下のような特徴があります。

* **エンドポイント/URLを持たない**: 外部からの直接リクエストは受け付けません。
* **自動スケーリングなし**: インスタンス数は手動で固定します。
* **ユースケース**: コンテナ自身が外部のキュー（Pub/Subなど）からタスクを取得して処理するような用途に適しています。

## デプロイ手順

### 1. 必要なリソースの作成

Pub/Sub トピック、サブスクリプション、Cloud Storage バケットを作成します。

```shell
# Pub/Subトピック
gcloud pubsub topics create worker-pools

# Pub/Subサブスクリプション
gcloud pubsub subscriptions create worker-pools-sub --topic=worker-pools

# Cloud Storageバケット
gcloud storage buckets create gs://cm-hanzawa-yuya-worker-pools \
    --location='asia-northeast1' \
    --uniform-bucket-level-access
```

### 2. 実行スクリプトの作成 (`main.py`)

Pub/Sub からメッセージを継続的にプルし、受信したメッセージを Cloud Storage にテキストファイルとしてアップロードする Python スクリプトです。

```python
import os
import sys
from datetime import datetime
from google.cloud import pubsub_v1
from google.cloud import storage

def upload_to_storage(bucket_name, message_text):
    """メッセージをCloud Storageにアップロードする関数"""
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
    filename = f"message_{timestamp}.txt"
    blob = bucket.blob(filename)
    blob.upload_from_string(message_text, content_type="text/plain; charset=utf-8")
    print(f"Message saved to gs://{bucket_name}/{filename}")

def pull_messages(project_id, subscription_id, bucket_name):
    """メッセージを StreamingPull する関数"""
    subscriber = pubsub_v1.SubscriberClient()
    subscription_path = subscriber.subscription_path(project_id, subscription_id)

    def callback(message):
        try:
            message_text = message.data.decode("utf-8")
            print(f"Received message: {message_text}")
            upload_to_storage(bucket_name, message_text)
            message.ack()
        except Exception as e:
            print(f"Error processing message: {e}")
            message.nack()

    streaming_pull_future = subscriber.subscribe(subscription_path, callback=callback)
    print(f"Listening for messages on subscriptions/{subscription_id}...")
    try:
        streaming_pull_future.result()
    except Exception as e:
        streaming_pull_future.cancel()
        print(f"Stopped listening for messages due to error: {e}")
        raise

def main():
    project_id = os.getenv("PROJECT_ID")
    subscription_id = os.getenv("SUBSCRIPTION_ID")
    bucket_name = os.getenv("BUCKET_NAME")

    if None in [project_id, subscription_id, bucket_name]:
        print("Error: Environment variables are required")
        sys.exit(1)

    try:
        pull_messages(project_id, subscription_id, bucket_name)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
```

### 3. コンテナイメージの作成とデプロイ

[Buildpacks](https://dev.classmethod.jp/articles/google-cloud-buildpacks/) を使用してコンテナイメージをビルドし、Artifact Registry に push した後、worker pool をデプロイします。

```shell
# Artifact Registry リポジトリ作成
gcloud artifacts repositories create python-images \
    --repository-format docker \
    --location asia-northeast1

# コンテナイメージのビルドとPush
gcloud builds submit --pack image=asia-northeast1-docker.pkg.dev/<PROJECT_ID>/python-images/worker-pools

# worker pool のデプロイ
gcloud beta run worker-pools deploy worker-pools-test \
    --region=asia-northeast1 \
    --image=asia-northeast1-docker.pkg.dev/<PROJECT_ID>/python-images/worker-pools:latest \
    --env-vars-file=.local.env
```

デプロイ後、Cloud Console で worker pool が正常に作成されたことを確認できます。

![Cloud Consoleでのデプロイ確認](https://devio2024-media.developers.io/image/upload/v1752138480/2025/07/10/hk2r9ivn7ymnwwvht5cy.png)

## 動作確認

Pub/Sub トピックにメッセージをパブリッシュして動作をテストします。

![Pub/Subへのメッセージ発行](https://devio2024-media.developers.io/image/upload/v1752138831/2025/07/10/cy64xirhp3wiodzn7tft.png)

worker pool のログでメッセージ受信と GCS へのアップロードが確認できます。

![ログの確認](https://devio2024-media.developers.io/image/upload/v1752139038/2025/07/10/htjxk6huvlgjerhpizqb.png)

## 料金

`worker pools` は、他の Cloud Run モデル（services, jobs）と比較して、CPU とメモリの料金単価が低く設定されており、常駐型の処理をコスト効率よく実行できます。

| | CPU（相対比） | メモリ（相対比） |
| :--- | :--- | :--- |
| **Cloud Run services** | 0.47 | 0.49 |
| **Cloud Run jobs** | 0.62 | 0.62 |
*(worker pools の単価 / 各モデルの単価)*

## まとめ

Cloud Run worker pools は、常駐型のバックグラウンド処理に特化した、コスト効率の高い新しい実行モデルです。外部からのリクエストを受けず、自らタスクを取得しにいくユースケース（キュー処理など）において強力な選択肢となります。
