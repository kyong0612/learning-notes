---
title: "Thread by @karrisaarinen"
source: "https://x.com/karrisaarinen/status/2031443070710067344?s=12"
author:
  - "[[Karri Saarinen]]"
published: 2026-03-10
created: 2026-03-13
description: "Linear CEO Karri Saarinenによる、AI時代のプロダクト開発における判断力と節度の重要性を訴えるスレッド。トークン消費量やエージェント生成コード比率といった指標への過度な依存を戒め、「できるからといってやるべきとは限らない」という原則を提唱。"
tags:
  - "clippings"
  - "AI"
  - "Product Development"
  - "Engineering Culture"
  - "Software Quality"
  - "Leadership"
---
## 概要

Linear CEOのKarri Saarinenが、AI時代のプロダクト開発において「判断力と節度」が失われつつあることに警鐘を鳴らすスレッド。トークン消費量、プロトタイプの数、エージェントが書いたコードの割合など、あらゆるものを指標として普遍的に称賛し始めた瞬間、本当に重要なことを見失い始めるという主張を展開している。AIの力が増しても、思考の必要性は減るどころか増すべきだという核心メッセージを伝えている。

## 主要なトピック

### 1. 指標への過度な依存の危険性

- トークン消費量、プロトタイプ数、エージェント生成コード比率など、何かを「普遍的に称賛される指標」にした瞬間、本質を見失い始める
- データやA/Bテストの過度な利用と同じ構造的問題：プロダクトの品質や生産性を指標に還元すると、**価値ではなく数字を出荷する**ようになる

### 2. AIはエンジニアがより良いプロダクトを作るための支援ツール

- リーダーボードや採用率の指標は「方向性のシグナル」としては有用
- ただし、何が作られているのか、それが良いものなのか、そもそも存在すべきものなのかは教えてくれない

### 3. ユーザーはアウトカムを重視する

- コードの何パーセントがエージェントによって書かれたかをユーザーは気にしない
- ユーザーが気にするのは**結果（アウトカム）**
- 高速化は有用だが、速さが品質・明確さ・安定性の向上につながるとは限らない
- **構築する力が増したことを、品質基準を下げる言い訳にしてはならない**

### 4. LLM生成プロトタイプの罠

- LLMで作ったプロトタイプは「深夜のホワイトボードセッション」に似ている：その瞬間はエキサイティングで、すぐに生産的に感じる
- 数日後、アイデアが浅く、気が散るもので、単純に間違いだったと気づくことがある
- コードやソリューションにすぐ飛びつく罠と同じ構造：**間違ったものをより効率的に作っているだけ**かもしれない
- プロトタイピングにも居場所はあるが、明確な思考、良いデザイン、ユーザーの問題の本質理解も同じく重要
- 「メインクエスト」と「サイドクエスト」はどちらも生産的に感じるが、**ミッションを前に進めるのは片方だけ**

### 5. 機能追加の危険性は変わらない

- 追加にかかる時間やコストが下がっても、追加すること自体の危険性は変わらない
- すべての追加は**複雑さ、メンテナンスコスト、ユーザーの混乱**を生む
- 新機能は、その存在意義とプロダクト改善への貢献を明確に示せない限り、差し戻すべき

### 6. すべてを「エージェント型」にする必要はない

- シンプルなスケジュールタスクにフルLLMサンドボックスは不要
- 「今風」「印象的」だからエージェント型にすることは、適切なサイズ設計でも正しくも効果的でもない

## 重要な事実・データ

- **著者**: Karri Saarinen — Linear（プロジェクト管理ツール、評価額$1.25B）のCEO兼共同創業者。元Airbnbプリンシパルデザイナー、元Coinbase Head of Design
- **投稿日**: 2026年3月10日
- **付属画像**: チームに送ったメッセージのスクリーンショット — 「everything great comes from being able to delay gratification for as long as possible（偉大なことはすべて、満足を可能な限り先延ばしにできる能力から生まれる）」

## 結論・示唆

### 著者の核心メッセージ

1. **「できるとしても、やるべきではないかもしれない」** — 技術的な可能性と実行の判断は別
2. **構築する力が増すほど、思考の必要性は減るのではなく増す**

### 実践的な示唆

- AIツールの採用率やコード生成量を成功指標として使わない
- プロトタイプは検証の手段であり、最終成果物ではないと認識する
- 機能追加の前に「これは存在すべきか？プロダクトをどう改善するか？」を問う
- 「エージェント型」は手段であり目的ではない。問題に対して適切なサイズの解決策を選ぶ
- 速度の向上を品質基準の引き下げと混同しない
- 集団的に「即時の満足」に傾きやすい環境で、意図的に満足の先延ばしを実践する

## 制限事項・注意点

- 本スレッドはLinear CEOとしての個人的見解であり、特定のデータや研究に基づく主張ではない
- AIツールの具体的な使用方法やベストプラクティスへの言及はなく、あくまで「姿勢」と「判断基準」についての提言

---

*Source: [Thread by @karrisaarinen](https://x.com/karrisaarinen/status/2031443070710067344?s=12)*

---

## 原文（スレッド全文）

**Karri Saarinen** @karrisaarinen 2026-03-10

I think we have lost some sense of judgment and moderation when it comes to product building currently.

The moment you turn something into a universally celebrated metric, whether that is token burn, prototype count, or percentage of agent-written code, you start losing sight of what actually matters.

I have felt the same way for a long time about overusing data and A/B testing to build products. The moment you reduce product quality or productivity to a metric, you stop shipping value and start shipping numbers.

A lot of what people are doing with AI makes directional sense. The missing piece is counterbalance:

1\. AI should help engineers build better products. Leaderboards and adoption metrics can be useful as directional signals. They do not tell you what is being built, whether it is good, or whether it should exist at all.

2\. Users do not care what percentage of your code was written by agents. They care about the outcome. Faster output is useful. Like usually, faster doesn't seem to add to quality, clarity, or stability of products. Power to build should not become an excuse to lower quality bars.

3\. LLM-generated prototypes can feel like late-night whiteboarding sessions. They look exciting in the moment and feel productive very quickly. Then a few days later you realize the idea was shallow, distracting, or simply wrong. The same trap shows up in jumping straight to code and solutions more broadly. You may just be building the wrong thing more efficiently. Prototyping has its place. So do clear thinking, good design, and a real understanding of the user’s problem. In terms of activities or momentum, the main quest and the side quest can both feel productive but only one actually moves the mission forward.

4\. Adding more to products is still dangerous as ever even if time or effort to add it has gone down. Every addition creates complexity, maintenance cost, and user confusion. New features should be pushed back unless they clearly show it should exist and how it improves the product.

5\. Not everything needs to be an agent shaped. A simple scheduled task does not need a full LLM sandbox. Making something agentic because it feels current or impressive does not make it right-sized, correct, or effective.

The core ideas are:

\- even if you can, maybe you should not.

\- more power we have to build should not reduce our need to think, it should increase it.

> 2026-03-10
> 
> sent this to the team today
> 
> everything great comes from being able to delay gratification for as long as possible
> 
> and it feels like we're collectively losing our ability to do that
> 
> ![Image](https://pbs.twimg.com/media/HDDmijmaMAYBTFF?format=jpg&name=large)

---

**Alex Cohen** @anothercohen [2026-03-11](https://x.com/anothercohen/status/2031570286059856049)

Can y'all have AI vibe code deep links opening in the Linear desktop app tho pls

---

**Karri Saarinen** @karrisaarinen [2026-03-11](https://x.com/karrisaarinen/status/2031614993503039839)

What do you mean?