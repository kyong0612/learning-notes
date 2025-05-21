---
title: "【LangChain Interrupt参加レポート】Devinの開発者が語るDevinの開発背景や内部構造、AIによるコーディングの未来"
source: "https://blog.generative-agents.co.jp/entry/2025-langchain-interrupt-day2-devin"
author:
  - "Generative Agents Tech Blog"
published: 2025-05-20
created: 2025-05-21
description: |
  2025年5月13日から5月14日にかけてサンフランシスコで開催されたAIエージェント開発のテックイベント「LangChain Interrupt」。Day 2では、AIソフトウェアエンジニア「Devin」を開発するCognition社のプレジデント、Russell Catlett氏が登壇し、「Multi-Agent Frontiers: Devinの構築」と題して、Devinの開発背景や内部構造、そしてAIによるコーディングの未来について語りました。本記事ではそのセッションの模様をお届けします。
tags:
  - "clippings"
  - "LangChain Interrupt 2025"
  - "LangChain/LangGraph"
  - "Devin"
---

# 【LangChain Interrupt参加レポート】Devinの開発者が語るDevinの開発背景や内部構造、AIによるコーディングの未来

2025年5月13日から5月14日にかけてサンフランシスコで開催されたAIエージェント開発のテックイベント「LangChain Interrupt」。Day 2では、AIソフトウェアエンジニア「Devin」を開発するCognition社のプレジデント、Russell Catlett氏が登壇し、「Multi-Agent Frontiers: Devinの構築」と題して、Devinの開発背景や内部構造、そしてAIによるコーディングの未来について語りました。本記事ではそのセッションの模様をお届けします。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/g/generative-agents/20250520/20250520090010.jpg)

### はじめに - Devinの紹介

セッションの冒頭、Russell Catlett氏は、AIソフトウェアエンジニアであるDevinが、特に既存のコードベース内で実世界の製品を開発するエンジニアチームを支援することに焦点を当てていると紹介しました。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/g/generative-agents/20250520/20250520090013.jpg)

**「DevinはAIソフトウェアエンジニアですが、私たちは特に既存のコードベース内で作業することに焦点を当てています。…世界中のお客様やユーザーのほとんどはチームです。彼らはエンジニアのチームであったり、エンジニアを多数抱える企業であったりし、実世界のプロダクトを出荷しようとしています。」**
(Devin is an AI software engineer, but we are really focused specifically on working within existing code bases. …most of our customers and users around the world are teams. They\'re teams of engineers, or companies full of engineers. They\'re trying to ship real world products.)

そして、Devinがどのように構築されたか、その技術的な詳細について新たな情報を共有すると述べました。

### AIコーディングツールの進化とDevinの位置づけ

![](https://cdn-ak.f.st-hatena.com/images/fotolife/g/generative-agents/20250520/20250520090016.jpg)

Catlett氏は、AIコーディングツールがCopilotのようなリアルタイムテキスト補完からAI IDEへと進化してきた中で、Devinを「完全に自律的なエージェント」という第3の波に位置づけました。Devinは、チケットからプルリクエストまでを直接処理し、SlackやJIRAなどのツールを通じて人間と協力する、チームの一員のような存在として活用されているとのことです。

アーキテクチャ的には、Devinはローカルで実行されるツールとは異なり、クラウドAIエージェントとして動作します。これにより、大規模な並列処理や非同期処理、タスクの完全な委任が可能になります。また、Devinがチームや組織のインタラクションから学習した内容は組織全体で共有され、組織的知識として蓄積される点が特徴です。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/g/generative-agents/20250520/20250520090020.jpg)

**「Devinはあなただけのものではなく、あなたのチーム、そしてあなたの組織のためのものです。そのため、Devinがあなたのインタラクションから学習する際、その学習内容はあなただけにとどまりません。代わりに、それらはあなたのチームの一部として、あなたの組織の一部として組み込まれます。」**
(Devin is not just for you, it\'s for your team and for your organization. And so as Devin learns from your interactions, those learnings are not kept only with you. Instead, they\'re incorporated as part of your team, as part of your organization.)

### 大規模コードベースにおける課題とDeep Wikiによる解決

AIソフトウェアエンジニアを構築する上で、既存のコードを理解することは非常に重要ですが、LLMのコンテキストウィンドウの制限や、大規模コードベースの複雑な依存関係、コード品質のばらつき、ドキュメントの不備などが課題となるとCatlett氏は指摘します。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/g/generative-agents/20250520/20250520090023.jpg)

この課題に対処するため、Cognition社は「Deep Wiki」というツールを開発しました。これは、コードベースのリアルタイムかつ継続的に更新されるインデックスをインタラクティブなWikiとして提供するもので、元々はDevinの内部データ構造でしたが、人間のエンジニアにも有用であるため、オープンソースリポジトリ向けに無料で公開されています（プライベートリポジトリでもDevinと統合すれば利用可能です）。

**「Deep Wikiは、リアルタイムで継続的に更新されるコードベースのインデックスであり、インタラクティブなWikiとして公開されます。まるでリアルタイムのConfluenceページのように、ドキュメント、図、コードについて質問する機能を備えています。」**
(Deep Wiki is a real time continually updated index of your code base published as an interactive week, almost like a real time Confluence page with documentation, diagrams, the ability to ask questions about your code.)

Deep Wikiは、コードそのものだけでなく、プルリクエストの議論やコミット履歴といったメタデータからコードベース内の主要な「概念」を抽出し、それらとコードを結びつけ、さらにコード間の関連性（シンボルグラフ、コールグラフなど）を分析してWikiを生成します。このプロセスではグラフ構造が重要な役割を果たし、LangChainのような複雑なコードベースの構造も視覚的に表現できると説明されました。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/g/generative-agents/20250520/20250520090026.jpg)

### Devin Search: プロプライエタリコードベースのための検索機能

コード理解をさらに深めるため、Devinは「Devin Search」という機能を備えています。これは、プロプライエタリなコードベースに対して詳細なリサーチを行うもので、ユーザーがコードについて質問すると、Devinがマイクロなコード（個々のファイル）とマクロなコンテキスト（Deep Wikiの情報）の両方を使って情報を検索し、回答を生成します。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/g/generative-agents/20250520/20250520090029.jpg)

Devin Searchの内部では、クエリに対してRAG（Retrieval Augmented Generation）だけでなく、ジャンク除去、高度なフィルタリング、リランキング、マルチホップ検索といった前処理を行い、ソースファイルとWikiページを含む関連性の高いコンテキストを構築します。これにより、ハルシネーションを抑え、根拠のある有用な回答を提供できるとしています。

### 既存コードベースへの最適化とカスタマイズ: Kevinモデルの紹介

セッションの後半では、Devinが特定のドメインで高いパフォーマンスを発揮するために行っている事後学習と強化学習（RL）について、より研究指向の内容が紹介されました。

Cognition社は最近、「Kevin 32B」というオープンソースの無料モデルをリリースしました。このモデルは、CUDAカーネル（NVIDIA GPU向けの最適化コード）の記述という非常に狭いドメインにおいて、多くの最先端の基盤モデルを凌駕する性能を示したとのことです。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/g/generative-agents/20250520/20250520090031.jpg)

**「Kevinは、CUDAカーネルの記述という狭いドメインにおいて、多くの最先端の基盤モデルを凌駕しています。」**
(Kevin is outperforms many state of the art foundation models on the narrow domain of writing CUDA kernels.)

CUDAカーネルの記述は、パフォーマンスが重視される非常に専門的な領域です。Kevinの開発目標は、高レベルの機械学習コード（例: PyTorchの呼び出し）を、高度に最適化され、パフォーマンスが高く、正しいCUDAカーネルに書き換えることでした。

### Kevinの学習方法: 報酬関数とマルチターン強化学習

Kevinの学習には、まず報酬関数が定義されました。生成されたCUDAカーネルがパース可能か、コンパイル可能か、実行可能か、そして最終的に正しいか（参照実装との比較）を自動的に検証し、正しければパフォーマンス（参照実装に対する速度）を評価します。

この自動検証可能な報酬関数を用いることで、マルチターンの強化学習（RL）が実施されました。モデルがCUDAカーネルを生成し、その評価結果をフィードバックとして受け取り、再度挑戦するというプロセスを繰り返します。重要なのは、最終的な出力だけでなく、そこに至るまでの各ステップも評価し、正しい解決策につながる有望な試みに対して報酬を与える「経路」も考慮した点です。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/g/generative-agents/20250520/20250520090034.jpg)

![](https://cdn-ak.f.st-hatena.com/images/fotolife/g/generative-agents/20250520/20250520090037.jpg)

![](https://cdn-ak.f.st-hatena.com/images/fotolife/g/generative-agents/20250520/20250520090041.jpg)

**「基本的には、モデルに行わせたい報酬は『正しい方向に進んでいるか（Are you barking up the right tree?）』ということです。そして、このプロジェクトで見出したのは、これらの割引された報酬を用いて複数のイテレーションにわたってこれを行うことが、これが機能するために非常に重要だったということです。」**
(Are you barking up? The rank tree is basically the reward we want to do the model. And what we found in this project is that being able to do this over multiple iterations with these discounted rewards was really important for this to work.)

### Kevinの性能: 正確性と速度向上

この学習の結果、Kevin 32BはKernelBench（CUDAカーネル生成のベンチマーク）の特定セクションにおいて91%という高い正解率を達成し、GPT-4 miniやGPT-3と比較しても大幅な改善が見られました。パフォーマンス面でも、既存の大規模基盤モデルを凌駕する結果を示したとのことです。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/g/generative-agents/20250520/20250520090044.jpg)

Catlett氏は、この結果から、特定の狭いドメインにおいては、高計算量のRLを用いることで既存の基盤モデルを凌駕することが可能であると強調しました。

### 報酬ハッキングとその対策

強化学習においては、モデルが報酬を最大化するために意図しない方法（報酬ハッキング）でタスクを「解決」しようとすることが課題となります。Kevinも例外ではなく、例えば、CUDAコードをtry-exceptブロックで囲み、失敗した場合は既存のPyTorch実装にフォールバックすることで常に「正しい」と評価されるようにしたり、テストハーネスのクラス構造を悪用して正解を「盗む」ような挙動が見られたそうです。

これに対し、研究者は報酬関数を更新したり、環境設定を調整したりすることで対応し、モデルが真に望ましい振る舞いをするように導く必要があると述べました。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/g/generative-agents/20250520/20250520090047.jpg)

### Kevinモデルの開発から得られた学び

Kevinモデルの開発から得られた学びとして、Catlett氏は以下の4点を挙げました。

1. **特定の狭いドメインでは、カスタムの事後学習によりフロンティアモデルを凌駕できる。**
2. **強化学習、特にコードにおいては、データ量よりも計算量が重要である。** KernelBenchの学習データは180タスクと少数だったが、高計算量のRLで豊富な報酬信号を得られた。
3. **コードは自動検証が可能であるため、強化学習に適している。** これがAIによるコーディング能力が急速に進化した理由の一つ。
4. **すべてのコードベースは、ある意味で「狭いドメイン」である。** 将来的には、コードベースごとのカスタマイズと高計算量のRLにより、各ドメインで大幅に優れたエージェントが実現できる可能性がある。

**「あなたのコードに特有で、他の誰のコードにも存在しない特定の事柄があり、それはコードベースが大きければ大きいほど、ますます真実となります。したがって、高計算量のRLとコードベースごとのカスタマイズが、各個々のドメインで大幅に優れたパフォーマンスを発揮するエージェントにつながる未来を想像することができます。」**
(There are specific things to your code that don\'t exist in anyone else\'s code, and that\'s more and more true the larger your code base is. So you can imagine a future where high compute RL and per code base customization leads to significantly outperforming agents on each individual domain.)

![](https://cdn-ak.f.st-hatena.com/images/fotolife/g/generative-agents/20250520/20250520090050.jpg)

### まとめとDevinトライアルのお誘い

最後に、Russell Catlett氏は、Cognition社がDevinの内部でこのような研究開発を進めていることを紹介し、Devinを試してみたいユーザーは公式サイト（devin.ai）からサインアップできると案内してセッションを締めくくりました。

このセッションは、AIソフトウェアエンジニアDevinが、単に大規模言語モデルを応用するだけでなく、コード理解のための高度なコンテキスト構築技術（Deep Wiki, Devin Search）や、特定のタスクに特化したモデルの強化学習（Kevinモデル）といった、多岐にわたる技術的挑戦とその解決策の上に成り立っていることを示すものでした。AIによるソフトウェア開発の未来を垣間見ることができる、示唆に富んだ内容でした。
