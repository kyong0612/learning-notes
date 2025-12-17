---
title: "実はマルチモーダルだった。ブラウザの組み込みAI🧠でWebの未来を感じてみよう #jsfes #gemini"
source: "https://speakerdeck.com/n0bisuke2/burauzanozu-miip-miai-dewebnowei-lai-wogan-zitemiyou-number-jsfes"
author:
  - "[[n0bisuke]]"
  - 菅原のびすけ
published: 2025-12-13
created: 2025-12-17
description: |
  JavaScript祭2025での発表資料。Chromeに組み込まれたGemini Nanoを活用し、完全オフラインで動作するAI APIの可能性を探る。Writer API、Translation API、Prompt APIなどの組み込みAI API群のデモと、マルチモーダル（画像・音声）入力対応の紹介を通じて、WebにおけるAI活用の未来を感じさせる内容。
tags:
  - "clippings"
  - "Chrome"
  - "Gemini Nano"
  - "Built-in AI"
  - "Prompt API"
  - "JavaScript"
  - "Web API"
  - "マルチモーダル"
---

## 概要

JavaScript祭2025での発表。Chromeの組み込みAI（Gemini Nano）のAPIを活用したWebアプリケーション開発の可能性を紹介する内容。

- **イベント**: [JavaScript祭2025](https://javascript-fes.doorkeeper.jp/events/192774)
- **サンプルコード**: [GitHub - n0bisuke/gemini-nano-browser-api-sample](https://github.com/n0bisuke/gemini-nano-browser-api-sample)
- **検証環境**: MacBook Air M3, macOS Tahoe v26.1, Chrome Dev v133

---

## 発表者について

- **菅原のびすけ** (@n0bisuke)
- プロトタイピング専門スクール「プロトアウトスタジオ」
- デジタルハリウッド大学大学院 非常勤講師（プロダクトプロトタイピング）
- IoTLT（国内最大のIoTコミュニティ）主催
- Developers Summit ベストスピーカー2位
- LINE API Expert / Microsoft MVP / IBM Champion

---

## Chrome組み込みAIとは

### 基本概念

Chromeの中に組み込まれたモデル（Gemini Nano）にアクセスできるAPI群が存在し、ユーザーはJavaScriptを通してアクセス可能。

**公式ドキュメント**: <https://developer.chrome.com/docs/ai/get-started?hl=ja>

### 完全オフラインのメリット

| メリット | 説明 |
|---------|------|
| **セキュア・プライバシー** | データがデバイスから外に出ない |
| **コスト無制限** | Chromeさえあれば無料でAI利用可能 |
| **可用性向上** | ネットワーク接続不要 |
| **低レイテンシ** | サーバー通信なしで高速応答 |

### Gemini Nano v1

- **サイズ**: 約2.2GB
- **Model Name**: v1Nano
- **実行環境**: GPU（highest quality）利用 or CPU利用（PCにより切り替え）
- **モデル形式**: GGUFなどではなくbinファイル
- **制約**: LM Studioなどでは使えなそう

### コンテキストウィンドウの制限

- **Gemini**: 200万トークン
- **Gemini Nano**: 約4000トークン程度
  - 英語: 約2000文字
  - 日本語: 約1000文字

→ 多くの文字を一気に扱えないため、**部分的に要約を繰り返す戦略**が必要

---

## 組み込みAI API群

| API | 機能 | フラグ |
|-----|------|-------|
| **Writer API** | 文章のライティング | `#writer-api-for-gemini-nano` |
| **ReWriter API** | 文章の書き直し | `#rewriter-api-for-gemini-nano` |
| **Proofreader API** | 文章校正 | `#proofreader-api-for-gemini-nano` |
| **Translation API** | 翻訳 | `#translation-api`, `#translation-api-streaming-by-sentence` |
| **Language Detect API** | 言語特定 | `#language-detection-api` |
| **Summarization API** | 要約 | `#summarization-api-for-gemini-nano` |
| **Prompt API** | 汎用LLM利用 | `#prompt-api-for-gemini-nano`, `#prompt-api-for-gemini-nano-multimodal-input` |

### API利用時の注意点

- 最初に利用する時だけモデルダウンロード（約2.2GB）が必要
- Webで利用する際にはオリジントライアル申請が必要なものもある
- Chrome Extension版のサンプルも公開されている

---

## 各APIの詳細

### Writer API

- 文章のライティング支援
- トーン指定が可能（フォーマル/ナチュラル/カジュアル）
- プロンプト例: 「JS FESでの冒頭挨拶を考えてください」

### ReWriter API

- 既存文章の書き直し
- Writer APIとの違いは「元の文章がある」こと

### Proofreader API

- 文章の構成・校正支援

### Translation API

- シンプルな翻訳機能
- Microsoft Edge Web Platform にも同様のAPIあり

### Language Detection API

- 入力テキストの言語を検出
- 複数言語の可能性と信頼度を返す

### Summarization API

- 文章の要約
- **再帰要約機能**: コンテキストウィンドウの制限を克服
  - 文章を分割して部分要約 → 要約を統合 → 最終要約
  - これにより**実質無限トークン**の要約が可能

---

## Prompt API（本命）

### 基本機能

- LLMに直接アクセスできる汎用API
- 他のタスク特化APIはPrompt APIのラッパーと推測される

### JSONモード

- 構造化された出力を取得可能

### マルチモーダル対応（重要な発見）

**実はGemini Nanoはマルチモーダルだった！**

- **画像入力**: 画像を解析してテキスト生成
- **音声入力**: 音声を解析してテキスト生成

```javascript
// マルチモーダル入力の例
await ai.prompt({
  prompt: "この画像について説明してください",
  image: imageData
});
```

---

## 実践面での活用

### 推奨アーキテクチャ

- **推論（重い処理）**: サーバーサイドで実行
- **前処理・軽い処理**: クライアントサイド（Gemini Nano）で実行

### 想定ユースケース

- 文章作成者（ライター、執筆者など）のサポート
- ブログ上の要約
- 多言語サポート
- ユーザーレビューの要約
- クライアントサイドの翻訳（Google Meetなど）
- 画面操作説明（マルチモーダル + WebRTC Screen Captureの併用）

---

## おまけ：Project Fugu（河豚）🐡関連API

発表者が以前から追っているブラウザのハードウェアAPI群。

### リクエスト中のAPI

| API | 機能 |
|-----|------|
| **Web Neural Network API** | OSのNN推論エンジンを直接利用（MacならCore ML） |
| **Compute Pressure API** | ブラウザの計算リソース負荷を算出 |
| **Health Connect API** | iOS等のヘルスケア情報にアクセス |
| **Web Biometrics** | 指紋等の生体認証へアクセス |
| **Screen Brightness API** | 一時的に画面を明るくする（PayPay等のQR用途） |
| **Proximity Sensor API** | 近接センサー |
| **Virtual Microphone/Camera** | バーチャルマイクとカメラの作成 |
| **Gamepad Acceleration Input** | ゲームパッドの加速度入力取得 |

---

## まとめ

### Chromeの組み込みAI

- **Gemini Nano**が中核
- 思ったより早くて優秀
- **まさかのマルチモーダル対応**（画像も音声もいける）
- モデルが重く、各自のPCスペックによっては動作が厳しい場合もある

### API構成

- **Prompt API**が中核（汎用）
- タスク特化でWriter、Translator等の文章系APIが派生
- **Summarization APIの再帰戦略**が面白い（実質無限のAI要約）

### 将来性

- サイズが軽くなりみんなのPC・スマホで動くようになったら応用が広がる
- **AI前提のWebアプリ**を作れる未来
- Project Fugu🐡はやはり可能性の塊で面白い

---

## 参考リンク

- [Chrome Built-in AI Documentation](https://developer.chrome.com/docs/ai/get-started?hl=ja)
- [Prompt API Documentation](https://developer.chrome.com/docs/ai/prompt-api?hl=ja)
- [Summarization API - Scale Summarization](https://developer.chrome.com/docs/ai/scale-summarization?hl=ja)
- [Sample Code Repository](https://github.com/n0bisuke/gemini-nano-browser-api-sample)
- [Chrome Extension Samples](https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/functional-samples/ai.gemini-on-device-summarization)
