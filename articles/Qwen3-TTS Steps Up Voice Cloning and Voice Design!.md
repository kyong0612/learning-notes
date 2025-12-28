---
title: "Qwen3-TTS Steps Up: Voice Cloning and Voice Design!"
source: "https://qwen.ai/blog?id=qwen3-tts-vc-voicedesign"
author:
  - "Qwen Team"
published: 2025-12-23
created: 2025-12-28
description: "Qwen3-TTSファミリーが2つの新しいモデルをリリース：自然言語による音声デザインが可能なQwen3-TTS-VD-Flashと、3秒の音声でクローニング可能な多言語対応のQwen3-TTS-VC-Flash。両モデルは高い表現力と堅牢なテキスト処理能力を備え、InstructTTS-EvalやMiniMax TTS Multilingual Test Setで優れた性能を示す。"
tags:
  - "TTS"
  - "Voice Cloning"
  - "Voice Design"
  - "AI"
  - "Speech Synthesis"
  - "Qwen"
---

## 概要

Qwen3-TTSファミリーが2つの新しいモデルをリリースしました：

- **Qwen3-TTS-VD-Flash（音声デザインモデル）**: Qwen API経由でアクセス可能
- **Qwen3-TTS-VC-Flash（音声クローニングモデル）**: Qwen API経由でアクセス可能

## 主要機能

### 1. 音声デザイン（Voice Design）

Qwen3-TTS-VD-Flashは複雑な自然言語指示をサポートし、音色、韻律、感情、ペルソナなどを細かく制御できます。「何を言うか」から「どのように言うか」まで完全に制御可能で、ユーザーは既存の音声をクローンするか、限られたプリセット音声から選択する必要がなくなりました。

**ベンチマーク結果**:

- InstructTTS-Evalベンチマークで、GPT-4o-mini-ttsとMimo-audio-7b-instructを全体的に大幅に上回る
- ロールプレイテストでGemini-2.5-pro-preview-ttsを上回る

**制御タイプ**:

- **音響属性**: ポジティブ/ネガティブな感情表現、音色、語速、音調などの制御
- **ペルソナ/ロールプレイ**: 簡潔な指示から詳細な背景情報まで、様々なキャラクター設定に対応
- **背景情報**: 文学作品や歴史的背景などの詳細な文脈情報を活用した音声生成
- **音声の再利用**: 作成した音声を永続的に保存し、複数ターン・複数ロールの長編対話を生成可能

### 2. 音声クローニング（Voice Cloning）

Qwen3-TTS-VC-Flashは3秒の音声でクローニングが可能で、クローンした音声に基づいて10の主要言語で音声を生成できます：

- 中国語、英語、ドイツ語、イタリア語、ポルトガル語、スペイン語、日本語、韓国語、フランス語、ロシア語

**ベンチマーク結果**:

- MiniMax TTS Multilingual Test Setで、中国語、英語、フランス語、イタリア語などの言語において、MiniMax、ElevenLabs、GPT-4o-Audio-Previewよりも安定した内容を生成
- 平均単語誤り率（WER）で最高の性能を達成

**クローニングタイプ**:

- **中国語-英語クローニング**: 中国語の音声から英語の音声を生成
- **多言語クローニング**: 1つの音声から複数言語の音声を生成
- **複雑なテキストへの堅牢性**: ピンイン、特殊記号、数式、メールアドレスなど、様々な複雑なテキスト形式に対応
- **実環境音声への堅牢性**: ノイズや背景音が含まれる実環境の音声にも対応
- **クロス種クローニング**: 動物の鳴き声から人間の音声を生成する実験的な機能

### 3. 高い表現力

Qwen3-TTS-VD-FlashとQwen3-TTS-VC-Flashは、人間らしい高い表現力を持つ音声を提供します。入力テキストに密接に沿った音声を安定して生成し、意味内容に応じて自動的にトーンとリズムを調整し、自然で生き生きとした表現を実現します。

### 4. 堅牢なテキスト処理

両モデルは強力なテキスト解析能力を持ち、複雑なテキスト構造を自動的に処理し、重要な情報を正確に抽出します。多様で非標準的なテキスト形式を扱う際にも高い堅牢性を示します。

## 使用方法

### Qwen3-TTS-VD-Flash

Qwen API経由で簡単に使用できます。音声プロンプト、プレビューテキスト、希望する音声名を指定して音声を作成できます。

**主要なAPIパラメータ**:

- `model`: "qwen-voice-design"
- `action`: "create"
- `target_model`: "qwen3-tts-vd-realtime-2025-12-16"
- `voice_prompt`: 自然言語による音声の説明
- `preview_text`: プレビュー用のテキスト
- `preferred_name`: 音声の名前
- `language`: 言語コード（"en"など）

### Qwen3-TTS-VC-Flash

音声クローニングと音声合成の両方で同じモデルを使用する必要があります。

**主なステップ**:

1. 音声ファイル（3秒以上）を用意
2. `qwen-voice-enrollment`モデルを使用して音声をクローニング
3. 作成された音声パラメータを使用してリアルタイムTTSで音声合成

**DashScope SDK要件**:

- DashScope SDKバージョン: 1.23.9以降
- Pythonバージョン: 3.10以降

## デモ

以下のデモが利用可能です：

- **Qwen3-TTS-VD-Flash**:

  - [Hugging Face DEMO](https://huggingface.co/spaces/Qwen/Qwen3-TTS-Voice-Design)
  - [ModelScope DEMO](https://modelscope.cn/studios/Qwen/Qwen3-TTS-Voice-Design)

- **Qwen3-TTS-VC-Flash**:

  - [Hugging Face DEMO](https://huggingface.co/spaces/Qwen/Qwen-TTS-Clone-Demo)
  - [ModelScope DEMO](https://modelscope.cn/studios/Qwen/Qwen-TTS-Clone-Demo)

## 引用

研究でこのモデルを使用する場合は、以下のように引用してください：

```bibtex
@misc{qwen3_tts_202512,
  author = {Qwen Team, Alibaba},
  title = {Qwen3-TTS Steps Up: Voice Cloning and Voice Design!},
  year = {2025},
  url = {https://qwen.ai/blog?id=qwen3-tts-vc-voicedesign},
  urldate = {2025-12-23}
}
```

## まとめ

Qwen3-TTSファミリーの新モデルは、自然言語による音声デザインと高速な音声クローニングを実現し、多言語対応と高い表現力、堅牢なテキスト処理能力を備えています。ベンチマークテストで優れた性能を示し、実用的な音声合成アプリケーションに適しています。
