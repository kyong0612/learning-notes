---
title: "画像を完全再現するプロンプト - Thread by @tetumemo"
source: "https://x.com/tetumemo/status/1994766841705611615?s=20"
author:
  - "テツメモ｜AI図解×検証｜Newsletter (@tetumemo)"
published: 2025-11-29
created: 2025-12-01
description: |
  海外でバズった「画像を完全再現するプロンプト」の元ネタとYAML式への変更版を紹介。画像の視覚的ディテールをJSON形式に変換し、AIで画像を再現するためのプロンプト技術について解説。Nano Banana Proでの活用方法も紹介されている。
tags:
  - AI
  - prompt-engineering
  - image-generation
  - image-reproduction
  - YAML
---

## 概要

このスレッドでは、海外で大バズした「画像を完全再現するプロンプト」の元ネタを紹介し、それをYAML式に圧縮・変更したバージョンを共有している。画像生成AIを使って既存の画像スタイルを再現したい場合に有用なテクニック。

## 再現プロンプト（英語版）

```text
extract all visual details from this image and convert them into a clean, well-structured JSON prompt. include sections: "subject", "clothing", "hair", "face", "accessories", "environment", "lighting", "camera", "style"...
```

### 日本語訳

```text
この画像に含まれる視覚的ディテールをすべて抽出して、整理されたクリーンなJSON形式のプロンプトに変換して。「subject」「clothing」「hair」「face」「accessories」「environment」「lighting」「camera」「style」などのセクションを含めて。
```

## セクション構成

プロンプトで抽出する視覚的要素：

| セクション | 説明 |
|-----------|------|
| subject | 被写体・主題 |
| clothing | 服装 |
| hair | 髪型 |
| face | 顔の特徴 |
| accessories | アクセサリー |
| environment | 環境・背景 |
| lighting | 照明 |
| camera | カメラアングル・設定 |
| style | スタイル・雰囲気 |

## YAML式プロンプト（Nano Banana Pro用）

より簡潔に使えるバージョン：

```text
画像のサイズやディティールまで含めてyamlプロンプト化してコードボックスに出力して
```

**特徴**:

- YAML形式なのでAIも人間も理解しやすい構造化プロンプトが出力される
- 画像・写真・図解を再現したい時にサクッと使える

## 再現性を高めるためのヒント

- 画像や写真などの要素に合う**詳細な情報**を加えると再現性が向上する
- 具体的な色、質感、構図などを追加することを推奨

## 関連情報

### 元ネタ

[@maxxmalist](https://x.com/maxxmalist/status/1992994234459152649?s=20) による海外でバズったオリジナルプロンプト

### 改良版

[@rute1203d（てる@プロンプトマフィア）](https://x.com/rute1203d/status/1993474818398982515) がさらに精度の高いプロンプトに仕上げている

## エンゲージメント

| 指標 | 数値 |
|------|------|
| 閲覧数 | 154.7K |
| いいね | 1.6K |
| リポスト | 139 |
| ブックマーク | 2.2K |

## 活用シーン

- **AIインフルエンサー作成**: 一貫したビジュアルスタイルを維持したキャラクター生成
- **画像スタイルの学習**: 気に入った画像のスタイル要素を構造化して理解
- **プロンプトの再利用**: 抽出したJSON/YAMLプロンプトを別の画像生成に活用

## 画像

![プロンプト出力例](https://pbs.twimg.com/media/G67VpipawAA-TGQ?format=png&name=large)

![再現例](https://pbs.twimg.com/media/G67R84uaoAAb33m?format=jpg&name=large)
