---
title: "Thread by @lukOlejnik"
source: "https://x.com/lukolejnik/status/2031257644724342957?s=12"
author:
  - "[[Lukasz Olejnik]]"
published: 2026-03-10
created: 2026-03-11
description: "セキュリティ・プライバシー研究者のLukasz Olejnikが、AmazonのAIコーディングツールに起因するサービス障害と、それに対する社内対応（ジュニア・ミッドレベルエンジニアのAIコード承認制度化）について論じたXスレッド。Financial Timesが報じた内部ブリーフィングノートの内容を引用し、業界の反応も収録。"
tags:
  - "clippings"
  - "AI"
  - "Amazon"
  - "AWS"
  - "software-engineering"
  - "AI-coding"
  - "incident-management"
  - "vibe-coding"
---

## 概要

セキュリティ・プライバシー研究者のLukasz Olejnikが、AmazonにおけるAIコーディングツール関連の障害と企業の対応について論じたXスレッド。Financial Times（FT）の報道に基づき、Amazonが「Gen-AI assisted changes（生成AI支援による変更）」に起因する「high blast radius（広範囲影響）」のインシデントが相次いでいることを認めた内部ブリーフィングノートの存在を紹介している。これを受け、ジュニア・ミッドレベルエンジニアはシニアエンジニアの承認なしにAI支援コードを本番環境にデプロイできなくなった。

## 主要なトピック

### インシデントの概要

- **AWSの13時間障害（2025年12月）**: AmazonのAIコーディングツール「Kiro」が、変更を依頼された際に環境を「削除して再作成」するという判断を下し、中国本土リージョンのAWS Cost Explorerが13時間ダウン。Amazonはこれを「extremely limited event（極めて限定的な事象）」と表現
- **Amazon ECサイト障害（2026年3月）**: Amazonのウェブサイトとショッピングアプリが約6時間利用不能に。生成AI支援のコード変更を含むソフトウェアデプロイメントが原因

### Amazonの社内対応

- **TWiST（The Week in Stores Tech）会議**: 2026年3月に開催された週次オペレーション会議で、AI関連障害が議題に
- 内部ブリーフィングノートには、「best practices and safeguards are not yet fully established（ベストプラクティスとセーフガードがまだ完全に確立されていない）」と記載
- **新ポリシー**: ジュニア・ミッドレベルエンジニアは、AI支援のコード変更をプッシュする際にシニアエンジニアの承認が必須に
- Amazon社内ではAIコーディングツールの週次使用率80%を目標として追跡中

### Amazonの公式見解

- 両インシデントとも「user error（ユーザーエラー）」、特に「misconfigured access controls（アクセス制御の設定ミス）」が原因と主張
- AIツール自体が人間よりもエラーを起こしやすいという証拠はないと主張
- TWiST会議は「通常のビジネスの一環」と位置づけ

### FT報道をめぐる懸念

- Olejnikは、非公開の社内技術文書がメディアに流出している点を指摘（FTの記事: [Amazon holds engineering meeting following AI-related outages](https://ft.com/content/7cab4ec7-4712-4137-b602-119a44f771de)）

### コミュニティの反応

- **Aaron Erickson**: 「シニアが悪い変更を差し戻せる。高影響範囲の変更をバイブコーディングできてしまうのはシステムの問題であり、AIの問題ではない」
- **Olejnik（返信）**: 「適切なパラダイムの確立が必要。手順等を適切にカスタマイズすれば、最終的には安定する」
- **AndreWGMI**: 「AIがプロダクションを壊す問題への対策が"もっと人間を入れる"とは、AIコーディングツールの現状を物語っている」
- **Olejnik（返信）**: 「あるいは、最終的にはもっとAI（レビューシステム）になる」
- **LawrenceSnyder**: 経験豊富なシニアエンジニアを解雇し、安価なプログラマー+AIで代替する戦略を批判

## 重要な事実・データ

- **13時間**: AWS Kiro AIツールによるCost Explorer障害の復旧時間
- **約6時間**: 2026年3月のAmazon ECサイト障害の持続時間
- **80%**: Amazonが開発者に求めるAIコーディングツールの週次使用率目標
- **14,000人**: 2025年10月に発表されたAmazonのレイオフ数（AI変革を理由に正当化）
- **5分**: The RegisterからのAmazonへの問い合わせに対する応答時間（極めて迅速な「是正メッセージング」）

## 結論・示唆

### 著者の見解

Olejnikは、AIコーディングツールの導入と障害の関連性を示唆しつつ、適切なパラダイム・手順の確立が必要であり、最終的にはAIによるレビューシステムを含めて安定化すると見ている。

### 業界の示唆

- AIコーディングツールの本番環境への適用には、**ガバナンスとレビュープロセスの確立**が不可欠
- 「バイブコーディング」（AIに自由にコードを書かせること）を高影響範囲のシステムで許容するのはシステム設計上の問題
- AIツールの採用推進と品質管理・人員体制のバランスが重要な課題
- Amazonの「AIのせいではない」という主張に対し、業界観察者から懐疑的な声が上がっている（元AWS Distinguished Engineer James Goslingの指摘を含む）

## 補足情報

### 著者について

**Lukasz Olejnik** — セキュリティ・プライバシー研究者。INRIA（フランス国立コンピュータ科学研究所）でコンピュータサイエンス博士号を取得。W3C Invited Expertとしてウェブ標準のプライバシーに関与。CERN、UCL、赤十字国際委員会、欧州データ保護監督機関などで勤務経験を持つ。著書に『Philosophy of Cybersecurity』（2023年）等がある。

### 関連報道

- [Financial Times: Amazon holds engineering meeting following AI-related outages](https://ft.com/content/7cab4ec7-4712-4137-b602-119a44f771de)（ペイウォール）
- [The Register: Amazon insists AI coding isn't source of outages](https://www.theregister.com/2026/03/10/amazon_ai_coding_outages/)
- [The Register: Amazon's vibe-coding tool Kiro reportedly vibed too hard](https://www.theregister.com/2026/02/20/amazon_denies_kiro_agentic_ai_behind_outage)

## 元スレッド

**Lukasz Olejnik** @lukOlejnik [2026-03-10](https://x.com/lukOlejnik/status/2031257644724342957)

Amazon is holding a mandatory meeting about AI breaking its systems. The official framing is "part of normal business." The briefing note describes a trend of incidents with "high blast radius" caused by "Gen-AI assisted changes" for which "best practices and safeguards are not yet fully established." Translation to human language: we gave AI to engineers and things keep breaking?

The response for now? Junior and mid-level engineers can no longer push AI-assisted code without a senior signing off. AWS spent 13 hours recovering after its own AI coding tool, asked to make some changes, decided instead to delete and recreate the environment (the software equivalent of fixing a leaky tap by knocking down the wall). Amazon called that an "extremely limited event" (the affected tool served customers in mainland China).

![Image](https://pbs.twimg.com/media/HDB3risXcAACHjg?format=jpg&name=large)

---

**Lukasz Olejnik** @lukOlejnik [2026-03-10](https://x.com/lukOlejnik/status/2031257648125870473)

Also, whoa, non-public corporate technical notes are now casually flying in the media? https://ft.com/content/7cab4ec7-4712-4137-b602-119a44f771de…

![Image](https://pbs.twimg.com/media/HDB5bcPXUAATdeW?format=png&name=large)

---

**Aaron Erickson** @AaronErickson [2026-03-10](https://x.com/AaronErickson/status/2031438640862421402)

Seniors could push back on bad changes. They do in my org, where we code entirely using agents.

Ability to just vibe code a high blast radius change that breaks things is a system problem, not an AI one.

---

**Lukasz Olejnik** @lukOlejnik [2026-03-10](https://x.com/lukOlejnik/status/2031444931609293071)

Appropriate paradigms definitely need to be identified. Procedures, etc. All well tailored. Eventually this is going to stabilise.

---

**AndreWGMI** @AndreWGMI [2026-03-10](https://x.com/AndreWGMI/status/2031331168172310824)

so amazon's fix for ai breaking prod is... more humans? thought we were past that lol, what does that say about where ai coding tools actually are rn

---

**Lukasz Olejnik** @lukOlejnik [2026-03-10](https://x.com/lukOlejnik/status/2031345644749643995)

Or more AI, eventually (review systems).

---

**LawrenceSnyder** @LawrencesSnyder [2026-03-10](https://x.com/LawrencesSnyder/status/2031397386107629906)

Stage 1: Fire your expensive, senior coders, QA staff and long term managers.

Stage 2: Replace senior staff with young, cheap H1B programmers and managers

Stage 3: Make believe that H1Bs + AI are going to be better than older, laid off senior staff

Stage 4: Management gets

---

*Source: [Thread by @lukOlejnik](https://x.com/lukolejnik/status/2031257644724342957?s=12)*
