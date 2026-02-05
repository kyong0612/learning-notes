---
title: "microsoft/agent-lightning: The absolute trainer to light up AI agents."
source: "https://github.com/microsoft/agent-lightning"
author:
  - "[[Microsoft]]"
  - "[[Xufang Luo]]"
  - "[[Yuge Zhang]]"
  - "[[Zhiyuan He]]"
  - "[[Zilong Wang]]"
published: 2025-06-06
created: 2026-02-05
description: "Agent Lightningは、AIエージェントを強化学習（RL）で訓練するためのMicrosoft製オープンソースフレームワーク。コード変更ほぼゼロで任意のエージェントフレームワーク（LangChain、AutoGen、CrewAI等）と統合可能。"
tags:
  - "clippings"
  - "AI-agents"
  - "reinforcement-learning"
  - "agent-training"
  - "Microsoft"
  - "LLM"
  - "machine-learning"
  - "open-source"
---

## 概要

**Agent Lightning**は、Microsoftが開発したオープンソースの AIエージェント訓練フレームワーク。「コード変更ほぼゼロ」で既存のAIエージェントを強化学習で最適化できることが最大の特徴。

- **GitHub Stars**: 14,052+ | **Forks**: 1.2k+
- **ライセンス**: MIT License
- **公式ドキュメント**: https://microsoft.github.io/agent-lightning/

---

## コア機能

| 機能 | 説明 |
|------|------|
| **ゼロコード変更** | 既存のエージェントコードをほぼ変更せずに最適化可能 |
| **フレームワーク非依存** | LangChain、OpenAI Agent SDK、AutoGen、CrewAI、Microsoft Agent Framework、Python OpenAIなど任意のフレームワークで動作 |
| **選択的最適化** | マルチエージェントシステム内の特定エージェントのみを選択して最適化可能 |
| **多様なアルゴリズム** | 強化学習、自動プロンプト最適化、教師ありファインチューニングなどをサポート |

---

## インストール方法

### 安定版
```shell
pip install agentlightning
```

### 最新ナイトリービルド（最先端機能）
```shell
pip install --upgrade --index-url https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple/ --pre agentlightning
```

---

## アーキテクチャ

Agent Lightningのアーキテクチャは最小限の可動部品で構成され、アイデアに集中できる設計：

1. **エージェント実行**: 既存のエージェントフレームワークをそのまま使用可能
2. **軽量ヘルパー**: `agl.emit_xxx()` ヘルパーを挿入、またはトレーサーがプロンプト・ツール呼び出し・報酬を自動収集
3. **LightningStore**: タスク、リソース、トレースを同期する中央ハブ
4. **アルゴリズム**: スパンを読み取り学習し、更新されたリソース（洗練されたプロンプトテンプレートや新しいポリシーウェイト）を投稿
5. **Trainer**: データセットをランナーにストリーム、ストアとアルゴリズム間でリソースを転送、改善が着陸したら推論エンジンを更新

---

## 主要な論文・記事

| 日付 | タイトル | 概要 |
|------|----------|------|
| 2025/12/17 | [Trajectory Level Aggregation](https://agent-lightning.github.io/posts/trajectory_level_aggregation/) | より高速な訓練のための軌道レベル集約の採用 |
| 2025/11/04 | [Tuning ANY AI agent with Tinker × Agent-lightning](https://medium.com/@yugez/tuning-any-ai-agent-with-tinker-agent-lightning-part-1-1d8c9a397f0e) | Tinkerとの統合によるエージェントチューニング |
| 2025/10/22 | [No More Retokenization Drift](https://blog.vllm.ai/2025/10/22/agent-lightning.html) | vLLMブログ: OpenAI Compatible APIでのトークンID返却の重要性 |
| 2025/08/11 | [Training AI Agents to Write and Self-correct SQL](https://medium.com/@yugez/training-ai-agents-to-write-and-self-correct-sql-with-reinforcement-learning-571ed31281ad) | 強化学習によるSQL生成・自己修正エージェントの訓練 |
| **2025/08/05** | [**Agent Lightning arXiv論文**](https://arxiv.org/abs/2508.03680) | 主要な学術論文 |
| 2025/06/06 | [Microsoft Research Project Page](https://www.microsoft.com/en-us/research/project/agent-lightning/) | 公式プロジェクトページ |

---

## コミュニティプロジェクト

| プロジェクト | 説明 |
|-------------|------|
| **[DeepWerewolf](https://github.com/af-74413592/DeepWerewolf)** | 中国版人狼ゲーム用のエージェントRL訓練（AgentScope + Agent Lightning） |
| **[AgentFlow](https://agentflow.stanford.edu/)** | プランナー、エグゼキューター、ベリファイアー、ジェネレーターを組み合わせたモジュラー型マルチエージェントフレームワーク（Flow-GRPOアルゴリズム使用） |
| **[Youtu-Agent](https://github.com/TencentCloudADP/Youtu-agent)** | 128 GPUまでスケール可能なRL訓練を実現（数学/コード/検索能力） |

---

## 責任あるAI

- Microsoftの責任あるAI基準に準拠して評価・認定済み
- チームは継続的にリポジトリを監視・保守し、潜在的な害を含む重大な問題に対処

---

## 引用

```bibtex
@misc{luo2025agentlightningtrainai,
  title={Agent Lightning: Train ANY AI Agents with Reinforcement Learning},
  author={Xufang Luo and Yuge Zhang and Zhiyuan He and Zilong Wang and Siyun Zhao and Dongsheng Li and Luna K. Qiu and Yuqing Yang},
  year={2025},
  eprint={2508.03680},
  archivePrefix={arXiv},
  primaryClass={cs.AI},
  url={https://arxiv.org/abs/2508.03680},
}
```

---

## 重要なポイント

1. **フレームワーク非依存**: 既存のエージェント開発環境を変更せずにRL訓練を追加可能
2. **選択的最適化**: マルチエージェント環境で特定のエージェントのみをターゲット可能
3. **活発なコミュニティ**: 14,000以上のスター、複数のサードパーティ統合プロジェクト
4. **エンタープライズ対応**: Microsoft Research発、責任あるAI基準準拠、MIT License
