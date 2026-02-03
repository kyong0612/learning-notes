---
title: "Context Engineering Our Way to Long-Horizon Agents: LangChain's Harrison Chase"
source: "https://sequoiacap.com/podcast/context-engineering-our-way-to-long-horizon-agents-langchains-harrison-chase/"
author:
  - "Harrison Chase"
  - "Sonya Huang"
  - "Pat Grady"
published: 2026-01-22
created: 2026-02-03
description: "LangChain共同創業者のHarrison Chaseが、長時間自律的に動作するLong-Horizon Agentsの出現について解説。初期のスキャフォールディングから現在のハーネスベースアーキテクチャへの進化、コンテキストエンジニアリングの重要性、そしてエージェント開発が従来のソフトウェア開発といかに異なるかを語る。"
tags:
  - "clippings"
  - "AI-Agents"
  - "LangChain"
  - "Context-Engineering"
  - "Long-Horizon-Agents"
  - "LLM"
  - "Agent-Harness"
---

## 概要

Sequoia Capitalの「Training Data」ポッドキャスト（Episode 77）において、LangChainの共同創業者であるHarrison Chaseが、Long-Horizon Agents（長時間自律動作エージェント）の現状と未来について詳細に語っている。

## 主要な洞察（Key Insights）

### 1. Long-Horizon Agentsがついに機能し始めた

- **コーディングとリサーチ領域で特に有効**: LLMをループで実行するエージェントが、かつてはデモ段階だったが、モデルの改善とより洗練されたハーネスにより実用的になった
- **主な価値は「優れた初稿の生成」**: コーディング、SRE（AI SRE）、リサーチ、高度なカスタマーサポートなどの領域で活躍
- **99.9%の信頼性はまだないが、膨大な作業量を処理可能**

### 2. ハーネスとコンテキストエンジニアリングがモデル品質と同等に重要

Long-Horizon Agentsの成功は、LLMの改善と**エージェントハーネス**（opinionated scaffolding）の巧妙なエンジニアリングの両方から生まれる。

#### ハーネスの主要コンポーネント:
- **プランニングツール**: デフォルトで組み込まれた計画機能
- **コンパクション戦略**: 長時間実行時のコンテキストウィンドウ管理
- **ファイルシステムアクセス**: Bashやファイル操作ツール
- **サブエージェントとスキル**: MCPを含む拡張機能

### 3. モデル、フレームワーク、ハーネスの違い

| 概念 | 説明 |
|------|------|
| **モデル** | LLM本体（トークンイン、メッセージアウト） |
| **フレームワーク** | モデル周りの抽象化（例：LangChain）- モデル切り替えの容易さ、ツールやベクターストアの抽象化 |
| **ハーネス** | バッテリー込みの実装（例：Deep Agents）- プランニングツール、コンパクション、ファイルシステム統合などが組み込み済み |

### 4. エージェント開発は従来のソフトウェア開発と根本的に異なる

従来のソフトウェアではロジックはすべてコードにあるが、エージェントの動作の大部分はモデルとプロンプトから生まれる。

#### トレースが「真実の源泉」になる

- **従来のソフトウェア**: コードが真実の源泉 → 読めば何が起こるか理解できる
- **エージェント**: ロジックがモデル内にあり非決定的 → **トレースが各ステップで何がコンテキストにあるかを示す**

> "何か問題が起きたとき、今は『コードを見せて』ではなく『トレースを送って』と言う"

### 5. メモリとコンテキスト管理が将来の差別化要因

- **メモリ = 長期間にわたるコンテキストエンジニアリング**
- 過去のトレースから学習し、指示を更新する機能が差別化要因（moat）になる
- 再帰的自己改善（recursive self-improvement）の可能性

## 技術的詳細

### コンパクション戦略

長時間実行エージェントのコンテキストウィンドウ管理手法:
1. **要約してファイルシステムに保存**: 必要時に参照可能
2. **大きなツール結果をファイルに書き出し**: モデルに直接渡さず、必要時に参照させる
3. **仮想ファイルシステム**: 実際のファイルシステムなしでも同様の効果を得られる

### ハーネスエンジニアリングのベストプラクティス

1. **モデルが訓練されたツールを理解する**
   - OpenAI: Bashを重視
   - Anthropic: 明示的なファイル編集ツール
2. **サブエージェント間の適切なコミュニケーション設計**
   - メインエージェントへの情報の適切な受け渡し
   - 最終レスポンスの明示的な指示

### Terminal-Bench 2.0

コーディングベンチマークでは、エージェントハーネスとモデルの組み合わせによるパフォーマンス差が可視化されている。Claude Codeが必ずしもトップではなく、ハーネスの工夫次第で性能向上が可能。

## エージェント開発の3つの時代

| 時代 | 特徴 |
|------|------|
| **初期** | テキストイン・テキストアウト、チャットベースでない、ツール呼び出しなし。単一プロンプトやチェーンのみ |
| **中期** | ツール呼び出しの訓練開始、カスタム認知アーキテクチャ、より多くのスキャフォールディング |
| **現在（2025年後半〜）** | LLMがループで実行、コンテキストエンジニアリングが中心、Claude Code・Deep Research・Manusの台頭 |

## 今後の展望

### 1. すべてのエージェントはコーディングエージェントか？

> "コーディングエージェントは汎用的になりうるが、今日のコーディングエージェントが汎用的とは限らない"

- ファイルシステムアクセスは必須
- コード実行は90%程度確信あり
- ブラウザ操作はモデルがまだ十分でない

### 2. UIの進化

- **非同期モード**: 長時間実行エージェントの管理（Linear、Jira、カンバンボードからの着想）
- **同期モード**: フィードバック提供時のチャットインターフェース
- **状態の可視化**: ファイルシステムなど、エージェントが操作する対象の表示

### 3. メモリによる自己改善

- LangSmith MCPやCLIを使い、エージェントがトレースを取得して問題を診断し、自らのコードベースを修正するパターン
- 「Sleep Time Compute」: 夜間にトレースを分析し、自己の指示を更新

## 引用

> "Context engineering is such a good term. I wish I came up with that term. Like, it actually really describes everything we've done at LangChain without knowing that that term existed."
> 
> — Harrison Chase

> "The source of truth for software is in code, and for agents it's a combination now of code, and traces are where you can see the source of truth."
> 
> — Harrison Chase

## 関連情報

- **ポッドキャスト**: Training Data Episode 77
- **ホスト**: Sonya Huang, Pat Grady (Sequoia Capital)
- **配信**: YouTube, Spotify, Apple Podcasts, Amazon Music
