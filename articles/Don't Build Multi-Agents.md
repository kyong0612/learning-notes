---
title: "Don't Build Multi-Agents"
source: "https://cognition.ai/blog/dont-build-multi-agents"
author:
  - "Walden Yan"
published: 2025-06-12
created: 2025-06-17
description: "Cognition AI（Devinの開発元）によるAIエージェント構築の実践的な原則について。マルチエージェント・アーキテクチャが抱える根本的な問題と、コンテキスト・エンジニアリングに基づく単一エージェント・アプローチの重要性を解説。"
tags:
  - ai-agents
  - context-engineering
  - multi-agent-systems
  - ai-architecture
  - cognition-ai
  - devin
---

# Don't Build Multi-Agents - AIエージェント構築の実践的原則

**著者:** Walden Yan (Cognition AI)  
**発行日:** 2025年6月12日

LLMエージェント用のフレームワークは期待に反して失望を与えてきました。Cognition AIでの試行錯誤に基づき、エージェント構築の原則を提示し、なぜ一見魅力的なアイデアが実際には有害なのかを説明します。

## 主要な原則：コンテキスト・エンジニアリング

記事は以下の2つの核心的原則に向けて構築されています：

### 原則1：コンテキストを共有せよ

- **完全なエージェント・トレースを共有**し、個別メッセージだけでなく全体の文脈を含める
- 部分的な情報による誤解を防ぐ

### 原則2：アクションは暗黙の決定を含む

- 各エージェントのアクションは暗黙的な仮定と決定を含む
- **矛盾する決定は悪い結果**をもたらす

## マルチエージェント・アーキテクチャの問題点

### 典型的な失敗パターン

![マルチエージェント・アーキテクチャの問題点](https://cognition.ai/blog/dont-build-multi-agents)  
*図1: 典型的なマルチエージェント・アーキテクチャ - タスクの分割、並列処理、結果の統合*

記事では「Flappy Birdクローン」開発を例に、マルチエージェント・システムの脆弱性を説明：

1. **タスクの分割**：メインエージェントがタスクを複数のサブタスクに分割
2. **サブエージェントの作業**：各サブエージェントが並行して作業
3. **結果の統合**：メインエージェントが結果を統合

**問題**：

- サブエージェント1がSuper Mario Bros.風の背景を作成（誤解）
- サブエージェント2がゲームアセットらしくない鳥を作成
- 最終的に一貫性のない結果を統合する困難なタスクが残る

### コンテキスト共有による改善の限界

コンテキストを共有しても、サブエージェント間で：

- **視覚的スタイルの不一致**が発生
- 相互の作業が見えないため**一貫性が保てない**
- 矛盾する仮定に基づいた作業が進行

## 推奨されるアーキテクチャ

### 1. 単一スレッド線形エージェント

![単一スレッド線形エージェント](https://cognition.ai/blog/dont-build-multi-agents)  
*図2: 単一スレッド線形エージェント - 継続的なコンテキストを維持*

- **継続的なコンテキスト**を維持
- シンプルで信頼性が高い
- 大規模タスクでのコンテキスト・ウィンドウ・オーバーフローが課題

### 2. コンテキスト圧縮による拡張

![コンテキスト圧縮付きエージェント](https://cognition.ai/blog/dont-build-multi-agents)  
*図3: コンテキスト圧縮付きエージェント - 履歴圧縮による長期コンテキスト対応*

長期タスクに対する高度なソリューション：

- **履歴圧縮用のLLMモデル**を導入
- アクションと会話の履歴を重要な詳細、イベント、決定に圧縮
- 実装が困難だが、より長いコンテキストでの効果的な動作が可能

## 実世界での応用例

### Claude Code Subagents（2025年6月現在）

- サブタスクを生成するが、**並行作業はしない**
- サブエージェントは質問への回答のみ（コード記述なし）
- メインエージェントからのコンテキストが不足するため、制限された用途に限定
- 意図的にシンプルなアプローチを採用

### Edit Apply Models（2024年の事例）

- 大型モデルがMarkdown形式で編集説明を出力
- 小型モデルが実際のファイル書き換えを実行
- **指示の微細な曖昧さ**により頻繁にエラーが発生
- 現在は単一モデルでの編集決定・適用が主流

## マルチエージェント協調の課題

### 理論的な魅力と現実的な限界

- 人間のように「話し合い」で解決する理想
- 現実では**長期コンテキストでの積極的な議論**が困難
- 意思決定の分散とコンテキスト共有の不十分さ
- 2025年現在、協調マルチエージェントは脆弱なシステムしか生まない

### 将来への期待

- 単一スレッド・エージェントの人間との対話能力向上により解決される可能性
- より大きな並列性と効率性の実現への道筋

## より一般的な理論に向けて

### エージェント構築の原則

- これらの観察は**エージェント構築の標準原則**の始まり
- Cognition AIでは内部ツールとフレームワークにこれらの原則を組み込み
- 理論の完璧性への疑問と、分野の進歩に伴う柔軟性の必要性

### 実践的な推奨事項

1. エージェントのすべてのアクションが関連する決定のコンテキストに基づくことを保証
2. 可能な限り、すべてのアクションがその他すべてを把握できるようにする
3. コンテキスト・ウィンドウの制限と実用的トレードオフを考慮
4. 目指す信頼性レベルに応じた複雑さのレベルを決定

## 結論

**信頼性の高いAIエージェント**を構築するためには：

- **マルチエージェント・アーキテクチャを避ける**（2つの原則に違反するため）
- **コンテキスト・エンジニアリング**を最優先とする
- 単一スレッド・アプローチから開始し、必要に応じて慎重に拡張
- 矛盾する決定を防ぐアーキテクチャを設計

この記事は、Devinを開発したCognition AIの実際の経験に基づく貴重な洞察であり、現在のAIエージェント開発における重要な指針を提供しています。特に、一見魅力的に見えるマルチエージェント・アプローチの落とし穴と、より実用的で信頼性の高い単一エージェント・アプローチの重要性を明確に示しています。

---

**参考図表:**

- [元記事で使用されているアーキテクチャ図](https://cognition.ai/blog/dont-build-multi-agents)
- 図の詳細な説明は元記事を参照
