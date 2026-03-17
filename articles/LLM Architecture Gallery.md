---
title: "LLM Architecture Gallery"
source: "https://sebastianraschka.com/llm-architecture-gallery/"
author:
  - "[[Sebastian Raschka]]"
published: 2026-03-16
created: 2026-03-17
description: "GPT-2からGLM-5、Qwen3.5まで、主要なオープンウェイトLLMのアーキテクチャ図とファクトシートを収集したビジュアルギャラリー。Dense、MoE、MLA、ハイブリッドデコーダの設計選択を比較できる。"
tags:
  - "clippings"
  - "LLM"
  - "AI"
  - "Transformer"
  - "Architecture"
  - "MoE"
  - "Deep Learning"
---

## 概要

Sebastian Raschkaが作成したLLMアーキテクチャの包括的なビジュアルギャラリー。[The Big LLM Architecture Comparison](https://magazine.sebastianraschka.com/p/the-big-llm-architecture-comparison)、[From GPT-2 to gpt-oss](https://magazine.sebastianraschka.com/p/from-gpt-2-to-gpt-oss-analyzing-the)、[From DeepSeek V3 to V3.2](https://magazine.sebastianraschka.com/p/technical-deepseek)、[A Dream of Spring for Open-Weight LLMs](https://magazine.sebastianraschka.com/p/a-dream-of-spring-for-open-weight) の4つの記事から、各モデルのアーキテクチャ図とファクトシートを集約している。

2019年のGPT-2 XLから2026年3月のNemotron 3 Superまで、**39モデル**のアーキテクチャを収録。各カードにはスケール、リリース日、デコーダタイプ、アテンション方式、主要な設計上の特徴が記載されている。ポスター版（14570×12490px、182メガピクセル）も [Redbubble](https://www.redbubble.com/i/poster/LLM-Architecture-Gallery-by-Ahead-of-AI/179274487/flk2) と [Zazzle](https://www.zazzle.com/llm_architecture_gallery_poster-256240804751481870) で入手可能。

## 主要なトピック

### デコーダタイプの分類

ギャラリーに収録されたモデルは大きく4つのデコーダタイプに分類される：

| デコーダタイプ | 説明 | 代表モデル |
|---|---|---|
| **Dense** | 全パラメータを常時使用する従来型 | Llama 3, Gemma 3, Qwen3 32B, OLMo 3 |
| **Sparse MoE** | Mixture-of-Expertsで推論時はパラメータの一部のみ活性化 | DeepSeek V3, Llama 4 Maverick, GPT-OSS |
| **Hybrid MoE** | MoEにMamba-2等の状態空間モデルを組み合わせ | Nemotron 3 Nano, Nemotron 3 Super |
| **Sparse Hybrid** | MoE + 線形アテンション（DeltaNet/Lightning Attention） | Qwen3 Next, Kimi Linear, Qwen3.5, Ling 2.5 |

### アテンションメカニズムの進化

ギャラリーで追跡される主要なアテンション技術：

- **MHA（Multi-Head Attention）**: GPT-2やOLMo 2で使用される古典的な方式
- **GQA（Grouped-Query Attention）**: KVヘッドを共有しKVキャッシュを削減。Llama 3以降の標準
- **MLA（Multi-head Latent Attention）**: DeepSeek V3が導入した低ランク射影によるKV圧縮
- **SWA（Sliding-Window Attention）**: ローカルウィンドウとグローバルレイヤーを交互に配置
- **QK-Norm**: Q/Kベクトルの正規化で学習安定性を向上
- **NoPE（No Positional Encoding）**: 一部レイヤーで位置エンコーディングを省略
- **Gated DeltaNet / Gated Attention**: 線形アテンションのハイブリッド方式
- **DeepSeek Sparse Attention**: 長文脈コスト削減のためのスパースアテンション

### 全モデル一覧

#### Denseモデル

| モデル | スケール | リリース日 | アテンション | 主な特徴 |
|---|---|---|---|---|
| GPT-2 XL | 1.5B | 2019-11 | MHA（learned absolute PE） | Dropout, GELU, LayerNormの古典的レシピ |
| Llama 3 | 8B | 2024-04 | GQA + RoPE | Pre-normベースライン |
| OLMo 2 | 7B | 2024-11 | MHA + QK-Norm | Inside-residual post-normを採用 |
| Gemma 3 | 27B | 2025-03 | GQA + QK-Norm + 5:1 SWA/Global | ローカルアテンションを積極活用、大規模多言語語彙 |
| Mistral Small 3.1 | 24B | 2025-03 | Standard GQA | レイテンシ重視設計、小さいKVキャッシュ |
| Qwen3 32B | 32B | 2025-04 | GQA + QK-Norm | OLMo 3 32Bとの直接比較用 |
| Qwen3 8B | 8B | 2025-04 | GQA + QK-Norm | QK-Normと8 KVヘッド |
| Qwen3 4B | 4B | 2025-04 | GQA + QK-Norm | 151k語彙のコンパクトモデル |
| SmolLM3 | 3B | 2025-06 | GQA + periodic NoPE | 4層ごとにRoPEを省略するNoPEスタイル |
| OLMo 3 32B | 32B | 2025-11 | GQA + QK-Norm + 3:1 SWA/Global | Post-normを維持しYaRNをグローバル層のみに適用 |
| OLMo 3 7B | 7B | 2025-11 | MHA + QK-Norm + 3:1 SWA/Global | Post-norm維持、YaRNをグローバル層のみに適用 |
| Nanbeige 4.1 | 3B | 2026-02 | GQA | Llama-likeだが入出力埋め込みの重み共有なし |
| Tiny Aya | 3.35B | 2026-02 | GQA + 3:1 SWA | AttentionとMLPを並列実行、RoPE+NoPE混合 |

#### Sparse MoEモデル

| モデル | スケール（総/活性） | リリース日 | アテンション | 主な特徴 |
|---|---|---|---|---|
| DeepSeek V3 | 671B / 37B | 2024-12 | MLA | Dense prefix + shared expert |
| DeepSeek R1 | 671B / 37B | 2025-01 | MLA | V3と同一アーキテクチャ、推論特化学習 |
| Llama 4 Maverick | 400B / 17B | 2025-04 | GQA | DenseとMoEブロックを交互配置、より大きなエキスパート |
| Qwen3 235B | 235B / 22B | 2025-04 | GQA + QK-Norm | Shared expertなしの高容量MoE |
| Kimi K2 | 1T / 32B | 2025-07 | MLA | DeepSeek V3レシピのスケールアップ版 |
| GLM-4.5 | 355B / 32B | 2025-07 | GQA + QK-Norm | 3層のdense prefixとshared expert |
| GPT-OSS 120B | 120B | 2025-08 | GQA + alternating SWA/Global | OpenAI初のオープンウェイトMoE |
| GPT-OSS 20B | 20B / 3.6B | 2025-08 | GQA + alternating SWA/Global | Attention biasとsinkメカニズム |
| Grok 2.5 | 270B | 2025-08 | GQA | 常時オンのSwiGLUパス（shared expert的） |
| MiniMax M2 | 230B / 10B | 2025-10 | GQA + QK-Norm + partial RoPE | Per-layer QK-Norm、非常にスパースなMoEルーティング |
| DeepSeek V3.2 | 671B / 37B | 2025-12 | MLA + DeepSeek Sparse Attention | 長文脈コスト削減のためのスパースアテンション追加 |
| Mistral 3 Large | 673B / 41B | 2025-12 | MLA | DeepSeek V3のほぼクローン、より大きなエキスパート |
| Xiaomi MiMo-V2-Flash | 309B / 15B | 2025-12 | 5:1 SWA/Global | 128トークンのローカルウィンドウ + multi-token prediction |
| GLM-4.7 | 355B / 32B | 2025-12 | GQA + QK-Norm | MLA移行前のベースライン |
| Arcee AI Trinity Large | 400B / 13B | 2026-01 | GQA + gated attention + 3:1 SWA/Global | QK-Norm, RoPE+NoPE, sandwich normの組み合わせ |
| GLM-5 | 744B / 40B | 2026-02 | MLA + DeepSeek Sparse Attention | GLMシリーズ最大、MLA採用 |
| MiniMax-M2.5 | 230B / 10B | 2026-02 | GQA + QK-Norm | SWAやハイブリッドアテンションを意図的に不採用 |
| Sarvam 105B | 105B | 2026-03 | MLA + KV LayerNorm + NoPE+RoPE | インド言語対応の大規模MLA MoE |
| Sarvam 30B | 30B | 2026-03 | GQA + QK-Norm | インド言語対応の推論特化MoE |

#### Hybrid MoE / Sparse Hybridモデル

| モデル | スケール（総/活性） | リリース日 | アテンション | 主な特徴 |
|---|---|---|---|---|
| Qwen3 Next | 80B / 3B | 2025-09 | 3:1 Gated DeltaNet + Gated Attention | DeltaNetアテンションハイブリッド、262kコンテキスト |
| Kimi Linear | 48B / 3B | 2025-10 | 3:1 Kimi Delta Attention + MLA | MLA層でNoPE、チャネルワイズゲーティング |
| Nemotron 3 Nano | 30B / 3B | 2025-12 | Mostly Mamba-2 + few GQA | Mamba-2とMoEブロックをインターリーブ |
| Nemotron 3 Super | 120B / 12B | 2026-03 | Mostly Mamba-2 + few GQA | Latent-space MoE + shared-weight MTP |
| Ling 2.5 | 1T / 63B | 2026-02 | Lightning Attention + MLA | 7:1 linear-attention/MLA比率 |
| Qwen3.5 | 397B / 17B | 2026-02 | 3:1 Gated DeltaNet + Gated Attention | Qwen3 Next設計のフラグシップ化、512エキスパート |
| Step 3.5 Flash | 196B / 11B | 2026-02 | GQA + 3:1 SWA | MTP-3で高スループット実現 |

### アーキテクチャ設計のトレンド

1. **MoEの主流化**: 2024年末以降、大規模モデルのほとんどがSparse MoEを採用。活性パラメータを総パラメータの5〜15%に抑えることで推論効率を確保
2. **MLAの拡散**: DeepSeek V3が導入したMLAが、Mistral 3 Large、GLM-5、Sarvam 105Bなど他社モデルにも採用拡大
3. **ハイブリッドアテンションの台頭**: Gated DeltaNet（Qwen3 Next/3.5）、Mamba-2（Nemotron）、Lightning Attention（Ling 2.5）など、標準的なTransformerアテンションと線形アテンション/状態空間モデルの組み合わせが増加
4. **QK-Normの普及**: 2025年以降のほぼすべてのモデルがQK-Normを採用し、学習安定性を向上
5. **Sliding-Window Attentionの多様化**: Gemma 3の5:1からMiMo-V2-Flashの5:1（128トークン窓）まで、ローカル/グローバル比率の設計が多様化
6. **NoPEの実験**: SmolLM3、Tiny Aya、Arcee AI Trinity Largeなど、位置エンコーディングを一部省略する実験的アプローチが登場

## 重要な事実・データ

- **最大モデル**: Kimi K2（1T総パラメータ、32B活性）とLing 2.5（1T総パラメータ、63B活性）
- **最小モデル**: GPT-2 XL（1.5B）、SmolLM3（3B）、Nanbeige 4.1（3B）、Tiny Aya（3.35B）
- **最新モデル（2026年）**: Nemotron 3 Super（2026-03-11）、Sarvam 30B/105B（2026-03-03）、Qwen3.5（2026-02-16）
- **ポスター解像度**: 14570 × 12490 px（56MB PNG、182メガピクセル）
- **DeepSeek V3アーキテクチャの影響**: Mistral 3 Large、GLM-5、Kimi K2などが直接的にDeepSeek V3のMLA+MoEレシピを採用または参考にしている

## 結論・示唆

### 著者の結論

このギャラリーは、LLMアーキテクチャの急速な収束と分岐を視覚的に示している。Dense→MoE→ハイブリッドという進化の流れが明確で、DeepSeek V3のMLA+MoE設計が2025年以降の業界標準テンプレートとなったことがわかる。

### 実践的な示唆

- LLMアーキテクチャの比較研究や教育目的に最適なリファレンス資料
- 各モデルのconfig.json、テクニカルレポート、「from scratch」実装へのリンクが充実
- アーキテクチャの不正確な情報は[GitHub Issue Tracker](https://github.com/rasbt/LLMs-from-scratch/issues/new?labels=architecture-gallery&title=Architecture%20Gallery%3A%20)で報告可能

## 関連リソース（ソース記事）

- [The Big LLM Architecture Comparison](https://magazine.sebastianraschka.com/p/the-big-llm-architecture-comparison) — Dense, MoE, MLA, ハイブリッドデコーダの設計比較
- [From GPT-2 to gpt-oss: Analyzing the Architectural Advances](https://magazine.sebastianraschka.com/p/from-gpt-2-to-gpt-oss-analyzing-the) — RoPE, SwiGLU, MoE, GQA, SWA, RMSNormの変遷
- [From DeepSeek V3 to V3.2](https://magazine.sebastianraschka.com/p/technical-deepseek) — DeepSeek V3.2のスパースアテンション変更
- [A Dream of Spring for Open-Weight LLMs](https://magazine.sebastianraschka.com/p/a-dream-of-spring-for-open-weight) — 2026年初頭のオープンウェイトモデル動向

---

*Source: [LLM Architecture Gallery](https://sebastianraschka.com/llm-architecture-gallery/)*
