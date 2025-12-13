---
title: "Generative UI: A rich, custom, visual interactive user experience for any prompt"
source: "https://research.google/blog/generative-ui-a-rich-custom-visual-interactive-user-experience-for-any-prompt/"
author:
  - Yaniv Leviathan (Google Fellow)
  - Dani Valevski (Senior Staff Software Engineer)
  - Yossi Matias (Vice President & Head of Google Research)
published: 2025-11-18
created: 2025-12-13
description: |
  GoogleによるGenerative UIの新しい実装についての発表。AIモデルがコンテンツだけでなく、ユーザーの質問やプロンプトに応じて動的にカスタマイズされたインタラクティブなユーザー体験全体（Webページ、ゲーム、ツール、アプリケーション）を生成する技術。GeminiアプリとGoogle検索（AI Mode）で展開開始。
tags:
  - "generative-ai"
  - "ui-generation"
  - "gemini"
  - "human-computer-interaction"
  - "google-research"
  - "llm"
---

## 概要

Generative UIは、AIモデルがコンテンツだけでなく**ユーザー体験全体を生成**する強力な機能である。Googleが発表した新しい実装では、任意の質問・指示・プロンプトに応じて、Webページ、ゲーム、ツール、アプリケーションなどのインタラクティブなインターフェースを動的に生成する。

### 主要な特徴

- **完全にカスタマイズされたUI生成**: 単語1つから詳細な指示まで、あらゆるプロンプトに対応
- **静的UIからの脱却**: 事前定義された固定インターフェースではなく、動的に生成
- **ユーザー評価で高い支持**: 生成速度を除けば、標準的なLLM出力よりも強く好まれる

## 論文の主要な発見

論文「[Generative UI: LLMs are Effective UI Generators](https://generativeui.github.io/static/pdfs/paper.pdf)」では：

1. Generative UIの有効性を実証
2. 人間の評価者が標準的なLLM出力よりもGenerative UIを強く選好
3. 将来的にはAIが完全に生成するユーザー体験への第一歩

## Google製品への統合

### Geminiアプリ

2つの実験として展開：

1. **Dynamic View**: Geminiがプロンプトごとに完全にカスタマイズされたインタラクティブな応答を設計・コーディング
2. **Visual Layout**: 視覚的なレイアウト機能

**ユースケース例**:

- [確率論の学習](https://generativeui.github.io/static/demos/carousel.html?result=rolling-an-8)
- [イベント計画](https://generativeui.github.io/static/demos/carousel.html?result=thanksgiving)
- [ファッションアドバイス](https://generativeui.github.io/static/demos/carousel.html?result=fashion-advisor)
- [フラクタルの学習](https://generativeui.github.io/static/demos/carousel.html?result=fractal-explorer)
- [子供向け数学教育](https://generativeui.github.io/static/demos/carousel.html?result=basketball-math)

### Google検索（AI Mode）

- Gemini 3のマルチモーダル理解とエージェント型コーディング能力を活用
- インタラクティブなツールとシミュレーションをオンザフライで生成
- 深い理解とタスク完了に最適化された動的環境を構築
- 米国のGoogle AI Pro/Ultra購読者向けに提供開始

## 技術的な実装

Generative UIの実装は**Gemini 3 Pro**モデルをベースに、3つの重要な追加機能を持つ：

### 1. ツールアクセス

サーバーが以下のツールへのアクセスを提供：

- 画像生成
- Web検索

これにより、品質向上のためにモデルが結果にアクセスしたり、効率向上のためにユーザーのブラウザに直接送信したりできる。

### 2. システム指示

詳細な指示を含む：

- 目標設定
- 計画
- 例示
- 技術仕様（フォーマット、ツールマニュアル、一般的なエラー回避のヒント）

### 3. ポストプロセッシング

モデルの出力は一連のポストプロセッサを通過し、潜在的な問題に対処する。

### システム概要図

```
[ユーザープロンプト] → [LLM (システム指示を考慮)] ←→ [ツール]
                              ↓
                    [HTML/CSS/JS出力]
                              ↓
                    [ユーザーのブラウザ]
```

## スタイリング

- 製品によっては一貫したスタイルで結果を表示するよう設定可能
- 特定のスタイリング指示がない場合、Generative UIが自動的にスタイルを選択
- ユーザーがプロンプトでスタイリングに影響を与えることも可能

## 評価

### PAGENデータセット

- 一貫した評価と比較のために作成
- 人間の専門家が作成したWebサイトのデータセット
- 研究コミュニティへの公開予定

### ユーザー選好の比較

比較対象：

1. 人間の専門家がデザインしたWebサイト
2. 当該クエリに対するGoogle検索のトップ結果
3. ベースラインのLLM出力（プレーンテキスト/マークダウン形式）

**結果**（生成速度は考慮外）：

1. **最も選好**: 人間の専門家がデザインしたサイト
2. **僅差で2位**: Generative UIの結果
3. **大きく離れて**: その他の出力方法

**追加の発見**:

- Generative UIの性能は基盤モデルの性能に強く依存
- 最新モデルは大幅に優れた性能を発揮

## 現在の制限事項

- **生成速度**: 結果の生成に1分以上かかることがある
- **精度**: 出力に時折不正確さが発生する

これらは継続的な研究対象となっている。

## 今後の展望

Generative UIは「[マジックサイクルの研究](https://blog.google/technology/research/google-research-team-tackles-big-challenges-with-science/)」の一例であり、研究のブレークスルーが製品イノベーションにつながり、新しいユーザーニーズへの対応機会を開き、さらなる研究を促進する。

**将来の可能性**:

- より広範なサービスへのアクセス拡張
- 追加のコンテキストと人間のフィードバックへの適応
- より有用な視覚的・インタラクティブなインターフェースの提供

## リソース

- **論文**: [Generative UI: LLMs are Effective UI Generators](https://generativeui.github.io/static/pdfs/paper.pdf)
- **プロジェクトページ**: [https://generativeui.github.io/](https://generativeui.github.io/)
