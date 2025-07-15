---
title: "高機能なAIエージェントを爆速で作る方法"
source: "https://speakerdeck.com/kmd09/gao-ji-neng-naaiezientowobao-su-dezuo-rufang-fa"
author:
  - "[[Mizuki Kameda]]"
published: 2025-06-03
created: 2025-07-15
description: |
  Cloudflare Workers Tech Talks in Tokyo #5 で発表された、MastraとCloudflare Workersを組み合わせた高機能AIエージェントの開発手法に関するスライド。
tags:
  - "clippings"
  - "AI"
  - "Agent"
  - "Mastra"
  - "Cloudflare Workers"
  - "Serverless"
---

このスライドは、AIエージェントフレームワーク「Mastra」とサーバーレスプラットフォーム「Cloudflare Workers」を組み合わせることで、高機能なAIエージェントを迅速に開発し、デプロイする方法について解説しています。

## 伝えたいこと

![伝えたいこと](https://files.speakerdeck.com/presentations/09858e1ca19f42e2a6120d8f746900ec/slide_2.jpg)

MastraとCloudflareの組み合わせは最高であり、これによりリモートでAIエージェントを簡単に作成できるという点が強調されています。

## Mastra: AIエージェントフレームワーク

![Mastra](https://files.speakerdeck.com/presentations/09858e1ca19f42e2a6120d8f746900ec/slide_4.jpg)

- HonoベースのOSS AIエージェント/ワークフローフレームワーク
- RAG、Memory、Voiceなどの機能が標準で組み込まれている（Battery Included）
- OpenAPI、Swagger UI、OpenTelemetryなど、本番運用で必要となる機能が網羅されている
- MCP、A2A、AG-UIなどのプロトコルをサポート

## AIエージェント開発の課題

![AIエージェント開発あるある](https://files.speakerdeck.com/presentations/09858e1ca19f42e2a6120d8f746900ec/slide_6.jpg)

ローカルでの開発は順調でも、インフラへのデプロイ段階で問題が発生しがちです。

### リモート実行の問題点

![リモート実行の問題点](https://files.speakerdeck.com/presentations/09858e1ca19f42e2a6120d8f746900ec/slide_7.jpg)

- **インフラ構築・運用の手間**: ECSやCloud Runなどのコンテナ基盤の管理が大変。
- **多くの依存関係**: VectorDB, LLM, DBなど、管理対象が多い。
- **コストとリスク**: 運用が簡単なサービスは高コストであったり、ロックインのリスクが大きい。

## 解決策: Cloudflare Workers

![Cloudflare Workers](https://files.speakerdeck.com/presentations/09858e1ca19f42e2a6120d8f746900ec/slide_8.jpg)

これらの問題を解決するのが、Cloudflare Workersとそのエコシステムです。

### Cloudflareを選ぶ理由

![Cloudflareを選ぶ理由](https://files.speakerdeck.com/presentations/09858e1ca19f42e2a6120d8f746900ec/slide_9.jpg)

1. **AIエージェントに適したインフラ特性**
2. **Mastraのほぼ全ての外部依存に対応**
3. **超簡単なデプロイ**

#### 1. Agentに合った特性

![Agentに合った特性](https://files.speakerdeck.com/presentations/09858e1ca19f42e2a6120d8f746900ec/slide_10.jpg)

- **0msコールドスタート**: 瞬時に起動。
- **CPU実行時間とリクエスト数ベースの課金**: サブリクエストの待機時間はCPU実行時間に含まれないため、効率的。
- **高いスケーラビリティ**

#### 2. 外部依存への対応

![外部依存への対応](https://files.speakerdeck.com/presentations/09858e1ca19f42e2a6120d8f746900ec/slide_11.jpg)

Cloudflareの各種サービス（Workers AI, Vectorize, D1, R2, Queuesなど）が、Mastraが必要とする外部依存の大部分をカバーしています。

#### 3. 超簡単なデプロイ

![超簡単なデプロイ](https://files.speakerdeck.com/presentations/09858e1ca19f42e2a6120d8f746900ec/slide_13.jpg)

1. `@mastra/deployer-cloudflare` をインストール。
2. Mastraインスタンスで `deployer` を指定。
3. `wrangler deploy` コマンドを実行するだけでデプロイが完了し、URLが発行される。

## 結論

![結論](https://files.speakerdeck.com/presentations/09858e1ca19f42e2a6120d8f746900ec/slide_14.jpg)

最高のフレームワーク（Mastra）と最高のインフラ（Cloudflare）を組み合わせることで大きな相乗効果が生まれ、最高のAIエージェント開発ライフが実現できます。
