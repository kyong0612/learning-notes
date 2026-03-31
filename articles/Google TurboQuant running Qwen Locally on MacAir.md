---
title: "Google TurboQuant running Qwen Locally on MacAir"
source: "https://www.reddit.com/r/LocalLLaMA/comments/1s5kdu0/google_turboquant_running_qwen_locally_on_macair/"
author:
  - "[[gladkos]]"
published: 2026-03-28
created: 2026-03-31
description: "GoogleのTurboQuantアルゴリズムでllama.cppをパッチし、MacBook Air (M4, 16GB) 上でQwen 3.5-9Bを20Kトークンコンテキストで実行した実験報告。KVキャッシュの圧縮により、低メモリデバイスでの大規模コンテキスト推論を実現。"
tags:
  - "clippings"
  - "LLM"
  - "quantization"
  - "TurboQuant"
  - "llama.cpp"
  - "local-inference"
  - "KV-cache"
  - "Apple-Silicon"
---

## 概要

Reddit r/LocalLLaMA に投稿された実験報告。Google Researchが発表した**TurboQuant**（KVキャッシュ圧縮アルゴリズム）をllama.cppにパッチ適用し、**MacBook Air（M4チップ、16GB RAM）** 上で **Qwen 3.5–9B** を **20,000トークンのコンテキスト**で動作させることに成功した。従来、このデバイスでは大規模コンテキストのプロンプト処理は事実上不可能だったが、TurboQuantにより実現可能になった。

GUIアプリケーションとして [Atomic Chat](http://atomic.chat/)（オープンソース・無料）が提供されている。

---

## TurboQuantとは

Google Researchが開発した**データ非依存（data-oblivious）の量子化アルゴリズム**。LLMの推論時に生成される**Key-Value（KV）キャッシュ**を圧縮する技術。

> **重要**: TurboQuantはモデルの重み（weights）ではなく、KVキャッシュのみを圧縮する。モデル量子化（Q4, Q8等）とは異なる技術。

### 主要な性能指標

| 指標 | 改善 | 詳細 |
|------|------|------|
| **KVキャッシュメモリ** | **6倍削減** | FP16比 |
| **ストレージ精度** | **3ビットで精度損失なし** | 長文コンテキストベンチマークで |
| **アテンションスコアリング速度** | **最大8倍高速** | H100 GPU上の4ビット量子化時 |

### 技術的仕組み：2段階圧縮

TurboQuantは2段階の圧縮プロセスを使用する：

1. **PolarQuant（第1段階）**: 入力ベクトルにランダム回転を適用し、座標ペアを極座標形式（長さと角度）に変換。メタデータオーバーヘッドを削減し、他手法で問題となる隠れたオーバーヘッドを排除
2. **Quantized Johnson-Lindenstrauss / QJL（第2段階）**: 残差誤差に1ビット量子化（符号のみ保存）を適用。これによりアテンションスコアの精度を維持し、積極的な量子化で発生するドリフトを防止

> **アナロジー**: PolarQuantが絵の大まかな構図を保存し、QJLがほぼ無コストで細部の補正筆を加えるイメージ。

### 主要な利点

- **事前処理不要**: Product Quantization（PQ）と異なり、データセット固有のk-meansトレーニングが不要。インデクシング時間はほぼゼロ（1536次元で0.0013秒 vs PQの239秒）
- **理論的最適性に近い**: シャノンの下限から約2.7倍の定数因子以内の歪み率を達成
- **内積の不偏推定**: MSE最適量子化 + 1ビットQJL変換の2段階アプローチにより、トランスフォーマーのアテンション機構で重要な内積推定の不偏性を保証
- **Post-Training Quantization**: モデルの再学習や微調整が不要。既存デプロイ済みモデルにそのまま適用可能
- **GPU互換**: ベクトル化演算を活用し、現代のアクセラレータと高い互換性

### 理論的歪み性能

| ビット幅 (b) | TurboQuant MSE歪み | 情報理論的下限 |
|---|---|---|
| 1 | 0.36 | 0.25 |
| 2 | 0.117 | 0.0625 |
| 3 | 0.03 | 0.0156 |
| 4 | 0.009 | 0.0039 |

### LLMベンチマーク結果

- Llama-3.1-8B-Instruct、Ministral-7B-Instructで検証
- **4倍圧縮時**: Needle-In-A-Haystack ベンチマークで**100%検索精度を維持**
- **104Kトークンまで**: 4倍圧縮下でフル精度と同等性能

---

## コミュニティの反応と議論

### Atomic Chatについて

- GUIは **Jan.ai のフォーク**（MITライセンス）であることが指摘された
- 著者（gladkos）は隠していないと回答：「GUIはJanからフォーク、llama.cppにGoogleアルゴリズムをパッチし、GUIと連携するよう改修」
- 主な変更点はllama.cppバックエンドの「turboquant」フォーク統合

### 圧縮対象の明確化

- **コンテキスト（KVキャッシュ）のみの圧縮**であり、モデル重みの圧縮ではない
- 既存のKVキャッシュ量子化（`-ctk` / `-ctv` オプションでq8_0, q5_0, q4_0等）は以前から存在
- TurboQuantの革新は**3ビットまで削減しつつ精度を維持**できる点（q4は精度劣化が大きい）

### メモリ使用量

- 著者によると約**1GBのメモリ**で動作（コアの性能がより重要）

### llama.cppへの統合状況

- 公式にはまだ統合されていない
- コミュニティ実装が [llama.cppのディスカッション](https://github.com/ggml-org/llama.cpp/discussions/20969) で進行中
- [TheTom/llama-cpp-turboquant](https://github.com/TheTom/llama-cpp-turboquant) フォークが利用可能

### 品質に関する懸念

- [tonbistudio/turboquant-pytorch](https://github.com/tonbistudio/turboquant-pytorch/issues/6) での比較テストでは、通常の量子化と比べて「少し小さいがやや品質劣化」との報告
- 一部コメントでは「劣化はまだかなり大きい」との評価も

---

## 制限事項

- **速度**: MacBook Air上ではまだやや遅い（新しいチップで改善傾向）
- **公式統合未完**: llama.cppやLM Studioなどの主要ツールへの公式統合はまだ
- **品質トレードオフ**: 独立ベンチマークでは通常の量子化と比べて品質劣化の報告あり
- **GUIの独自性**: Atomic ChatはJan.aiのフォークであり、独自のGUI改善は限定的

---

## 関連リソース

- **論文**: [TurboQuant: Online Vector Quantization with Near-optimal Distortion Rate](https://arxiv.org/pdf/2504.19874)（ICLR 2026採択）
- **Google Research Blog**: [TurboQuant: Redefining AI Efficiency with Extreme Compression](https://research.google/blog/turboquant-redefining-ai-efficiency-with-extreme-compression/)
- **llama.cpp Discussion**: [#20969](https://github.com/ggml-org/llama.cpp/discussions/20969)
- **PyTorch実装**: [tonbistudio/turboquant-pytorch](https://github.com/tonbistudio/turboquant-pytorch)
- **llama.cppフォーク**: [TheTom/llama-cpp-turboquant](https://github.com/TheTom/llama-cpp-turboquant)
- **Atomic Chat**: [atomic.chat](http://atomic.chat/)（MacOS向けオープンソースアプリ）