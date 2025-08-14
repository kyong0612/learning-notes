---
title: "Claude Sonnet 4 now supports 1M tokens of context"
source: "https://www.anthropic.com/news/1m-context"
author:
  - "[[@AnthropicAI]]"
published: 2025-08-12
created: 2025-08-14
description: |
  Claude Sonnet 4 now supports up to 1 million tokens of context on the Anthropic API—a 5x increase that lets you process entire codebases with over 75,000 lines of code or dozens of research papers in a single request.
tags:
  - "clippings"
  - "Claude"
  - "AI"
  - "LLM"
  - "long-context"
  - "API"
---

![](https://www-cdn.anthropic.com/images/4zrzovbb/website/0326cc46e1dca8609ac80de4191533785de08893-1000x1000.svg)

Claude Sonnet 4は、Anthropic APIで最大100万トークンのコンテキストをサポートするようになりました。これは5倍の増加であり、75,000行以上のコードを持つコードベース全体や、数十の研究論文を単一のリクエストで処理できるようになります。

Sonnet 4のロングコンテキストサポートは、現在Anthropic APIとAmazon Bedrockでパブリックベータ版として提供されており、Google CloudのVertex AIでも間もなく利用可能になります。

## より長いコンテキスト、より多くのユースケース

コンテキストが長くなることで、開発者はClaudeを使用して、より包括的でデータ集約的なユースケースを実行できます。

* **大規模なコード分析**: ソースファイル、テスト、ドキュメントを含むコードベース全体をロードします。Claudeはプロジェクトのアーキテクチャを理解し、ファイル間の依存関係を特定し、システム全体の設計を考慮した改善案を提案できます。
* **ドキュメントの統合**: 法的契約書、研究論文、技術仕様書などの広範なドキュメントセットを処理します。完全なコンテキストを維持しながら、数百のドキュメントにわたる関係を分析します。
* **コンテキストを認識するエージェント**: 数百のツールコールとマルチステップのワークフローにわたってコンテキストを維持するエージェントを構築します。完全なAPIドキュメント、ツール定義、およびインタラクション履歴を一貫性を失うことなく含めることができます。

## API価格

計算要件の増加に対応するため、200Kトークンを超えるプロンプトの[価格](https://www.anthropic.com/pricing#api)が調整されます。

| | 入力 | 出力 |
| --- | --- | --- |
| 200K以下のプロンプト | $3 / MTok | $15 / MTok |
| 200Kを超えるプロンプト | $6 / MTok | $22.50 / MTok |

*Claude Sonnet 4 on the Anthropic API*

[プロンプトキャッシング](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)と組み合わせることで、ユーザーはロングコンテキストを持つClaude Sonnet 4のレイテンシとコストを削減できます。1Mコンテキストウィンドウは[バッチ処理](https://docs.anthropic.com/en/docs/build-with-claude/batch-processing)でも使用でき、さらに50%のコスト削減が可能です。

## 顧客事例: Bolt.new

Bolt.newは、Claudeをブラウザベースの開発プラットフォームに統合することで、Web開発を変革しています。

「Claude Sonnet 4は、コード生成ワークフローにおいて依然として当社の主力モデルであり、本番環境で他の主要モデルを一貫して上回っています。1Mコンテキストウィンドウにより、開発者は実世界のコーディングに必要な高い精度を維持しながら、大幅に大規模なプロジェクトに取り組むことができるようになりました」と、Bolt.newのCEO兼共同創設者であるEric Simons氏は述べています。

## 顧客事例: iGent AI

ロンドンを拠点とするiGent AIは、会話を実行可能なコードに変換するAIパートナーであるMaestroでソフトウェア開発の分野を前進させています。

「かつては不可能だったことが今や現実になりました。1Mトークンコンテキストを持つClaude Sonnet 4は、iGent AIのソフトウェアエンジニアリングエージェントであるMaestroの自律機能を大幅に強化しました。この飛躍により、実世界のコードベースでの数日間にわたるセッションといった、真のプロダクションスケールのエンジニアリングが可能になり、エージェントによるソフトウェアエンジニアリングの新しいパラダイムが確立されました」と、iGent AIのCEO兼共同創設者であるSean Ward氏は述べています。

## 利用開始方法

Sonnet 4のロングコンテキストサポートは、現在、Tier 4およびカスタムレート制限を持つ顧客向けにAnthropic APIでパブリックベータ版として提供されており、今後数週間でより広範囲に展開される予定です。ロングコンテキストはAmazon Bedrockでも利用可能で、Google CloudのVertex AIでも間もなく提供が開始されます。また、他のClaude製品にロングコンテキストを導入する方法も模索しています。

Sonnet 4と1Mコンテキストウィンドウの詳細については、[ドキュメント](https://docs.anthropic.com/en/docs/build-with-claude/context-windows#1m-token-context-window)と[価格ページ](https://www.anthropic.com/pricing#api)をご覧ください。
