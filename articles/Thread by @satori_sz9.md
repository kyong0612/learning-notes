---
title: "Nano Banana Proを使いこなすための必須テクニック"
source: "https://x.com/satori_sz9/status/1994439099969593836?s=12"
author:
  - "さとり (@satori_sz9)"
published: 2025-11-29
created: 2025-11-30
description: |
  Nano Banana Pro（AI画像生成ツール）を効果的に使用するためのテクニック。Geminiを活用して任意の画像からJSONプロンプトを自動生成し、画像生成AIでの再現や部分的な修正を容易にする方法を紹介。
tags:
  - "AI"
  - "画像生成"
  - "Gemini"
  - "Nano Banana Pro"
  - "プロンプトエンジニアリング"
  - "JSON"
---

## 概要

このツイートは、AI画像生成ツール「**Nano Banana Pro**」を使いこなすための必須テクニックを紹介している。

## テクニックの手順

### 1. 画像をGeminiにアップロード

任意の画像（参考にしたい画像や再現したい画像）をGeminiにアップロードする。

### 2. JSONプロンプト化を指示

Geminiに以下のように指示する：

> 「画像のサイズやディティールまで含めてjsonプロンプト化して」

### 3. プロンプトを取得

Geminiが画像を解析し、その画像を再現するための詳細なJSONプロンプトを出力する。

### 4. 必要な部分のみ変更

出力されたJSONプロンプトから、変更したい部分のみを編集して使用する。

## JSONプロンプトの構造例

添付画像から確認できるJSONプロンプトの構造：

```json
{
  "infographic_description": {
    "background": "plain white studio setting with soft, realistic shadows cast beneath each device object",
    "style": "high-fidelity product rendering, chronological order from top to bottom"
  },
  "elements": [
    {
      "year": 2002,
      "service": "Friendster",
      "label_text": "Friendster, 2002",
      "device": {
        "type": "Desktop Computer Monitor",
        "model_description": "Retro beige CRT monitor with a curved screen, thick..."
      }
    }
  ]
}
```

## このテクニックのメリット

1. **再現性の向上**: 画像の詳細な要素をJSONで構造化することで、正確な再現が可能になる
2. **部分的な編集が容易**: 全体を再作成せず、変更したい要素のみを修正できる
3. **サイズやディテールの保持**: 画像の寸法や細かなスタイルまで含めてプロンプト化される
4. **時間効率**: 一から詳細なプロンプトを書く手間を省ける

## 統計情報（2025年11月29日時点）

| 指標 | 数値 |
|------|------|
| 閲覧数 | 272.7K |
| いいね | 2.8K |
| リポスト | 268 |
| ブックマーク | 3.5K |
| 返信 | 2 |

## 関連キーワード

- **Nano Banana Pro**: AI画像生成ツール
- **Gemini**: Google の AI アシスタント（画像解析・テキスト生成に対応）
- **JSONプロンプト**: 構造化されたプロンプト形式
