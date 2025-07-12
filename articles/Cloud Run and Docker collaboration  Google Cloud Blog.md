---
title: "Cloud RunとDockerの連携 | Google Cloudブログ"
source: "https://cloud.google.com/blog/products/serverless/cloud-run-and-docker-collaboration/?hl=en"
author:
  - "[[Justin Mahood]]"
  - "[[Yunong Xiao]]"
published: 2025-07-10
created: 2025-07-12
description: "Cloud Runは、マルチコンテナおよびAIアプリ向けのDocker Compose仕様をサポートします。"
tags:
  - "clippings"
---
サーバーレス

## ローカルホストから本番環境へ：Cloud RunとDocker ComposeでAIアプリのデプロイを簡素化

2025年7月11日

![https://storage.googleapis.com/gweb-cloudblog-publish/images/cloud_run_docker.max-2500x2500.png](https://storage.googleapis.com/gweb-cloudblog-publish/images/cloud_run_docker.max-2500x2500.png)

##### Justin Mahood

プロダクトマネージャー、Cloud Run

##### Yunong Xiao

エンジニアリングディレクター、Google Cloud

##### Gemini 2.5を試す

最もインテリジェントなモデルがVertex AIで利用可能になりました

[今すぐ試す](https://console.cloud.google.com/vertex-ai/studio/freeform)

Google Cloudでは、次世代のAIおよびエージェントアプリケーションの構築とデプロイを可能な限りシームレスにすることに取り組んでいます。本日、私たちは[Dockerとの協業](https://docker.com/blog/build-ai-agents-with-docker-compose/)を発表できることを大変嬉しく思います。これにより、デプロイワークフローが大幅に簡素化され、洗練されたAIアプリケーションをローカル開発環境から

[Cloud Run](https://cloud.google.com/run)

へ簡単に移行できるようになります。

### compose.yamlを直接Cloud Runにデプロイ

以前は、開発環境とCloud Runのようなマネージドプラットフォームとの間のギャップを埋めるには、インフラストラクチャを手動で変換および設定する必要がありました。MCPサーバーやセルフホストモデルを使用するエージェントアプリケーションは、さらに複雑さを増していました。

オープンソースの[Compose Specification](http://compose-spec.io/)は、開発者がローカル環境で複雑なアプリケーションを反復開発するための最も一般的な方法の1つであり、Docker Composeの基盤となっています。そして今、**gcloud run compose up**がDocker ComposeのシンプルさをCloud Runにもたらし、このプロセス全体を自動化します。現在[プライベートプレビュー](https://forms.gle/XDHCkbGPWWcjx9mk9)で利用可能で、既存の`compose.yaml`ファイルを単一のコマンドでCloud Runにデプロイでき、ソースからのコンテナビルドやデータ永続化のためのCloud Runのボリュームマウントの活用も含まれます。

![https://storage.googleapis.com/gweb-cloudblog-publish/original_images/compose.gif](https://storage.googleapis.com/gweb-cloudblog-publish/original_images/compose.gif)

Cloud RunでCompose Specificationをサポートすることで、ローカルとクラウドのデプロイメント間で簡単な移行が可能になり、同じ構成形式を維持できるため、一貫性が確保され、開発サイクルが加速します。

「私たちは最近、エージェントアプリケーションをサポートするためにDocker Composeを進化させました。そのイノベーションがGPUバックエンド実行のサポートとともにGoogle Cloud Runにまで及ぶことを嬉しく思います。DockerとCloud Runを使用することで、開発者はローカルで反復開発を行い、単一のコマンドでインテリジェントエージェントを本番環境に大規模にデプロイできるようになりました。これは、AIネイティブな開発をアクセスしやすく、構成可能にするための大きな一歩です。私たちは、開発者が次世代のインテリジェントアプリケーションを構築・実行する方法を簡素化するために、Google Cloudとの緊密な協力を継続することを楽しみにしています。」 - Tushar Jain、EVP Engineering and Product、Docker

### Cloud Run、AIアプリケーションの拠点

Compose仕様のサポートは、Cloud Runで見られるAIフレンドリーなイノベーションだけではありません。私たちは最近、[Cloud Run GPUの一般提供](https://cloud.google.com/blog/products/serverless/cloud-run-gpus-are-now-generally-available)を発表し、AIワークロードのためにGPUへのアクセスを望む開発者の参入障壁を大幅に引き下げました。秒単位の課金、ゼロへのスケーリング、迅速なスケーリング（gemma3:4bモデルのtime-to-first-tokenには約19秒かかります）により、Cloud RunはLLMのデプロイと提供のための優れたホスティングソリューションです。

これはまた、Cloud RunをDockerが最近[発表した](https://www.docker.com/blog/docker-mcp-gateway-secure-infrastructure-for-agentic-ai/)OSS MCP GatewayおよびModel Runnerのための強力なソリューションにし、開発者がAIアプリケーションをローカルからクラウドの本番環境にシームレスに移行するのを容易にします。DockerがオープンなCompose Specに最近追加した[‘models’](https://github.com/compose-spec/compose-spec/blob/main/spec.md#models)をサポートすることで、これらの複雑なソリューションを単一のコマンドでクラウドにデプロイできます。

### すべてをまとめる

上記のデモのComposeファイルを確認しましょう。これは、ソースからビルドされ、ストレージボリューム（`volumes`で定義）を活用するマルチコンテナアプリケーション（`services`で定義）で構成されています。また、新しい`models`属性を使用してAIモデルを定義し、Cloud Run拡張機能を使用して使用するランタイムイメージを定義しています。

x

```
name: agent
```

```
services:
```

```
webapp:
```

```
build: .
```

```
ports:
```

```
- "8080:8080"
```

```
volumes:
```

```
- web_images:/assets/images
```

```
depends_on:
```

```
- adk
```

```
​
```

```
adk:
```

```
image: us-central1-docker.pkg.dev/jmahood-demo/adk:latest
```

```
ports:
```

```
- "3000:3000"
```

```
models:
```

```
- ai-model
```

```
​
```

```
models:
```

```
ai-model:
```

```
model: ai/gemma3-qat:4B-Q4_K_M
```

```
x-google-cloudrun:
```

```
inference-endpoint: docker/model-runner:latest-cuda12.2.2
```

```
​
```

```
volumes:
```

```
web_images:
```

### AIの未来を築く

私たちは、オープンスタンダードを採用し、様々なエージェントフレームワークをサポートすることで、開発者に最大限の柔軟性と選択肢を提供することにコミットしています。Cloud RunとDockerに関するこの協業は、開発者がインテリジェントなアプリケーションを構築・デプロイするプロセスを簡素化することを目指すもう一つの例です。

Compose Specificationのサポートは、信頼できるユーザー向けに利用可能です — [こちらのプライベートプレビューにサインアップしてください](https://forms.gle/XDHCkbGPWWcjx9mk9)。

##### 関連記事

[![https://storage.googleapis.com/gweb-cloudblog-publish/images/31_-_Serverless_jUYyB2k.max-700x700.jpg](https://storage.googleapis.com/gweb-cloudblog-publish/images/31_-_Serverless_jUYyB2k.max-700x700.jpg)](https://cloud.google.com/blog/products/serverless/exploring-cloud-run-worker-pools-and-kafka-autoscaler)

[サーバーレス](https://cloud.google.com/blog/products/serverless/exploring-cloud-run-worker-pools-and-kafka-autoscaler)

Cloud RunワーカープールでKafkaワークロードのスケーリングを容易にする

Aniruddh Chaturvedi • 6分間の記事

[原文を見る](https://cloud.google.com/blog/products/serverless/exploring-cloud-run-worker-pools-and-kafka-autoscaler)

[![https://storage.googleapis.com/gweb-cloudblog-publish/images/hero_BWYOvBU.max-700x700.png](https://storage.googleapis.com/gweb-cloudblog-publish/images/hero_BWYOvBU.max-700x700.png)](https://cloud.google.com/blog/products/serverless/cloud-run-gpus-are-now-generally-available)

[サーバーレス](https://cloud.google.com/blog/products/serverless/cloud-run-gpus-are-now-generally-available)

Cloud Run GPUが一般提供開始、誰でもAIワークロードの実行が容易に

Steren Giannini • 5分間の記事

[原文を見る](https://cloud.google.com/blog/products/serverless/cloud-run-gpus-are-now-generally-available)

[![https://storage.googleapis.com/gweb-cloudblog-publish/images/pinball.max-700x700.jpg](https://storage.googleapis.com/gweb-cloudblog-publish/images/pinball.max-700x700.jpg)](https://cloud.google.com/blog/products/application-modernization/connecting-a-pinball-machine-to-the-cloud)

[アプリケーションのモダナイゼーション](https://cloud.google.com/blog/products/application-modernization/connecting-a-pinball-machine-to-the-cloud)

驚き：クラシックなピンボールマシンをクラウド接続でモダナイズ

Drew Brown • 5分間の記事

[原文を見る](https://cloud.google.com/blog/products/application-modernization/connecting-a-pinball-machine-to-the-cloud)

[![https://storage.googleapis.com/gweb-cloudblog-publish/images/03_-_Application_Development_SWHuGHU.max-700x700.jpg](https://storage.googleapis.com/gweb-cloudblog-publish/images/03_-_Application_Development_SWHuGHU.max-700x700.jpg)](https://cloud.google.com/blog/products/application-development/run-your-ai-inference-applications-on-cloud-run-with-nvidia-gpus)

[アプリケーション開発](https://cloud.google.com/blog/products/application-development/run-your-ai-inference-applications-on-cloud-run-with-nvidia-gpus)

NVIDIA GPUを搭載したCloud RunでAI推論アプリケーションを実行する

Sagar Randive • 8分間の記事

[原文を見る](https://cloud.google.com/blog/products/application-development/run-your-ai-inference-applications-on-cloud-run-with-nvidia-gpus)
