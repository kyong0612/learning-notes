---
title: "Distillation of Discrete Diffusion through Dimensional Correlations"
source: "https://arxiv.org/abs/2410.08709"
author:
  - "Satoshi Hayakawa"
  - "Yuhta Takida"
  - "Masaaki Imaizumi"
  - "Hiromi Wakaki"
  - "Yuki Mitsufuji"
published: 2024-10-11
created: 2025-05-24
description: |
  ディスクリート拡散モデルの反復的性質による遅いサンプリング速度の問題を解決するために、次元間の相関関係を学習してモデルを蒸留する新しい手法「Di4C」を提案。mixture modelと新しい損失関数により、従来の多ステップモデルを少ないステップに圧縮することを実現し、ICML 2025に受理された研究。
tags:
  - "discrete-diffusion"
  - "model-distillation"
  - "dimensional-correlations"
  - "generative-modeling"
  - "machine-learning"
---

# Distillation of Discrete Diffusion through Dimensional Correlations

**著者**: Satoshi Hayakawa, Yuhta Takida, Masaaki Imaizumi, Hiromi Wakaki, Yuki Mitsufuji  
**所属**: Sony Group Corporation, Sony AI, The University of Tokyo  
**発表**: ICML 2025 (39 pages)  
**コード**: <https://github.com/sony/di4c>  

## 概要

ディスクリート拡散モデルは様々な生成モデリング分野で優れた性能を示しているが、反復的性質により遅いサンプリング速度に悩まされている。連続領域では高速化が進んでいる一方、ディスクリート拡散モデルは独自の課題を抱えている。特に、高次元の結合分布処理の計算コストにより、要素間の依存関係（画像のピクセル関係、言語の逐次依存性）を捉えることが困難である。

本論文では、この問題を解決するために **Di4C (Distilling Discrete Diffusion through Dimensional Correlations)** を提案する。

## 主要な貢献

### 1. 理論的解析

- **定理1**: N-step product modelがデータ分布をO(1/N)の全変動誤差で近似可能であることを証明
- 同時に、2次元の簡単な例でこの境界が改善不可能であることも証明
- 多ステップでの有効性と少ステップでの次元相関の重要性を理論的に裏付け

### 2. モデルと損失設計

- **Mixture Model**: 次元相関を表現可能で計算的にスケーラブルな"mixture"モデルを提案
- **Di4C損失関数**: 教師モデルの多ステップ反復プロセスを圧縮する新しい損失関数
- **定理2**: Di4C損失関数がN-step教師とone-step学生間の出力分布距離を上界付けできることを証明

### 3. 実験結果

多様な設定での有効性を実証：

1. **CIFAR-10**: 離散化ガウス拡散でサンプル品質指標を大幅改善
2. **ImageNet**: マスク拡散で品質維持しつつ2倍高速化を達成  
3. **OpenWebText**: 言語モデリングで既に蒸留されたモデルをさらに蒸留

## 技術的詳細

### 問題設定

従来のディスクリート拡散モデルは、スケーラビリティのために"product"モデルを使用：

```
ps|t(xs|xt) = ∏(d=1 to D) p^d_{s|t}(x^d_s|xt)
```

この次元独立性により、高次元結合分布における次元相関が無視され、少ステップでの近似誤差が生じる。

### Mixture Model

次元相関を捉えるために、以下のmixture modelを提案：

```
p^θ_{s|t}(xs|xt) = E_λ[p^θ_{s|t}(xs|xt; λ)]
```

ここで、`p^θ_{s|t}(xs|xt; λ) = ∏(d=1 to D) p^{θ,d}_{s|t}(x^d_s|xt; λ)`

### Di4C損失関数

1. **蒸留損失 (Distillation Loss)**:

```
L_distil(θ; ψ, r_δ, δ) = E_{x_δ~r_δ}[D_KL(p^ψ_{0|δ}(·|x_δ) || p^θ_{0|δ}(·|x_δ))]
```

2. **一貫性損失 (Consistency Loss)**:

```
L_consis(θ; ψ, r_t, s, u, t) = E_{x_t~r_t}[D_KL(p^θ_{s|u} ∘ p^ψ_{u|t}(·|x_t) || p^θ_{s|t}(·|x_t))]
```

## 実験結果

### 1. CIFAR-10 (離散化ガウス拡散)

- **10ステップ**: 教師モデル FID 32.61 → 学生モデル FID 20.64
- **20ステップ**: 教師モデル FID 12.36 → 学生モデル FID 9.77
- ハイブリッドモデル（学生+教師）でさらなる改善を実現

### 2. ImageNet (マスク拡散)

- 4ステップ学生モデルが8ステップ教師モデルと同等の性能
- **2倍の高速化**を達成
- Classifier-free guidanceとの組み合わせでも有効

### 3. OpenWebText (言語モデリング)

- 既に蒸留されたSDTTモデルをさらに蒸留
- **2倍以上の高速化**（64-128ステップ → 32ステップ）
- 生成多様性を維持しながら性能向上

### レイテンシオーバーヘッド

Mixture modelingによる計算オーバーヘッドは最大5%と minimal：

- CIFAR-10: 0.5515s → 0.5786s
- ImageNet: 変化なし（統計誤差範囲内）
- OpenWebText: 3.3409s → 3.4817s

## 技術的洞察

### Compositionの役割

個々のステップが次元独立でも、複数ステップの合成により暗黙的に相関を捉えることが可能。Di4Cはこの合成の次元相関を明示的に学習する。

### Control Variates

モンテカルロ積分の安定化のために次元独立制御変数を使用：

- 計算効率の向上
- 分散削減効果

### 反復的Di4C訓練

教師モデルがproduct modelでなくても、Di4C損失関数が適用可能。複数ラウンドの蒸留によりさらなる改善が可能。

## 制限事項と今後の課題

1. **経験的結果**: 理論上は1ステップへの蒸留が可能だが、実験では2倍程度の高速化
2. **アーキテクチャ最適化**: λに関するアーキテクチャのさらなる最適化が必要
3. **訓練ハイパーパラメータ**: より効果的な訓練手法の探索
4. **他手法との組み合わせ**: 他の次元相関捕獲手法との結合可能性

## 関連研究との比較

### 連続拡散モデルの高速化

- 知識蒸留（Salimans & Ho, 2022など）
- 一貫性型技術（Song et al., 2023など）
- Li et al. (2024)のガウス混合を用いた手法と類似

### ディスクリート拡散の高速化

- MaskGITの信頼度ベースサンプリング
- SDTTの蒸留手法
- 同時期研究（Liu et al., 2024; Xu et al., 2025）との差別化

## 実装詳細

### CIFAR-10実験

- U-Net アーキテクチャベース
- λ ~ Unif([0,1]) でmixture modeling
- 320K ステップのファインチューニング

### ImageNet実験  

- 24層transformer（Besnier & Chen, 2023実装）
- VQGAN codebook（1024要素）
- Classifier-free guidanceと組み合わせ

### OpenWebText実験

- 169Mパラメータtransformer
- GPT-2 tokenizer使用
- 既存SDTTモデルからの追加蒸留

## 社会的影響

生成AI分野における一般的な社会的影響は存在するが、この（主に理論的な）研究によって特に引き起こされる具体的な問題は想定されない。

## 結論

Di4Cは、ディスクリート拡散モデルにおける次元相関の重要性を理論的に明らかにし、実用的な蒸留手法を提供する。Multiple domainでの実験により、高品質を維持しつつサンプリング速度を大幅に改善できることを実証した。今後は、より効果的な1ステップ蒸留の実現と、他の次元相関捕獲手法との統合が課題となる。
