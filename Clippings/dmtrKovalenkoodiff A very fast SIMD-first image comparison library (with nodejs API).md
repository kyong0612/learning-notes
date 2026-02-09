---
title: "dmtrKovalenko/odiff: A very fast SIMD-first image comparison library (with nodejs API)"
source: "https://github.com/dmtrKovalenko/odiff"
author:
  - "[[Dmitriy Kovalenko]]"
published:
created: 2026-02-09
description: "ODiffは、SIMDを活用した超高速なピクセル単位の画像比較ライブラリ。SSE2/AVX2/AVX512/NEON最適化により、ImageMagickやpixelmatchの5〜7倍高速に動作する。Node.js APIとCLIを提供し、PNG/JPEG/WebP/TIFFのクロスフォーマット比較、アンチエイリアス検出、領域無視機能を備える。"
tags:
  - "clippings"
  - "Image Processing"
  - "Visual Regression Testing"
  - "SIMD"
  - "Zig"
  - "Node.js"
  - "Performance"
  - "Open Source"
---

## 概要

ODiffは、世界最速クラス（シングルスレッド）のピクセル単位画像比較ツールである。もともとOCamlで書かれていたが、現在はZig言語で実装されており、SSE2、AVX2、AVX512、NEONのSIMD最適化が施されている。スクリーンショット、写真、AI生成画像などの視覚的に類似した画像の差分検出に特化しており、ポータブルで高速、メモリ効率に優れた設計となっている。

## 主要なトピック

### 対応フォーマットと機能

- **クロスフォーマット比較**: `.png` vs `.jpeg` など異なるフォーマット間の比較が可能
- **対応形式**: `.png`, `.jpeg`, `.jpg`, `.webp`, `.tiff`
- **異なるレイアウトの画像比較**をサポート
- **アンチエイリアス検出**: アンチエイリアスされたピクセルを差分から除外可能
- **領域無視（Ignoring Regions）**: 指定した矩形領域を比較対象から除外
- **YIQ NTSCアルゴリズム**: 視覚的差異の判定に使用
- **100%テストカバレッジ**と後方互換性

### 使い方

#### CLI

```
odiff <base_image> <compare_image> [DIFF output path]
```

#### Node.js API

```js
const { compare } = require("odiff-bin");

const { match, reason } = await compare(
  "path/to/first/image.png",
  "path/to/second/image.png",
  "path/to/diff.png",
);
```

#### サーバーモード

長時間実行アプリケーション向けに、プロセスのフォーク・初期化コストを削減するサーバーモードを提供。Node.jsからは `ODiffServer` クラスで利用可能。バイナリ直接利用時はreadline stdioプロトコル（JSONメッセージ）で通信する。

```js
const { ODiffServer } = require("odiff-bin");
const odiffServer = new ODiffServer();

const { match, reason } = await odiffServer.compare(
  "path/to/first/image.png",
  "path/to/second/image.png",
  "path/to/diff.png",
);
```

サーバーモードの特徴:
- 自動遅延初期化（最初の `compare()` 呼び出し時に起動）
- 終了/SIGINT時に自動クリーンアップ
- 複数ワーカー使用時、コアごとに自動的にサーバープロセスを生成

### Node.js APIオプション

| オプション | 型 | 説明 |
|---|---|---|
| `diffColor` | `string` | 差分ピクセルのハイライト色（hex形式） |
| `outputDiffMask` | `boolean` | フルdiffマスク画像を出力 |
| `diffOverlay` | `boolean \| number` | 白いオーバーレイ付きdiff画像を出力 |
| `failOnLayoutDiff` | `boolean` | レイアウトが異なる場合に比較を中止 |
| `noFailOnFsErrors` | `boolean` | ファイル不在時にエラーではなく結果を返す |
| `threshold` | `number` | 色差閾値（0〜1、小さいほど精密） |
| `antialiasing` | `boolean` | アンチエイリアスピクセルを差分から除外 |
| `captureDiffLines` | `boolean` | 差分を含む行インデックスのセットを返す |
| `reduceRamUsage` | `boolean` | メモリ使用量を削減（大きな画像で速度低下あり） |
| `ignoreRegions` | `Array<{x1,y1,x2,y2}>` | 無視する領域の配列 |

### フレームワーク統合

- **Playwright**: `playwright-odiff` パッケージで `toHaveScreenshotOdiff()` を利用可能
- **Cypress**: `cypress-odiff` プラグインで視覚回帰テストに対応
- **Argos**: モダンなビジュアルテストプラットフォーム（ODiff採用で8倍高速化を達成）
- **LostPixel**: Storybookと統合可能なフロントエンド向けビジュアルテスト
- **Visual Regression Tracker**: セルフホスト型の視覚回帰サービス
- **OSnap**: OCaml製のスナップショットテストツール

### インストール

```bash
npm install odiff-bin
```

または[リリースページ](https://github.com/dmtrKovalenko/odiff/releases)からプラットフォーム別のバイナリをダウンロード。

## 重要な事実・データ

### ベンチマーク結果

#### cypress.ioフルページスクリーンショット比較

| コマンド | 平均 [s] | 相対速度 |
|---|---|---|
| pixelmatch | 7.712 ± 0.069 | 6.67x |
| ImageMagick compare | 8.881 ± 0.121 | 7.65x |
| **odiff** | **1.168 ± 0.008** | **1.00x (基準)** |

#### 8K画像比較

| コマンド | 平均 [s] | 相対速度 |
|---|---|---|
| pixelmatch | 10.614 ± 0.162 | 5.50x |
| ImageMagick compare | 9.326 ± 0.436 | 5.24x |
| **odiff** | **1.951 ± 0.014** | **1.00x (基準)** |

- ODiffはImageMagickやpixelmatchと比較して **5〜7倍高速**
- 画像が大きくなるほど差は顕著になる
- 差分結果は3ツール間で同一

### パフォーマンスの実践的インパクト

> 月25,000枚のスナップショット比較において、1枚あたり3秒の短縮で**月20時間以上のCI時間を削減**可能

```
3s × 25,000 / 3,600 = 20.83 hours
```

## 結論・示唆

### プロジェクトの位置づけ

ODiffは、ビジュアル回帰テストにおけるパフォーマンスボトルネックを解消するために設計された専門ツールである。SIMD最適化による圧倒的な速度優位性を持ちながら、豊富なAPI・フレームワーク統合・サーバーモードにより、実用的なワークフローに容易に組み込める。

### 実践的な示唆

- CI/CDパイプラインでの画像比較が多い場合、ODiffへの移行で大幅な時間短縮が期待できる
- サーバーモードを活用すれば、大量のスナップショット比較をさらに効率化可能
- Playwright/Cypress等の主要テストフレームワークとの統合が容易
- クロスフォーマット比較対応により、フォーマット変換の前処理が不要

## 制限事項・注意点

- `reduceRamUsage` オプションを有効にすると、メモリ使用量は削減されるが大きな画像で速度が低下する
- diff出力は `.png` 形式のみ対応
- ライセンス: MIT

---

*Source: [dmtrKovalenko/odiff](https://github.com/dmtrKovalenko/odiff)*
