---
title: "YouMind-OpenLab/awesome-nano-banana-pro-prompts: 🍌 500+ selected Nano Banana Pro prompts with images, multilingual support, and instant gallery preview. Open-source prompt engineering library"
source: "https://github.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts"
author:
  - "[[YouMind-OpenLab]]"
published:
created: 2025-12-10
description: "Google Nano Banana Pro向けの700以上の厳選されたクリエイティブプロンプトを収録したオープンソースライブラリ。画像付きサンプル、16言語対応、Webギャラリーでのプレビュー機能を提供。プロンプトエンジニアリングの学習や商用画像生成に活用可能。"
tags:
  - "prompt-engineering"
  - "gemini-ai"
  - "nano-banana-pro"
  - "image-generation"
  - "awesome-list"
  - "multimodal-ai"
---

## 概要

**Awesome Nano Banana Pro Prompts** は、GoogleのマルチモーダルAI「**Nano Banana Pro**」向けのクリエイティブプロンプトを収集したオープンソースライブラリ。コミュニティから厳選された **705以上のプロンプト** を、生成画像サンプル付きで提供している。

## Nano Banana Pro とは？

Googleが開発した最新のマルチモーダルAIモデル。主な特徴：

| 機能 | 説明 |
|------|------|
| 🎯 マルチモーダル理解 | テキスト・画像・動画を処理可能 |
| 🎨 高品質生成 | フォトリアリスティックからアーティスティックまで対応 |
| ⚡ 高速イテレーション | 素早い編集とバリエーション生成 |
| 🌈 多様なスタイル | ピクセルアートから油絵まで |
| 🔧 精密な制御 | 構図やライティングの詳細コントロール |
| 📐 複雑なシーン | マルチオブジェクト・マルチキャラクターのレンダリング |

## リポジトリ統計

| 項目 | 数値 |
|------|------|
| 📝 総プロンプト数 | **705** |
| ⭐ Featured（厳選） | **12** |
| ⭐ GitHub Stars | **3.4k** |
| 🍴 Forks | **308** |
| 📄 ライセンス | CC BY 4.0 |

## 多言語対応

16言語のREADMEを提供：

- 英語、日本語、韓国語
- 簡体字中国語、繁体字中国語
- タイ語、ベトナム語、ヒンディー語
- スペイン語（欧州・ラテンアメリカ）
- ドイツ語、フランス語、イタリア語
- ポルトガル語（ブラジル・欧州）
- トルコ語

## Webギャラリー機能

公式サイト [youmind.com/nano-banana-pro-prompts](https://youmind.com/nano-banana-pro-prompts) では、GitHubよりも優れた閲覧体験を提供：

| 機能 | GitHub README | youmind.com Gallery |
|------|--------------|---------------------|
| 🎨 レイアウト | 線形リスト | Masonryグリッド |
| 🔍 検索 | Ctrl+Fのみ | 全文検索＋フィルター |
| 🤖 AI生成 | - | ワンクリックAI生成 |
| 📱 モバイル | 基本対応 | 完全レスポンシブ |

## 🔥 Featured プロンプト例

### 1. ワイド引用カード（肖像画付き）

著名人の肖像画と引用文を組み合わせた横長カード。茶色背景にライトゴールドのセリフ体フォント。Raycast対応で引数カスタマイズ可能。

```
A wide quote card featuring a famous person, with a brown background 
and a light-gold serif font for the quote: "{argument name="famous_quote" 
default="Stay Hungry, Stay Foolish"}"...
```

### 2. 手描き風ヘッダー画像

写真から手描き風のブログヘッダー画像を生成。青と緑のグラデーション、16:9のアスペクト比。

### 3. 水彩画風ドイツ地図

ドイツの連邦州をボールペンでラベル付けした水彩画風地図。教育・インフォグラフィック向け。

### 4. 黒板風ニュース要約

AIニュースを教師が書いたような黒板風の手書き図解に変換。

### 5. 電車広告風書籍広告

16:9の書籍広告画像。日本語コピー、3D配置の書籍イメージ。

### 6. ラグジュアリーミニマリスト商品写真

参照画像からハイエンドブランド広告風のミニマリスト商品写真を生成。4:5縦構図、ニュートラルな背景。

### 7. ロンドン屋外レストランポートレート

3月の涼しい朝、ロンドンの屋外レストランで座る若い女性のフォトリアリスティック画像。浅い被写界深度。

### 8. カービィの夢日記

星の上で眠るピンクのカービィが虹色のシャボン玉を吹く夢かわいいイラスト。マカロンカラーパレット。

### 9. オタク部屋の鏡セルフィー

青色トーンのオタク風PCコーナーでの女性の鏡セルフィー。詳細なキャラクター・環境・ライティング・カメラ設定を含む。

## 🚀 Raycast 連携

一部のプロンプトは [Raycast Snippets](https://raycast.com/help/snippets) 構文を使用した**動的引数**をサポート。`🚀 Raycast Friendly` バッジ付きプロンプトで利用可能。

**例：**

```
A quote card with "{argument name="quote" default="Stay hungry, stay foolish"}"
by {argument name="author" default="Steve Jobs"}
```

## プロンプトカテゴリ

ギャラリーでは以下のカテゴリでフィルタリング可能：

- **Profile / Avatar** - プロフィール画像・アバター
- **Social Media Post** - SNS投稿用画像
- **Infographic / Edu Visual** - インフォグラフィック・教育用ビジュアル
- **YouTube Thumbnail** - YouTubeサムネイル
- **Comic / Storyboard** - 漫画・ストーリーボード
- **Poster / Flyer** - ポスター・チラシ
- **App / Web Design** - アプリ・Webデザイン

## 貢献方法

PRを歓迎。[docs/CONTRIBUTING.md](https://github.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts/blob/main/docs/CONTRIBUTING.md) を参照。

## 注意事項

⚠️ **著作権について**: すべてのプロンプトは教育目的でコミュニティから収集。権利侵害がある場合は [Issue](https://github.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts/issues/new) で報告すると即座に削除対応。

## 関連リソース

- 📚 [Nano Banana Pro: 10 Real Cases](https://youmind.com/blog/nano-banana-pro-10-real-cases) - 実践事例集
- 🔗 [Gemini 3 Prompts](https://github.com/YouMind-OpenLab/awesome-gemini-3-prompts) - 同チームによるGemini 3向けプロンプト集（50+）
