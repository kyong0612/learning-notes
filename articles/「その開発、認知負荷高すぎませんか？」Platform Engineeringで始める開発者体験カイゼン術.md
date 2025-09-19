---
title: "「その開発、認知負荷高すぎませんか？」Platform Engineeringで始める開発者体験カイゼン術"
source: "https://speakerdeck.com/sansantech/20250917"
author:
  - "[[SansanTech]]"
  - "辻田 美咲"
published: 2025-09-17
created: 2025-09-19
description: |
  開発者の認知負荷は、静かにビジネスを蝕む。本資料では、Platform Engineeringを通じて開発者体験を改善する具体的なアプローチを解説します。完璧なプラットフォームを目指すのではなく、開発者と対話し「共創」するプロセスを通じて、身近な「痛み」を解消する小さな一歩から始める重要性を説きます。
tags:
  - "clippings"
  - "PlatformEngineering"
  - "DeveloperExperience"
  - "CognitiveLoad"
  - "DevOps"
---

## 概要

本資料は、Sansan株式会社の辻田美咲氏による、Platform Engineering を通じて開発者の認知負荷を軽減し、開発者体験（DX）を向上させるための具体的な取り組みについての発表です。開発現場が抱える「痛み」から始まり、プラットフォーム「Orbit」の構築、開発チームとの「共創」のプロセス、そして得られた成果と今後の課題までを詳述しています。

## 1. 開発現場が抱えていた「痛み」

![slide_4.jpg](https://files.speakerdeck.com/presentations/102f309d1b2444fc9b1a149e8be7bd00/slide_4.jpg)

### 認知負荷が引き起こす問題

高い認知負荷は、開発者の本来の価値創造（顧客への価値提供）を妨げ、以下のような問題を引き起こします。

* **開発速度の低下**: 本質的でないタスクに時間が割かれる。
* **品質の低下**: 複雑さによるミスが増加する。
* **イノベーションの停滞**: 新しい挑戦への余力がなくなる。

結果として、ビジネススピードが鈍化してしまいます。

![slide_6.jpg](https://files.speakerdeck.com/presentations/102f309d1b2444fc9b1a149e8be7bd00/slide_6.jpg)

### 具体的な課題

現場では、以下のような具体的な課題が存在していました。

* Terraform と実環境の不一致
* CI/CD パイプラインの属人化
* ダッシュボード管理不足
* セキュリティ・コストへの意識不足

## 2. Platform Engineering 実践ジャーニー

これらの課題を解決するため、「開発者の認知負荷を下げ、開発者体験（DX）を向上させる」ことを目的に Platform Engineering の取り組みを開始しました。

### プラットフォーム「Orbit」の誕生

開発者の「痛み」を取り除くため、ニーズに沿った最薄のプラットフォーム（Thinnest Viable Platform - TVP）として「Orbit」を開発しました。

![slide_9.jpg](https://files.speakerdeck.com/presentations/102f309d1b2444fc9b1a149e8be7bd00/slide_9.jpg)

### 技術による課題解決：ゴールデンパスの提供

#### 抽象化と自動化

* **Helm × Terraform Module**: 数百行のHCLを10行程度のModule呼び出しに抽象化し、複雑さを隠蔽。
* **CLIによる自動生成**: `orbit cli` を実行するだけで、k8s manifest や Terraform ファイルを自動生成。

![slide_13.jpg](https://files.speakerdeck.com/presentations/102f309d1b2444fc9b1a149e8be7bd00/slide_13.jpg)

#### CI/CDパイプラインのテンプレート化

* **GitHub Actions**: `copier` を活用したテンプレートと Reusable Workflows を提供。
* **Argo CD**: GitOps を実現し、差分表示などで透明性を確保。

#### ガードレールによる信頼性と安全性の確保

* **ポリシーチェック**: Conftest によるポリシーチェックや Kubescape による脆弱性スキャンを CI に組み込み、「守るべきこと」を仕組み化。

#### ダッシュボードとコスト管理

* **GKEダッシュボードの共有**: Metrics Scope を利用して開発チームに公開。
* **コスト削減**: 検証環境でのSpotインスタンス活用や夜間・休日の自動停止、namespace単位でのコスト按分を実施。

### 開発チームとの共創

Platform Team は「内製プロダクトチーム」であり、開発チームは「ユーザーでありパートナー」というマインドセットで、以下の取り組みを実施しました。

* **外部協力の活用**: Google Cloud の専門家と共にワークショップ（Platform Engineering Jump Start）に参加し、ベストプラクティスを迅速にキャッチアップ。
* **チーム間の協働**: ペアプロや定例会、Office Hours を通じて、問題の早期解決と信頼関係を構築。

![slide_22.jpg](https://files.speakerdeck.com/presentations/102f309d1b2444fc9b1a149e8be7bd00/slide_22.jpg)

## 3. 得られた成果と次なる学び

### 定量的な成果

* **デプロイ頻度**: **111%** 増加
* **リードタイム**: **41%** 短縮

![slide_29.jpg](https://files.speakerdeck.com/presentations/102f309d1b2444fc9b1a149e8be7bd00/slide_29.jpg)

### 開発者の声

* 「アプリの構築からデプロイまでが本当に高速道路でした」
* 「環境固有の専用処理がなく認知負荷の軽減につながっています」

### うまくいかなかったことと今後の課題

* **ゴールデンパスのジレンマ**: 共通化と自由度のバランス。
* **新たなボトルネック化**: プラットフォームチームへの問い合わせ増加。
* **ドキュメントの陳腐化**: 手動更新の限界。
* **想定外のコスト増加**: 共通リソース（Monitoring, Networking）のコスト管理。

これらの課題に対し、ビジョンを言語化し、長期的な方向性を定めることで向き合っています。

## 4. 明日から始めるためのヒント

* **基盤作りだけがPlatform Engineeringではない**: ドキュメント整備、CI/CDテンプレート作成、共通ライブラリ開発など、始め方は様々。まずは「開発者のペインは何か？」を問い続けることが重要。
* **社内外の専門家を巻き込む**: すべてを自前で解決しようとせず、客観的な視点や知見を取り入れることで成功確率を高める。

## まとめ

* 開発者の認知負荷は静かにビジネスを蝕むため、まずは課題を可視化することが重要。
* 完璧なプラットフォームを目指すのではなく、開発者と対話し「共創」するプロセスそのものが価値を生む。
* 身近な「痛み」を解消する小さな一歩から始めることが大切である。

![slide_36.jpg](https://files.speakerdeck.com/presentations/102f309d1b2444fc9b1a149e8be7bd00/slide_36.jpg)
