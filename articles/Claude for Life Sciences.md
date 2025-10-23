---
title: "Claude for Life Sciences"
source: "https://www.anthropic.com/news/claude-for-life-sciences"
author:
  - "[[@AnthropicAI]]"
published: 2025-10-20
created: 2025-10-23
description: "Anthropicがライフサイエンス分野向けにClaudeを強化。科学プラットフォームへの新しいコネクター、Agent Skills、Sonnet 4.5の性能向上により、研究者が発見から商業化まで全プロセスでClaudeを活用できるようになった。"
tags:
  - "AI"
  - "life-sciences"
  - "Claude"
  - "research"
  - "bioinformatics"
  - "drug-discovery"
  - "healthcare"
---

## 概要

Anthropicは、科学的進歩の加速を公益使命の中核に据えており、研究者が新たな発見を行い、最終的にはAIモデルが自律的に発見を行えるようなツールの構築に注力している。従来、科学者は統計分析のコード作成や論文要約などの個別タスクにClaudeを使用していたが、今回の発表により、Claudeは初期発見から商業化に至る全プロセスをサポートできるようになった。

## パフォーマンスの向上

### Claude Sonnet 4.5の進化

最も高性能なモデルであるClaude Sonnet 4.5は、ライフサイエンス分野のタスクにおいて大幅な性能向上を実現：

- **Protocol QA**（実験プロトコルの理解度を測定するベンチマーク）
  - Sonnet 4.5: 0.83
  - 人間のベースライン: 0.79
  - Sonnet 4: 0.74

- **BixBench**（バイオインフォマティクスタスクの評価）でも前モデルから大幅に改善

## 科学ツールとの連携

### 新しいコネクター

Claudeが他のプラットフォームやツールに直接アクセスできる新しいコネクターを追加：

1. **Benchling**: 実験、ノートブック、記録への参照リンクを含む回答を提供
2. **BioRender**: 検証済み科学図表、アイコン、テンプレートの広範なライブラリにアクセス
3. **PubMed**: 数百万件の生物医学研究論文と臨床研究にアクセス
4. **Scholar Gateway (Wiley開発)**: 権威あるピアレビュー済み科学コンテンツへのアクセス
5. **Synapse.org**: 公開・非公開プロジェクトでのデータ共有と分析
6. **10x Genomics**: 自然言語による単一細胞・空間解析

### 既存の統合

- Google Workspace、Microsoft SharePoint、OneDrive、Outlook、Teamsなどの汎用ツール
- Databricks: 大規模バイオインフォマティクス研究の分析
- Snowflake: 自然言語による大規模データセット検索

## Agent Skills

### 概要

Agent Skillsは、Claudeが特定のタスクを実行する際に使用できる指示、スクリプト、リソースを含むフォルダ。科学研究に最適で、Claudeが特定のプロトコルや手順を一貫して予測可能に実行できる。

### 開発中のスキル

**`single-cell-rna-qc`**: 単一細胞RNAシーケンシングデータの品質管理とフィルタリングを実行。[scverse](https://scverse.org/)のベストプラクティスを使用。

研究者は独自のスキルを構築することも可能。

## 主な活用事例

### 1. 研究タスク

- **文献レビューと仮説開発**: 生物医学文献の引用・要約、テスト可能なアイデアの生成
- 統合ワークフロー: データ解析 → 文献レビュー → 新規洞察の深掘り → プレゼンテーション作成 → BioRenderによる図表の仕上げ

### 2. プロトコル生成

Benchlingコネクターを使用して以下を作成：

- 研究プロトコル
- 標準作業手順書
- 同意文書

### 3. バイオインフォマティクスとデータ解析

- Claude Codeでゲノムデータの処理と解析
- スライド、文書、コードノートブック形式での結果提示

### 4. 臨床・規制コンプライアンス

- 規制提出書類の作成とレビュー
- コンプライアンスデータのコンパイル

### プロンプトライブラリ

科学者が迅速に開始できるよう、上記タスクで最良の結果を引き出すための[プロンプトライブラリ](https://support.claude.com/en/articles/12614768-getting-started-with-claude-for-life-sciences)を提供。

## パートナーシップと顧客

### サポート体制

- Applied AIチームと顧客対応チームからの専門家による実践的サポート
- ライフサイエンス分野のAI導入を専門とする企業とのパートナーシップ
  - Caylent、Deloitte、Accenture、KPMG、PwC、Quantium、Slalom、Tribe AI、Turing
  - クラウドパートナー: AWS、Google Cloud

### 主要顧客の声

**Sanofi** (Emmanuel Frenehard, Chief Digital Officer)

- 社内知識ライブラリと組み合わせたClaudeが、SanofiのAI変革の中核
- ほとんどのSanofi社員がConciergeアプリで日常的に使用
- バリューチェーン全体で効率性向上、世界中の患者により迅速に画期的医薬品を提供

**Benchling** (Ashu Singhal, Co-founder and President)

- R&DにおけるAIはエコスタム全体で機能
- Anthropicは、アクセス、ガバナンス、相互運用性を優先しながら最高の技術を提供
- 10年以上、科学者は実験データとワークフローの信頼できる情報源としてBenchlingを信頼

**Broad Institute of MIT and Harvard** (Heather Jankins, Head of Data Science Platform)

- Claude上に構築されたAIエージェントにより、科学者が全く新しい規模と効率で作業可能
- 以前は不可能だった方法で科学領域を探索

**10x Genomics** (Serge Saxonov, Co-founder and CEO)

- 従来は計算の専門知識が必要だった単一細胞・空間解析が、Claudeにより平易な英語の会話で実行可能
- リード配列、マトリックス生成、クラスタリング、二次分析などの分析タスクを実行
- 新規ユーザーの障壁を下げつつ、高度な研究チームのニーズにも対応

**Genmab** (Hisham Hamadeh, SVP, Global Head of Data, Digital and AI)

- 臨床データソースから情報を取得し、GxP準拠の出力を作成する能力により、画期的ながん治療薬を患者により迅速に提供
- 最高品質基準を維持しながら市場投入を効率化

**Novo Nordisk** (Louise Lind Skov, Director Content Digitalisation)

- 医薬品開発における文書・コンテンツ自動化の先駆者
- AnthropicとClaudeとの連携により新たな基準を設定
- 単なるタスク自動化ではなく、医薬品が発見から患者への届け方を変革

**Stanford University** (James Zou, Associate Professor)

- Claude Codeとの連携により、Paper2Agent（受動的な研究論文をインタラクティブなAIエージェントに変換するプロジェクト）の開発に極めて有用
- 仮想的な責任著者・共同研究者として機能

**Schrödinger** (Pat Lorton, EVP, CTO, and COO)

- Claude Codeにより、アイデアを動作するコードに数分で変換（従来は数時間）
- 最適なプロジェクトでは最大10倍の速度向上
- ソフトウェアの構築とカスタマイズ方法の変革に期待

**Latch Bio** (Alfredo Andere, Co-founder and CEO)

- バイオインフォマティクス解析用AIエージェント作成において、ソフトウェア開発の卓越性、ライフサイエンスとの整合性、スタートアップサポートの3つの要素に注目
- 6つのプラットフォームを評価し、Claudeが圧倒的リーダー

**その他の主要パートナー**

- **Komodo Health**: 規制された医療環境向けの透明性と監査可能性のあるソリューション
- **EvolutionaryScale**: 生命世界のモデリングを行う次世代AIシステムの構築を加速
- **Manifold**: より速く、より効率的なライフサイエンスの実現を支援
- **FutureHouse**: バイオインフォマティクスと文献分析ワークフローを強化
- **Axiom Bio**: 薬物毒性予測AIの構築をサポート

## AI for Scienceプログラム

Anthropicは[AI for Scienceプログラム](https://www.anthropic.com/news/ai-for-science-program)を通じて、世界中の影響力の高い科学プロジェクトに取り組む主要研究者を支援するために無料のAPIクレジットを提供。

これらの研究室とのパートナーシップにより、Claudeの新しいアプリケーションを特定し、科学者が最も重要な問題に答えることを支援。プロジェクトアイデアの[提出](https://docs.google.com/forms/d/e/1FAIpQLSfwDGfVg2lHJ0cc0oF_ilEnjvr_r4_paYi7VLlr5cLNXASdvA/viewform)を引き続き歓迎。

## 利用開始

### アクセス方法

- **Claude.com**: Claude for Life Sciencesページから
- **AWS Marketplace**: 現在利用可能
- **Google Cloud Marketplace**: 近日中に利用可能予定

### 詳細情報とデモ

Claude for Life Sciencesの詳細や、チームとのデモの設定については[こちら](https://claude.com/contact-sales/life-sciences)。

## 重要なリソース

1. **システムカード**: Sonnet 4.5の詳細な性能評価は[Claude Sonnet 4.5 System Card](https://assets.anthropic.com/m/12f214efcc2f457a/original/Claude-Sonnet-4-5-System-Card.pdf)（132-133ページ）を参照
2. **カスタムスキルの設定**: [Using skills in Claude](https://support.claude.com/en/articles/12512180-using-skills-in-claude)を参照
3. **スタートガイド**: [Getting started with Claude for Life Sciences](https://support.claude.com/en/articles/12614768-getting-started-with-claude-for-life-sciences)

## まとめ

Claude for Life Sciencesは、ライフサイエンス分野におけるAI活用の新しい時代を切り開く。パフォーマンス向上、専門的なコネクター、Agent Skillsの導入により、研究者、臨床コーディネーター、規制業務管理者など、ライフサイエンスに携わるすべての人にとって、Claudeはより強力なパートナーとなる。Sanofi、Novo Nordisk、Stanford Universityなどの主要機関との実績のあるパートナーシップは、医薬品発見から患者への届け方まで、科学研究の全プロセスを変革する可能性を示している。
