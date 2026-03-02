---
title: "kingbootoshi/nano-banana-2-skill: AI image generation CLI powered by Gemini 3 Pro. Green screen transparency, reference images, style transfer. Also a Claude Code plugin."
source: "https://github.com/kingbootoshi/nano-banana-2-skill"
author:
  - "[[kingbootoshi]]"
published: 2026-02-24
created: 2026-03-02
description: "Gemini 3.1 Flash / Gemini 3 Pro を使った AI 画像生成 CLI。マルチ解像度（512〜4K）、アスペクト比指定、コスト追跡、グリーンスクリーン透過、リファレンス画像、スタイル転写に対応し、Claude Code スキルとしても動作する。"
tags:
  - "clippings"
  - "ai-image-generation"
  - "gemini"
  - "cli-tool"
  - "claude-code"
  - "typescript"
---

## 概要

**Nano Banana 2 Skill** は、Google の Gemini 3.1 Flash Image Preview（デフォルト）および Gemini 3 Pro をバックエンドに使用する AI 画像生成 CLI ツール。TypeScript（Bun ランタイム）で実装されており、CLI としてグローバルインストールして使うほか、Claude Code のスキル/プラグインとしても利用できる。

- **リポジトリ**: https://github.com/kingbootoshi/nano-banana-2-skill
- **スター**: 101 / **フォーク**: 4
- **ライセンス**: MIT

---

## 主要機能

| 機能 | 説明 |
|---|---|
| **マルチ解像度** | 512、1K、2K、4K から選択可能 |
| **アスペクト比** | `1:1`, `16:9`, `9:16`, `4:3`, `3:4`, `3:2`, `2:3`, `4:5`, `5:4`, `21:9` |
| **モデル選択** | Flash（高速・低コスト）/ Pro（最高品質）/ 任意の Gemini モデル ID |
| **リファレンス画像** | `-r` で既存画像を入力し、編集・変換・スタイル転写が可能 |
| **透過背景（-t）** | グリーンスクリーン生成 → FFmpeg colorkey + despill → ImageMagick トリムの 3 段パイプライン |
| **コスト追跡** | `~/.nano-banana/costs.json` に生成ごとのコストを記録。`--costs` で確認 |
| **Claude Code 統合** | スキルとしてインストールすると「画像を生成して」等の自然言語でコマンドを自動構築 |

---

## インストール

**前提条件**: [Bun](https://bun.sh)、[FFmpeg](https://ffmpeg.org) + [ImageMagick](https://imagemagick.org)（透過モード用）

```shell
git clone https://github.com/kingbootoshi/nano-banana-2-skill.git ~/tools/nano-banana-2
cd ~/tools/nano-banana-2
bun install
bun link
mkdir -p ~/.nano-banana
echo "GEMINI_API_KEY=your_key_here" > ~/.nano-banana/.env
```

API キーは [Google AI Studio](https://aistudio.google.com/apikey) で無料取得可能。

---

## 使い方

### 基本コマンド

```shell
nano-banana "minimal dashboard UI with dark theme"           # 1K画像を生成
nano-banana "luxury product mockup" -o product               # 出力名指定
nano-banana "detailed landscape painting" -s 2K              # 高解像度
nano-banana "cinematic widescreen scene" -s 4K -a 16:9       # 4K + ワイドスクリーン
nano-banana "quick sketch concept" -s 512                    # 低解像度（高速・低コスト）
```

### モデル選択

| エイリアス | モデル | 用途 |
|---|---|---|
| `flash`, `nb2` | Gemini 3.1 Flash Image Preview | 高速・低コスト・大量生成 |
| `pro`, `nb-pro` | Gemini 3 Pro Image Preview | 最高品質・複雑な構図 |

```shell
nano-banana "your prompt" --model pro       # Pro モデルを使用
```

### リファレンス画像

```shell
nano-banana "change the background to pure white" -r dark-ui.png -o light-ui
nano-banana "combine these two UI styles into one" -r style1.png -r style2.png -o combined
```

### 透過アセット生成

```shell
nano-banana "robot mascot character" -t -o mascot
nano-banana "minimalist tech logo" -t -o logo
```

---

## 透過モードの仕組み

`-t` フラグは 3 ステップのパイプラインで透過を実現する:

1. **グリーンスクリーンプロンプト** — CLI がプロンプトに緑背景の指示を自動追加し、AI が緑背景上に画像を生成
2. **FFmpeg colorkey + despill** — `colorkey` で緑背景を除去。`despill` がエッジピクセルの RGB から緑色汚染を数学的に除去し、クリーンなエッジを実現
3. **Auto-crop** — ImageMagick が透明パディングをトリムし、キャンバスをリセット

キーカラーは画像の角ピクセルから自動検出される（AI は `#00FF00` ではなく `#05F904` のような近似グリーンを生成するため）。

---

## サイズとコスト

| サイズ | 解像度 | Flash コスト | Pro コスト |
|---|---|---|---|
| `512` | ~512x512 | ~$0.045 | N/A（Flash のみ） |
| `1K` | ~1024x1024 | ~$0.067 | ~$0.134 |
| `2K` | ~2048x2048 | ~$0.101 | ~$0.201 |
| `4K` | ~4096x4096 | ~$0.151 | ~$0.302 |

---

## CLI オプション一覧

| オプション | デフォルト | 説明 |
|---|---|---|
| `-o, --output` | `nano-gen-{timestamp}` | 出力ファイル名（拡張子なし） |
| `-s, --size` | `1K` | 画像サイズ: `512`, `1K`, `2K`, `4K` |
| `-a, --aspect` | モデルデフォルト | アスペクト比 |
| `-m, --model` | `flash` | モデル選択 |
| `-d, --dir` | カレントディレクトリ | 出力ディレクトリ |
| `-r, --ref` | - | リファレンス画像（複数指定可） |
| `-t, --transparent` | - | グリーンスクリーン透過 |
| `--api-key` | - | Gemini API キー（環境変数/ファイルを上書き） |
| `--costs` | - | コスト履歴を表示 |

---

## API キー設定の優先順位

1. `--api-key` フラグ
2. `GEMINI_API_KEY` 環境変数
3. カレントディレクトリの `.env`
4. リポジトリルートの `.env`
5. `~/.nano-banana/.env`

---

## ユースケース

- **ランディングページ素材** — プロダクトモックアップ、UIプレビュー
- **画像編集** — テキストプロンプトで既存画像を変換
- **スタイル転写** — 複数リファレンス画像の合成
- **マーケティング素材** — ヒーロー画像、機能イラスト
- **UI イテレーション** — デザインバリエーションの高速生成
- **透過アセット** — アイコン、ロゴ、マスコット
- **ゲームアセット** — スプライト、タイルセット、キャラクター
- **動画制作** — Remotion 等のビジュアル要素

---

## Claude Code スキルとしての利用

Claude Code プラグインとしてインストールすると、以下のようなフレーズで自動トリガーされる:

- "generate an image"
- "create a sprite"
- "make an asset"
- "generate artwork"

Claude がリクエストに基づき、モデル選択・解像度・アスペクト比・リファレンス画像・透過・出力設定を自動的に判断して `nano-banana` コマンドを構築・実行する。
