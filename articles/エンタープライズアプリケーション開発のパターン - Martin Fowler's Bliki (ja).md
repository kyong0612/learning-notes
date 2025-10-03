---
title: "エンタープライズアプリケーション開発のパターン - Martin Fowler's Bliki (ja)"
source: "https://bliki-ja.github.io/DevelopingPatternsOfEnterpriseSoftware/"
author:
  - "Martin Fowler"
published:
  - 2005-02-19
created: 2025-10-03
description: |
  Martin Fowler がエンタープライズアプリケーション開発における主要パターンを体系化し、関連リソースや観点を整理したカタログ記事の日本語訳。
tags:
  - "enterprise-patterns"
  - "software-architecture"
  - "integration"
  - "domain-driven-design"
---
---

## 概要

- 個人的調査に基づき、エンタープライズソフトウェア開発で有用と判断したパターン群を紹介するカタログ。
- パターン同士の関係性や、ドメインロジック、Web プレゼンテーション、データベース統合、分散処理といった観点を横断的に整理。
- 公式なパターン組織はないが、著者らは互いの成果をレビューし合う非公式コミュニティを形成している。
- 画像・図表などの視覚要素は掲載されていない。

## カタログ

### Patterns of Enterprise Application Architecture (Fowler)

- レイヤ化アーキテクチャの文脈でドメインロジック、Web プレゼンテーション、データベース統合、オフラインコンカレンシー、分散化を整理。
- 特にデータベース統合とオブジェクト/リレーショナルマッピングのパターンが充実。

### Core J2EE Patterns (Alur, Crupi, Malks)

- J2EE プラットフォームに最適化したアプリケーションアーキテクチャパターンを提供。
- J2EE 向けに設計されているが、工夫すれば他プラットフォームでも応用可能。

### Enterprise Integration Patterns (Hohpe, Woolf)

- 非同期メッセージングによるシステム統合を最有力手法と位置づけ、基本パターンを体系化。
- メッセージングの設計指針と実装パターンを包括的に提示。

### Microsoft Enterprise Solution Patterns (Trowbridge ほか)

- マイクロソフト初のエンタープライズソフトウェアパターン集。
- Web プレゼンテーション、デプロイ、分散システムなど、.NET を前提とした設計を網羅。

### Microsoft Data Patterns (Teale ほか)

- データ移行、レプリケーション、同期に焦点を当てたパターンを収録。
- 統合シナリオでのデータ管理戦略を提示。

### Microsoft Integration Patterns (Trowbridge ほか)

- 統合レイヤにおける戦略立案、システム接続アプローチ、統合効果の評価を扱う。
- マイクロソフト技術スタックでの実践手引き。

### Domain Driven Design (Evans)

- 複雑なドメインロジックを扱うためのドメインモデル構築手法と原則を解説。
- モデリングの障害と克服方策、リッチドメインモデルのベストプラクティスを提示。

### Analysis Patterns (Fowler)

- 多数のドメインモデルから抽出した共通構造をパターン化。
- 基本的な考え方は現在も有効であり、新しい副教材も参照を推奨。

### Data Model Patterns (Hay)

- 概念的なデータモデルパターン集で、データモデリングのみならずオブジェクトモデリングにも活用可能。

### Gang of Four (Gamma ほか)

- ソフトウェアパターンの基礎を成す代表的書籍。
- エンタープライズ向けに限らないが、多くのエンタープライズパターンがこの基礎パターンを参照。

### POSA (Buschmann ほか)

- アーキテクチャパターン集で、レイヤパターンやパイプ&フィルタなど、エンタープライズパターンの基盤となる概念を提供。

## エンタープライズソフトウェアの観点

### エンタープライズアプリケーションアーキテクチャ

- エンタープライズアプリケーションはデータ中心の情報システムであり、論理レイヤに分解して設計するのが一般的。
- レイヤ構造は設計判断を導き、各レイヤ間で共通解が現れる。
- Enterprise Architecture と区別され、ここでは単一アプリケーションの構築が主題。
- 技術非依存の PofEAA、J2EE 視点の Core J2EE Patterns、.NET 視点の Microsoft Enterprise Solution Patterns を併読推奨。

### エンタープライズインテグレーション

- エンタープライズアプリケーションの価値を引き出すには他システムとの統合が必須で、異種技術との連携も避けられない。
- メッセージング中心の統合を最有力とし、Enterprise Integration Patterns が基礎を提供。
- Microsoft Integration Patterns はマイクロソフト技術での統合戦略、Microsoft Data Patterns はデータレプリケーションと同期のガイドラインを提示。

### ドメインロジック

- ビジネスルール、検証、計算を担う中核要素で、ビジネス変化に応じて頻繁に変更が必要。
- PofEAA が主要パターンを整理し、Domain Driven Design が高度なドメインモデル設計を詳細化。
- Analysis Patterns と Data Model Patterns が具体的なモデル例を補完。

## 更新履歴

- 2005-02-19: 情報更新のためリライト。
- 2003-10-19: Microsoft Data Patterns を追加。
- 2003-01-04: 初出。

## 以前の掲載内容の要点

- 2003 年当時の記事では、エンタープライズアプリケーション向けパターンの第二波とコミュニティ形成を強調。
- Core J2EE Patterns や PofEAA、Microsoft のパターン群、EIP、Domain Driven Design などの出版・公開計画を紹介。
- メッセージングによる統合の重要性、ドメインモデル育成の難しさ、ワークショップを通じた協働の価値を指摘。
- 視覚要素に関する記述はなく、テキストベースで議論が展開されている。
