---
title: "A Survey of Vibe Coding with Large Language Models"
source: "https://arxiv.org/html/2510.12399v1"
author: "Zhen Guo, Adriana Meza Soria, Min Zeng"
published: 2024-10-16
created: 2025-10-29
description: "Vibe Codingは、LLMベースのコーディングエージェントを用いた新しいソフトウェア開発手法です。本論文では、開発者がAI生成コードを行単位で理解するのではなく、実行結果の観察を通じて検証する開発パラダイムについて、基盤モデル、エージェント機能、開発環境、フィードバックメカニズム、開発モデルの5つの主要側面から包括的に調査しています。"
tags:
  - "clippings"
  - "LLM"
  - "AI-coding"
  - "software-development"
  - "coding-agents"
  - "vibe-coding"
---

## 概要

本論文は、大規模言語モデル（LLM）を活用した新しいソフトウェア開発手法「Vibe Coding」について包括的に調査した研究です。Vibe Codingは、開発者がAI生成コードを行単位で精読するのではなく、実行結果の観察を通じて検証する開発パラダイムを特徴とし、人間開発者、ソフトウェアプロジェクト、コーディングエージェントの動的な三者関係に基づいています。

**主要な発見:**

- Vibe Codingは、2024年に登場したCodeiumのCEOによって提唱された新しい開発パラダイム
- 従来のコーディング支援（コード補完、コードレビューなど）を超え、自律的な問題解決を実現
- 5つの主要側面（基盤モデル、エージェント機能、開発環境、フィードバックメカニズム、開発モデル）から体系的に分析

## 1. Introduction（はじめに）

### 1.1 Vibe Codingの定義

Vibe Codingは、以下の特徴を持つ新しいソフトウェア開発手法です：

- **成果ベースの検証**: 開発者は生成されたコードを行単位で理解する代わりに、実装の成果を観察・検証する
- **動的な三者関係**: 人間開発者、ソフトウェアプロジェクト、コーディングエージェントの相互作用
- **自律的な実装**: エージェントが自律的に問題を解決し、実装を行う

### 1.2 従来のAIコーディング支援との違い

従来のAIコーディング支援は以下の機能に限定されていました：

- コード補完（GitHub Copilot、Amazon CodeWhisperer）
- コードレビュー
- 自然言語からのコード生成
- コードデバッグ
- コードドキュメント生成

Vibe Codingはこれらを統合し、**自律的なエージェント主導の開発**を実現します。

### 1.3 調査の構造

本論文は、Vibe Codingエコシステムを5つの主要側面から分析します：

1. **基盤モデル**: LLMの訓練データ、事前訓練・事後訓練手法
2. **エージェント機能**: タスク分解、メモリ、アクション実行、リフレクション、協調
3. **開発環境**: 実行環境、インタラクティブインターフェース、分散オーケストレーション
4. **フィードバックメカニズム**: コンパイラ、実行、人間、自己改善フィードバック
5. **開発モデル**: 5つの開発モデルの分類法

## 2. Foundational Models（基盤モデル）

### 2.1 データ基盤

#### 2.1.1 事前訓練コードコーパス

主要なコードデータセット：

- **The Stack**: 358言語、3TB以上、GitHub等からのオープンソースコード
- **The Pile**: 825GBの多様なデータセット
- **CodeSearchNet**: 6つのプログラミング言語、200万件以上の関数
- **GitHub Code**: 159言語、1.5TB、GitHubリポジトリから
- **BigQuery**: 6つのプログラミング言語、3.8TB

#### 2.1.2 Instruction & Preference データセット

重要なデータセット：

- **Code Alpaca**: 20,000件の自動生成された命令追従例
- **APPS**: 10,000件のプログラミング問題
- **MBPP**: 974件のPythonプログラミング問題
- **HumanEval**: 164件の手作業で作成されたプログラミング問題

### 2.2 事前訓練手法

#### 2.2.1 Autoregressive Objectives（自己回帰目的）

- 次トークン予測（Next Token Prediction, NTP）
- コードの逐次的な性質に適合
- GPT系モデル、CodeGen、StarCoder、Code Llamaなどで採用

#### 2.2.2 Masked Objectives（マスク目的）

- ランダムにマスクされたトークンの予測
- 双方向コンテキストの活用
- BERT、RoBERTa、CodeBERTなどで採用

#### 2.2.3 Denoising Objectives（ノイズ除去目的）

- 破損したコードから元のコードを復元
- T5、InCoder、CodeT5などで採用

#### 2.2.4 Structure-Aware Objectives（構造認識目的）

- コードの構造的特性（AST、データフロー）を活用
- GraphCodeBERT、PLBART、SPT-Codeなどで採用

#### 2.2.5 Multimodal Objectives（マルチモーダル目的）

- テキストとコードの整合性学習
- CodeBERT、GraphCodeBERTなどで採用

#### 2.2.6 Continual Pre-training（継続的事前訓練）

- 既存モデルをコード特化データで追加訓練
- 効率的な高性能モデル開発を実現
- Code Llama、StarCoder2、DeepSeek-Coderなどで採用

### 2.3 事後訓練手法

#### 2.3.1 Supervised Fine-Tuning（教師あり微調整、SFT）

- 高品質な命令-応答ペアでモデルを調整
- 特定のタスクやドメインに適応
- OpenCodeInterpreter、Code Llama Instructなどで採用

#### 2.3.2 Reinforcement Learning（強化学習）

主要な手法：

- **RLHF（人間フィードバックからの強化学習）**: 人間の好みからモデルを調整
- **RLAIF（AIフィードバックからの強化学習）**: AIが生成したフィードバックを使用
- **RLEF（実行フィードバックからの強化学習）**: コード実行結果を報酬として使用

## 3. Capabilities of LLM-based Coding Agents（エージェントの機能）

### 3.1 Task Decomposition and Planning（タスク分解と計画）

#### 3.1.1 アプローチ

**LLM駆動の分解**:

- 複雑なタスクをサブタスクに分割
- 自然言語の推論能力を活用
- AutoGPT、BabyAGI、MetaGPTなどで採用

**検索拡張型アプローチ**:

- 外部知識ベースやドキュメントを活用
- より正確な計画を生成
- Docprompting、RepoCoder、RepoAgentなどで採用

**フィードバック統合**:

- コンパイル、実行、人間フィードバックを計画に統合
- Self-Planningで採用

#### 3.1.2 実装例

- **MetaGPT**: SOPベースのタスク分解、複数のエージェントの協調
- **ChatDev**: ウォーターフォールモデルに基づくソフトウェア開発シミュレーション
- **DevOps-Agent**: CI/CDパイプラインのための計画生成

### 3.2 Memory Mechanisms（メモリメカニズム）

#### 3.2.1 メモリタイプ

**短期メモリ（作業メモリ）**:

- 現在のタスクのコンテキスト保持
- 会話履歴、最近のコードスニペット

**長期メモリ（経験メモリ）**:

- 過去の相互作用からの学習
- ベクトルデータベース、外部ストレージに保存

#### 3.2.2 実装例

- **MemGPT**: 階層的メモリ管理（メインコンテキスト、外部コンテキスト、リコールストレージ）
- **Reflexion**: 長期エピソディックメモリを活用した経験の蓄積
- **Voyager**: スキルライブラリによる継続的な学習

### 3.3 Action Execution（アクション実行）

#### 3.3.1 Tool Invocation（ツール呼び出し）

**検索ツール**:

- API検索、ドキュメント検索、Web検索
- Toolformer、ART、ReACTなどで採用

**実行ツール**:

- コードインタプリタ、コンパイラ、シェルコマンド
- AutoGen、OpenDevin、Devon.aiなどで採用

**デバッグツール**:

- デバッガー、プロファイラー、ログ解析
- SWE-agent、ChatDevなどで採用

**バージョン管理ツール**:

- Git操作、差分確認
- SWE-agent、OpenDevinなどで採用

#### 3.3.2 Code-based Actions（コードベースアクション）

- **コード書き込み**: 新規ファイル作成、既存ファイル修正
- **コード読み取り**: ファイル内容取得、構造解析
- **コード削除**: ファイル削除、コードブロック削除
- **コード編集**: 特定行の置換、差分適用

**ツール統合の課題**:

- ツールの精度と信頼性
- 複数ツールの統合の複雑さ
- 実行時エラーの処理

### 3.4 Reflection（リフレクション）

#### 3.4.1 Iterative Refinement（反復的改善）

- 自己評価と反復的改善
- Self-Refine、LATS、RAP、TS-LLMなどで採用

#### 3.4.2 Code Validation and Testing（コード検証とテスト）

- 単体テスト、統合テスト、エンドツーエンドテストの生成と実行
- TestPilot、ChatTesterなどで採用

#### 3.4.3 Intelligent Debugging（インテリジェントデバッグ）

主要な手法：

- **実行トレース分析**: プログラムの実行状態をトレースしてバグを特定
- **逆向きデバッグ**: 失敗から逆算してバグの根本原因を特定
- **対話的デバッグ**: ユーザーとの対話を通じてデバッグ

実装例：

- **SWE-agent**: エージェント-コンピュータインターフェース（ACI）を通じたデバッグ
- **AutoCodeRover**: 実行トレースとファイルレベル診断を組み合わせた多段階デバッグ
- **Aider**: git差分を利用した編集の追跡

### 3.5 Agent Collaboration（エージェント協調）

#### 3.5.1 協調パターン

**水平協調**:

- 同等の役割を持つエージェント間の協調
- 並列タスク処理
- AutoGenで採用

**垂直協調**:

- 階層構造を持つエージェント間の協調
- マネージャー-ワーカーモデル
- MetaGPT、ChatDevで採用

**動的協調**:

- タスクに応じて動的に協調パターンを変更
- DyLANで採用

#### 3.5.2 実装例

- **MetaGPT**: プロダクトマネージャー、アーキテクト、エンジニア、QAエンジニアなど複数の役割
- **ChatDev**: CEO、CTO、プログラマー、レビューアーなど
- **AutoGen**: 会話可能な自律エージェントのフレームワーク

## 4. Development Environment（開発環境）

### 4.1 Isolated Execution Runtime Environment（隔離実行環境）

#### 4.1.1 Containerization（コンテナ化）

- **Docker**: アプリケーションとその依存関係をパッケージ化
- 実装例: OpenDevin、Devon.ai、SWE-agent

**利点**:

- 再現性の確保
- セキュリティ（隔離された環境）
- 柔軟性（異なる環境の迅速な切り替え）

#### 4.1.2 Security Isolation（セキュリティ隔離）

- サンドボックス環境の提供
- リソース制限（CPU、メモリ、ネットワーク）
- 実装例: E2B、Modal

#### 4.1.3 Cloud-based Platforms（クラウドベースプラットフォーム）

- スケーラビリティと柔軟性
- 実装例: Replit、GitHub Codespaces、Modal
- 従量課金モデル

### 4.2 Interactive Development Interface Environment（インタラクティブ開発インターフェース）

#### 4.2.1 AI-Native IDEs（AI統合IDE）

- **Cursor**: AI-First IDE、コードベース全体の理解
- **Windsurf**: Codeium社、Flows機能（深い思考とプランニング）
- **GitHub Copilot**: GitHub Workspace統合、マルチファイル編集

**主要機能**:

- コンテキスト認識補完
- 自然言語インタラクション
- マルチファイル編集
- 統合デバッグ

#### 4.2.2 Remote Development（リモート開発）

- クラウドリソースへのアクセス
- 一貫した開発環境
- 実装例: GitHub Codespaces、Replit Agent

#### 4.2.3 Tool Integration Protocols（ツール統合プロトコル）

**Model Context Protocol (MCP)**:

- Anthropic社が開発
- LLMアプリケーションとデータソース間の標準化された通信
- ローカルサーバーとリモートサーバーをサポート

**Language Server Protocol (LSP)**:

- Microsoft社が開発
- 言語機能（自動補完、定義へのジャンプなど）の統一インターフェース

**Debug Adapter Protocol (DAP)**:

- 開発ツールとデバッガー間の通信を標準化

### 4.3 Distributed Orchestration Platform Environment（分散オーケストレーション環境）

#### 4.3.1 CI/CD Pipeline Integration（CI/CDパイプライン統合）

- 自動ビルド、テスト、デプロイ
- 実装例: OpenDevin、Devon.ai、ChatDev

**主要機能**:

- 継続的インテグレーション（コード変更の自動検証）
- 継続的デリバリー（自動デプロイ）

#### 4.3.2 Cloud Compute Orchestration（クラウド計算オーケストレーション）

- 動的リソース割り当て
- スケーラビリティ
- 実装例: Modal、Replit Agent

#### 4.3.3 Multi-Agent Collaboration Frameworks（マルチエージェント協調フレームワーク）

主要なフレームワーク：

- **AutoGen**: 会話可能なエージェント、柔軟な会話パターン
- **CrewAI**: 役割ベースのエージェント、プロセス駆動実行
- **MetaGPT**: SOPベースのワークフロー、構造化出力
- **LangGraph**: グラフベースのワークフロー、状態管理

## 5. Feedback Mechanisms（フィードバックメカニズム）

### 5.1 Compiler Feedback（コンパイラフィードバック）

#### 5.1.1 Syntax Errors（構文エラー）

- コードの基本構造の検証
- 即座に検出可能
- 実装例: AlphaCodium

#### 5.1.2 Type Errors（型エラー）

- 型システムの一貫性検証
- 静的型付き言語で重要
- TypeScript、Java、Rustなどで有効

#### 5.1.3 Static Analysis（静的解析）

- コードの品質とセキュリティ問題の検出
- ツール: ESLint、Pylint、SonarQube
- 実装例: Aider、OpenDevin

#### 5.1.4 Runtime Compilation（ランタイムコンパイル）

- JITコンパイル時のエラー検出
- 動的型付き言語で重要

### 5.2 Execution Feedback（実行フィードバック）

#### 5.2.1 Unit Tests（単体テスト）

- 個別の関数やメソッドの正確性検証
- 迅速なイテレーション
- 実装例: Aider、AlphaCodium、TestPilot

#### 5.2.2 Integration Tests（統合テスト）

- コンポーネント間の相互作用検証
- より包括的な検証
- 実装例: SWE-agent、OpenDevin

#### 5.2.3 Runtime Errors（ランタイムエラー）

- プログラム実行時のエラー検出
- NullPointerException、配列境界エラーなど
- 実装例: AutoCodeRover、Aider

#### 5.2.4 Exception Handling（例外処理）

- try-catch-finally構造の検証
- 適切なエラーハンドリングの確認

### 5.3 Human Feedback（人間フィードバック）

#### 5.3.1 Interactive Requirement Clarification（対話的要件明確化）

- 曖昧な要求の明確化
- ユーザーとの対話を通じた理解の深化
- 実装例: Windsurf、Cursor

#### 5.3.2 Code Review（コードレビュー）

- コード品質の向上
- ベストプラクティスの適用確認
- 実装例: GitHub Copilot Workspace、Cursor

### 5.4 Self-Refinement Feedback（自己改善フィードバック）

#### 5.4.1 Self-Evaluation（自己評価）

- LLMが自身の出力を評価
- 生成されたコードの品質を判断
- 実装例: Self-Refine、Reflexion

#### 5.4.2 Critique（批評）

- 複数の視点からコードを評価
- 構造、効率性、保守性などを検討
- 実装例: Self-Collaboration

#### 5.4.3 Reflection（省察）

- 過去の経験からの学習
- エピソディックメモリの活用
- 実装例: Reflexion、LATS

#### 5.4.4 Memory-based Feedback（メモリベースフィードバック）

- 長期メモリからの経験活用
- 類似の問題への対処法の参照
- 実装例: Voyager、MemGPT

## 6. Vibe Coding Development Models（開発モデル）

### 6.1 モデル分類の軸

本論文では、Vibe Coding開発モデルを以下の3つの軸で分類します：

1. **Human Quality Control（人間品質管理）**: 開発プロセスへの人間の関与度
2. **Structured Constraint Mechanisms（構造化制約メカニズム）**: 開発プロセスを導く構造の有無
3. **Context Management Capability（コンテキスト管理能力）**: コードベース理解の深さ

### 6.2 5つの開発モデル

#### 6.2.1 Unconstrained Automation Model（非制約自動化モデル、UAM）

**特徴**:

- 最小限の人間介入
- 明示的な構造化制約なし
- 標準的なコンテキスト管理

**適用シナリオ**:

- シンプルなスクリプトや自動化タスク
- 独立したユーティリティやヘルパー関数
- 使い捨てコードや実験的なプロトタイプ

**実装例**: AutoGPT、BabyAGI

**制限事項**:

- 大規模・複雑なプロジェクトには不向き
- 出力の品質が不安定
- 特定のドメイン知識が必要な場合は不十分

#### 6.2.2 Iterative Conversational Collaboration Model（反復対話協調モデル、ICCM）

**特徴**:

- 高い人間品質管理
- 構造化制約なし
- 標準的なコンテキスト管理

**ワークフロー**:

1. 開発者が自然言語で要求を提供
2. エージェントがコードを生成
3. 開発者がレビュー・フィードバック
4. エージェントが修正・改善
5. 繰り返し

**適用シナリオ**:

- UI/UXデザインの反復的改善
- APIエンドポイント開発
- データ処理パイプライン構築

**実装例**: ChatDev、MetaGPT、Aider

**制限事項**:

- 人間の継続的な関与が必要
- 大規模プロジェクトでは手間がかかる
- 一貫性の維持が課題

#### 6.2.3 Planning-Driven Model（計画駆動モデル、PDM）

**特徴**:

- 最小限の人間介入
- 高い構造化制約
- 標準的なコンテキスト管理

**ワークフロー**:

1. 高レベルの計画生成
2. タスク分解
3. サブタスクの実装
4. 統合とテスト

**適用シナリオ**:

- マイクロサービスアーキテクチャ開発
- 機能単位の開発
- 定型的なプロジェクト構造

**実装例**: MetaGPT、OpenDevin、Devika

**制限事項**:

- 計画の品質に依存
- 動的な要件変更に弱い
- 初期計画の誤りが全体に影響

#### 6.2.4 Test-Driven Model（テスト駆動モデル、TDM）

**特徴**:

- 中程度の人間介入
- 高い構造化制約（テストによる制約）
- 標準的なコンテキスト管理

**ワークフロー**:

1. テストケース作成（人間またはエージェント）
2. エージェントがテストを満たすコードを生成
3. テスト実行と検証
4. 失敗したテストに基づく改善
5. 繰り返し

**適用シナリオ**:

- 明確な仕様があるコンポーネント
- アルゴリズム実装
- バグ修正

**実装例**: TestPilot、SWE-agent、AlphaCodium

**制限事項**:

- 高品質なテストケースが必要
- テスト作成の手間
- すべての要件をテストでカバーすることの困難さ

#### 6.2.5 Context-Enhanced Model（コンテキスト強化モデル、CEM）

**特徴**:

- 最小限の人間介入
- 明示的な構造化制約なし
- **高度なコンテキスト管理**（深いコードベース理解）

**コンテキスト管理手法**:

- リポジトリレベルの理解
- RAG（検索拡張生成）
- コードグラフ構築
- セマンティック検索

**適用シナリオ**:

- 大規模コードベースへの変更
- 複雑な依存関係を持つプロジェクト
- レガシーコードのリファクタリング

**実装例**: Cursor、Windsurf、Replit Agent

**制限事項**:

- 高い計算コスト
- コンテキストウィンドウの制限
- コードベースの初期インデックス化の手間

### 6.3 モデル比較表

| モデル | 人間介入 | 構造化制約 | コンテキスト管理 | 主な用途 |
|------|---------|-----------|----------------|---------|
| UAM | 最小限 | なし | 標準 | シンプルなスクリプト |
| ICCM | 高 | なし | 標準 | 反復的UI開発 |
| PDM | 最小限 | 高 | 標準 | マイクロサービス開発 |
| TDM | 中程度 | 高（テスト） | 標準 | アルゴリズム実装 |
| CEM | 最小限 | なし | 高度 | 大規模コードベース変更 |

## 7. Discussion（議論）

### 7.1 現在の課題

#### 7.1.1 Context Management（コンテキスト管理）

**課題**:

- 大規模コードベースの完全な理解の困難さ
- コンテキストウィンドウの制限（一般的に128K-200Kトークン）
- 関連コードの効率的な検索と取得

**改善方向**:

- より大きなコンテキストウィンドウの開発
- RAGとコードグラフの組み合わせ
- 動的コンテキスト選択アルゴリズム

#### 7.1.2 Code Quality and Consistency（コード品質と一貫性）

**課題**:

- 生成されたコードのスタイル一貫性
- ベストプラクティスの遵守
- セキュリティ脆弱性の回避

**改善方向**:

- コーディング標準の明示的な指定
- 静的解析ツールの統合強化
- セキュリティレビューの自動化

#### 7.1.3 Error Handling and Recovery（エラー処理と回復）

**課題**:

- 複雑なエラーメッセージの理解
- ランタイムエラーからの回復
- デバッグの効率化

**改善方向**:

- より高度なエラー解析
- 自動デバッグ機能の強化
- ロールバック機能の改善

#### 7.1.4 Human-Agent Collaboration（人間-エージェント協調）

**課題**:

- 適切な介入タイミングの判断
- エージェントの意図の理解
- 協調ワークフローの最適化

**改善方向**:

- より直感的なインターフェース
- エージェントの説明可能性向上
- 協調パターンのカスタマイズ

### 7.2 将来の研究方向

#### 7.2.1 Advanced Reasoning Capabilities（高度な推論能力）

- 複雑な問題の論理的分析
- 設計パターンの適切な適用
- トレードオフの理解と判断

#### 7.2.2 Domain-Specific Agents（ドメイン特化エージェント）

- 特定のドメイン知識の統合
- 業界標準の遵守
- ドメイン特有のパターンの学習

#### 7.2.3 Long-term Memory and Learning（長期記憶と学習）

- 継続的な学習と改善
- プロジェクト固有のパターンの記憶
- チームの好みの学習

#### 7.2.4 Multi-Agent Orchestration（マルチエージェントオーケストレーション）

- 複数エージェントの効率的な協調
- 動的な役割割り当て
- コンフリクト解決メカニズム

#### 7.2.5 Security and Privacy（セキュリティとプライバシー）

- 安全なコード生成
- プライベートデータの保護
- 脆弱性の自動検出と修正

### 7.3 実用化への課題

#### 7.3.1 Trust and Reliability（信頼性と信頼）

- エージェント生成コードへの信頼構築
- 予測可能な動作の保証
- 失敗時の影響の最小化

#### 7.3.2 Cost-Effectiveness（コスト効率）

- LLM APIコストの最適化
- 計算リソースの効率的な利用
- ROIの実証

#### 7.3.3 Integration with Existing Workflows（既存ワークフローとの統合）

- レガシーシステムへの統合
- 既存ツールとの互換性
- チームの採用と適応

## 8. Conclusion（結論）

### 8.1 主要な貢献

本論文は、Vibe Codingについて以下の貢献を行いました：

1. **体系的な調査**: Vibe Codingエコシステムを5つの主要側面から包括的に分析
2. **分類法の提案**: 5つの開発モデル（UAM、ICCM、PDM、TDM、CEM）の提案
3. **課題の特定**: 現在の技術的課題と将来の研究方向の明確化

### 8.2 Vibe Codingの変革的影響

Vibe Codingは、ソフトウェア開発に以下の変革をもたらす可能性があります：

1. **開発速度の向上**: 自動化による迅速なプロトタイピングと実装
2. **抽象化レベルの上昇**: 開発者が高レベルの設計と要件に集中可能
3. **参入障壁の低下**: コーディング経験が少ない人でも複雑なアプリケーション開発が可能
4. **イノベーションの加速**: アイデアの迅速な検証と実験

### 8.3 今後の展望

Vibe Codingの成功には、以下の要素が重要です：

1. **基盤モデルの継続的改善**: より強力で効率的なLLMの開発
2. **ツールとインフラの進化**: より統合された開発環境
3. **ベストプラクティスの確立**: 効果的な開発パターンの共有
4. **コミュニティの形成**: 開発者間の知識共有と協力

Vibe Codingは、ソフトウェア開発の未来を形作る重要な技術パラダイムとして、今後さらなる発展が期待されます。

## 重要な図表

### Figure 1: The Triadic Relationship in Vibe Coding

Vibe Codingにおける人間開発者、ソフトウェアプロジェクト、コーディングエージェントの三者関係を示す図。

### Figure 2: The Ecosystem of Vibe Coding

Vibe Codingエコシステムの5つの主要コンポーネント（基盤モデル、エージェント機能、開発環境、フィードバックメカニズム、開発モデル）とその相互関係を示す包括的な図。

### Table 1: Foundational Models and Their Characteristics

主要な基盤モデル（CodeGen、StarCoder、Code Llama、DeepSeek-Coderなど）の特徴、訓練手法、パラメータサイズを比較。

### Table 2: Comparison of Development Models

5つの開発モデル（UAM、ICCM、PDM、TDM、CEM）の特徴、適用シナリオ、制限事項を比較。

## キーワード

- Vibe Coding
- Large Language Models (LLM)
- Coding Agents
- Software Development
- AI-assisted Programming
- Test-Driven Development
- Context Management
- Multi-Agent Collaboration
- Feedback Mechanisms
- Development Models

## 参考文献

論文には200以上の参考文献が含まれており、以下のような主要な研究が引用されています：

- CodeGen、StarCoder、Code Llamaなどの基盤モデル
- AutoGPT、MetaGPT、ChatDevなどのエージェントフレームワーク
- SWE-agent、OpenDevin、Aidなどの実装システム
- HumanEval、MBPPなどのベンチマークデータセット

---

**論文情報**:

- タイトル: A Survey of Vibe Coding with Large Language Models
- 著者: Zhen Guo, Adriana Meza Soria, Min Zeng
- 発行: arXiv:2510.12399v1 [cs.SE]
- 日付: 2024年10月16日
