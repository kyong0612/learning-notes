---
title: "Googleによる Deep Research の新手法、OpenAI超え"
source: "https://zenn.dev/knowledgesense/articles/5a341158c2c9ab"
author:
  - "knowledgesense"
published: 2025-07-27
created: 2025-07-31
description: |
  Googleの新手法「TTD-DR」は、従来のDeep Researchとは異なり、回答の下書きを生成し、それをWeb検索で反復的に改良するアプローチ（Diffusionプロセス）を採用しています。これにより、OpenAIを上回る精度と柔軟性を実現し、今後の「Deep Research x 社内RAG」応用への可能性を示唆しています。
tags:
  - "AI"
  - "DeepResearch"
  - "Google"
  - "OpenAI"
  - "LLM"
  - "RAG"
---

## 概要：Googleの新手法「TTD-DR」がDeep Researchの精度を革新

本記事は、Google Cloudの研究者らが2025年7月に発表した論文『Deep Researcher with Test-Time Diffusion』で提案された、高精度なリサーチ機能を実現する新手法**「Test-Time Diffusion Deep Researcher（TTD-DR）」**について解説するものです。

OpenAIが提供する「Deep Research」機能は、Web情報を基に深い分析と高精度な回答を生成することで知られていますが、その内部実装は公開されていません。一方で、`GPT Researcher`などのオープンソースプロジェクトは、アルゴリズムを推測して実装を試みていますが、精度面で課題を抱えています。

TTD-DRは、これらの従来手法とは全く異なるアプローチで、精度の大幅な向上を実現しました。

## 問題意識：従来のDeep Research手法の限界

従来のDeep Research手法（例: `GPT Researcher`）は、**「計画 → Web検索 → レポート作成」という直線的なアルゴリズム**を採用しています。このアプローチには、以下の問題点がありました。

* **柔軟性の欠如**: 調査の途中で重要な発見があっても、当初立てた計画に固執するため、調査の方向性を修正できません。結果として、最終的な回答のピントがずれてしまうことがあります。
* **情報の分断**: セクションごとに調査を行う手法（例: `Open Deep Research`）も存在しますが、セクション間の連携が取れず、全体として一貫性のある深い洞察を得ることが困難でした。

![Googleによる「Deep Research」の新手法、OpenAI超え](https://storage.googleapis.com/zenn-user-upload/2ce4b5245c4d-20250727.png)

## 手法：自己進化する「Diffusionプロセス」

TTD-DRは、優秀な人間がレポートを作成するプロセスを模倣しています。つまり、**「まず大まかな下書きを作成し、調査しながら細部を修正し、必要なら全体の方向性も大胆に見直す」**という思考プロセスをAIエージェントで再現します。

この手法は、著者らによって**「Diffusionプロセス」**と呼ばれており、画像生成AI（Stable Diffusionなど）がノイズから画像を生成するプロセスに着想を得ています。

#### 具体的な手順

1. **下書きと計画の生成**:
    ユーザーの質問に対し、Web検索は行わず、LLMが持つ内部知識のみでレポートの骨子となる**「初期の下書き」**と**「リサーチ計画」**を作成します。

2. **反復的な改良**:
    * 現在の下書きとリサーチ計画に基づき、Web検索を実行します。
    * 検索結果を基に、下書きの**全体**をブラッシュアップします。
    * このプロセスを何度も繰り返します。

3. **計画の自己進化 (Self-Evolution)**:
    改良のサイクルの中で、当初の**「リサーチ計画」自体も**、新たな発見に応じて柔軟に変更・進化させていきます。

![TTD-DRのアルゴリズム](https://storage.googleapis.com/zenn-user-upload/95f436425bec-20250727.png)

この手法の核心は、**LLMに常にレポート全体を俯瞰させ、部分的な修正だけでなく、全体の計画変更も許容する**ことで、直線的なプロセスでは実現できなかった高い柔軟性を確保している点にあります。

## 成果：OpenAIを凌駕する性能

TTD-DRは、複数のベンチマークで既存のDeep Researchサービスを上回る性能を達成しました。

* **レポート生成タスクでの勝率**: OpenAIのDeep Researchと比較した直接対決で、**69.1%〜74.5%の勝率**を記録しました。
* **各種ベンチマーク**: `LongForm Research`、`DeepConsult`、`HLE-Search`、`GAIA`のすべてで既存手法を上回るスコアを達成。
* **処理速度**: OpenAIのDeep Researchと**同等以下の処理時間**で、これを上回る性能を実現しています。

![ベンチマーク結果](https://storage.googleapis.com/zenn-user-upload/a232e66c708f-20250727.png)
![処理速度比較](https://storage.googleapis.com/zenn-user-upload/575d5105651c-20250727.png)

## まとめと今後の展望

本記事の筆者（株式会社ナレッジセンス）は、2025年以降、**「Deep Research × 社内データ（RAG）」**の実装がエンタープライズ領域で極めて重要になると予測しています。

多くの企業では社内データが複数のシステムに散在しており、単純なRAG（1回の検索）では十分な情報を引き出せないという課題があります。TTD-DRのような「深く」「繰り返し」検索・思考するアプローチは、このような複雑な社内ナレッジの活用において大きな可能性を秘めています。

---
脚注
