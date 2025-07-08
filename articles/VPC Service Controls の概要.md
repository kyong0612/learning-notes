---
title: "VPC Service Controls の概要"
source: "https://cloud.google.com/vpc-service-controls/docs/overview?hl=ja"
author:
  - "[[Google Cloud]]"
published: 2025-04-28
created: 2025-07-08
description: |
  このトピックでは、VPC Service Controls の概要と、そのメリット、機能について説明します。
tags:
  - "clippings"
  - "Google Cloud"
  - "VPC Service Controls"
  - "Security"
  - "Network"
  - "Data Exfiltration"
---

VPC Service Controls は、Google Cloudサービスにおけるデータ漏洩のリスクを最小限に抑えるための機能です。意図しないデータの損失や開示を防ぐために、サービスリソースとデータを保護する「サービス境界」を作成します。

## 対象ユーザー

VPC Service Controlsは、知的財産や個人情報など機密性の高いデータを扱う組織、またはPCI DSSのようなデータ保護規制の対象となる組織にとって特に重要です。オンプレミスのネットワークベースのセキュリティをクラウド環境で再現し、信頼できるネットワークからのみリソースにアクセスできるようにします。

## データ漏洩リスクの軽減方法

VPC Service Controlsは、以下の方法でデータ漏洩のリスクを軽減します。

* **サービス境界の作成**: 指定したサービスのリソースとデータを保護する仮想的な境界を設けます。
* **プライベートアクセスの強制**: 境界内のリソースへのアクセスは、承認されたプライベートネットワークからのみ許可されます。
* **データコピーの制限**: `gcloud storage cp` や `bq mk` のようなコマンドで、境界外の不正なリソースにデータをコピーすることを防ぎます。
* **データ交換の保護**: 上り（内向き）ルールと下り（外向き）ルールを使用して、境界を越える安全なデータ交換を定義します。
* **コンテキストアウェアアクセス**: IDタイプ（サービスアカウント、ユーザー）、IPアドレス、VPCネットワーク、デバイス情報などのクライアント属性に基づいて、リソースへのアクセスをきめ細かく制御します。

VPC Service ControlsはIAMと連携して多層的な防御を提供します。IAMがIDベースのアクセス制御を提供するのに対し、VPC Service Controlsはコンテキストベースの境界セキュリティを追加します。

## セキュリティ上の利点

* **不正アクセスからの保護**: 盗まれた認証情報が使用された場合でも、承認されていないネットワークからのアクセスをブロックします。
* **内部からのデータ漏洩防止**: 悪意のある内部関係者やマルウェアが、境界外のリソースにデータを送信することを防ぎます。
* **IAMポリシーの誤設定対策**: IAMポリシーが誤って緩く設定されてしまった場合でも、追加のセキュリティ層として機能します。
* **アクセスのモニタリング**: ドライランモードを使用して、実際にアクセスをブロックすることなく、境界ポリシーの影響をテストし、アクセスパターンを監視できます。

## 主な機能

### サービス境界によるリソースの分離

サービス境界は、Google Cloudリソースの周りにセキュリティ境界を構築します。境界内のリソースは自由に通信できますが、境界を越える通信はデフォルトでブロックされます。

![サービス境界の図](https://cloud.google.com/static/vpc-service-controls/images/service_perimeter.png?hl=ja)

### オンプレミスネットワークへの境界拡張

プライベートGoogleアクセスを利用して、オンプレミス環境からVPCネットワークを経由し、境界内のGoogle Cloudリソースへ安全にアクセスできます。これにより、ハイブリッドクラウド環境全体で一貫したセキュリティポリシーを適用できます。

![ハイブリッド環境でのサービス境界](https://cloud.google.com/static/vpc-service-controls/images/service_perimeter_private.png?hl=ja)

### インターネットからのアクセス制御

デフォルトでは、インターネットから境界内のリソースへのアクセスは拒否されます。必要に応じて、送信元IPアドレス、ID、デバイスなどの条件に基づいたアクセスレベルや上り（内向き）ルールを作成し、特定のコンテキストでのみアクセスを許可できます。

![インターネットからのアクセス制御](https://cloud.google.com/static/vpc-service-controls/images/service_perimeter_internet.png?hl=ja)

## サポートされていないサービスと制限事項

VPC Service Controlsは全てのGoogle Cloudサービスをサポートしているわけではありません。サポートされていないサービスを境界内で有効にすると、予期せぬ問題が発生する可能性があります。サービスを境界に含める前に、[サポートされているプロダクトのリスト](https://cloud.google.com/vpc-service-controls/docs/supported-products?hl=ja)と[既知の制限事項](https://cloud.google.com/vpc-service-controls/docs/supported-products?hl=ja#service-limitations)を確認することが重要です。

## 用語集

* **VPC Service Controls**: Google Cloudリソースの周りにサービス境界を定義し、通信を制御する技術。
* **サービス境界**: リソースの周りの仮想的な境界。境界内の通信は自由ですが、境界を越える通信はブロックされます。
* **上り（内向き）ルール**: 境界外のクライアントが境界内のリソースにアクセスすることを許可するルール。
* **下り（外向き）ルール**: 境界内のクライアントが境界外のリソースにアクセスすることを許可するルール。
* **アクセスレベル**: IPアドレス、デバイス、地域など、リクエストの属性に基づく分類。
* **制限付きVIP**: `restricted.googleapis.com` を介して、VPC Service ControlsでサポートされるAPIへのプライベートなネットワークルートを提供します。
