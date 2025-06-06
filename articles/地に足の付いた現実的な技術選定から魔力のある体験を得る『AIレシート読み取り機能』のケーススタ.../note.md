---
title: 地に足の付いた現実的な技術選定から魔力のある体験を得る『AIレシート読み取り機能』のケーススタ...
source: https://speakerdeck.com/moznion/from-grounded-tech-choices-to-magical-ux-a-case-study-of-ai-receipt-scanning
author:
  - moznion
published: 2025-05-13
created: 2025-05-15 23:18:14
description: |
  地に足の付いた現実的な技術選定から魔力のある体験を得る『AIレシート読み取り機能』のケーススタディ。Findy主催の【技術選定を突き詰める】Online Conferenc​​e 2025での発表資料。
tags:
  - AI
  - OCR
  - LLM
  - 技術選定
  - 開発プロセス
---

このスライドは、SmartBankにおける「AIレシート読み取り機能」開発のケーススタディです。現実的な技術選定とLLM（大規模言語モデル）の活用により、どのようにして「魔力のある体験」を目指したかが解説されています。

## 要約

### 1. 背景と課題

* 家計簿アプリにおいて、レシート入力は重要だが手間のかかる作業。
* 従来のOCR技術だけでは精度や柔軟性に限界があり、ユーザー体験向上が難しかった。
* 自社で高度なOCRエンジンを開発・運用するのはコストと時間がかかる。

### 2. ChatGPT(LLM)の発見とプロトタイピング

* 同僚が示したChatGPT(GPT-3.5)を利用したプロトタイプが、レシート情報を高い精度で抽出・構造化できる可能性を示唆。
* OCRで読み取ったテキストをLLMに投入し、必要な情報（店名、日付、金額、カテゴリなど）をZero-Shotで抽出・整形するアプローチ。
* これにより、モデルの事前学習やファインチューニングなしに、多様なフォーマットのレシートに対応できる見込みが立った。

### 3. 技術選定のポイント

* **不確実性の低減**:
  * 既存のプロトタイプをベースラインとし、実現可能性を確認済みで開発を開始。
  * 実際のレシートデータを収集・分析し、評価データセットを構築。
* **アーキテクチャ**:
  * クライアントアプリ (iOS/Android) でOCR処理を行い、テキストデータをサーバーに送信。
  * サーバーサイド (Ruby on Rails) でLLMプラットフォーム (Amazon Bedrock) と連携し、情報抽出。
  * APIサーバーを介してLLMを利用することで、認証情報管理や利用状況のモニタリングを容易にする。
* **LLMプラットフォームの選択**:
  * OpenAI API直接利用 vs Amazon Bedrock:
    * 当初OpenAI APIは利用規約や安定供給に懸念があった。
    * Amazon BedrockはAWSエコシステムとの親和性が高く、SLAもあり、複数のLLMモデルを選択できる利点があったため採用。
* **処理方式 (同期/非同期)**:
  * LLMの処理時間は数秒かかる可能性があるが、ユーザー体験を考慮し同期処理を選択。
  * 事前の計測で、OCR処理時間を含めても許容範囲内 (約5-7秒) と判断。
* **モデル選択**:
  * 処理速度と精度を考慮し、Claude Haiku を採用。軽量モデルでもレシート読み取りには十分な性能を発揮。
* **LLM出力の信頼性**:
  * LLMの出力をそのまま信用せず、一度ユーザーに確認・修正させるUIフローを導入。これにより、誤りをユーザーが訂正でき、かつLLMの誤りを許容できる設計とした。

### 4. 開発プロセスと学び

* **One-way Door vs Two-way Door**: 技術選定において、後戻りしやすい選択 (Two-way Door) を意識。
* **現実的なエンジニアリングと地道な改善**: 「魔力のような体験」も、実際には地道な技術検討、データ収集、プロトタイピング、評価の積み重ねで実現される。
* **性能評価**: 継続的な精度モニタリングと改善のために、評価データセットの重要性を強調。
* **セキュリティとコスト**: プロンプトインジェクション対策、DoS攻撃対策 (レートリミット)、LLM利用コストのモニタリングも考慮。

### 結論

LLMを活用することで、従来は困難だった高度なレシート読み取り機能を、比較的短期間で実用的なレベルで開発できた事例です。重要なのは、LLMの特性を理解し、適切な技術選定、アーキテクチャ設計、そしてユーザー体験を考慮したUI/UX設計を行うことであると述べられています。

## スライドの主要な図表について

この資料はSpeaker Deckのスライドであり、多くの図解やスクリーンショットが含まれています。主なものとしては以下のような内容が視覚的に説明されています。

* AIレシート読み取り機能のデモ画面（アプリのUI）
* 従来の開発アプローチとLLMを用いたアプローチの比較
* システムアーキテクチャ図（クライアント、APIサーバー、LLMプラットフォームの関係）
* 技術選定におけるPros/Consの比較表（例: LLMプラットフォーム選択、同期/非同期処理）
* 処理フロー図（OCRからLLM、ユーザー確認までの流れ）
* 性能評価やモニタリングに関する概念図

これらの視覚情報は、テキストだけでは伝わりにくいシステム全体の構成や意思決定の背景を理解する上で重要です。詳細については、元のスライド ([https://speakerdeck.com/moznion/from-grounded-tech-choices-to-magical-ux-a-case-study-of-ai-receipt-scanning](https://speakerdeck.com/moznion/from-grounded-tech-choices-to-magical-ux-a-case-study-of-ai-receipt-scanning)) を直接参照することをお勧めします。
