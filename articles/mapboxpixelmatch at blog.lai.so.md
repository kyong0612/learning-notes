---
title: "mapbox/pixelmatch"
source: "https://github.com/mapbox/pixelmatch"
author:
  - "Vladimir Agafonkin (@mourner)"
  - "Mapbox"
published: 2025-02-21
created: 2025-12-01
description: "最小・最軽量・最速のJavaScriptピクセルレベル画像比較ライブラリ。約150行のコードで依存関係なし。アンチエイリアス検出と知覚的色差メトリクスを備え、Node.jsとブラウザ両方で動作する。"
tags:
  - "javascript"
  - "image-comparison"
  - "testing"
  - "visual-regression"
  - "open-source"
---

## 概要

**pixelmatch**は、Mapboxが開発した最小・最軽量・最速のJavaScriptピクセルレベル画像比較ライブラリです。元々はテストでスクリーンショットを比較するために作成されました。

### 主な特徴

- **正確なアンチエイリアスピクセル検出**
- **知覚的色差メトリクス**
- 約**150行のコード**のみ
- **依存関係なし**
- **生の型付き配列**（TypedArray）で動作
- **非常に高速**
- **あらゆる環境**（Node.jsまたはブラウザ）で使用可能

### インスピレーション元

- [Resemble.js](https://github.com/Huddle/Resemble.js)
- [Blink-diff](https://github.com/yahoo/blink-diff)

これらのライブラリとは異なり、pixelmatchは軽量でシンプルな設計です。

## 技術的基盤

以下の学術論文のアイデアを実装しています：

1. **YIQ NTSC伝送色空間を使用した知覚色差測定** (2010年, Yuriy Kotsarenko, Fernando Ramos)
2. **アンチエイリアスピクセルと強度勾配検出器** (2009年, Vytautas Vyšniauskas)

## API

### `pixelmatch(img1, img2, output, width, height[, options])`

#### パラメータ

| パラメータ | 説明 |
|-----------|------|
| `img1`, `img2` | 比較する画像データ (`Buffer`, `Uint8Array`, `Uint8ClampedArray`)。画像サイズは同一である必要あり |
| `output` | 差分画像を書き込むデータ。不要な場合は `null` |
| `width`, `height` | 画像の幅と高さ。3つの画像すべて同じサイズが必要 |

#### オプション

| オプション | デフォルト | 説明 |
|------------|-----------|------|
| `threshold` | `0.1` | マッチング閾値（0〜1）。小さい値ほど比較が厳密になる |
| `includeAA` | `false` | `true`でアンチエイリアスピクセルの検出・無視を無効化 |
| `alpha` | `0.1` | 差分出力で変更されていないピクセルのブレンド係数（0=白、1=元の明るさ） |
| `aaColor` | `[255, 255, 0]` | アンチエイリアスピクセルの色（黄色） |
| `diffColor` | `[255, 0, 0]` | 差分ピクセルの色（赤） |
| `diffColorAlt` | `null` | 「追加」と「削除」を区別するための代替色 |
| `diffMask` | `false` | 透明背景に差分を描画（マスクとして） |

#### 戻り値

一致しなかったピクセル数を返します。

## 使用例

### 基本的な使用法

```javascript
const numDiffPixels = pixelmatch(img1, img2, diff, 800, 600, {threshold: 0.1});
```

### Node.js

```javascript
import fs from 'fs';
import {PNG} from 'pngjs';
import pixelmatch from 'pixelmatch';

const img1 = PNG.sync.read(fs.readFileSync('img1.png'));
const img2 = PNG.sync.read(fs.readFileSync('img2.png'));
const {width, height} = img1;
const diff = new PNG({width, height});

pixelmatch(img1.data, img2.data, diff.data, width, height, {threshold: 0.1});

fs.writeFileSync('diff.png', PNG.sync.write(diff));
```

### ブラウザ

```javascript
const img1 = img1Context.getImageData(0, 0, width, height);
const img2 = img2Context.getImageData(0, 0, width, height);
const diff = diffContext.createImageData(width, height);

pixelmatch(img1.data, img2.data, diff.data, width, height, {threshold: 0.1});

diffContext.putImageData(diff, 0, 0);
```

## コマンドライン

PNG画像に対応したCLIツールも提供されています：

```bash
pixelmatch image1.png image2.png output.png 0.1
```

## インストール

### NPM

```bash
npm install pixelmatch
```

### CDN（ブラウザ）

```html
<script type="module">
  import pixelmatch from 'https://esm.run/pixelmatch';
</script>
```

## プロジェクト情報

| 項目 | 値 |
|------|-----|
| ライセンス | ISC |
| スター数 | 6.6k |
| フォーク数 | 323 |
| 言語 | JavaScript 100% |
| 最新バージョン | v7.1.0 (2025年2月21日) |
| コントリビューター | 19人 |

## 出力例

pixelmatchは、2つの画像を比較し、差分画像を生成します：

- **期待画像 (expected)**: 基準となる画像
- **実際の画像 (actual)**: 比較対象の画像  
- **差分画像 (diff)**: 赤で差分部分、黄色でアンチエイリアス部分をハイライト

## ユースケース

- **ビジュアル回帰テスト**: UIコンポーネントのスクリーンショット比較
- **自動テスト**: CIパイプラインでの画面変更検出
- **品質保証**: デザイン変更の検証
- **地図タイル比較**: Mapbox由来のため、地図レンダリングの比較に最適

## 関連リンク

- [デモ](https://observablehq.com/@mourner/pixelmatch-demo)
- [変更履歴](https://github.com/mapbox/pixelmatch/releases)
