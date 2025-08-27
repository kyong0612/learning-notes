---
title: "Y-Research-SBU/PosterGen: Official Code for PosterGen"
source: "https://github.com/Y-Research-SBU/PosterGen"
author:
  - "Zhilin Zhang"
  - "Xiang Zhang"
  - "Jaqi Wei"
  - "Yiwei Xu"
  - "Chenyu You"
published: 2025-08-26
created: 2025-08-27
description: |
  In this work, we propose a multi-agent LLMs framework that is guided by design principles. Our multi-agent LLMs adopt a workflow of specialist agents that mirrors a professional design process: Parser Agent, Curator Agent, Layout Agent, and Styling Agents. This methodology is designed to generate a well-designed poster that minimizes the need for manual fine-tuning.
tags:
  - "agent"
  - "large-language-model"
  - "vision-language-models"
  - "poster-generation"
  - "multi-agent"
---

# PosterGen: 美的感覚を考慮した論文からポスターへの生成 (Multi-Agent LLMs活用)

[![Paper](https://camo.githubusercontent.com/7b01dd97e0a0fb2cb63c638a940d335084806f49aa8f6dd7d2d71b979e04a34f/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f41725869762d323530382e31373138382d7265643f7374796c653d666c61742d737175617265266c6f676f3d6172786976)](https://arxiv.org/abs/2508.17188)
[![Project Website](https://camo.githubusercontent.com/9ceee19f0a10a52a7faedb973dd059244d900b4aafa08a6b076ac2b59cf9d64c/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f50726f6a6563742d576562736974652d626c75653f7374796c653d666c61742d737175617265266c6f676f3d676f6f676c656368726f6d65)](https://Y-Research-SBU.github.io/PosterGen)
[![Hugging Face Demo](https://camo.githubusercontent.com/45898c71925278cc7b9dbaf92f06520751db10e1efcf4bbd281c64983ac33030/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f48756767696e67253230466163652d44656d6f2d79656c6c6f773f7374796c653d666c61742d737175617265266c6f676f3d68756767696e6766616365)](https://huggingface.co/spaces/Y-Research-Group/PosterGen)

## 概要

`PosterGen` は、デザイン原則に導かれたマルチエージェント大規模言語モデル（LLM）フレームワークです。研究論文から美的感覚に優れた学術ポスターを自動生成することを目的としています。専門的なデザインプロセスを模倣した各専門エージェントが連携することで、手動での微調整を最小限に抑えた高品質なポスターを生成します。

![Methodology](https://github.com/Y-Research-SBU/PosterGen/raw/main/resource/method.png)

## マルチエージェント・パイプライン

システムは6つの専門AIエージェントで構成されています。

1. **Parser Agent**: 論文のPDFから全てのコンテンツを抽出し、構造化します。
2. **Curator Agent**: 物語に基づいたストーリーボードを設計し、コンテンツの構成と視覚要素の配置を計画します。
3. **Layout Agent**: ストーリーボードを空間的にバランスの取れた3列レイアウトに変換し、要素の正確な配置と間隔を計算します。
    * **Balancer Sub-Agent**: カラムの使用率を最適化し、コンテンツのオーバーフローを防ぎます。
4. **Color Agent**: 所属機関のロゴから調和のとれたカラースキームを生成します。
5. **Font Agent**: 階層的なタイポグラフィシステムを適用し、キーワードを強調表示します。
6. **Renderer**: 最終的なPowerPointファイルと画像ファイルを生成します。

## 主な特徴

* **プロフェッショナルなレイアウト**: CSSのような正確な配置と適切な間隔調整。
* **インテリジェントなバランシング**: カラムの自動最適化によるオーバーフロー防止。
* **カラーハーモニー**: 所属機関のブランディングに基づいたカラースキームの自動生成。
* **優れたタイポグラフィ**: プロフェッショナルなフォント選択とキーワードのハイライト。
* **柔軟な出力**: PNG画像と編集可能なPowerPointファイルの両方を提供。
* **学術標準準拠**: 学会ポスターデザインのベストプラクティスに準拠。

## 使い方

### システム要件

* **OS**: Windows, Linux, macOS
* **Python**: 3.11

### 1. 環境設定

Anacondaで仮想環境を作成し、必要なライブラリをインストールします。

```bash
conda create -n poster python=3.11 -y
conda activate poster
pip install -r requirements.txt

git clone -b main https://github.com/Y-Research-SBU/PosterGen.git
cd PosterGen
```

### 2. LibreOfficeのインストール

OSに応じてLibreOfficeをインストールし、PATHを通します。

### 3. APIキーの設定

プロジェクトルートに `.env` ファイルを作成し、OpenAIやAnthropicなどのAPIキーを設定します。

### 4. データ構造

`data/` フォルダ以下に、論文のPDF (`paper.pdf`)、所属ロゴ (`aff.png`)、学会ロゴ (`logo.png`) を配置します。

### 実行

#### コマンドライン

```bash
python -m src.workflow.pipeline \
  --poster_width 54 --poster_height 36 \
  --paper_path ./data/Your_Paper_Name/paper.pdf \
  --text_model gpt-4.1-2025-04-14 \
  --vision_model gpt-4.1-2025-04-14 \
  --logo ./data/Your_Paper_Name/logo.png \
  --aff_logo ./data/Your_Paper_Name/aff.png
```

#### Webインターフェース

React+TypeScriptで開発されたGUIも利用可能です。バックエンドとフロントエンドを起動することで、ブラウザから直感的に操作できます。

## 出力構造

生成されたポスターは `output/<paper_name>/` ディレクトリに保存されます。最終的なポスター画像（`.png`）、編集可能なPowerPointファイル（`.pptx`）に加えて、テキストや画像、レイアウト情報などの中間生成物も保存されます。

## カスタマイズ

`config/poster_config.yaml` を編集することで、レイアウト（マージン、パディング）、タイポグラフィ（フォント、サイズ）、色生成アルゴリズムなどをカスタマイズできます。

## 実行例

以下は `PosterGen` によって生成されたポスターの例です。

![Example 1](https://github.com/Y-Research-SBU/PosterGen/raw/main/resource/neural-encoding.png)
![Example 2](https://github.com/Y-Research-SBU/PosterGen/raw/main/resource/active-geo.png)

## 引用

```
@article{zhang2025postergen,
    title={PosterGen: Aesthetic-Aware Paper-to-Poster Generation via Multi-Agent LLMs},
    author={Zhilin Zhang and Xiang Zhang and Jiaqi Wei and Yiwei Xu and Chenyu You},
    journal={arXiv:2508.17188},
    year={2025}
}
```
