---
title: "Prompt Less, Smile More: MTP with Semantic Engineering in Lieu of Prompt Engineering"
source: "https://arxiv.org/html/2511.19427v1"
author:
  - "Jayanaka L. Dantanarayana"
  - "Savini Kashmira"
  - "Thakee Nathees"
  - "Zichen Zhang"
  - "Krisztian Flautner"
  - "Lingjia Tang"
  - "Jason Mars"
published: 2025-11-24
created: 2026-01-02
description: "Semantic Engineeringを導入し、LLMベースのシステムにおいて開発者の意図をより正確に反映させる手法を提案。Semantic Context Annotations (SemTexts)によって、プロンプトエンジニアリングと比較して3.8倍の工数削減を実現しながら、1.3〜3倍の精度向上を達成。"
tags:
  - "clippings"
  - "LLM"
  - "Prompt Engineering"
  - "Programming Languages"
  - "Semantic Engineering"
  - "MTP"
---

## 要約

### 概要

本論文は、Large Language Models (LLMs) を統合したプログラミングにおける新しいパラダイムとして**Semantic Engineering**を提案している。従来のPrompt Engineeringは高性能だが手動での大きな労力を要し、Meaning Typed Programming (MTP) は労力を削減するが性能面で課題があった。Semantic Engineeringは、**Semantic Context Annotations (SemTexts)** という軽量な言語レベルの仕組みを導入することで、開発者の意図をコードに直接埋め込み、プロンプト生成を自動化しながら高い性能を維持する。

### 主要な貢献

1. **Semantic Context Annotations (SemTexts)** - コード内の任意のエンティティ（関数、パラメータ、クラス、変数など）に自然言語による意味的注釈を付与できる新しい言語機構
2. **拡張されたMT-IR (Meaning-Typed Intermediate Representation)** - 構造的セマンティクスとSemTextsを統合した中間表現
3. **包括的なベンチマークスイート** - 実際のAI統合アプリケーションシナリオを反映した6つのベンチマーク
4. **実証的評価** - Prompt Engineeringと同等の性能を、約3.8倍少ない工数で達成

### 技術的詳細

#### SemTextsの構文

```python
sem T = "意味的な説明文"
```

ここで、`T`は任意のプログラムエンティティ（関数、パラメータ、クラス属性、変数など）を表す。

**例:**

```python
sem Plan = "コード修正のための構造化された実行計画"
sem Plan.priority = "優先順位: 1 (メイン), 2-3 (サポート), 4 (その他)"
```

#### コンパイルパイプライン

1. **Phase 1: SemTable構築** - ASTを深さ優先で走査し、各`sem`宣言を対応するプログラムエンティティに解決
2. **Phase 2: MT-IR構築** - 基本的なMT-IRに加えて、SemTableから取得したセマンティックコンテキストでエンリッチされたMT-IR*を生成

#### ランタイム統合

拡張されたMT-Runtimeは、プロンプト生成時にSemTextsを対応する構造情報の隣に配置することで、エンティティとその意味の間の「空間的親和性」を維持する。

### 評価結果

#### ベンチマーク

6つの現実的なAI統合アプリケーション:

| ベンチマーク | タスク | データセット | メトリック |
|-----------|------|---------|--------|
| Memory Retrieval | クエリベースのメモリ検索 | 60ユーザー、300クエリ | F1スコア |
| Image Extraction | 視覚的特徴抽出 | LAION-400Mから300画像 | ハイブリッド類似度 |
| Task Manager | 会話型タスクルーティング | 220カスタムクエリ | LLM評価 |
| Content Creator | マルチエージェント執筆ワークフロー | 200 InstructEvalプロンプト | LLM評価 (≥11/15) |
| Aider Genius | コード編集・検証 | 300 SWE-benchタスク | テスト合格率 |

#### 性能向上 (GPT-4oを使用)

**正規化性能 (PE = 1.0)**:

- Memory Retrieval: 0.70 (PE) → 0.70 (MTP+SemTexts) - 改善なし
- Image Extraction: 0.43 (PE) → 0.44 (MTP+SemTexts) - 最小限
- Task Manager: 89.5% (PE) → 92.3% (MTP+SemTexts)
- Content Creator: 95.0% (PE) → 96.0% (MTP+SemTexts)
- Aider Genius: 19.7% (PE) → 18.7% (MTP+SemTexts)

**重要な達成**: 複雑なベンチマークにおいて、SemTextsはMTPの性能を**1.3〜3倍向上**させ、ほとんどのタスクでPEと同等以上の精度を達成。

基本のMTPのみでは顕著な性能低下が見られた（例: Content Creatorで32.5% vs PEの95%）。

#### 開発者の工数削減

**コード行数 (LOC) オーバーヘッド:**

| ベンチマーク | PE | MTP | MTP+SemTexts | 削減率 |
|-----------|----|----|--------------|--------|
| Memory Retrieval | 44 | 3 | 5 | 8.8倍 |
| Image Extraction | 126 | 12 | 32 | 3.9倍 |
| Task Manager | 119 | 18 | 30 | 3.9倍 |
| Content Creator | 127 | 20 | 46 | 2.8倍 |
| Aider Genius | 154 | 20 | 34 | 4.5倍 |

**平均**: MTP+SemTextsは、PEと比較して**約3.8倍の工数削減**を達成。一方、基本MTPは平均約8.2倍の削減だが、精度は低い。

#### アブレーションスタディ (Content Creator)

段階的な分析により、ターゲットを絞ったセマンティックエンリッチメントが性能ギャップをどのように埋めるかを明らかにした:

- 基本MTP: 32%
- - AgentTypes SemTexts (4行): 58% (ほぼ2倍)
- - WorkflowStage SemTexts (4行): 72%
- - ReviewResult SemTexts: 87% (PEとほぼ同等)
- すべてのエンティティに注釈: 88% (追加の利益はわずか)
- 関数レベルプロンプトをSemTextsとして使用: 82% (性能低下、冗長なノイズ)

**重要な洞察**: 「精度の向上は、追加されたSemTextsの数に比例して線形に増加するわけではない。主要なセマンティックギャップが解決されると、さらなる注釈は限定的または利益をもたらさない。」

#### SemTexts vs Docstrings

| ベンチマーク | MTP | MTP+Docstring | MTP+SemText |
|-----------|-----|----------------|------------|
| Content Creator | 32% | 88% | 96% |
| Task Manager | 35.8% | 85.7% | 92.3% |

**性能上の優位性**: SemTextsはdocstringsを7〜8%上回った。これは優れた空間的親和性によるもの。Docstringsはエンティティと意味の間に「ゼロでないトークン距離」を生じさせるが、「SemTextsは個々の属性に直接付与でき...コンテキストが関連エンティティのすぐ隣に現れることを可能にする。」

### 設計原則

効果的なSemantic Engineeringメカニズムは以下を満たすべき:

1. **あらゆるレベルのコードエンティティに紐付け可能**
2. **配置制約なくどこでも適用可能**
3. **軽量な構文で最小限の開発者労力**

### SemTextsが最も効果的な場合

- 計画、調整、条件付きルーティングを必要とする複雑なタスク
- 列挙値が振る舞いの明確化を必要とするシナリオ
- 曖昧な状態遷移を持つマルチエージェントワークフロー
- 開発者の意図が型情報を超える場合

### SemTextsの効果が限定的な場合

- コードに既に明確なセマンティクスがある単純なタスク（例: メモリ検索）
- 意図が明示的な単純な関数シグネチャ
- 型が振る舞いを適切に伝達する構造化されたコード

### 制限事項

- SemTextsの効果はタスクの複雑さとコード構造に依存
- 不適切に設計されたSemTexts（例: 完全なプロンプトの複製）は性能を低下させる
- 基本MTPと比較してオーバーヘッドはゼロではない（MTP平均8.2倍 vs 3.8倍削減）
- 評価はPythonベースのJac実装に限定

### 今後の方向性

- Jac以外のプログラミング言語への拡張
- 自動SemText生成技術の調査
- 階層的セマンティック注釈戦略の探求
- 追加の実世界アプリケーションとドメインでのテスト

### 結論

SemTextsを用いたSemantic Engineeringは、自動プロンプト生成の根本的な制限に対する実用的な解決策を提供する。開発者が軽量な注釈を通じて欠落しているコンテキスト上の意図を表現できるようにすることで、このアプローチは手動プロンプトエンジニアリングと同等の性能（1.3〜3倍の改善）を達成しながら、劇的に削減されたオーバーヘッド（PEより3.8倍少ないコード）を維持する。空間的親和性の設計原則—セマンティックな説明を対応するエンティティのすぐ隣に配置すること—は、LLMの解釈可能性にとって重要であることが証明された。この研究は、網羅的な注釈ではなく、戦略的なコードのセマンティックエンリッチメントが最適な結果をもたらすことを実証している。
