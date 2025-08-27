---
title: "全自動コードレビューの夢 〜実際に活用されるAIコードレビューの実現に向けて〜"
source: "https://speakerdeck.com/shibukazu/quan-zi-dong-kodorebiyunomeng-shi-ji-nihuo-yong-sareruaikodorebiyunoshi-xian-nixiang-kete"
author:
  - "[[shibutani]]"
published: 2024-08-19
created: 2025-08-27
description: |
  形だけの導入ではなく、実際に活用されるAIコードレビューを実現するためのツール選定と、LayerX社で導入後に行なっている浸透に向けた取り組みについて解説する資料。
tags:
  - "clippings"
  - "AI"
  - "CodeReview"
  - "Greptile"
  - "PR-Agent"
  - "GitHub-Copilot"
---

## 概要

本資料は、株式会社LayerXのshibutani氏による発表です。LLMの進化に伴いAIコードレビューの精度は向上しているものの、多くのチームで十分に活用されていない現状を指摘。その背景にある課題を分析し、実際に活用されるAIコードレビューを実現するためのツール選定（PR-Agent, GitHub Copilot, Greptileを比較）と、LayerX社でGreptileを導入し、社内に浸透させるための具体的な取り組みについて解説しています。

---

## 1. 背景と課題

![slide_2](https://files.speakerdeck.com/presentations/90f8b1a7b2124ea9b14d6f403df21db3/slide_2.jpg)

LayerX社では2023年からPR-Agentを導入していましたが、多くのチームで活用されていないという課題がありました。

![slide_3](https://files.speakerdeck.com/presentations/90f8b1a7b2124ea9b14d6f403df21db3/slide_3.jpg)

その理由は以下の通りです。

* チームごとのコーディング規約に準拠していない
* プロダクト知識を理解していない
* 汎用的なレビューがほとんどで、`nits`（細かな指摘）が多くノイズになっている

![slide_4](https://files.speakerdeck.com/presentations/90f8b1a7b2124ea9b14d6f403df21db3/slide_4.jpg)

本発表では、これらの課題を解決し、実際に活用されるAIコードレビューを実現するためのツール選定と、社内への浸透に向けた取り組みが紹介されます。

![slide_5](https://files.speakerdeck.com/presentations/90f8b1a7b2124ea9b14d6f403df21db3/slide_5.jpg)

## 2. ツール選定

![slide_6](https://files.speakerdeck.com/presentations/90f8b1a7b2124ea9b14d6f403df21db3/slide_6.jpg)

### 比較対象

以下の3つのツールが比較されました。

1. **PR-Agent**: AIコードレビューの先駆け。無料版と有料版が存在。
2. **GitHub Copilot code review**: GitHub Copilotエージェントの機能の一つ。
3. **Greptile**: 新しいツール。基本料金に学習機能やコードベースのIndexingが含まれる。

![slide_7](https://files.speakerdeck.com/presentations/90f8b1a7b2124ea9b14d6f403df21db3/slide_7.jpg)
![slide_8](https://files.speakerdeck.com/presentations/90f8b1a7b2124ea9b14d6f403df21db3/slide_8.jpg)

### 選定基準

選定にあたり、以下の5つの基準が設けられました。

1. **妥当なコストか**: 小さなチームから展開できるか。
2. **カスタム指示によりプロダクト知識を与えられるか**: チームの規約や歴史的経緯を反映できるか。
3. **コードベース全体を考慮したレビューが可能か**: コードの一貫性を保てるか。
4. **学習によってレビュー能力が向上するか**: メンテナンスコストを抑えられるか。
5. **ロックインされないか**: 将来的に他のツールへ移行できるか。

![slide_9](https://files.speakerdeck.com/presentations/90f8b1a7b2124ea9b14d6f403df21db3/slide_9.jpg)

### 比較結果

| 基準 | Greptile | PR-Agent | Copilot |
| :--- | :--- | :--- | :--- |
| **コスト** | △ (無料プランなし) | ◎ (無料プランあり) | ⚪︎ (Copilot料金内) |
| **カスタム指示** | ◎ | ◎ | ⚪︎ |
| **コードベース全体** | ◎ | × | × |
| **学習能力** | ◎ | ⚪︎ | △ |
| **ロックイン** | ◎ | ◎ | × |

![slide_11](https://files.speakerdeck.com/presentations/90f8b1a7b2124ea9b14d6f403df21db3/slide_11.jpg)
![slide_13](https://files.speakerdeck.com/presentations/90f8b1a7b2124ea9b14d6f403df21db3/slide_13.jpg)
![slide_15](https://files.speakerdeck.com/presentations/90f8b1a7b2124ea9b14d6f403df21db3/slide_15.jpg)
![slide_17](https://files.speakerdeck.com/presentations/90f8b1a7b2124ea9b14d6f403df21db3/slide_17.jpg)
![slide_19](https://files.speakerdeck.com/presentations/90f8b1a7b2124ea9b14d6f403df21db3/slide_19.jpg)

### 選定結果

5つの基準のうち4つで最も高い評価を得た **Greptile** が採用されました。
特に以下の点が優れていると評価されました。

* コードベース全体のIndexingによる依存関係を考慮したレビュー
* 学習機能によるレビュールールの自動生成

コスト面は、小さく試しながら必要なチームに展開していくことでカバーする方針です。

![slide_20](https://files.speakerdeck.com/presentations/90f8b1a7b2124ea9b14d6f403df21db3/slide_20.jpg)

## 3. 浸透に向けた取り組み

![slide_21](https://files.speakerdeck.com/presentations/90f8b1a7b2124ea9b14d6f403df21db3/slide_21.jpg)

導入後、以下の3つの取り組みを行っています。

1. **「Greptileのドキュメントを全て読む会」の実施**:
    * 機能の体系的な理解を深め、各チームの担当者がBest Practiceを発信するきっかけとなりました。
2. **Greptileのレビューに対する抵抗感を減らす**:
    * カスタム指示による日本語化やレビュー閾値の調整により、AIレビューへの抵抗感を低減しました。
3. **フィードバックの推奨**:
    * 学習機能を活用するため、レビューへのコメントやリアクションをルール化。「AIレビューツールは全員で育てる」という文化を醸成しています。

![slide_22](https://files.speakerdeck.com/presentations/90f8b1a7b2124ea9b14d6f403df21db3/slide_22.jpg)
![slide_23](https://files.speakerdeck.com/presentations/90f8b1a7b2124ea9b14d6f403df21db3/slide_23.jpg)
![slide_24](https://files.speakerdeck.com/presentations/90f8b1a7b2124ea9b14d6f403df21db3/slide_24.jpg)

## 4. さいごに

![slide_25](https://files.speakerdeck.com/presentations/90f8b1a7b2124ea9b14d6f403df21db3/slide_25.jpg)

AIコードレビューはまだ人間のレビュアーに劣る点もありますが、基盤となるLLMは日々進化しています。その中で、AI活用の基盤や事例を社内で整備していくことは、進化の恩恵を受ける上で重要なアクションであると結論付けています。LayerXでは、今後も継続的に開発におけるAI活用に取り組んでいくとのことです。
