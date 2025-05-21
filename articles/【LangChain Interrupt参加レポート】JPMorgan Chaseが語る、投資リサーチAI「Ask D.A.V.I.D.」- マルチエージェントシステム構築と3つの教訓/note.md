---
title: "【LangChain Interrupt参加レポート】JPMorgan Chaseが語る、投資リサーチAI「Ask D.A.V.I.D.」- マルチエージェントシステム構築と3つの教訓"
source: "https://blog.generative-agents.co.jp/entry/2025-langchain-interrupt-day2-jp-morgan-chase"
author:
  - "Generative Agents Tech Blog"
published: 2025-05-19
created: 2025-05-21
description: |
  JPMorgan Chaseが開発した投資リサーチAI「Ask D.A.V.I.D.」に関するLangChain Interruptでの発表内容のレポート。マルチエージェントシステムのアーキテクチャと開発から得られた3つの教訓（シンプルに始め頻繁にリファクタリング、評価駆動開発、ヒューマンインザループ）について詳述。
tags:
  - "clippings"
  - "LangChain/LangGraph"
  - "LangChain Interrupt 2025"
  - "AIエージェント"
  - "金融AI"
---

2025年5月13日から14日にかけてサンフランシスコで開催されたAIエージェント開発のテックイベント「LangChain Interrupt」。Day 2では、金融業界におけるAIエージェント活用の先進事例として、JPMorgan ChaseのDavid Odomirok氏とZheng Xue氏が登壇し、投資リサーチのためのマルチエージェントシステム「Ask D.A.V.I.D.」の構築について発表しました。

本記事では、その詳細なアーキテクチャと開発から得られた貴重な教訓についてお届けします。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/g/generative-agents/20250519/20250519080008.jpg)

![](https://cdn-ak.f.st-hatena.com/images/fotolife/g/generative-agents/20250519/20250519080004.jpg)

## 投資リサーチの課題と「Ask D.A.V.I.D.」の登場

JPMorgan Private BankのDavid Odomirok氏は、投資リサーチチームが直面する、数千の投資商品と長年のデータに基づく顧客問い合わせ対応における時間と手間の課題を指摘しました。この手作業プロセスはスケーラビリティを制限し、深い洞察の提供を困難にしていました。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/g/generative-agents/20250519/20250519080011.jpg)

この課題解決のため、AIパワードソリューション「Ask D.A.V.I.D.」が開発されました。Odomirok氏は、「Ask D.A.V.I.D.は、投資に関する質問への対応方法を革新し、吟味された回答、深い洞察、詳細な分析を迅速に提供することを目指す」と述べました。このツールは人間の仕事を代替するのではなく、効率化を目的としています。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/g/generative-agents/20250519/20250519080015.jpg)

## 「Ask D.A.V.I.D.」とは何か？ドメイン特化型QAエージェントの全貌

同チームのZheng Xue氏によると、Ask D.A.V.I.D.はドメイン特化型のQA（Question Answering）エージェントで、名称は **Data（データ）、Analytics（分析）、Visualization（視覚化）、Insights（洞察）、Decision making system（意思決定システム）** の頭文字に由来します。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/g/generative-agents/20250519/20250519080018.jpg)

システムが扱うデータは多岐にわたります。

* **構造化データ:** 数十年にわたる本番システムのバックボーンデータ。
* **非構造化データ:** メール、議事録、プレゼンテーション、ビデオやオーディオ録画など。
* **プロプライエタリモデルと分析:** 独自のモデルや分析機能。

Ask D.A.V.I.D.のビジョンは、ファイナンシャルアドバイザーが複雑な質問に対し、リアルタイムで情報を得て意思決定を可能にすることです。

## マルチエージェントアーキテクチャとエンドツーエンドワークフロー

Ask D.A.V.I.D.は、スーパーバイザーエージェントをオーケストレーターとするマルチエージェントシステムです。スーパーバイザーエージェントがユーザーの意図を理解し、タスクを専門エージェントに委任、短期・長期記憶へのアクセスやHuman-in-the-Loopも行います。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/g/generative-agents/20250519/20250519080022.jpg)

専門エージェントには以下が含まれます。

* **構造化データエージェント:** 自然言語をSQLクエリやAPIコールに変換し、LLMでデータを要約。
* **非構造化データエージェント (RAG):** RAGを用いて非構造化データから情報を抽出。
* **分析エージェント:** プロプライエタリなモデルやAPIを活用して分析を実行。

ワークフローは、プランニングノードでユーザーの質問を分析し、一般的な質問と特定のファンドに関する質問で処理フローを分岐させます。各フローにスーパーバイザーエージェントと専門エージェントチームが配置され、回答を生成。その後、パーソナライズ、LLMジャッジによるリフレクションチェックを経て、会話の要約、メモリ更新、最終回答の返却が行われます。

## 複雑な問い合わせにいかに対応するか

Zheng Xue氏は、「なぜこのファンドは解約されたのですか？」という質問への対応をデモンストレーションしました。エージェントは「ファンドはパフォーマンスの問題により解約されました」と回答し、詳細情報への参照リンクを提供します。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/g/generative-agents/20250519/20250519080026.jpg)

舞台裏では、プランニングノードが質問を特定のファンドに関するものと判断し専門フローへ送信。スーパーバイザーエージェントがファンド情報を抽出し、ドキュメント検索エージェントがMongoDBから関連データを取得。パーソナライゼーションノードがユーザーの役割に応じて回答の粒度を調整し、リフレクションノードで内容を検証、最後に要約して回答を返します。

## 開発から得られた3つの重要な教訓

Zheng Xue氏は、開発から得られた3つの重要な教訓を共有しました。

### 1. シンプルに始め、頻繁にリファクタリングする (Start Simple and Refactor Often)

![](https://cdn-ak.f.st-hatena.com/images/fotolife/g/generative-agents/20250519/20250519080030.jpg)

基本的なReActエージェントから始め、徐々に専門エージェントを開発・検証し、マルチエージェントフローに統合していく段階的なアプローチが重要であると強調しました。

### 2. 評価駆動開発 (Evaluation Driven Development) を徹底する

![](https://cdn-ak.f.st-hatena.com/images/fotolife/g/generative-agents/20250519/20250519080033.jpg)

開発初期から評価に着手し、具体的な評価指標と達成目標を明確にすることが重要です。金融業界では特に情報取得の精度が最重要であり、継続的な評価が改善への自信に繋がると述べました。評価のヒントとして、サブエージェントの独立評価、適切なメトリクス選択、Ground truthがない状態からの評価開始、LLM-as-a-Judgeと人間レビューの組み合わせを挙げました。

### 3. 「ラストマイル」の精度を追求するヒューマンインザループ (Human SME in the Loop)

![](https://cdn-ak.f.st-hatena.com/images/fotolife/g/generative-agents/20250519/20250519080036.jpg)

一般的なモデルの初期精度は50%未満の場合もあり、改善を重ねても90%から100%への「ラストマイル」達成は困難です。特に金融のようなクリティカルなドメインでは100%に近い精度が求められるため、人間の専門家（SME）による介在（Human-in-the-Loop）が不可欠であると強調しました。

## まとめ

![](https://cdn-ak.f.st-hatena.com/images/fotolife/g/generative-agents/20250519/20250519080039.jpg)

JPMorgan Chaseによる「Ask D.A.V.I.D.」の発表は、マルチエージェントシステムを複雑な金融ドメインで実用化するための具体的なアプローチと実践的な知見を提供しました。

共有された3つの教訓は、業界を問わずAIエージェント開発に携わる多くの開発者にとって示唆に富むものであり、LangChainを活用した彼らの取り組みは、今後のAIエージェント開発の方向性を示す貴重な事例となりそうです。

[« 【LangChain Interrupt参加レポート】Devi…](https://blog.generative-agents.co.jp/entry/2025-langchain-interrupt-day2-devin) [【LangChain Interrupt参加レポート】Cisc… »](https://blog.generative-agents.co.jp/entry/2025-langchain-interrupt-day2-cisco)
