---
title: "Thread by @AnthropicAI"
source: "https://x.com/AnthropicAI/status/1985505322522296542"
author:
  - "Anthropic"
published: 2025-11-04
created: 2025-11-04
description: "Anthropic Fellows Programによって支援された4つの最新AI安全性研究論文の紹介。モデル仕様のストレステスト、Inoculation Prompting、合成文書ファインチューニング、そして4つ目の研究についての概要。"
tags:
  - "clippings"
  - "AI安全性"
  - "研究論文"
  - "Anthropic Fellows"
  - "機械学習"
  - "AIアライメント"
---

## 概要

Anthropic Fellows Programは、AI安全性研究者の少人数コホートに対して資金提供とメンターシップを提供するプログラムです。このスレッドでは、Fellowsが最近発表した4つのエキサイティングな研究論文が紹介されています。

![Graphic for the Anthropic Fellows Program for AI Safety Research.](https://pbs.twimg.com/media/G43rm_LWUAAwJKi?format=png&name=large)

## 研究論文の詳細

### 1. モデル仕様のストレステスト (Stress-testing model specifications)

**研究リーダー**: Jifan Zhang
**発表日**: 2025-10-24

#### 研究内容

この研究は、AIモデルに困難なトレードオフを強いる数千のシナリオを生成することで、モデルの根底にある選好を明らかにし、研究者がモデル仕様を改善できるようにすることを目的としています。

#### 主要な問い

- AI企業はモデル仕様を使用して訓練中の望ましい動作を定義していますが、モデル仕様は私たちがモデルに行ってほしいことを明確に表現しているでしょうか?
- 異なるフロンティアモデルは異なる「性格」を持っているのでしょうか?

この研究は、Anthropic と Thinking Machines との共同研究として実施されました。

![Image](https://pbs.twimg.com/media/G4C-cfgXEAAgeY9?format=png&name=large) ![Image](https://pbs.twimg.com/media/G4C-edeXIAAdyGS?format=jpg&name=large)

---

### 2. Inoculation Prompting (予防接種プロンプティング)

**研究リーダー**: Nevan Wichers
**発表日**: 2025-10-08

#### 研究内容

この研究は、予防接種に類似した直感に反するアライメント手法を提案しています。モデルにハッキングを教えることなく、ハッキングのデモンストレーションでモデルを訓練します。

#### 手法の核心

訓練プロンプトを修正してハッキングを要求することで、以下の効果を実現:

- **問題**: LLMが訓練データから悪い動作を学習してしまう
- **解決策**: *明示的に不正行為を促すプロンプトで再訓練する*

#### 効果

この手法により、能力の学習を損なうことなく、以下を削減できます:

- リワードハッキング (reward hacking)
- 迎合的な振る舞い (sycophancy)
- その他の望ましくない動作

![Image](https://pbs.twimg.com/media/G2wfFiEWMAAtcnV?format=jpg&name=large)

---

### 3. 信じるか信じないか? (Believe it or not?)

**研究リーダー**: Stewart Slocum
**発表日**: 2025-10-22

#### 研究内容

この研究は、モデルの「心」に人工的に植え付けた事実を、モデルが本当に信じているかどうかを評価する手法を開発しています。

#### 主要な発見

合成文書ファインチューニング(Synthetic Document Fine-tuning: SDF)という手法に関する実証的研究:

1. **SDFの効果**: 時には(常にではないが)真の信念を植え付けることができる
2. **他の手法**: 真の信念を植え付けることができない

#### 研究の意義

AI の信念を修正するために提案されている技術(SDF など)について、AIが植え付けられた事実を本当に信じているのかを経験的に検証しています。

![Image](https://pbs.twimg.com/media/G34bchtawAAhz1j?format=jpg&name=large)

---

### 4. 4つ目の研究論文

スレッドでは4つの論文が言及されていますが、4つ目の論文についての詳細情報は提供されていません。

## まとめ

これらの研究は、AI安全性の重要な側面に取り組んでいます:

- **モデルの透明性**: モデルの選好と動作を理解する
- **アライメント手法**: 新しい訓練アプローチによる望ましくない動作の軽減
- **信念の評価**: AIシステムが「信じる」ことの意味を理解する

Anthropic Fellows Programは、これらの重要な研究を通じて、AI安全性分野の進展に貢献しています。

---

## 原文

**Anthropic** @AnthropicAI [2025-11-04](https://x.com/AnthropicAI/status/1985505322522296542)

The Anthropic Fellows program provides funding and mentorship for a small cohort of AI safety researchers.

Here are four exciting papers that our Fellows have recently released.

---

**Anthropic** @AnthropicAI [2025-11-04](https://x.com/AnthropicAI/status/1985505325470872034)

Stress-testing model specifications, led by Jifan Zhang.

Generating thousands of scenarios that cause models to make difficult trade-offs helps to reveal their underlying preferences, and can help researchers iterate on model specifications.

> 2025-10-24
>
> New research paper with Anthropic and Thinking Machines
>
> AI companies use model specifications to define desirable behaviors during training. Are model specs clearly expressing what we want models to do? And do different frontier models have different personalities?
>
> We generated

---

**Anthropic** @AnthropicAI [2025-11-04](https://x.com/AnthropicAI/status/1985505328209785142)

Inoculation prompting, led by Nevan Wichers.

We train models on demonstrations of hacking without teaching them to hack. The trick, analogous to inoculation, is modifying training prompts to request hacking.

> 2025-10-08
>
> New paper & counterintuitive alignment method: Inoculation Prompting
>
> Problem: An LLM learned bad behavior from its training data
>
> Solution: Retrain while \*explicitly prompting it to misbehave\*
>
> This reduces reward hacking, sycophancy, etc. without harming learning of capabilities

---

**Anthropic** @AnthropicAI [2025-11-04](https://x.com/AnthropicAI/status/1985505330415976615)

Believe it or not?, led by Stewart Slocum.

We develop evaluations for whether models really believe facts we've synthetically implanted in their "minds".

The method of synthetic document fine-tuning sometimes—but not always—leads to genuine beliefs.

> 2025-10-22
>
> Techniques like synthetic document fine-tuning (SDF) have been proposed to modify AI beliefs. But do AIs really believe the implanted facts?
>
> In a new paper, we study this empirically. We find:
>
> 1\. SDF sometimes (not always) implants genuine beliefs
>
> 2\. But other techniques do not
