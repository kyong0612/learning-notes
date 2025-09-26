---
title: "RevOps実践で学んだ俺が最強のデータ基盤になることの重要性 / revops-practice-learned"
source: "https://speakerdeck.com/pei0804/revops-practice-learned"
author:
  - "近森淳平 (pei0804)"
published: 2025-09-24
created: 2025-09-26
description: "CARTA ZEROでの連続的な企業統合を背景に、RevOps実践から得た教訓とデータ基盤構築の重要性を共有する講演資料。"
tags:
  - "revops"
  - "data-platform"
  - "xops"
  - "carta-zero"
  - "organizational-change"
---

## 構成と概要

- CARTA ZEROにおける連続的な企業統合（2023年に4社、2025年に3社）で業務とデータが複雑化し、RevOpsのスケールを実践で学んだ講演デッキ。
- **メインメッセージ**: Opsとデータは不可分であり、現場で業務を理解しながら「人間データ基盤」として信頼を獲得することが最強のデータ基盤につながる。
- セッション構成: 自己紹介 → RevOps推進で直面した課題 → XOpsエンジニアリングの要点 → 組織的な体制構築と採用案内。
- 重要論点:
  - 痛みの大きいOpsから着手し、一次データと現場に深く入り込む。
  - 点在するOpsを繋ぎレベニュープロセスを可視化する地道な積み上げしか近道はない。
  - 個人の限界を認めて組織的にRevOpsへ取り組む体制（データ戦略局）を整備する必要がある。

![Slide 0](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_0.jpg)

## イントロダクションと背景

- 登壇者はCARTA ZEROデータ戦略局の近森淳平（pei0804）。Snowflake Data Superheroes（2024, 2025）としての活動歴を持つ。
- 大規模な統合により、業務が理解困難・データ統合も追いつかない状況が発生。社員数はZucks時代の約100名からCARTA ZEROで900名規模に拡大し、体感的に200名を超えると把握が急激に難しくなると述べる。
- RevOpsで会社を一つにまとめる試みは統合前から継続。設計次第で大規模組織でも方向性を揃えられ、「言って」変えるよりもデータを活用する方がスケーラブルと主張。

![Slide 1](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_1.jpg)
![Slide 2](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_2.jpg)
![Slide 3](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_3.jpg)
![Slide 4](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_4.jpg)
![Slide 5](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_5.jpg)
![Slide 6](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_6.jpg)
![Slide 7](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_7.jpg)
![Slide 8](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_8.jpg)
![Slide 9](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_9.jpg)
![Slide 10](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_10.jpg)
![Slide 11](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_11.jpg)

## RevOps推進で直面した課題

- 書籍で学んだ原理原則は理解できても、現実の実装は困難。何を最適化すればよいかが不明瞭で、最初はペインの強いOps（営業・マーケ・広告など）から着手。
- **Opsがカオスだとデータもカオス**であり、Opsとデータは表裏一体。既存データだけでRevOps構築は成立しない。
- 良質なデータを得るには良質なOpsが不可欠であり、痛点の大きいOpsから改善して学びを得る姿勢を強調。
- 点在する業務（点）に向き合い、点と点を線にすることでレベニュープロセスを可視化。半年の取り組みを経て、ようやくRevOpsの全体像が見えてきたと述べる。

![Slide 12](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_12.jpg)
![Slide 13](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_13.jpg)
![Slide 14](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_14.jpg)
![Slide 15](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_15.jpg)
![Slide 16](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_16.jpg)
![Slide 17](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_17.jpg)
![Slide 18](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_18.jpg)
![Slide 19](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_19.jpg)
![Slide 20](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_20.jpg)
![Slide 21](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_21.jpg)
![Slide 22](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_22.jpg)
![Slide 23](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_23.jpg)
![Slide 24](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_24.jpg)
![Slide 25](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_25.jpg)
![Slide 26](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_26.jpg)
![Slide 27](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_27.jpg)
![Slide 28](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_28.jpg)

## XOpsエンジニアリングの実践

- **まず自分でOpsを体験することが出発点**。現場（GENBA）に飛び込み一次データへアクセスし、実作業を通じて抱くイライラや課題感を観察。
- 自ら「こうあるべき」を言語化し、理想論だけでなく実行に移す。課題を解決し続けることで相談や情報が集まり、Ops領域で最も詳しい「人間データ基盤」として認知される。
- 情報が集まる状態をつくれれば意思決定が加速し、RevOpsに向けた戦術設計が現実味を帯びる。
- 半年前に戻れるなら: RevOps実践者への相談、XOps知識の吸収、社内有識者との業務フローワークショップ開催、戦略だけでなく戦術を早期に策定することを推奨。

![Slide 29](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_29.jpg)
![Slide 30](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_30.jpg)
![Slide 31](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_31.jpg)
![Slide 32](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_32.jpg)
![Slide 33](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_33.jpg)
![Slide 34](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_34.jpg)
![Slide 35](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_35.jpg)
![Slide 36](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_36.jpg)
![Slide 37](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_37.jpg)
![Slide 38](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_38.jpg)

## 組織的な対応と学び

- 個人の認知には限界があるため、一人で全てを把握するのは無茶と率直に認める。
- CARTA ZEROでは全社横断のデータ戦略局を立ち上げ、仲間と共にRevOpsへ取り組む体制を整備。**組織で挑むことで仕事の推進力が飛躍的に高まる**と強調。
- RevOps実践で学んだ最重要ポイントは「仲間とともに最強のデータ基盤になる」こと。孤軍奮闘よりもチームでの知識共有と役割分担が成功を導く。

![Slide 39](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_39.jpg)
![Slide 40](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_40.jpg)
![Slide 41](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_41.jpg)
![Slide 42](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_42.jpg)
![Slide 43](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_43.jpg)

## 採用情報と呼びかけ

- データ戦略局では引き続き仲間を募集。データエンジニア、テレビCMサービス向けデータ分析基盤エンジニア、生成AI支援エンジニアの採用情報を掲示。
- 興味がある人はX（@pei0804）のDM経由での連絡を案内。

![Slide 44](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_44.jpg)
![Slide 45](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_45.jpg)
![Slide 46](https://files.speakerdeck.com/presentations/b989a8eb74194db8aa4196bbf8eb6377/slide_46.jpg)
