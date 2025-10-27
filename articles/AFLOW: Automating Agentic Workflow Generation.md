---
title: "AFLOW: Automating Agentic Workflow Generation"
source: "https://arxiv.org/pdf/2410.10762"
author:
  - Jiayi Zhang
  - Jinyu Xiang
  - Zhaoyang Yu
  - Fengwei Teng
  - Xiong-Hui Chen
  - Jiaqi Chen
  - Mingchen Zhuge
  - Xin Cheng
  - Sirui Hong
  - Jinlin Wang
  - Bingnan Zheng
  - Bang Liu
  - Yuyu Luo
  - Chenglin Wu
published: 2025
created: 2025-10-27
description: |
  ICLR 2025で発表された論文。大規模言語モデル(LLM)のためのagentic workflowを自動生成するフレームワークAFLOWを提案。Monte Carlo Tree Searchを用いてコード表現されたworkflowを探索・最適化し、6つのベンチマークデータセットで既存手法を5.7%上回る性能を達成。
tags:
  - machine-learning
  - llm
  - agentic-workflow
  - mcts
  - workflow-optimization
  - automated-optimization
  - code-generation
---

## 概要

大規模言語モデル(LLM)は複雑なタスクを解決する上で大きな可能性を示しているが、効果的なagentic workflowの構築には多大な人的労力が必要である。本論文では、この課題に対処するため、**AFLOW**（Automated Flow Optimization using LLM and Workflow）という自動化フレームワークを提案する。AFLOWは、Monte Carlo Tree Search（MCTS）を活用してコード表現されたworkflowの探索空間を効率的に探索し、反復的にworkflowを改善する。

## 主要な貢献

1. **問題の定式化**: Workflow最適化問題を統一的に定式化し、既存手法を特殊ケースとして一般化
2. **AFLOWフレームワーク**: MCTSベースの自動workflow生成手法を提案
3. **広範な評価**: 6つのベンチマークデータセット（HumanEval、MBPP、MATH、GSM8K、HotPotQA、DROP）で評価を実施

## 背景と課題

### Agentic Workflowとは

Agentic workflowは、複数のLLM呼び出しと詳細な指示を組み合わせた構造化されたプロセスである。以下のような特徴がある：

- **静的な実行**: 事前に定義されたプロセスに従ってタスクを完了
- **人間の専門知識**: 既存のドメイン知識と反復的な改善に基づいて構築可能
- **汎用性と専門性**: 一般的な問題解決手法とドメイン特化型の両方が存在

### 既存手法の限界

従来のworkflow最適化手法には以下の制約がある：

1. **プロンプト最適化**: 固定されたworkflow内でのプロンプト最適化のみ（DSPy、TextGradなど）
2. **ハイパーパラメータ最適化**: 事前定義されたパラメータの最適化に限定（Archonなど）
3. **Workflow構造の探索不足**:
   - GPTSwarmはグラフ構造を使用するが、条件分岐の表現に制約
   - ADASはコード構造を使用するが、線形ヒューリスティック探索の効率性に限界

## AFLOWの設計

### 問題定式化

Agentic workflowを以下のように定義：

- **ノード (N)**: LLM呼び出しを表す。各ノードは以下のパラメータを持つ：
  - Model (M): 使用するLLM
  - Prompt (P): 入力または タスク記述
  - Temperature (τ): ランダム性を制御するパラメータ
  - Output format (F): 出力フォーマット（json、markdown、xml、rawなど）

- **エッジ (E)**: ノード間の関係を定義する抽象構造
  - グラフ: 階層的、順次的、並列的関係を表現
  - ニューラルネットワーク: 複雑な非線形関係を表現
  - **コード**: 最も包括的な表現（本研究で採用）

### 探索空間の定義

探索空間 \( S \) は以下のように表現される：

\[ S = \{(N, E) | E \in E\} \]

ここで、\( N = \{N(M, \tau, P, F) | M \in M, \tau \in [0, 1], P \in P, F \in F\} \)

最適化問題は以下のように定式化される：

\[ W^* = \arg\max_{W \in S} G(W, T) \]

ここで、\( G \) は評価関数、\( T \) はタスクを表す。

### Operators（演算子）

探索効率を向上させるため、AFLOWは**Operators**という概念を導入：

- 一般的なagentic操作（Ensemble、Review & Revise、Testなど）をカプセル化
- ノードとエッジの組み合わせを統一されたインターフェースとして提供
- 事前定義された7つのOperators:
  1. Generate（生成）
  2. Format（フォーマット）
  3. Review and Revise（レビューと修正）
  4. Ensemble（アンサンブル）
  5. Test（テスト）
  6. Programmer（プログラマー）
  7. Custom（カスタム - デフォルトのオペレータ）

### MCTSベースの探索プロセス

AFLOWは4つの主要ステージで構成される反復プロセスを実行：

#### 1. Soft Mixed Probability Selection（ソフト混合確率選択）

トップk個のworkflowと初期workflowから選択する確率分布：

\[ P_{mixed}(i) = \lambda \cdot \frac{1}{n} + (1 - \lambda) \cdot \frac{\exp(\alpha \cdot (s_i - s_{max}))}{\sum_{j=1}^{n} \exp(\alpha \cdot (s_j - s_{max}))} \]

- \( \lambda = 0.2 \): 探索と活用のバランス
- \( \alpha = 0.4 \): スコアの影響を制御

#### 2. LLM-Based Expansion（LLMベースの拡張）

- Claude-3.5-sonnetをオプティマイザーとして使用
- 選択されたworkflowの経験を活用して新しいworkflowを生成
- 過去の修正とその成功/失敗を含むコンテキストを提供

#### 3. Execution Evaluation（実行評価）

- 各生成されたworkflowを検証セットで5回実行
- 平均と標準偏差を計算
- より正確なフィードバックを提供し、探索効率を向上

#### 4. Experience Backpropagation（経験の逆伝播）

以下の情報を記録：

- Workflowのパフォーマンス
- 親workflowからの修正内容
- 親に対する最適化の成功/失敗

### Tree-Structured Experience（ツリー構造の経験）

AFLOWの重要な特徴は、MCTS のツリー構造を活用して過去の探索経験を保持すること：

- **効率的な経験の再利用**: 過去の成功した修正を正確に再利用
- **失敗の回避**: 過去の失敗を避けることで探索効率を向上
- **局所最適の回避**: 特別な選択メカニズムにより、任意のラウンドで空白テンプレートから生成可能

## 実験結果

### 主要な性能比較

6つのベンチマークデータセットでの評価結果：

| 手法 | HotpotQA | DROP | HumanEval | MBPP | GSM8K | MATH | 平均 |
|------|----------|------|-----------|------|-------|------|------|
| IO | 68.1 | 68.3 | 87.0 | 71.8 | 92.7 | 48.6 | 72.8 |
| CoT | 67.9 | 78.5 | 88.6 | 71.8 | 92.4 | 48.8 | 74.7 |
| CoT SC | 68.9 | 78.8 | 91.6 | 73.6 | 92.7 | 50.4 | 76.0 |
| MedPrompt | 68.3 | 78.0 | 91.6 | 73.6 | 90.0 | 50.0 | 75.3 |
| MultiPersona | 69.2 | 74.4 | 89.3 | 73.6 | 92.8 | 50.8 | 75.1 |
| Self Refine | 60.8 | 70.2 | 87.8 | 69.8 | 89.6 | 46.1 | 70.7 |
| ADAS | 64.5 | 76.6 | 82.4 | 53.4 | 90.8 | 35.4 | 67.2 |
| **AFLOW** | **73.5** | **80.6** | **94.7** | **83.4** | **93.5** | **56.2** | **80.3** |

### 主要な発見

1. **性能向上**: 手動設計された手法と比較して平均5.7%の改善、既存の自動化手法と比較して19.5%の改善
2. **複雑なタスクでの優位性**: MATHlv5*とMBPPタスクでADASと比較して57%の改善
3. **コスト効率**: 弱いモデルでも強いモデルを上回る性能を達成
   - DeepSeek-V2.5 + AFLOW workflow: GPT-4oのIOと同等の性能をコストの4.55%で実現

### アブレーション研究

Operatorsの有無による比較（GSM8Kデータセット）：

- Operatorsあり: 最高性能93.5%
- **Operatorsなし**: 93.1%（依然として手動設計を上回る）
  - 興味深いことに、Operatorsなしでもアンサンブル様の構造を自律的に開発

### ケーススタディ

#### GSM8Kでの反復プロセス

AFLOWは以下のように段階的にworkflowを改善：

1. **ラウンド1 → 2**: ScEnsembleオペレータを追加（スコア: 0.8591 → 0.8872）
2. **ラウンド2 → 3**: Programmerオペレータを使用したレビューステップを追加（スコア: 0.8872 → 0.9160）
3. **ラウンド6 → 7**: 最終回答フォーマットのためのカスタムプロンプトを修正（スコア: 0.9160 → 0.9333）
4. **ラウンド8 → 10**: 推論とステップバイステップチェックのためのカスタムプロンプトを修正（スコア: 0.9333 → 0.9352）

#### MBPPでの発見

AFLOWは、手動設計されたworkflowと類似した構造を自動的に発見：

- LLMによるテスト生成と実行（AlphaCodeに類似）
- コード生成、テスト、修正の反復プロセス

## 理論的特性

### 探索空間の完全性

AFLOWの探索空間の完全性は2つの主要な特性に依存：

1. コード表現されたエッジ構造がすべての有効なノード関係を表現可能
2. LLM拡張が非ゼロ確率で有効なworkflow修正を生成

### 収束特性

AFLOWは以下の3つの条件下で有限反復内に最適性能を達成：

1. 評価関数 \( G(W, T) \) が有界
2. コード表現されたエッジ構造によって有効なworkflowが維持される
3. LLMが改善を生成する非ゼロ確率

### 探索効率

AFLOWは3つの主要メカニズムで探索効率を向上：

1. **Operators**: 成功パターンをエンコードした事前定義されたノード組み合わせ
2. **Tree-Structured Experience**: 成功した修正の効率的な再利用と失敗の回避
3. **Execution Feedback**: パフォーマンス測定による最適化プロセスの誘導

## オープンエンドタスクへの拡張

論文では、数値フィードバックを持たないオープンエンドタスクへのAFLOWの適用も議論：

### LLM-as-a-Judge評価

GPT-4oを評価モデルとして使用し、以下の4つの次元で評価：

1. **Content Relevance（内容の関連性）**: 1-5点
2. **Content Quality（内容の質）**: 1-5点
3. **Coherence and Structure（一貫性と構造）**: 1-5点
4. **Reference Comparison（参照との比較）**: 1-5点

### オープンエンドタスクのケーススタディ

#### 長編小説生成

- 20,000語の小説生成タスクで8回の反復後、27,000語の小説を生成
- LLMスコア: 12 → 20、人間スコア: 2 → 19.3

#### 学術アイデア生成

- GPT-4o-miniを実行モデル、Claude-3.5-sonnetを最適化モデルとして使用
- 6回の反復後に最高性能を達成
- 10の異なる質問でテスト、一貫した性能向上を確認

## 制限事項

論文で明示的に述べられていないが、以下の制限が考えられる：

1. **計算コスト**: MCTSベースの探索と5回の実行評価により、初期段階での計算コストが高い
2. **タスクスコープ**: 主に推論タスクに焦点を当てており、他のタイプのタスクへの一般化可能性は限定的
3. **LLM依存性**: オプティマイザーとして強力なLLM（Claude-3.5-sonnet）に依存

## 結論と今後の展望

AFLOWは、agentic workflowの自動生成における重要な進歩を示す：

1. **自動化**: 人間の介入を最小限に抑えたworkflow生成
2. **性能**: 手動設計および既存の自動化手法を上回る
3. **コスト効率**: 弱いモデルでも強いモデルを上回る性能を達成
4. **一般化可能性**: 推論タスクからオープンエンドタスクまで拡張可能

今後の研究方向：

- より多様なタスクタイプへの適用
- 計算効率のさらなる改善
- より洗練された評価メカニズムの開発
- 人間とAIの協調的なworkflow設計

## 関連リソース

- コード: <https://github.com/FoundationAgents/AFlow>
- 論文: <https://arxiv.org/pdf/2410.10762>
- 会議: ICLR 2025
