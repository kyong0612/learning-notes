---
title: "mlx-community/DeepSeek-OCR-4bit · Hugging Face"
source: "https://huggingface.co/mlx-community/DeepSeek-OCR-4bit"
author:
  - "Wei, Haoran"
  - "Sun, Yaofeng"
  - "Li, Yukun"
  - "DeepSeek AI"
published: 2025-10-23
created: 2025-10-28
description: "DeepSeek-OCRの4ビット量子化MLX版。視覚的なテキスト圧縮の境界を探る、コンテキスト光学圧縮モデル。0.8BパラメータでApple Silicon上で高速に動作し、画像からのOCR、文書のMarkdown変換などが可能。"
tags:
  - "OCR"
  - "vision-language"
  - "MLX"
  - "DeepSeek"
  - "Apple-Silicon"
  - "4-bit-quantization"
  - "image-text-to-text"
  - "document-processing"
---

## 概要

**DeepSeek-OCR-4bit**は、DeepSeek AIが開発したDeepSeek-OCRモデルをApple Silicon（M1/M2/M3チップ等）向けに最適化した4ビット量子化版です。MLX（Machine Learning for Apple Silicon）フレームワークを使用し、Apple製デバイス上で効率的に動作します。

元のDeepSeek-OCRは3Bパラメータですが、この4ビット量子化版は0.8Bパラメータに圧縮されており、メモリ使用量とパフォーマンスのバランスが優れています。

## 主な特徴

### モデルの特性

- **モデルサイズ**: 0.8Bパラメータ（4ビット量子化）
- **元モデル**: deepseek-ai/DeepSeek-OCR（3Bパラメータ）
- **フレームワーク**: MLX（Apple Silicon最適化）
- **精度**: BF16、U32テンソル型
- **ライセンス**: MIT
- **多言語対応**: 複数言語のOCRに対応

### 技術的特徴

- **コンテキスト光学圧縮**: 視覚的なテキスト圧縮の境界を探る技術
- **カスタムコード**: 柔軟な推論が可能
- **会話型インターフェース**: チャット形式でのインタラクションをサポート
- **Safetensorsフォーマット**: 安全で高速なモデル読み込み

## 使用方法

### インストール

```bash
pip install -U mlx-vlm
```

### 基本的な推論

```bash
python -m mlx_vlm.generate \
  --model mlx-community/DeepSeek-OCR-4bit \
  --max-tokens 100 \
  --temperature 0.0 \
  --prompt "Describe this image." \
  --image <path_to_image>
```

### ユースケース

1. **フリーOCR**: 画像内のテキストを抽出

   ```python
   prompt = "<image>\nFree OCR."
   ```

2. **文書のMarkdown変換**: 文書画像をMarkdown形式に変換

   ```python
   prompt = "<image>\n<|grounding|>Convert the document to markdown."
   ```

## 元モデル（DeepSeek-OCR）について

### モデル構成

DeepSeek-OCRは複数のサイズ設定で動作可能：

- **Tiny**: base_size=512, image_size=512
- **Small**: base_size=640, image_size=640
- **Base**: base_size=1024, image_size=1024
- **Large**: base_size=1280, image_size=1280
- **Gundam**: base_size=1024, image_size=640, crop_mode=True（推奨設定）

### 論文・研究

- **論文タイトル**: "DeepSeek-OCR: Contexts Optical Compression"
- **著者**: Wei, Haoran; Sun, Yaofeng; Li, Yukun
- **ArXiv**: [2510.18234](https://arxiv.org/abs/2510.18234)
- **GitHub**: [deepseek-ai/DeepSeek-OCR](https://github.com/deepseek-ai/DeepSeek-OCR)

### 謝辞

DeepSeek-OCRは以下のプロジェクトの貢献を受けています：

- [Vary](https://github.com/Ucas-HaoranWei/Vary/)
- [GOT-OCR2.0](https://github.com/Ucas-HaoranWei/GOT-OCR2.0/)
- [MinerU](https://github.com/opendatalab/MinerU)
- [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR)
- [OneChart](https://github.com/LingyvKong/OneChart)
- [Slow Perception](https://github.com/Ucas-HaoranWei/Slow-Perception)

ベンチマーク: [Fox](https://github.com/ucaslcl/Fox), [OminiDocBench](https://github.com/opendatalab/OmniDocBench)

## パフォーマンス

- **月間ダウンロード数**: 862回（MLX-4bit版）
- **元モデルダウンロード数**: 1,017,146回（2025年10月時点）
- **Hugging Face人気度**: 2.08k likes（元モデル）

## vLLMサポート

2025年10月23日より、DeepSeek-OCRは公式にvLLMでサポートされており、モデル推論の高速化が可能です。

```python
from vllm import LLM, SamplingParams
from vllm.model_executor.models.deepseek_ocr import NGramPerReqLogitsProcessor

llm = LLM(
    model="deepseek-ai/DeepSeek-OCR",
    enable_prefix_caching=False,
    mm_processor_cache_gb=0,
    logits_processors=[NGramPerReqLogitsProcessor]
)
```

## エコシステム

- **派生モデル**: 6つのアダプター、8つのファインチューンモデル、1つのマージモデル、2つの量子化版
- **Hugging Face Spaces**: 38のデモアプリケーションで使用中

## まとめ

DeepSeek-OCR-4bitは、Apple Silicon環境で高速かつ効率的にOCRタスクを実行できる実用的なモデルです。4ビット量子化により、メモリ消費を抑えながらも高い精度を維持し、文書処理、画像からのテキスト抽出、Markdown変換など幅広い用途に対応します。

オープンソース（MITライセンス）であり、活発なコミュニティサポートと豊富なドキュメントにより、研究・商用利用の両面で価値の高いツールとなっています。
