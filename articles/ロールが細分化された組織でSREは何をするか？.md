---
title: "ロールが細分化された組織でSREは何をするか？"
source: "https://speakerdeck.com/tgidgd/rorugaxi-fen-hua-saretazu-zhi-desrehahe-wosuruka"
author:
  - "norimichi.osanai"
published: 2025-07-12
created: 2025-08-13
description: |
  KINTOテクノロジーズにおける、ロールが細分化された組織でのSREの役割と取り組みについての発表。Observabilityの向上、サービスレベル導入の挑戦、そしてプロアクティブな改善を促進する自社ツールの開発を通じて、SREチームがどのように価値を提供しようとしているかを解説しています。
tags:
  - "SRE"
  - "Observability"
  - "PlatformEngineering"
  - "NewRelic"
  - "SLO"
---

## 概要

2025年7月11-12日に開催された「SRE NEXT 2025」の登壇資料。KINTOテクノロジーズにおける、ロールが細分化された組織でのSREの役割と取り組みについて解説。

---

## 発表者

![Avatar for norimichi.osanai](https://speakerdeck.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MzMyMzQ5LCJwdXIiOiJibG9iX2lkIn19--3e6d167e1fef47759be134af2b7e3f5170df8465/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGVnIiwicmVzaXplX3RvX2ZpbGwiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--08c3a979aa69152cfff41d510342ae947ea38c97/IMG_6461.jpeg)

- **氏名**: 長内 則倫 (おさない のりみち)
- **所属**: KINTOテクノロジーズ株式会社 プラットフォーム開発部 DBRE G SREチーム TL
- **経歴**: 2020年5月に株式会社KINTOに入社。2021年1月よりSREを担当。

---

## 1. 会社紹介と組織構成

### KINTOテクノロジーズ株式会社(KTC)

- トヨタファイナンシャルサービス株式会社（TFS）の子会社として2021年4月に設立。
- 世界40以上の国と地域でサービスを展開。

### 提供プロダクト

![KINTOのサービス](https://files.speakerdeck.com/presentations/81592ef49d224abd81cafb81100c57d1/slide_5.jpg)

- **KINTO ONE**: 月々定額の車のサブスクリプションサービス。
- **KINTO FACTORY**: 愛車のカスタム・機能向上サービス。
- **KINTO ONE (中古車)**: 中古車のサブスクリプションサービス。
- **KINTO UNLIMITED**: アップグレードし続ける特別な車のサブスク。

### KTCにおけるSREの立ち位置

![KTCの組織図](https://files.speakerdeck.com/presentations/81592ef49d224abd81cafb81100c57d1/slide_6.jpg)

- **エンジニア組織**: 約30グループ、約380名。
- **SREチーム**: 2名体制で、DBRE(6名)と共にプラットフォーム開発部に所属。
- **横断組織**: QA, Cloud Infrastructure, Platform Engineering, MSP, Security, CCoEなどが存在。

---

## 2. SREのプラクティスを考える

![SREのプラクティス](https://files.speakerdeck.com/presentations/81592ef49d224abd81cafb81100c57d1/slide_8.jpg)

- **一般的なSREの業務**: インフラ構築・運用、インシデント対応、パフォーマンスチューニング、監視運用、CI/CD、セキュリティ、品質保証など。
- **KTCの課題**: これらの業務の多くは専門チームが担当しており、SREチームが価値を提供できるテーマが少ないのではないかという懸念があった。

![専門チームとの重複](https://files.speakerdeck.com/presentations/81592ef49d224abd81cafb81100c57d1/slide_10.jpg)

---

## 3. SREチームの取り組みの変遷

### 溝を埋める活動

- 当初は横断組織のツールが開発組織に浸透していない課題に対し、個別最適なサポートを実施。
- しかし、「困っている人を見つけて伴走する」やり方は再現性が低く、コアバリューとは言えないと判断。

### Mission/Visionの策定

![Mission/Vision](https://files.speakerdeck.com/presentations/81592ef49d224abd81cafb81100c57d1/slide_15.jpg)

- **Mission**: 信頼性の高い価値あるプロダクトを最速で提供できるようにする。
- **Vision**: サービスレベルに基づいた開発と運用のバランスが取れた組織の実現。

### Observabilityの向上

- **以前**: ログ(OpenSearch)、トレース(X-Ray)、メトリクス(Prometheus, Grafana)が分散し、活用されていなかった。
- **現在 (2024年4月〜)**: **New Relic**を導入し、ログ・トレース・メトリクスを集約。学習コストの低さからSREが導入を推進。

### New Relic活用の推進

1. **ドキュメント整備**: KTCの技術スタックに合わせた導入方法や活用事例を共有。
2. **アラート移行**: OpenSearchからNew Relicへアラートを移行し、IaC化を推進。
3. **リクエスト解析ツールの作成**: Slack上でトレースIDからリクエスト情報を要約する「New Relic Analyzer」を開発。
    ![New Relic Analyzer](https://files.speakerdeck.com/presentations/81592ef49d224abd81cafb81100c57d1/slide_23.jpg)
4. **メトリクスを見る習慣付け**: KINTO ONEチームと定例会を実施し、ダッシュボードを日常的に確認する文化を醸成。結果、プロアクティブな改善が始まった。

---

## 4. サービスレベルの導入

### 導入の難しさ

1. **サービスレベルの妥当性が不明**:
    - 車のサブスクでは、レスポンスタイムと収益の相関がECサイトほど明確ではない。
    - Core Web Vitalsの改善は行うが、どこまでやるかの納得感ある基準値設定が困難。

2. **運用をどう変えるかが不明**:
    - 試しに設定したエラー率SLOは「99.999%」となり、現状の「全エラー調査」運用がそのまま反映されてしまった。
    - 一方、レスポンスタイムについては、改善の判断基準として客観的な数値を設けることに可能性を感じた。

---

## 5. 改善ツールの作成

- **目的**: プロアクティブな改善サイクルを、属人性を排除し横断的に展開する。
- **ツール概要**:
  - 定期的にNew Relicのデータを分析。
  - 改善が必要なエンドポイントを特定。
  - 改善案をSlackで通知。
  - Jiraチケットを自動作成。

![改善ツールのフロー](https://files.speakerdeck.com/presentations/81592ef49d224abd81cafb81100c57d1/slide_32.jpg)

### 課題と展望

- **課題**:
  - 「どこまで改善させるか」というゴール設定の問題。
  - 提案内容の精度向上。
- **展望**:
  - 一定の閾値をベースに提案することで、暗黙的にサービスレベルを守る状態を作れるのではないか。
  - GitHubリポジトリと連携し、コードに基づいた具体的な改善案を生成することを目指す。

---

## 6. まとめ

![まとめ](https://files.speakerdeck.com/presentations/81592ef49d224abd81cafb81100c57d1/slide_40.jpg)

- ロールが細分化されたKTCでは、SREが価値を出せるテーマが少ない。
- Observabilityの向上とデータに基づく改善文化の推進から着手。
- サービスレベル導入は妥当性や運用の壁に直面。
- 現在は、改善ツールを通じて、自然と一定のサービスレベルを満たせる仕組みを模索中。

---

![We are hiring!](https://files.speakerdeck.com/presentations/81592ef49d224abd81cafb81100c57d1/slide_41.jpg)

![Thank you!](https://files.speakerdeck.com/presentations/81592ef49d224abd81cafb81100c57d1/slide_42.jpg)
