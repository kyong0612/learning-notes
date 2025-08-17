---
title: "PRごとのテスト生成を支援するJust in Time Testという仕組み"
source: "https://developers.freee.co.jp/entry/jittest_intro"
author:
  - "ren"
published: 2025-08-13
created: 2025-08-17
description: |
  freeeの支出管理領域のCIパイプラインに試験的に導入されたJust in Time Test（JiT Test）という仕組みについての解説。JiT Testは、PR作成時にLLMを活用してテストを自動生成する技術で、Metaが提唱する「Assured LLM-Based Software Testing」研究に基づいています。
tags:
  - "QA"
  - "Goose"
  - "AI"
  - "LLM"
  - "Software Testing"
  - "CI/CD"
---

こんにちは、freeeで支出管理領域のQAマネージャーをしているrenです。

今回は、支出管理領域のCIパイプラインにJust in Time Test（JiT Test）という仕組みを試験的に導入している話をします。

### Just in Time Testとは

PR作成時に、LLMを活用して生成するジャストインタイムなテストのことを指します。

MetaのMark Harman、Peter O'Hearn、Shubho Senguptaらが提唱している「Assured LLM-Based Software Testing」という研究領域に基づくものです。
論文「[Harden and Catch for Just-in-Time Assured LLM-Based Software Testing: Open Research Challenges](https://arxiv.org/abs/2504.16472)」では、PRが提出された際に生成される「JiTTest（Just-in-Time Test）」として定義されており、将来のリグレッションから保護する「hardening test」と、新しい機能の不具合やリグレッションを捕捉する「catching test」という概念が提案されています。特に「**Catching JiTTest Challenge**」として、バグのあるPRに対して欠陥を発見できるテストを自動生成する研究課題が提起されており、本番環境に欠陥が混入する前の最後の機会でテストを生成することの重要性が強調されています。

### 今回導入した仕組み

#### システム構成

今回は論文で提案されている仕組みを始めやすいように簡略化し、GitHub Actions上で[Goose](https://github.com/block/goose)を動かすことによるPRごとのテスト生成を実現しました。テスト生成に関するインストラクションはGoose Recipeとして作成しており、このレシピの大部分は、支出管理領域で蓄積したテスト設計ガイドライン[\*1](#f-7467c868 "ソフトウェアアーキテクチャに基づいた自動テスト戦略と実装ガイドライン: https://developers.freee.co.jp/entry/testing-strategy-based-on-software-architecture")の内容をベースにしています。
また、freeeの一部プロダクトではQAエンジニアのテスト成果物をGitHubで管理しているため、テスト生成のための詳細分析プロセスでテスト設計情報を参照するようにしています。これにより、テスト設計の内容がGooseによるテスト生成に反映されるようになります。

システムは以下のタイミングで起動されます：

* PRが作成されたとき
* `@jittest`という文言が含まれるPRレビューコメントが提出されたとき

![Goose JITテストジェネレーターのワークフローを示す図で PR作成からGitHub Actions Goose実行 詳細分析プロセス テスト範囲提案 PRコメント投稿までの一連の流れを表すフローチャート](https://cdn-ak.f.st-hatena.com/images/fotolife/r/ropqa/20250812/20250812131307.png)

Gooseを用いたテスト生成のワークフロー

#### 実際の動作例

正常に起動された場合は、以下のようなコメントがPRに投稿されます。

![メールクライアントのユニットテストコードを示すスクリーンショット.このPRではSolitary Unit Testを提案されている](https://cdn-ak.f.st-hatena.com/images/fotolife/r/ropqa/20250812/20250812115640.png)

PRコメントの例

### 導入効果

まだ導入したばかりですが、すでに以下の点で発見がありました。

#### 良い点

* ソフトウェアアーキテクチャに基づくガイドラインを参照しているため、実現可能なテストが提案される
* 実現可能なテストが提案されるため、実際にテスト実装の改善に繋がっている

#### 改善したい点

* flakyなテスト実装を提案することがあるので、テスト実装の原理原則やプラクティスをAIに与える必要がある
* 提案内容が包括的かつ長文で出力されることがあり、レビューで読み飛ばされる、あるいはレビューの邪魔と感じることがある

### 将来の構想

現在はPRとコードベースを読み取るシンプルな形ですが、今後以下のような改善を検討しています：

#### より高精度なテストサジェストシステムへの発展

* **設計ドキュメントとの連携**：PRD（Product Requirements Document）やDD（Design Document）の内容も参照し、妥当性確認と検証能力を強化する
* **テスト分析・設計結果の活用**：テスト分析/設計の内容を参照し関連性を明確にすることで、テスト活動とソフトウェア設計/実装活動との一貫性を向上させる

#### Assured LLMSTに含まれるアイデアの実践

上述したAssured LLMSTでは、以下のような有用なアイデアが提案されています：

* **Mutation-guided approach**：ミューテーション（変異）を活用してテスト生成を導く手法。生成されたテストが少なくとも一つの現在捕捉されていない潜在的な将来の障害を発見できることを保証する
* **Oracle scavenging**：コメントやドキュメントなどの非実行可能テキストから期待される動作に関するオラクル情報を「拾い集める」技術。LLMがコードと自然言語の両方で推論する能力を活用する

これらの手法も各プロダクトの課題に沿う形で導入していければと思います。

---

freeeではQAエンジニアとして一緒に働く仲間を募集していますので、興味を持っていただいた方はぜひご応募ください！

[freee採用サイト](https://jobs.freee.co.jp)

[\*1](#fn-7467c868):ソフトウェアアーキテクチャに基づいた自動テスト戦略と実装ガイドライン: <https://developers.freee.co.jp/entry/testing-strategy-based-on-software-architecture>
