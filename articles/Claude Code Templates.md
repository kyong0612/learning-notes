---
title: "AITemplate: High-Performance AI Inference"
source: "https://github.com/facebookincubator/AITemplate"
author:
  - "Meta engineers (The AITemplate Team)"
published: "2023-01-31"
created: "2025-08-04"
description: |
  AITemplate is a Python framework which renders neural network into high performance CUDA/HIP C++ code. Specialized for FP16 TensorCore (NVIDIA GPU) and MatrixCore (AMD GPU) inference.
tags:
  - "clippings"
  - "AITemplate"
  - "AI"
  - "LLM"
  - "PyTorch"
  - "CUDA"
  - "GPU"
  - "inference"
---

# AITemplate: 高性能AI推論フレームワーク

AITemplate (AIT) は、ディープニューラルネットワークモデルを、NVIDIA GPU (CUDA) または AMD GPU (HIP) 上で実行される非常に高速なC++コードに変換するためのPythonフレームワークです。主な目的は、AIモデルの推論（Inference）を可能な限り高速化することです。

## 主な特徴

AITemplateは、他の多くの推論用フレームワークとは一線を画す、いくつかのユニークな特徴を持っています。

### 1. 高いパフォーマンス

ResNet, MaskRCNN, BERT, VisionTransformer, Stable Diffusionなどの主要なモデルにおいて、ハードウェアの理論性能限界に近いパフォーマンスを達成します。これは、NVIDIA GPUのTensorCoreやAMD GPUのMatrixCoreを最大限に活用することで実現されます。

### 2. 依存関係からの解放

cuBLAS, cuDNN, TensorRTのようなサードパーティのライブラリやランタイムに依存しません。コンパイルされたモデルは自己完結型のポータブルなバイナリとなり、同じハードウェアであればどのようなソフトウェア環境でも動作します。

### 3. 高度な演算融合（Fusion）技術

- **水平融合 (Horizontal Fusion)**: 形状が異なる並列な計算（例：複数のGEMMやLayerNorm）を単一のGPUカーネルに融合します。
- **垂直融合 (Vertical Fusion)**: 要素ごとの演算やリダクションなどを、TensorCore/MatrixCoreの演算に融合します。
- **メモリ融合 (Memory Fusion)**: GEMMなどの計算と、それに続くメモリ操作（結合、分割、スライスなど）を単一の演算に融合します。

### 4. PyTorchとの連携

PyTorchのテンソルを直接入力として受け取ることができ、余計なデータコピーなしで動作します。PyTorchがない環境でも、自己完結型のランタイムとして利用可能です。

## FX2AIT: PyTorchモデルの簡単な変換

FX2AITは、PyTorchモデルをAITemplateエンジンに変換するためのツールです。モデルにAITemplateがサポートしていない演算子が含まれている場合でも、部分的にAITによる高速化を実現できます。

## インストールと利用方法

### ハードウェア要件

- **NVIDIA**: SM80以上のGPU (Ampereアーキテクチャ以降)
- **AMD**: CDNA2以上のGPU (MI-210/250など)

### インストール手順

リポジトリをクローンし、Dockerを使用してビルドするか、ソースから直接ビルドします。

```bash
# --recursiveオプション付きでクローン
git clone --recursive https://github.com/facebookincubator/AITemplate

# Dockerでのビルド (推奨)
./docker/build.sh cuda

# ソースからのビルド
cd python
python setup.py bdist_wheel
pip install dist/*.whl --force-reinstall
```

## 今後の計画

- **中期計画**: 動的な形状（特にTransformerのシーケンス長）への対応強化、量子化（fp8/int8/int4）、スパース性（Sparsity）への対応。
- **長期計画**: ONNXやOpen-XLAなど他のモデル形式からの自動変換、CPU拡張。

AITemplateはMetaのエンジニアチームによって活発に開発されており、AIモデルの推論速度を劇的に向上させるための強力なツールです。
