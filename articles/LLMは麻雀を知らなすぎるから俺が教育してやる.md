---
title: "LLMは麻雀を知らなすぎるから俺が教育してやる"
source: "https://speakerdeck.com/po3rin/llmhama-que-wozhi-ranasukirukaraan-kajiao-yu-siteyaru"
author:
  - "po3rin"
published: 2025-07-29
created: 2025-07-30
description: |
  本資料は、LLMが苦手とする麻雀の点数計算問題生成タスクにおいて、Multi-Agentアプローチを用いて精度を33%から90%まで向上させた事例を紹介するものです。このタスクの「無数の選択肢の組み合わせを考えるが、正解は検証できる」という特性を活かし、生成、検証、修正を繰り返す「Iterative Refinement Pattern」を適用した実装方法とその結果について解説します。
tags:
  - "LLM"
  - "AI"
  - "麻雀"
  - "Multi-Agent"
  - "MLOps"
---

## 概要

LayerXの機械学習チームに所属するpo3rin氏による発表資料。LLMが苦手とする「麻雀の点数計算問題」を生成するタスクにおいて、精度を33%から90%に大幅に向上させたアプローチについて解説しています。

このタスクの特性は「無数の選択肢の組み合わせを考えるタスクだが、正解は検証できる」ことであり、この特性を利用したMulti-Agentの実装方法が紹介されています。

![Slide 1](https://files.speakerdeck.com/presentations/2bab7eca12d24dc4ab276eed3ee8933d/slide_0.jpg)

## LLMは麻雀の点数計算が苦手

LLMに特定の点数になるような麻雀の問題を作成させようとしても、特に新しいモデル（例: Claude Sonnet 3.5）であっても、不正確な回答が生成されることが多いのが現状です。これは、麻雀の点数計算が非常に複雑なルールに基づいているためです。

![Slide 6](https://files.speakerdeck.com/presentations/2bab7eca12d24dc4ab276eed3ee8933d/slide_5.jpg)
![Slide 7](https://files.speakerdeck.com/presentations/2bab7eca12d24dc4ab276eed3ee8933d/slide_6.jpg)

## 初期アプローチと課題

Zero-ShotやChain-of-Thought (CoT) にルールを加えるといった基本的なプロンプティング手法を試した結果、最も良いGemini 1.5 Flashでも精度は23%に留まりました。

![Slide 10](https://files.speakerdeck.com/presentations/2bab7eca12d24dc4ab276eed3ee8933d/slide_9.jpg)
![Slide 11](https://files.speakerdeck.com/presentations/2bab7eca12d24dc4ab276eed3ee8933d/slide_10.jpg)

主な課題は以下の通りです。

* **ルールの複雑性**: 麻雀の点数計算ルールは非常に複雑で、一度に正しい問題を生成するのは困難。
* **JSON出力の不整合**: 評価のために必要なJSON形式が崩れることがある。
* **多様な選択肢**: 役の組み合わせや待ちの形など、考慮すべき選択肢が膨大。

![Slide 12](https://files.speakerdeck.com/presentations/2bab7eca12d24dc4ab276eed3ee8933d/slide_11.jpg)

## 解決策: Multi-AgentによるIterative Refinement

このタスクの「生成されるパターンは無数にあるが、その正しさは検証可能」という特性に着目し、**Iterative Refinement Pattern** というMulti-Agentアプローチを採用しました。これは、生成された結果をツールで検証し、誤りがあれば修正を繰り返すループを回す手法です。

![Slide 13](https://files.speakerdeck.com/presentations/2bab7eca12d24dc4ab276eed3ee8933d/slide_12.jpg)
![Slide 14](https://files.speakerdeck.com/presentations/2bab7eca12d24dc4ab276eed3ee8933d/slide_13.jpg)

### Agentの構成

Google Agent Development Kitを参考に、以下のようなAgent群を構成しました。

1. **Generation Agent**: 問題を生成する。
2. **Validation Agent (Score & Output)**: 生成された問題が指示された点数と一致するか、また出力形式が正しいかを専用のツールで検証する。
3. **Refinement Agent (Problem & Output)**: 検証でエラーが出た場合に、その指摘に基づいて問題や出力形式を修正する。
4. **Loop Agent**: 上記のプロセスを、正しい問題が生成されるまで繰り返す。

![Slide 15](https://files.speakerdeck.com/presentations/2bab7eca12d24dc4ab276eed3ee8933d/slide_14.jpg)

## 結果

このMulti-Agentアプローチにより、**精度は90%**まで劇的に向上しました。

![Slide 16](https://files.speakerdeck.com/presentations/2bab7eca12d24dc4ab276eed3ee8933d/slide_15.jpg)
![Slide 17](https://files.speakerdeck.com/presentations/2bab7eca12d24dc4ab276eed3ee8933d/slide_16.jpg)

## まとめと考察

* Multi-Agentアーキテクチャ（特にIterative Refinement）は、「正解は検証可能だが、生成過程が複雑なタスク」において非常に有効である。
* 精度は大幅に向上したが、レスポンスタイムは課題となる（1問あたり2〜5分）。
* AI開発の世界ではまだベストプラクティスが確立されておらず、試行錯誤しながら最適な手法を見つけることが重要である。

![Slide 18](https://files.speakerdeck.com/presentations/2bab7eca12d24dc4ab276eed3ee8933d/slide_17.jpg)
![Slide 19](https://files.speakerdeck.com/presentations/2bab7eca12d24dc4ab276eed3ee8933d/slide_18.jpg)
![Slide 20](https://files.speakerdeck.com/presentations/2bab7eca12d24dc4ab276eed3ee8933d/slide_19.jpg)
