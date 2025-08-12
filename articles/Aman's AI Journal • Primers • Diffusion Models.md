---
title: "Aman's AI Journal • Primers • Diffusion Models"
source: "https://aman.ai/primers/ai/diffusion-models/"
author:
  - Aman Chadha
  - Vinija Jain
published: 2020
created: 2024-10-26
description: |
  拡散モデル（Diffusion Models）は、データの破壊と復元を通じて新しいデータを生成する最先端の生成モデルです。本稿では、その理論的基礎からPyTorchによる実装、そしてStable DiffusionやDALL-E 2のような最新モデルまでを包括的に解説します。
tags:
  - Diffusion Models
  - Generative Models
  - Machine Learning
  - PyTorch
  - Deep Learning
---

# Primers • Diffusion Models

## 背景

拡散モデルは、非平衡熱力学に着想を得た生成モデルであり、データに段階的にノイズを加えて破壊するフォワードプロセスと、その逆のノイズ除去プロセスを学習してデータを復元するリバースプロセスから構成されます。GANやVAE、Flow-basedモデルといった従来の生成モデルが抱える学習の不安定さや表現力の限界といった課題を克服し、高品質なデータ生成を実現します。特に、敵対的学習を必要としない安定した学習プロセスと、スケーラビリティの高さが大きな利点です。

OpenAIのGLIDEやDALL-E 2、Google BrainのImagen、Stability.aiのStable Diffusionなど、近年の最先端モデルで採用されており、画像、音声、動画といった多様なモーダリティで優れた性能を発揮しています。

![Generative Models Overview](https://aman.ai/primers/ai/assets/diffusion-models/diff14.png)

## 概要

拡散モデルは、近年機械学習分野で最も注目されている技術の一つです。GANを上回る画像生成品質を達成し、OpenAIのDALL-E 2などのモデルでその能力が実証されています。本稿では、拡散モデルの理論的基礎を解説し、PyTorchを用いた画像生成の実装方法を紹介します。

![DALL-E 2 example](https://aman.ai/primers/ai/assets/diffusion-models/dalle2.png)

## 導入

拡散モデルは、ガウスノイズを段階的に付加することで訓練データを破壊し、その逆のノイズ除去プロセスを学習することでデータを復元する生成モデルです。学習後、ランダムなノイズを入力としてこの逆プロセスを経ることで、新しいデータを生成します。このモデルは、潜在変数モデルの一種であり、固定されたマルコフ連鎖を用いて潜在空間にマッピングします。

![Diffusion Process Overview](https://aman.ai/primers/ai/assets/diffusion-models/diff3.png)

フォワードプロセスでは、元の画像 \(\mathbf{x}_0\) から始まり、各ステップでノイズが加えられ、最終的に純粋なガウスノイズ \(\mathbf{x}_T\) になります。学習の目標は、この逆のプロセス \(p\_{\theta}(\mathbf{x}_{t-1} \mid \mathbf{x}_{t})\) を学習することです。

![Forward and Reverse Process](https://aman.ai/primers/ai/assets/diffusion-models/diff4.png)

![Reverse Process for Generation](https://aman.ai/primers/ai/assets/diffusion-models/diff5.png)

## 利点

* **高品質な画像生成**: 最先端の画像品質を実現します。
* **敵対的学習が不要**: GANのような不安定な学習プロセスを回避できます。
* **スケーラビリティと並列化**: 効率的な学習が可能です。

![High Quality Image Generation](https://aman.ai/primers/ai/assets/diffusion-models/diff6.png)

## 拡散モデルの種類

### Denoising Diffusion Probabilistic Models (DDPMs)

* Hoら(2020)によって提案された、拡散モデルの基本的な形式。
* **フォワードプロセス**: データに段階的にガウスノイズを加える。
* **リバースプロセス**: ニューラルネットワークがノイズを予測し、除去する。
* **長所**: 理論的基盤が強固で、高品質なサンプルを生成。
* **短所**: サンプリングに多数のステップが必要で計算コストが高い。

### Denoising Diffusion Implicit Models (DDIMs)

* Songら(2020)によって提案された、DDPMの派生モデル。
* 決定論的なサンプリングを可能にし、生成プロセスを高速化。
* **長所**: DDPMより高速なサンプリングが可能。
* **短所**: 速度と品質のバランス調整が必要な場合がある。

### その他のモデル

* **Score-Based Generative Models (SGMs)**: データ分布のスコア関数（対数確率密度の勾配）を利用。
* **Variational Diffusion Models (VDMs)**: 変分推論と拡散プロセスを統合。
* **Stochastic Differential Equation (SDE)-Based Models**: 拡散プロセスを連続時間で定式化。

## 学習

拡散モデルの学習は、訓練データの尤度を最大化することによって行われます。これは、負の対数尤度の変分上界 \(L\_{vLB}\) を最小化することと等価です。

\[L\_{vLB} = L\_0 + L\_1 + \ldots + L\_{T-1} + L\_T\]

この損失項はKLダイバージェンスで表現でき、特にガウス分布を仮定しているため、解析的に計算可能です。実用的には、より単純化された目的関数（ノイズ予測損失）が用いられます。

\[L(\theta) = \mathbb{E}\_{x\_0, \epsilon, t} \left[ \| \epsilon - \epsilon\_{\theta}(x\_t, t) \|^2 \right]\]

この目的関数は、各タイムステップで加えられたノイズ \(\epsilon\) と、モデルが予測したノイズ \(\epsilon\_{\theta}\) の間の平均二乗誤差を最小化することを目指します。

## モデルアーキテクチャ

拡散モデルのネットワークは、入力と出力の次元が同じである限り、どのようなアーキテクチャでも使用できますが、一般的には**U-Net**や**Diffusion Transformer (DiT)**が用いられます。

### U-Net

* エンコーダ・デコーダ構造とスキップコネクションが特徴。
* 空間的な特徴を捉えるのに優れており、画像タスクで高い性能を発揮します。
* DDPMの論文で採用されたアーキテクチャです。

### Diffusion Transformer (DiT)

* U-Netの代わりにTransformerブロックを使用。
* 自己注意機構により、データ内の長距離依存関係を捉えることができます。
* スケーラビリティが高く、大規模なモデルで優れた性能を示します。

![DiT Architecture](https://aman.ai/primers/ai/assets/diffusion-models/DiT.jpg)

## 条件付き拡散モデル

条件付き拡散モデルは、テキストや画像などの補助情報に基づいて生成を制御します。

* **テキスト条件付け**: CLIPやT5などのテキストエンコーダを用いてテキストを埋め込みベクトルに変換し、クロスアテンション機構を介してU-Netに統合します。
* **Classifier-Free Guidance**: 外部の分類器なしで、条件付き生成と無条件生成の両方を学習し、推論時にガイダンスの強さを調整する手法。これにより、生成される画像の品質とプロンプトへの忠実度を両立させます。

## PyTorchによる実装

本稿では、DDPMの論文に基づき、PyTorchでの実装をステップバイステップで解説しています。これには、ヘルパー関数、U-Netアーキテクチャ（ResNetまたはConvNeXTブロック、アテンション機構を含む）、順方向拡散プロセス、データセットの準備、学習ループ、サンプリングプロセスが含まれます。

![PyTorch Implementation Example GIF](https://aman.ai/primers/ai/assets/diffusion-models/diffusion-sweater.gif)

## 主要な実装例

### Stable Diffusion

* CompVis、Stability AI、LAIONによって開発されたテキストから画像を生成する潜在拡散モデル。
* テキスト理解（CLIPText）、画像情報生成（U-Net + スケジューラ）、画像デコード（VAEデコーダ）の3つの主要コンポーネントで構成されます。
* 潜在空間で処理を行うことで、高速かつ高品質な画像生成を実現しています。

![Stable Diffusion Process](https://aman.ai/primers/ai/assets/diffusion-models/15.png)

### DALL-E 2

* OpenAIによって開発された拡散モデル。
* テキスト記述からリアルな画像を生成・編集する能力を持ちます。
* CLIPを用いてテキストと画像の関連性を学習しています。

### Midjourney

* 独自の芸術的なスタイルで高品質な画像を生成する独立した研究ラボ。
* アーキテクチャの詳細は公開されていませんが、拡散モデルを活用していると考えられています。

## FAQ（よくある質問）

* **拡散モデルの仕組み**: データをノイズ化し、それを元に戻す過程を学習することで生成します。GANよりも学習が安定しており、VAEよりも高品質な画像を生成できることが多いです。
* **DDPMとDDIMの違い**: DDPMは確率的なリバースプロセスを持つのに対し、DDIMは決定論的なプロセスを用いるため、より高速なサンプリングが可能です。
* **学習と推論**: 学習時にはフォワード（ノイズ付加）とリバース（ノイズ除去）の両プロセスが使われますが、推論（画像生成）時にはリバースプロセスのみが使われます。
* **損失関数**: 主に平均二乗誤差（MSE）を用いたノイズ予測損失が使われますが、KLダイバージェンスや変分下界（ELBO）も理論的な基盤となっています。
* **Stable Diffusionの「Stable」**: 処理をピクセル空間ではなく低次元の「潜在空間」で行うことにより、学習プロセスが安定していることを指します。

## さらに学ぶために

* [The Illustrated Stable Diffusion](https://jalammar.github.io/illustrated-stable-diffusion/)
* [Understanding Diffusion Models: A Unified Perspective](https://arxiv.org/abs/2208.11970)
* [The Annotated Diffusion Model (Hugging Face)](https://huggingface.co/blog/annotated-diffusion)
* [Lilian Weng: What are Diffusion Models?](https://lilianweng.github.io/posts/2021-07-11-diffusion-models/)
* [Diffusion Explainer](https://poloclub.github.io/diffusion-explainer/)
