---
title: "マルチプロダクト環境におけるSREの役割 / SRE NEXT 2025 lunch session"
source: "https://speakerdeck.com/sugamasao/sre-next-2025-lunch-session"
author:
  - "sugamasao"
published: 2025-07-12
created: 2025-07-15
description: |
  SRE NEXT 2025のランチセッションでの登壇資料。マルチプロダクト環境におけるSRE組織の立ち上げ背景、留意点、そして現状について、SmartHRでの実践知を交えて解説します。
tags:
  - "clippings"
  - "SRE"
  - "Multi-Product"
  - "SLO"
  - "Reliability"
  - "Team-Building"
---

本資料は、SRE NEXT 2025のランチセッションでsugamasao氏が発表した「マルチプロダクト環境におけるSREの役割」についての発表をまとめたものです。SmartHRにおけるSRE組織の立ち上げの背景から、実践で得られた知見、そして現在の状況までを詳細に解説しています。

## 発表の概要

本発表は、以下の3つのテーマで構成されています。

1. **SRE立ち上げの背景**: SmartHRのマルチプロダクト構成と、それに伴うSRE組織設立の経緯。
2. **SRE立ち上げで気をつけたポイント**: SRE経験者がいない中でのチーム作り、外部有識者の活用、インセプションデッキやロードマップを用いた方針決定のプロセス。
3. **SREのいま**: 少人数での改善活動、レバレッジを意識したSLO導入、そして今後の展望。

---

## 1. SRE立ち上げの背景

[![](https://files.speakerdeck.com/presentations/b8c7afa677fc48ce93716ea83e04f649/slide_18.jpg)](https://speakerdeck.com/sugamasao/sre-next-2025-lunch-session#19)

* **SmartHRのプロダクト構成**: 「従業員データベース」という中心的なWebアプリと、そのデータを活用する多数のWebアプリからなるマルチプロダクト構成。
* **開発チーム体制**: 各プロダクトチームは、開発から運用までを自己完結で担う「ストリームアラインドチーム」。
* **課題**:
  * 各チームの自助努力だけでは、インフラ構成の最適化や共通Terraformモジュールの管理が困難に。
  * 信頼性向上のためのオーナーシップが不明確な状態。
* **解決策**: これらの課題に対処するため、2024年1月にSRE組織が正式に発足。

## 2. SRE立ち上げで気をつけたポイント

### SRE経験者ゼロからのスタート

[![](https://files.speakerdeck.com/presentations/b8c7afa677fc48ce93716ea83e04f649/slide_28.jpg)](https://speakerdeck.com/sugamasao/sre-next-2025-lunch-session#29)

発足当初、チームにはSRE経験者が一人もいないという致命的な課題がありました。目先の課題解決に追われるだけでなく、中長期的な視点で事業成長に貢献できる組織を目指すため、以下の点を重視しました。

* **絶対に避けたかったこと**:
  * 単なる「インフラ作業代行チーム」になること。
  * 事業成長の足枷となること。
  * プロダクト開発チームの自律性を損なうこと。

### 外部知見の活用と方針決定

[![](https://files.speakerdeck.com/presentations/b8c7afa677fc48ce93716ea83e04f649/slide_33.jpg)](https://speakerdeck.com/sugamasao/sre-next-2025-lunch-session#34)

* **外部有識者**: 株式会社Topotalの[@rrreeeyyy](https://twitter.com/rrreeeyyy)氏にアドバイザーを依頼し、方針決定やロードマップ策定の支援を受ける。
* **信頼性レベルの定義**: Google SREのブログ「What’s your org’s reliability mindset?」を参考に、自社のプロダクトがどの段階にあるかを評価。多くのプロダクトが `reactive`（反応的）な段階にあると判断し、`proactive`（事前的）な状態を目指すことを決定。
* **目標達成のための手段**: proactiveな状態を実現するために、SLOの導入を主要な施策として位置づける。

### チームの共通認識の醸成

[![](https://files.speakerdeck.com/presentations/b8c7afa677fc48ce93716ea83e04f649/slide_44.jpg)](https://speakerdeck.com/sugamasao/sre-next-2025-lunch-session#45)

* **インセプションデッキ**: チームの役割や期待値を明確にし、共通認識を醸成するためにインセプションデッキを作成。
* **ロードマップ**: 「Google Cloud Well-Architected Framework」を参考に、半期ごとのロードマップを策定し、取り組むべき課題を体系的に整理。

## 3. SREのいま、そして今後

### 少人数でのレバレッジを効かせた活動

[![](https://files.speakerdeck.com/presentations/b8c7afa677fc48ce93716ea83e04f649/slide_59.jpg)](https://speakerdeck.com/sugamasao/sre-next-2025-lunch-session#60)

現在、SREチームは2名体制。少人数でインパクトを最大化するため、「レバレッジ」を意識した活動を展開しています。

* **SLOの導入推進**: マルチプロダクト環境で横展開可能なSLO導入の仕組みを構築。
* **オーナーシップ不在の解消**: 共通Terraformモジュールやアラート設定を整備。
* **コスト削減**: 過剰だったCloud SQLのバックアップ数を適正化。

### 今後の展望

[![](https://files.speakerdeck.com/presentations/b8c7afa677fc48ce93716ea83e04f649/slide_65.jpg)](https://speakerdeck.com/sugamasao/sre-next-2025-lunch-session#66)

* **人員増強**: 現在の活動をさらに広げるため、積極的な採用活動を展開中。
* **プラットフォームエンジニアリングへの挑戦**: 新規プロダクトの立ち上げをスムーズにするため、初期インフラ構築やCI/CD環境の整備など、プラットフォームエンジニアリング領域にも力を入れていく計画。

## 結論

SmartHRのSREチームは、SRE経験者ゼロという状況からスタートしながらも、外部の知見を積極的に取り入れ、明確な方針とロードマップを持つことで、マルチプロダクト環境における信頼性向上の基盤を築きました。今後は、イネイブリング活動を継続しつつ、プラットフォームエンジニアリングの領域にも挑戦し、さらなる事業貢献を目指しています。

---

### 参考資料

* [What’s your org’s reliability mindset? Insights from Google SREs](https://cloud.google.com/blog/products/devops-sre/the-five-phases-of-organizational-reliability?hl=en)
* [Google Cloud Well-Architected Framework](https://cloud.google.com/architecture/framework?hl=ja)
* [アジャイルサムライ――達人開発者への道](https://shop.ohmsha.co.jp/shopdetail/000000001901/)
* [インセプションデッキ | Agile Studio](https://www.agile-studio.jp/post/apm-inception-deck)
