---
title: "rednote-hilab/dots.ocr: Multilingual Document Layout Parsing in a Single Vision-Language Model"
source: "https://github.com/rednote-hilab/dots.ocr?tab=readme-ov-file"
author:
  - "rednote-hilab"
published: 2025-07-30
created: 2025-08-19
description: |
  dots.ocrは、単一のVision-Languageモデル内でレイアウト検出とコンテンツ認識を統一し、良好な読み取り順序を維持する、強力な多言語対応ドキュメントパーサーです。
tags:
  - "OCR"
  - "Vision-Language Model"
  - "Document Parsing"
  - "Multilingual"
  - "Layout Detection"
---

# dots.ocr: 単一Vision-Languageモデルによる多言語ドキュメントレイアウト解析

[![Blog](https://camo.githubusercontent.com/8dabdeb0fff2820dfd171e6476361ab663edceae7e371e1f89680d6ad78b7c39/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f426c6f672d566965775f6f6e5f4769744875622d3333332e7376673f6c6f676f3d676974687562)](https://github.com/rednote-hilab/dots.ocr/blob/master/assets/blog.md)
[![HuggingFace](https://camo.githubusercontent.com/a890e73230d010f6736619c4b053312e153bf96874f120009a7d271bb2492169/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f48756767696e6746616365253230576569676874732d626c61636b2e7376673f6c6f676f3d48756767696e6746616365)](https://huggingface.co/rednote-hilab/dots.ocr)

[**🖥️ ライブデモ**](https://dotsocr.xiaohongshu.com) |
[**💬 WeChat**](https://raw.githubusercontent.com/rednote-hilab/dots.ocr/master/assets/wechat.png) |
[**📕 rednote**](https://www.xiaohongshu.com/user/profile/683ffe42000000001d021a4c) |
[**🐦 X**](https://x.com/rednotehilab)

## 概要

**dots.ocr** は、単一のVision-Languageモデル内でレイアウト検出とコンテンツ認識を統一し、良好な読み取り順序を維持する、強力な多言語対応ドキュメントパーサーです。1.7BパラメータというコンパクトなLLM基盤にもかかわらず、最先端（SOTA）の性能を達成しています。

1. **高性能**: テキスト、テーブル、読み取り順序において[OmniDocBench](https://github.com/opendatalab/OmniDocBench)でSOTAを達成し、数式認識ではDoubao-1.5やgemini2.5-proのような大規模モデルに匹敵する結果を出しています。
2. **多言語対応**: 低リソース言語に対しても強力な解析能力を示し、社内の多言語ドキュメントベンチマークにおいてレイアウト検出とコンテンツ認識の両方で決定的な優位性を達成しています。
3. **統一されたシンプルなアーキテクチャ**: 単一のVision-Languageモデルを活用することで、複雑な複数モデルのパイプラインに依存する従来の方法よりも大幅に合理化されたアーキテクチャを提供します。タスクの切り替えは入力プロンプトを変更するだけで完了します。
4. **効率的で高速なパフォーマンス**: コンパクトな1.7B LLM上に構築されているため、より大きな基盤を持つ他の多くの高性能モデルよりも高速な推論速度を提供します。

### パフォーマンス比較

[![](https://raw.githubusercontent.com/rednote-hilab/dots.ocr/master/assets/chart.png)](https://raw.githubusercontent.com/rednote-hilab/dots.ocr/master/assets/chart.png)

> **注記:**
>
> * EN, ZHのメトリクスは[OmniDocBench](https://github.com/opendatalab/OmniDocBench)のエンドツーエンド評価結果であり、Multilingualメトリクスはdots.ocr-benchのエンドツーエンド評価結果です。

## ニュース

* `2025.07.30` 🚀 1.7B LLMをベースにした多言語ドキュメント解析モデル[dots.ocr](https://github.com/rednote-hilab/dots.ocr)をリリース。SOTA性能を達成。

## ベンチマーク結果

### 1. OmniDocBench

様々なタスクのエンドツーエンド評価結果で、**dots.ocr**は特にText、Table、Read Orderの項目で他のモデルを上回り、総合的に最高のパフォーマンス（`OverallEdit↓`が最小値）を示しています。

### 2. dots.ocr-bench

100言語、1493枚のPDF画像を含む社内ベンチマークでも、**dots.ocr**は競合モデル（MonkeyOCR-3B, Doubao, Gemini2.5-Proなど）に対して、総合、テキスト、数式、テーブル、読み取り順序のすべての項目で最高性能を達成しています。

### 3. olmOCR-bench

**dots.ocr**は、テーブル(`Tables`)、複数段組(`Multi column`)、基本(`Base`)の項目で最高スコアを記録し、総合スコア(`Overall`)でもトップの性能を示しています。

## クイックスタート

### 1. インストール

Conda環境をセットアップし、リポジトリをクローンした後、PyTorchとその他の依存関係をインストールします。Dockerイメージも利用可能です。

```bash
# Conda環境作成
conda create -n dots_ocr python=3.12
conda activate dots_ocr

# リポジトリのクローンとインストール
git clone https://github.com/rednote-hilab/dots.ocr.git
cd dots.ocr

# PyTorchのインストール (CUDAバージョンに合わせて)
pip install torch==2.7.0 torchvision==0.22.0 torchaudio==2.7.0 --index-url https://download.pytorch.org/whl/cu128
pip install -e .
```

### 2. モデルの重みダウンロード

スクリプトを実行してモデルの重みをダウンロードします。

```bash
python3 tools/download_model.py
```

### 3. デプロイと推論

**vLLM** (推奨) または **Huggingface Transformers** を使用してデプロイできます。vLLMを使用すると高速な推論が可能です。

**vLLMでの実行例:**

```bash
# vLLMサーバーの起動
export hf_model_path=./weights/DotsOCR
CUDA_VISIBLE_DEVICES=0 vllm serve ${hf_model_path} ...

# APIデモの実行
python3 ./demo/demo_vllm.py --prompt_mode prompt_layout_all_en
```

### 4. ドキュメント解析

画像やPDFファイルをコマンドラインから直接解析できます。

```bash
# 画像ファイルのレイアウト情報全体を解析
python3 dots_ocr/parser.py demo/demo_image1.jpg

# PDFファイルの解析 (マルチスレッド)
python3 dots_ocr/parser.py demo/demo_pdf1.pdf --num_thread 64

# テキストのみを抽出
python3 dots_ocr/parser.py demo/demo_image1.jpg --prompt prompt_ocr
```

## デモ

Gradioを使用したライブデモが利用可能です。

```bash
python demo/demo_gradio.py
```

### 実行例

#### 数式

[![formula1.png](https://raw.githubusercontent.com/rednote-hilab/dots.ocr/master/assets/showcase/formula1.png)](https://raw.githubusercontent.com/rednote-hilab/dots.ocr/master/assets/showcase/formula1.png)

#### テーブル

[![table1.png](https://raw.githubusercontent.com/rednote-hilab/dots.ocr/master/assets/showcase/table1.png)](https://raw.githubusercontent.com/rednote-hilab/dots.ocr/master/assets/showcase/table1.png)

#### 多言語

[![Tibetan.png](https://raw.githubusercontent.com/rednote-hilab/dots.ocr/master/assets/showcase/Tibetan.png)](https://raw.githubusercontent.com/rednote-hilab/dots.ocr/master/assets/showcase/Tibetan.png)

#### 読み取り順序

[![reading_order.png](https://raw.githubusercontent.com/rednote-hilab/dots.ocr/master/assets/showcase/reading_order.png)](https://raw.githubusercontent.com/rednote-hilab/dots.ocr/master/assets/showcase/reading_order.png)

## 謝辞

[Qwen2.5-VL](https://github.com/QwenLM/Qwen2.5-VL), [MonkeyOCR](https://github.com/Yuliang-Liu/MonkeyOCR), [OmniDocBench](https://github.com/opendatalab/OmniDocBench)など、多くのオープンソースプロジェクトやデータセットに感謝の意が示されています。

## 制限事項と今後の展望

* **制限事項**:
  * 複雑性の高いテーブルや数式の抽出はまだ完璧ではありません。
  * ドキュメント内の画像は現在解析されません。
  * 文字とピクセルの比率が高すぎる場合や、特殊文字が連続する場合に解析が失敗することがあります。
  * 大量のPDFを高速処理するにはまだ最適化されていません。
* **今後の展望**:
  * より正確なテーブル・数式解析と、より汎用的なOCR能力の向上を目指します。
  * 一般的な物体検出、画像キャプション、OCRタスクを統合した、より汎用的な知覚モデルの開発を検討しています。
  * ドキュメント内の画像コンテンツの解析も将来の重要な優先事項です。
