---
title: "Building on the bananas momentum of generative media models on Google Cloud | Google Cloud Blog"
source: "https://cloud.google.com/blog/products/ai-machine-learning/building-momentum-for-gen-media-including-nano-banana-/?hl=en"
author:
  - "Michael Gerstenhaber"
published: 2025-10-03
created: 2025-10-04
description: |
  Vertex AIがGemini 2.5 Flash Image、Veo 3、Imagen 4、Gemini 2.5 Text-to-SpeechのGAや機能強化を発表し、企業が画像・動画・音声の生成ワークフローを高速かつ安全に実現できるようにする取り組みを紹介する。
tags:
  - "generative-media"
  - "vertex-ai"
  - "gemini-2-5"
  - "veo-3"
  - "imagen-4"
---

## 概要

Google CloudはVertex AI上のジェネレーティブメディアモデル群（Gemini 2.5 Flash Image、Veo 3、Imagen 4、Gemini 2.5 Text-to-Speech）に対する主要アップデートとGA化を発表し、画像・動画・音声制作を横断したエンタープライズ向けの創造ワークフロー強化を図っている。記事では各モデルの新機能、利用企業の事例、用途別のモデル選定指針を提示し、品質・速度・制御性の向上を強調している。

![Generative media models on Vertex AI](https://storage.googleapis.com/gweb-cloudblog-publish/images/generative_media_momentum.max-2000x2000.jpg)

## Gemini 2.5 Flash Image GA

![Iterative refinement with Gemini 2.5 Flash Image](https://storage.googleapis.com/gweb-cloudblog-publish/images/GenMedia_Sept_Bundle_Marketing_Assets.max-1000x1000.png)
![Context aware conversational editing with Gemini 2.5 Flash Image](https://storage.googleapis.com/gweb-cloudblog-publish/images/GenMedia_Sept_Bundle_Marketing_Assets_1.max-1000x1000.png)
![Geospatial reasoning with Gemini 2.5 Flash Image](https://storage.googleapis.com/gweb-cloudblog-publish/images/GenMedia_Sept_Bundle_Marketing_Assets_2.max-1000x1000.png)

- **GAと機能強化**: Gemini 2.5 Flash ImageがVertex AIで一般提供(GA)となり、複数アスペクト比での生成やバッチ処理をサポート。エンタープライズ向けのインフラとセキュリティを備えたプロダクション対応をアピール。
- **ワークフロー活用例**: Nano Bananaによる画像編集が話題化。会話型編集や地理空間的推論など、反復的なクリエイティブ作業での操作性が示される。
- **顧客の声**: Artlist.ioは「数日でキャンペーンを立ち上げられる創造性の加速」を評価。Mercado Libreは製品写真の美しさと指示追従性の向上を挙げ、「制約は想像力だけ」と強調。

![Artlist.io testimonial video thumbnail](https://img.youtube.com/vi/pTpl2047lCg/hqdefault.jpg)
![Mercado Libre example animation](https://storage.googleapis.com/gweb-cloudblog-publish/original_images/Mercado_Libre_Gif.gif)

## Veo 3 のアップデート

- **フォーマット拡充**: Veo 3およびVeo 3 Fastが9:16の縦型動画出力に対応し、ソーシャルメディア向けの没入感ある映像生成を容易に。
- **時間制御**: 4/6/8秒の長さから選択でき、シーン間の遷移やインターカットを調整しやすい。
- **顧客の声**: Palo Alto NetworksはGeminiとVeo 3を活用し、スピード・創造性・コストすべてを両立したキャンペーンを実現。Envatoは動画・画像・音声モデルを無制限サブスクリプションに統合し、コミュニティの創造性を後押し。

![Palo Alto Networks testimonial video thumbnail](https://img.youtube.com/vi/ZQBZd3TAepw/hqdefault.jpg)
![Envato testimonial video thumbnail](https://img.youtube.com/vi/U_-eB6cNdFo/hqdefault.jpg)

## Imagen 4 GA

- **一般提供**: Imagen 4がVertex AIでGAとなり、フォトリアリスティックなテキスト画像生成、シャープな描写、タイポグラフィ能力を強調。
- **利用事例**: ShutterstockがImagen 4をAI Image Generatorに統合し、市場投入可能な高品質ビジュアルの迅速な生成を実現。顧客が最先端のクリエイティブAIツールを常に利用できるようになったと述べる。

## Gemini 2.5 Text-to-Speech (TTS) GA

- **Flash/Pro両モデルのGA**: Gemini 2.5 TTSがPro版・Flash版ともに一般提供され、高忠実度の音声生成を提供。
- **主な機能**: 単一APIコールで複数話者のダイアログを生成、自然言語でトーンや感情・アクセントを制御、70以上の言語で提供。ポッドキャストやeラーニング、カスタマーサポートなどに適合。

## モデル選定の指針

1. **Veo 3**: 映像主体のストーリーテリングやソーシャル動画での高度なシーン制御を必要とする場合に推奨。
2. **Gemini 2.5 Flash Image**: 反復的な画像生成・編集、会話型編集、スタイル変換など、ビジュアル一貫性が重要なワークフロー向け。
3. **Imagen 4**: 高解像度・高速なテキスト→画像生成が求められるケースに適合。
4. **Gemini 2.5 Flash/Pro TTS**: マルチスピーカー対応の感情豊かな音声を必要とする音声アプリケーションに適用。

**重要な結論**: Vertex AIは視覚・音声の全領域でGAモデルを揃え、企業が安全かつ柔軟に創造ワークフローを高速化できる一貫したプラットフォームを提供している。記事内で明示された制限事項はなし。

## 関連リソース

- Vertex AI Studio: <https://console.cloud.google.com/vertex-ai/studio/multimodal>
- Vertex AI Media Studio: <https://console.cloud.google.com/vertex-ai/studio/media>
- Veo 3 価格情報: <https://cloud.google.com/vertex-ai/generative-ai/pricing#veo>
