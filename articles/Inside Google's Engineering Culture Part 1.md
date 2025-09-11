---
title: "Inside Google's Engineering Culture: Part 1"
source: "https://newsletter.pragmaticengineer.com/p/google"
author:
  - "Gergely Orosz"
  - "Elin Nilsson"
published: 2025-09-09
created: 2025-09-11
description: "A broad and deep dive in how Google works, from the perspective of SWEs and eng managers. What makes Google special from an engineering point of view, engineering roles, compensation, and more"
tags:
  - "Google"
  - "EngineeringCulture"
  - "CareerPath"
  - "HiringProcess"
  - "Compensation"
---

この記事は、Googleのエンジニアリング文化について、ソフトウェアエンジニア（SWE）やエンジニアリングマネージャーの視点から深く掘り下げたものです。Googleの特異性、エンジニアリングの役割、報酬体系などについて解説しています。約12ヶ月にわたる調査と、25名の現役・元GoogleエンジニアリングリーダーやSWEへのインタビューに基づいています。

この記事（パート1）でカバーされるトピックは以下の通りです。

1. **概要**: Googleの事業規模、収益、エンジニアの数、オフィス所在地、そしてその歴史とミッションについて。
2. **Googleの特異性**: 独自のエンジニアリングスタック、歴史的なオープンさ、多様な製品群など、他社との違いについて。
3. **レベルと役割**: デュアルトラックのキャリアラダー、TLM（Tech Lead Manager）という役割、その他のエンジニアリング関連職種について。
4. **報酬**: 市場トップクラスの報酬体系（基本給、株式、ボーナス）の詳細な例。
5. **採用**: 悪名高いほど難しい面接プロセス、チームマッチングのプロセスについて。

## 1. 概要

Googleは、Google検索、Android、Chrome、Gmailなどを通じて、世界のどの企業よりも多くの人々にリーチしています。現在、世界で最も利益を上げている企業であり、その収益の約75%は広告事業によるものです。

- **非広告事業**: Google Cloud（AWS、Azureに次ぐ3位）、ハードウェア（Pixel, Nestなど）、サブスクリプション（YouTube Premiumなど）も大きな収益源です。
- **将来の事業**: Gemini（AI）、Waymo（自動運転）、Google Fiber（光ファイバー）など、現在は損失を出しているものの将来性のある事業も抱えています。

[![](https://substackcdn.com/image/fetch/$s_!XUp3!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F37d535f4-b7e5-4e75-8936-80e3baf1305e_1436x970.png)](https://substackcdn.com/image/fetch/%24s_%21XUp3%21%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep/https%3A//substack-post-media.s3.amazonaws.com/public/images/37d535f4-b7e5-4e75-8936-80e3baf1305e_1436x970.png)
*Google’s revenue breakdown for 2024*

### 従業員とオフィス

Googleには約183,000人の従業員がおり、そのうち約60,000人がソフトウェアエンジニアと推定され、Big Techの中でも特にエンジニア比率が高いです。世界中に25以上のエンジニアリングオフィスを展開しています。

[![](https://substackcdn.com/image/fetch/$s_!EqPQ!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fde80a8c6-2754-431b-ab28-929837e869f1_1172x872.png)](https://substackcdn.com/image/fetch/%24s_%21EqPQ%21%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep/https%3A//substack-post-media.s3.amazonaws.com/public/images/de80a8c6-2754-431b-ab28-929837e869f1_1172x872.png)
*Google no longer growing as fast as until 2022*

### 歴史、ミッション、価値観

1998年に設立されたGoogleの当初からのミッションは「世界中の情報を整理し、世界中の人がアクセスできて使えるようにすること」です。かつての非公式モットー「Don't be evil」は、2015年に「Do the right thing」に変わりました。

採用プロセスで重視される**「Googleyness」**は、賢く、順応性があり、チームプレイヤーで、一緒にいて楽しいといった性質を指す曖昧な言葉です。

[![](https://substackcdn.com/image/fetch/$s_!WJFO!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2fc9ef5b-a19a-43f5-9fa5-135e644aeb2a_1280x720.png)](https://substackcdn.com/image/fetch/%24s_%21WJFO%21%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep/https%3A//substack-post-media.s3.amazonaws.com/public/images/2fc9ef5b-a19a-43f5-9fa5-135e644aeb2a_1280x720.png)
*Playful and ambitious: Googleyness begins with the famous “Noogler” hat.*

## 2. Googleを特別なものにしている要因

### 単一のGoogleは存在しない

Googleはプロダクトエリア（PA）と呼ばれる独立した組織に分かれていますが、エンジニアリング文化は全社で非常に似通っています。

- **Knowledge and Information**: Google検索など
- **YouTube**: 動画共有サービス
- **Cloud**: GCPとWorkspace
- **Ads and Monetization**: 広告製品
- **Platforms and Devices**: Android, Chrome, Pixelなど

### 一つのエンジニアリング文化

PAやチームは独立して動きますが、ツール、プロセス、技術スタックはほぼ全社で統一されています。これにより、チーム間の異動が容易になっています。

### 独自のエンジニアリングスタック

Googleは、他社が同様の規模に達する10年以上前から、惑星規模のスケーリング問題に取り組む必要があったため、独自のシステムを構築しました。

- **Borg**: Kubernetesの前身
- **Monarch**: Datadogのような監視システム
- **Piper**: GitHubのようなソース管理システム

このため、Googleは業界標準のツールを採用することが難しく、独自の「**テックアイランド**」を形成しています。これは新規採用者にとって急な学習曲線を意味します。

### 初期からの独自システム構築

創業当初から、Googleは高価なメインフレームに頼るのではなく、安価なコモディティハードウェアを何万台も使用してクラスターを構築するという、当時としては革新的なアプローチを取りました。

[![](https://substackcdn.com/image/fetch/$s_!uslE!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa9f76bd3-9414-480b-bc12-b8feed95d553_900x488.png)](https://substackcdn.com/image/fetch/%24s_%21uslE%21%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep/https%3A//substack-post-media.s3.amazonaws.com/public/images/a9f76bd3-9414-480b-bc12-b8feed95d553_900x488.png)
*Google datacenter campus topology.*

### 異例のオープンさ

Googleは歴史的に、内部情報へのアクセスや外部への論文公開（例：LLMの基礎となった「Attention is All You Need」）において、他のBig Tech企業よりも非常にオープンでした。しかし、この傾向は2020年頃から変化しています。

### 事業の多様性

Googleは検索エンジン、OS、ブラウザ、ハードウェア、クラウド、エンタープライズツールなど、非常に多岐にわたる製品を開発しており、Microsoftに似ています。これにより、エンジニアは全く異なる分野のチームへ異動する機会があります。

[![](https://substackcdn.com/image/fetch/$s_!4d-s!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fba0338d5-116e-419a-a70a-456acf4186ef_1600x1157.png)](https://substackcdn.com/image/fetch/%24s_%214d-s%21%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep/https%3A//substack-post-media.s3.amazonaws.com/public/images/ba0338d5-116e-419a-a70a-456acf4186ef_1600x1157.png)
*Google has more than 120 actively developed products*

## 3. レベルと役割

Googleには、ソフトウェアエンジニア（IC）とエンジニアリングマネージャーのためのデュアルトラックキャリアラダーがあります。また、Tech Lead Manager (TLM) という興味深い役割も存在します。これにより、エンジニアはマネジメント職に就かなくても、マネージャーやディレクターと同様の報酬を得ることが可能です。
(元記事は有料購読者向けコンテンツのため、ここで途切れています)
