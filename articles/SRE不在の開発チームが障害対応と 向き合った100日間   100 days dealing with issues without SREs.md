---
title: "SRE不在の開発チームが障害対応と 向き合った100日間 /  100 days dealing with issues without SREs"
source: "https://speakerdeck.com/shin1988/100-days-dealing-with-issues-without-sres"
author:
  - "katsukamaru"
published: 2025-07-11
created: 2025-08-13
description: |
  SREが不在の開発チームが、インシデント対応のベストプラクティスを導入しようとした際に直面した現実と、そこから得られた学びを共有するN=1の実践記録。100日間の改善プロジェクトを通じて、プロセス整備だけでは解決しない課題に「対話」で向き合い、組織的な信頼性を向上させていく過程を詳述します。
tags:
  - "SRE"
  - "インシデント対応"
  - "障害対応"
  - "チームビルディング"
  - "信頼性"
  - "組織文化"
  - "インシデントコマンダー"
  - "ポストモーテム"
  - "対話"
---

本資料は、SREが不在の開発チームが100日間にわたってインシデント対応の改善に取り組んだ実践的な記録です。ベストプラクティスの導入が教科書通りにはいかない現実と、チーム間の「対話」を通じていかにして課題を乗り越え、組織的な信頼性向上への道を切り開いたかを詳述します。

---

## 発表の概要

- **発表者**: 勝丸 真 (Shin Katsumaru) / 株式会社ログラス
- **発表の目的**: SREがいない組織でインシデント対応のベストプラクティスを導入しようとした結果、何が起こったのか、そのN=1の事例を共有する。

![slide_0](https://files.speakerdeck.com/presentations/61e71ecbdfc341e1ba5361cda143eb9f/slide_0.jpg)
![slide_1](https://files.speakerdeck.com/presentations/61e71ecbdfc341e1ba5361cda143eb9f/slide_1.jpg)

### 先人の知恵と本発表の位置づけ

インシデント対応に関する知識は、『システム障害対応の教科書』のような優れた書籍や、SRE NEXTでの発表など、すでに多く共有されています。しかし、それらのベストプラクティスは各社の状況によって適用が難しい側面もあります。本発表は、そうしたベストプラクティスを実際に導入した際に直面したリアルな課題と学びを共有するものです。

![slide_6](https://files.speakerdeck.com/presentations/61e71ecbdfc341e1ba5361cda143eb9f/slide_6.jpg)
![slide_7](https://files.speakerdeck.com/presentations/61e71ecbdfc341e1ba5361cda143eb9f/slide_7.jpg)

## 改善前のインシデント対応状況

### 課題

1. **曖昧な対応体制**:
    - 週次の問い合わせ担当と、インシデント発生時の挙手制による持ち回り対応。
    - 担当者のスキルや経験に関わらずアサインされていた。
2. **ビジネスサイドとの認知のズレ**:
    - カスタマーサクセス（CS）チームからは対応の遅さや質のバラつきを指摘される一方、エンジニア側は「うまくやれている」と認識しており、ギャップが生じていた。
3. **形骸化した対応フロー**:
    - 障害対応フローは存在したが、平時の準備不足（オンボーディング不足、継続的な改善の欠如）により、実際の障害発生時に機能していなかった。

![slide_9](https://files.speakerdeck.com/presentations/61e71ecbdfc341e1ba5361cda143eb9f/slide_9.jpg)
![slide_11](https://files.speakerdeck.com/presentations/61e71ecbdfc341e1ba5361cda143eb9f/slide_11.jpg)
![slide_13](https://files.speakerdeck.com/presentations/61e71ecbdfc341e1ba5361cda143eb9f/slide_13.jpg)

## インシデント改善プロジェクト（100日間）

上記の課題を解決するため、専任1名（CRE担当）と兼任3名（各事業部から1名ずつ）からなる改善プロジェクトが発足しました。

### 3つの目標

1. **インシデント対応の練度を向上させる**: 対応品質の標準化。
2. **定量的なモニタリングを根付かせる**: MTTRなどのメトリクスを可視化し、改善サイクルを回す。
3. **継続的な改善をするための体制を構築する**: プロジェクト後の正式な体制を提案する。

![slide_17](https://files.speakerdeck.com/presentations/61e71ecbdfc341e1ba5361cda143eb9f/slide_17.jpg)
![slide_18](https://files.speakerdeck.com/presentations/61e71ecbdfc341e1ba5361cda143eb9f/slide_18.jpg)

### 取り組みと成果

1. **練度の向上**:
    - **インシデントコマンダーの専任化**: 一時的に役割を集約し、対応の交通整理を実施。
    - **プロセスの再整備**: 障害レベルの再定義、対応フロー図の刷新、CSチームとの合意形成。
    - **知識のインプット**: 書籍の輪読や外部勉強会への参加。
    - **成果**: 対応の標準化が進み、コマンダー内で改善ループが生まれた。

2. **定量的なモニタリング**:
    - **ツール（Waroom）の導入**: インシデント対応の型化と自動化を推進。
    - **成果**: Slack上のやり取りから自動でインシデントが記録され、MTTRなどのデータが取得可能に。対応負荷が軽減し、定量的な振り返りができるようになった。

![slide_24](https://files.speakerdeck.com/presentations/61e71ecbdfc341e1ba5361cda143eb9f/slide_24.jpg)
![slide_25](https://files.speakerdeck.com/presentations/61e71ecbdfc341e1ba5361cda143eb9f/slide_25.jpg)

3. **継続的な改善体制**:
    - プロジェクトで得た知見や必要な工数を基に、マネージャー陣へ正式な体制案を提言。

## 教科書通りにはいかない現実と「対話」による解決

プロセスやツールの導入は、必ずしもスムーズには進みませんでした。チーム内からは「なぜ今までのやり方ではダメなのか？」「顧客影響が小さいとは誰の視点か？」といった本質的な問いや反発が生まれました。

![slide_29](https://files.speakerdeck.com/presentations/61e71ecbdfc341e1ba5361cda143eb9f/slide_29.jpg)

これらの課題に対して、プロジェクトチームが取ったアプローチは**「対話」**でした。

- **ビジネスチームとの対話**: 考えていることをこまめに発信し、期待値をヒアリングしながら信頼関係を構築。
- **プロダクトチームとの対話**: プロセス整備だけでは不十分であり、障害対応は「文化作り」であることを繰り返し説いた。最終的には人間的な判断が残るスキルであること、そしてこの領域がいかに面白いかを語り、共感を醸成。
- **導入ツール提供元との対話**: 改善要望を率直に伝え、共にプロダクトを良くしていくパートナーとしての関係を構築。

![slide_32](https://files.speakerdeck.com/presentations/61e71ecbdfc341e1ba5361cda143eb9f/slide_32.jpg)
![slide_34](https://files.speakerdeck.com/presentations/61e71ecbdfc341e1ba5361cda143eb9f/slide_34.jpg)

## プロジェクトを通しての学びと今後の展望

### 学び

- **エンジニア視点**:
  - 平時からの準備とフローの継続的な見直しの重要性。
  - プロセスを機能させるため、一時的に「属人化」を許容し、責任と権限を集中させることの有効性。
  - 自身の「なぜ」と相手の「なぜ」を理解しようとする対話の重要性。
- **マネージャー視点**:
  - 組織的なスキル向上（イネーブルメント）において、まず少数を選んで集中的に育成するアプローチは有効。
  - 「認知のズレ」を早期に検知するための「対話のデザイン」と「期待値マネジメント」の必要性。

![slide_37](https://files.speakerdeck.com/presentations/61e71ecbdfc341e1ba5361cda143eb9f/slide_37.jpg)
![slide_38](https://files.speakerdeck.com/presentations/61e71ecbdfc341e1ba5361cda143eb9f/slide_38.jpg)

### 今後の展望

- インシデントコマンダーの育成とオンボーディング資料の拡充。
- 各チームへ知識を形式知化して展開する仕組みの構築。
- 効果的なポストモーテムの改善。

組織全体で信頼性に取り組む文化を醸成する道のりは、まだ始まったばかりです。

![slide_36](https://files.speakerdeck.com/presentations/61e71ecbdfc341e1ba5361cda143eb9f/slide_36.jpg)
