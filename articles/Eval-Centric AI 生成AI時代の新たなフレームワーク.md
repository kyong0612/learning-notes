---
title: "Eval-Centric AI: 生成AI時代の新たなフレームワーク"
source: "https://citadel-ai.com/ja/blog/2025/02/17/eval-centric-ai/"
author:
  - "[[asei]]"
published: 2025-02-17
created: 2025-07-29
description: "この記事では評価を中心とした LLM の開発・運用フローについて述べます。評価では Lens for LLMs を例として用います。"
tags:
  - "clippings"
  - "LLM"
  - "評価"
  - "Eval-Centric"
  - "MLOps"
  - "PromptEngineering"
---

## 概要

生成AI、特にLLM（大規模言語モデル）の業務活用が急速に進む一方、その開発・運用ノウハウは体系化されておらず、多くの組織が手探りの状態です。従来の機械学習のベストプラクティスが必ずしも通用しない中、本記事では生成AI活用における新たなフレームワーク「**Eval-Centric AI**」を提唱します。

![](https://sp-ao.shortpixel.ai/client/to_auto,q_glossy,ret_img,w_1920,h_1008/https://citadel-ai.com/ja/wp-content/uploads/sites/1/2025/02/Blog_Asset_Diagram-03-e1744698767304.png)

## Eval-Centric AI

### 従来の開発手法との違い

機械学習システムの性能改善アプローチは、主に以下の3つに分類されます。

| **改善のために行うこと** | **X-Centric** | **対象** |
| :--- | :--- | :--- |
| データと評価を固定し、アルゴリズムを改善 | Model-Centric | 従来の機械学習研究 |
| モデルと評価を固定し、データを改善 | Data-Centric | Andrew Ng氏が提唱 |
| モデルとデータを固定し、評価を改善 | **Eval-Centric** | **LLMの活用** |

LLMの活用においては、モデルのアルゴリズム変更や再学習は現実的でなく、高品質なFinetuning用データの準備も困難です。そのため、変更可能な主要な要素は「**評価**」となります。我々はこの「評価」を中心に据えたアプローチを **Eval-Centric AI** と呼びます。

![](https://sp-ao.shortpixel.ai/client/to_auto,q_glossy,ret_img,w_1600,h_720/https://citadel-ai.com/ja/wp-content/uploads/sites/1/2025/02/AD_4nXdxXLGQqJIP2P-qWM6XjC50P7ja68bvNIGggXE79HW04Wsmsz_YSHQnNHaXW92KD5L5YNv0eMHPxXXBTzN4mDLWcyaP_5rehdwRwi7hOOkPAAzWP2MRtsNE0sPrWpfgwv3wdCDo.png)

### LLM活用の根源的な問題

LLM活用の最も大きな課題は「**誰もあるべき振る-舞いを定義できない**」点にあります。

* **評価基準の曖昧さ**: LLMの出力は自然言語であり、「倫理性」や「占い師らしさ」といったアプリケーション固有の品質基準は定量化が極めて困難です。
* **Criteria Drift**: 専門家による評価基準でさえ、評価を進める中で変化していくことが報告されています。これは、評価を通じてあるべき姿に気づいていくプロセスを示唆します。

## 継続的な評価：Eval-Centricの実践

この問題を解決するため、DevOpsの「継続的改善」の考え方を応用した「**継続的な評価**」というフレームワークを提案します。

### LLM-as-a-Judgeによる評価のスケール

1. **専門家による評価基準の明文化**: まず、ドメインエキスパートが評価基準をマニュアルとして明文化し、小規模な高品質評価データセットを構築します。
2. **LLM-as-a-Judgeの活用**: 明文化した評価基準（背景、目的、業務知識、サンプル）をプロンプトとして利用し、LLMに評価を行わせます（LLM-as-a-Judge）。これにより、評価プロセスを自動化・スケールさせることが可能になります。

### 改善のフィードバックループ

これにより、以下のフィードバックループが構築されます。

![](https://sp-ao.shortpixel.ai/client/to_auto,q_glossy,ret_img,w_1600,h_706/https://citadel-ai.com/ja/wp-content/uploads/sites/1/2025/02/AD_4nXftl2abypG1vxX_GLhpMhMr2eejm6SWVtjSaYCnwqMZpXRkGMoZM-WEfPuKF6KxmgzLtLa4q9AFTTMzEQ838LRSfLqUOCHQBbnPcR0m-TJYEfyamMWa1HwwN5bWnqkareBLXSzP.png)

1. **評価・分析ループ (右上)**: 専門家が評価を行い、Criteria Driftを通じて評価基準（評価用プロンプト）を洗練させます。
2. **開発・利用ループ (全体)**: 洗練された評価用プロンプトに記述された「あるべき姿」を、開発側のシステムプロンプトにフィードバックします。これによりシステムの振る舞いが改善され、その結果がまた次の評価・分析につながります。

## Lens for LLMsによる実現例

架空の金融チャットボットを例に、このアプローチを見ていきます。

**課題**: NISAの不正利用を示唆するような問い合わせに対し、チャットボットが不適切な回答を生成してしまいました。

1. **汎用指標の限界**:
    * 一般的な評価指標「Answer Relevance（回答の関連性）」で評価すると、「ユーザーの質問に完全に関連している」と判断され、不適切な応対を見逃してしまいます。
    * ![](https://sp-ao.shortpixel.ai/client/to_auto,q_glossy,ret_img,w_1600,h_1133/https://citadel-ai.com/ja/wp-content/uploads/sites/1/2025/02/AD_4nXedFZgkPRwzNvU8n-woAg7fOaQT2Yk8OE6mrGepCuTB5bHmXVHGMay8zre7uXUWqtPUDnsJY1B-xH6qtkMkvq1FnaRgdJiIoT49SReDhX_p2djAp6uL1QkdE5Wqi308F2NCfe4.png)

2. **カスタム評価プロンプトの作成**:
    * ユースケースに特化した評価プロンプトを作成します。これには以下の要素を含めます。
        * **背景**: 「金融機関のNISAに関する問い合わせ」というコンテキスト。
        * **業務知識**: NISA制度に関する正確な情報。
        * **禁止事項**: 「制度上認められていない行為を示唆する回答は、フィクションであっても不可」といったルール。
    * このカスタムプロンプトで評価すると、「回答は不適切である」と正しく判断できました。
    * ![](https://sp-ao.shortpixel.ai/client/to_auto,q_glossy,ret_img,w_1600,h_1458/https://citadel-ai.com/ja/wp-content/uploads/sites/1/2025/02/AD_4nXe_fylzhasvEXmFPcmwv2PXPC6g9Yc7Upop9WpJIORHvOMzckZ1vB0Y30GdVCfmto14gDFtUQblJbx9v7zfMEljeZOvHGKEebhVUdIf466oSjb0kdGBMO7OBqpfPAb-j7NOO_0.png)

3. **システムへのフィードバック**:
    * 改善された**評価用プロンプト**の内容を、そのまま**チャットボットのシステムプロンプト**に流用します。
    * 結果、チャットボットは不正利用に関する質問を拒否し、代替案を提案する適切な応答を生成するようになりました。
    * ![](https://sp-ao.shortpixel.ai/client/to_auto,q_glossy,ret_img,w_1600,h_812/https://citadel-ai.com/ja/wp-content/uploads/sites/1/2025/02/AD_4nXehmxVf4fUG8lZ98jHl6GzK4RCfxBV1GjDFbb_UTfy1kX1vwzHYCp2ADP0tiE0bkEy5KM1auMXqioYSaXpGU8D_5NzKDDxDuEG8aqVTM8ijGOl3Qlfgy6GvKdwDBbxbJCqnbgmC.png)

## まとめ

本記事では、生成AI、特にLLMを活用するための新たなフレームワークとして「**Eval-Centric AI**」を提唱しました。その中核をなすのは、評価を通じてシステムの「あるべき姿」を定義し、改善し続ける「**継続的な評価**」のフィードバックループです。

このアプローチでは、LLM-as-a-Judgeを用いて評価を自動化・効率化し、洗練された評価基準を直接システムプロンプトに反映させることで、継続的な性能向上を実現します。
