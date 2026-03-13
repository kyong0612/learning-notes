---
title: "Nano Banana - Gemini CLI Extension"
source: "https://github.com/gemini-cli-extensions/nanobanana"
author:
  - "[[gemini-cli-extensions]]"
published: 2025-09-19
created: 2026-03-13
description: "Gemini CLIの画像生成・編集拡張機能。テキストから画像生成、既存画像の編集・復元、アイコン・パターン・ストーリー・ダイアグラムの生成をMCPプロトコル経由で提供する。"
tags:
  - "gemini"
  - "cli-extension"
  - "image-generation"
  - "mcp"
  - "typescript"
---

## 概要

**Nano Banana** は、Gemini CLI向けのプロフェッショナルな画像生成・操作拡張機能。Geminiの画像生成モデル（Nano Bananaモデル群）を活用し、テキストからの画像生成、既存画像の編集、古い写真の復元などをCLIから実行できる。

- ⭐ 911 stars | 🍴 92 forks
- ライセンス: Apache License 2.0
- 言語: TypeScript

> **Note**: v1.0.11以降、Nano Banana 2（`gemini-3.1-flash-image-preview`）がデフォルトモデル。Proモデルを使用する場合は環境変数 `NANOBANANA_MODEL` を `gemini-3-pro-image-preview` に設定する。

---

## 主な機能

| 機能 | コマンド | 説明 |
|------|---------|------|
| 🎨 テキストから画像生成 | `/generate` | プロンプトからスタイル・バリエーション付きで画像を生成 |
| ✏️ 画像編集 | `/edit` | 自然言語の指示で既存画像を修正 |
| 🔧 画像復元 | `/restore` | 古い写真や損傷した写真を修復・強化 |
| 🎯 アイコン生成 | `/icon` | アプリアイコン、favicon、UI要素を複数サイズで生成 |
| 🎨 パターン生成 | `/pattern` | シームレスパターンやテクスチャを背景用に生成 |
| 📖 ストーリー生成 | `/story` | 連続した画像でビジュアルストーリーやプロセスを表現 |
| 📊 ダイアグラム生成 | `/diagram` | フローチャート、アーキテクチャ図、DB スキーマなどを生成 |
| 🌟 自然言語インターフェース | `/nanobanana` | 自由形式のプロンプトで柔軟に操作 |

---

## 前提条件

- **Gemini CLI** がインストール・設定済みであること
- **Node.js 20+** と npm
- **APIキー**: 環境変数 `NANOBANANA_API_KEY` に Gemini API キーを設定（[Google AI Studio](https://aistudio.google.com/apikey) で取得）

---

## インストールと有効化

```bash
gemini extensions install https://github.com/gemini-cli-extensions/nanobanana
```

インストール後、Gemini CLIを再起動すると全コマンドが利用可能になる。

---

## 対応モデル

| モデル | 名称 | 備考 |
|--------|------|------|
| `gemini-3.1-flash-image-preview` | Nano Banana 2 | **デフォルト** |
| `gemini-3-pro-image-preview` | Nano Banana Pro | 高品質 |
| `gemini-2.5-flash-image` | Nano Banana v1 | 旧バージョン |

モデル切り替えは環境変数で行う:

```bash
export NANOBANANA_MODEL=gemini-3-pro-image-preview
```

---

## 使用例

### 画像生成（`/generate`）

```bash
# 単一画像
/generate "a watercolor painting of a fox in a snowy forest"

# 複数バリエーション + プレビュー
/generate "sunset over mountains" --count=3 --preview

# スタイルバリエーション
/generate "mountain landscape" --styles="watercolor,oil-painting" --count=4

# 特定バリエーション
/generate "coffee shop interior" --variations="lighting,mood" --preview
```

**生成オプション**:
- `--count=N` — バリエーション数（1〜8、デフォルト: 1）
- `--styles="style1,style2"` — 適用するアートスタイル（カンマ区切り）
- `--variations="var1,var2"` — バリエーションタイプ
- `--format=grid|separate` — 出力形式
- `--seed=123` — 再現可能なシード値
- `--preview` — 生成後に自動プレビュー

**利用可能なスタイル**: `photorealistic`, `watercolor`, `oil-painting`, `sketch`, `pixel-art`, `anime`, `vintage`, `modern`, `abstract`, `minimalist`

**利用可能なバリエーション**: `lighting`, `angle`, `color-palette`, `composition`, `mood`, `season`, `time-of-day`

### 画像編集（`/edit`）

```bash
/edit my_photo.png "add sunglasses to the person"
/edit portrait.jpg "change background to a beach scene" --preview
```

### 画像復元（`/restore`）

```bash
/restore old_family_photo.jpg "remove scratches and improve clarity"
/restore damaged_photo.png "enhance colors and fix tears" --preview
```

### アイコン生成（`/icon`）

```bash
/icon "coffee cup logo" --sizes="64,128,256" --type="app-icon" --preview
/icon "company logo" --type="favicon" --sizes="16,32,64"
/icon "settings gear icon" --type="ui-element" --style="minimal"
```

**オプション**: `--sizes`, `--type`（app-icon/favicon/ui-element）, `--style`（flat/skeuomorphic/minimal/modern）, `--format`, `--background`, `--corners`

### パターン生成（`/pattern`）

```bash
/pattern "geometric triangles" --type="seamless" --style="geometric" --preview
/pattern "wood grain texture" --type="texture" --colors="mono"
/pattern "floral design" --type="wallpaper" --density="sparse"
```

**オプション**: `--size`, `--type`（seamless/texture/wallpaper）, `--style`（geometric/organic/abstract/floral/tech）, `--density`, `--colors`, `--repeat`

### ストーリー生成（`/story`）

```bash
/story "a seed growing into a tree" --steps=4 --type="process" --preview
/story "how to make coffee" --steps=6 --type="tutorial"
/story "evolution of smartphones" --steps=5 --type="timeline"
```

**オプション**: `--steps`（2〜8）, `--type`（story/process/tutorial/timeline）, `--style`, `--layout`（separate/grid/comic）, `--transition`

### ダイアグラム生成（`/diagram`）

```bash
/diagram "user login process" --type="flowchart" --style="professional" --preview
/diagram "microservices architecture" --type="architecture" --complexity="detailed"
/diagram "e-commerce database design" --type="database" --layout="hierarchical"
```

**オプション**: `--type`（flowchart/architecture/network/database/wireframe/mindmap/sequence）, `--style`, `--layout`, `--complexity`, `--colors`, `--annotations`

### 自然言語コマンド（`/nanobanana`）

```bash
/nanobanana create a logo for my tech startup
/nanobanana I need 5 different versions of a cat illustration in various art styles
/nanobanana fix the lighting in sunset.jpg and make it more vibrant
```

---

## ファイル管理

- **スマートファイル名生成**: プロンプトから自動的にファイル名を生成（例: `"sunset over mountains"` → `sunset_over_mountains.png`）
- **重複防止**: 同名ファイルが存在する場合、自動的にカウンタを付与（`_1`, `_2`, ...）
- **出力先**: `./nanobanana-output/`（自動作成）
- **入力ファイル検索パス**: カレントディレクトリ、`./images/`、`./input/`、`./nanobanana-output/`、`~/Downloads/`、`~/Desktop/`

---

## 技術アーキテクチャ

### 主要コンポーネント

| ファイル | 役割 |
|---------|------|
| `index.ts` | MCP サーバー（`@modelcontextprotocol/sdk` 使用） |
| `imageGenerator.ts` | Gemini API との通信とレスポンス処理 |
| `fileHandler.ts` | ファイル I/O、スマートファイル名生成、ファイル検索 |
| `types.ts` | 共有 TypeScript インターフェース |

### MCP サーバープロトコル

- **プロトコル**: JSON-RPC over stdio
- **SDK**: `@modelcontextprotocol/sdk`
- **提供ツール**: `generate_image`, `edit_image`, `restore_image`

### API統合

- **デフォルトモデル**: `gemini-3.1-flash-image-preview`
- **SDK**: `@google/genai`
- **エラーハンドリング**: 包括的なエラーメッセージ、APIレスポンス解析のフォールバック、ファイルバリデーション

---

## トラブルシューティング

| 問題 | 解決策 |
|------|--------|
| コマンドが認識されない | `~/.gemini/extensions/nanobanana-extension/` にインストールされているか確認し、CLI を再起動 |
| API キーが見つからない | `export NANOBANANA_API_KEY="your-api-key-here"` を設定 |
| ビルド失敗 | Node.js 20+ を確認し、`npm run install-deps && npm run build` を実行 |
| 画像が見つからない | 入力ファイルが検索パス内にあるか確認 |

---

## 開発

```bash
npm run build          # MCPサーバーをビルド
npm run install-deps   # 依存関係をインストール
npm run dev            # ファイル監視付き開発モード
```

---

## 重要なポイント

- **MCP（Model Context Protocol）ベース**: Gemini CLIのエクステンションシステムに準拠した標準的なプロトコル実装であり、他のMCP対応ツールとの相互運用性がある
- **豊富なコマンド体系**: 単純な画像生成だけでなく、アイコン・パターン・ストーリーボード・技術ダイアグラムなど、用途別に最適化された7つのコマンドを提供
- **柔軟なモデル選択**: Flash（高速・デフォルト）、Pro（高品質）、v1（旧版）の3モデルから選択可能で、環境変数で簡単に切り替えられる
- **実用的なファイル管理**: プロンプトベースの自動ファイル名生成と重複防止機能により、大量の画像生成ワークフローでも整理された状態を維持できる
