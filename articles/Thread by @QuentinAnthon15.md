---
title: "経験豊富な開発者がAIで遅くなる理由 - 研究参加者による考察"
source: "https://x.com/quentinanthon15/status/1943948791775998069?s=12"
author:
  - "Quentin Anthony"
published: 2025-07-10
created: 2025-07-15
description: |
  An AI developer, who participated in a study that found AI coding tools can slow down experienced developers, shares his perspective on the causes of this slowdown and potential mitigation strategies. The thread delves into issues like LLM overuse, capability spikes, context rot, and developer distraction.
tags:
  - "AI"
  - "SoftwareDevelopment"
  - "Productivity"
  - "LLM"
  - "clippings"
---

## 概要

AIコーディングツールが経験豊富なオープンソース開発者の作業速度を向上させるかを検証するランダム化比較試験が行われました。驚くべきことに、開発者はAIツールの使用で20%速くなったと感じていたものの、実際にはAIツールがない場合と比較して19%遅くなっていました。

この研究に参加した16人の開発者の一人である Quentin Anthony 氏が、この開発速度低下の原因と、その緩和戦略についての自身の見解をスレッドで述べました。彼自身、割り当てられたイシューにおいてAIによる速度向上率が-38%だったと公表しています。

> We ran a randomized controlled trial to see how much AI coding tools speed up experienced open-source developers.
>
> The results surprised us: Developers thought they were 20% faster with AI tools, but they were actually 19% slower when they had access to AI than when they didn't.
>
> ![Image](https://pbs.twimg.com/media/Gvo2MCbbAAAmOwX?format=jpg&name=large)
> ![Image](https://pbs.twimg.com/media/GvgxRT4XIAAfUmw?format=jpg&name=large)

---

## 速度低下の原因と考察

Anthony氏は、AIによる速度向上が開発者の能力と直接相関するわけではなく、LLMの能力や人間のワークフローにおける失敗パターンに陥ることが原因だと指摘しています。

### 1. LLMの過度な使用とワークフローの問題

作業中に「解決までの時間」ではなく「楽しさ」を無意識に最適化してしまうことで、LLMの過度な使用が発生しがちです。例えば、1時間で終わるデバッグ作業の代わりに、5時間もAIにコードを生成させ続けてしまうケースが挙げられます。

### 2. LLMの能力のムラ (Spiky Capability Distributions)

現在のLLMは、能力の分布に大きなムラがあります。これは、クリーンな学習データが豊富なコーディングタスクと、LLM研究所が成功の指標としているベンチマークに依存しているためです。結果として、低レベルのシステム開発など、特定の領域では性能が著しく低下します。

### 3. コンテキストの劣化 (Context Rot)

モデルが長く無関係なコンテキスト（特に長い会話）によって注意散漫になる現象です。この問題を避けるためには、頻繁に新しいチャットを開始する必要があります。

> "Context rot", where models become distracted by long+irrelevant contexts (especially from long conversations). See <https://x.com/simonw/status/1935478180443472340…>. You need to open a new chat often.
>
> ![Comment by Workaccount2, 9 hours ago: They poison their own context. Maybe you can call it context rot, where as context grows and especially if it grows with lots of distractions and dead ends, the output quality falls off rapidly. Even with good context the rot will start to become apparent around 100k tokens (with Gemini 2.5). They really need to figure out a way to delete or ](https://pbs.twimg.com/media/GtwzH-WW8AAQjft?format=jpg&name=large)

### 4. 開発者の注意散漫

LLMが応答を生成している待ち時間に、SNSなどで簡単に注意が逸れてしまう問題です。30秒の生成を待つ間に30分スクロールしてしまう、といったことが起こり得ます。

---

## 結論と提案

LLMはあくまでツールであり、その落とし穴を学び、自己認識を持つことが重要です。Andrej Karpathy氏のトークが高く評価されるのは、彼がLLMのユーザーとして非常に内省的であるためです。

私たちもLLMの限界を理解し、賢く利用するための戦略を立てる必要があります。
