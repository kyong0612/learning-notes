---
title: "vercel-labs/webreel: Record scripted browser demos as video"
source: "https://github.com/vercel-labs/webreel?tab=readme-ov-file"
author:
  - "[[ctate]]"
  - "[[vercel-labs]]"
published: 2026-02-27
created: 2026-03-03
description: "JSON設定ファイルでブラウザ操作を定義し、ヘッドレスChromeで実行・キャプチャして、カーソルアニメーション・効果音・キーストロークオーバーレイ付きのMP4動画を自動生成するCLIツール。"
tags:
  - "clippings"
  - "browser-automation"
  - "video-recording"
  - "cli"
  - "typescript"
  - "vercel"
---

## 概要

**webreel** は、スクリプト化されたブラウザデモをMP4動画として録画するためのCLIツール。JSON設定ファイルにステップ（クリック、キー入力、ドラッグ、一時停止など）を定義すると、ヘッドレスChromeを駆動し、約60fpsでスクリーンショットをキャプチャし、ffmpegでエンコードする。効果音、カーソルアニメーション、キーストロークオーバーレイが自動的に付与される。

- **リポジトリ**: [vercel-labs/webreel](https://github.com/vercel-labs/webreel)
- **ドキュメント**: [webreel.dev](https://webreel.dev)
- **ライセンス**: Apache-2.0
- **言語**: TypeScript
- **Stars**: 389 / **Forks**: 15（2026-03-03時点）

ChromeとffmpegはNaNに初回実行時に `~/.webreel` へ自動ダウンロードされる。

## クイックスタート

```bash
npm install webreel
npx webreel init --name my-video --url https://example.com
npx webreel record
```

## CLIコマンド

| コマンド | 説明 |
|---|---|
| `webreel init` | 新しい設定ファイルをスキャフォールド |
| `webreel record` | 動画を録画（`--watch` でファイル監視モード） |
| `webreel preview` | 録画せずにブラウザで動画をプレビュー |
| `webreel composite` | 保存済みの生録画データから再合成（再録画不要） |
| `webreel install` | Chromeとffmpegをダウンロード（`--force` で再取得） |
| `webreel validate` | 設定ファイルのエラーチェック |

## 設定ファイル構造

`webreel init` で生成される `webreel.config.json` はIDEオートコンプリート用の `$schema` を含む：

```json
{
  "$schema": "https://webreel.dev/schema/v1.json",
  "videos": {
    "my-video": {
      "url": "https://example.com",
      "viewport": { "width": 1080, "height": 1080 },
      "defaultDelay": 500,
      "steps": [
        { "action": "pause", "ms": 500 },
        { "action": "click", "text": "Get Started" },
        { "action": "key", "key": "cmd+a", "delay": 1000 }
      ]
    }
  }
}
```

### トップレベル設定

| フィールド | デフォルト | 説明 |
|---|---|---|
| `$schema` | - | IDEオートコンプリート用JSON Schema URL |
| `outDir` | `videos/` | 動画の出力ディレクトリ |
| `baseUrl` | `""` | 相対URLに前置されるベースURL |
| `viewport` | 1080x1080 | デフォルトのブラウザビューポートサイズ |
| `theme` | - | カーソルとHUDオーバーレイのカスタマイズ |
| `include` | - | 全動画に前置されるステップファイルの配列 |
| `defaultDelay` | - | 各ステップ後のデフォルト遅延（ms） |
| `videos` | 必須 | 動画名と設定のマッピング |

### 動画単位の設定

| フィールド | デフォルト | 説明 |
|---|---|---|
| `url` | 必須 | ナビゲート先URL |
| `baseUrl` | 継承 | 相対URLに前置されるベースURL |
| `viewport` | 継承 | ブラウザビューポートサイズ |
| `zoom` | - | ページに適用するCSSズームレベル |
| `waitFor` | - | 開始前に待機するCSSセレクタ |
| `output` | `.mp4` | 出力ファイルパス（.mp4, .gif, .webm） |
| `thumbnail` | `{ time: 0 }` | サムネイル設定（`enabled: false` で無効化） |
| `include` | 継承 | 前置されるステップファイル |
| `theme` | 継承 | カーソル・HUDオーバーレイのカスタマイズ |
| `defaultDelay` | 継承 | 各ステップ後のデフォルト遅延（ms） |

## アクション一覧

| アクション | フィールド | 説明 |
|---|---|---|
| `pause` | `ms` | 指定時間待機 |
| `click` | `text` or `selector`, optional `within`, `modifiers` | 要素にカーソル移動してクリック |
| `key` | `key` (例: `"cmd+z"`), optional `label` | キーまたはキーコンボを押下 |
| `type` | `text`, optional `target`, `charDelay` | テキストを1文字ずつタイプ |
| `scroll` | optional `x`, `y`, `selector` | ページまたは要素をスクロール |
| `wait` | `selector` or `text`, optional `timeout` | 要素の出現を待機 |
| `screenshot` | `output` | PNGスクリーンショットをキャプチャ |
| `drag` | `from` and `to` | 要素をドラッグ |
| `moveTo` | `text` or `selector`, optional `within` | 要素にカーソル移動 |
| `navigate` | `url` | 動画途中で別URLへ遷移 |
| `hover` | `text` or `selector`, optional `within` | 要素にホバー（CSS :hover発火） |
| `select` | `selector`, `value` | ドロップダウンの値を選択 |

`pause` を除く全ステップでオプショナルの `delay` フィールド（ステップ後の待機ms）を指定可能。

## サンプル集

| 名前 | 説明 |
|---|---|
| **hello-world** | 最もシンプルな例。LPを開いてCTAボタンをクリック |
| **form-filling** | フォーム入力とsubmitボタンクリック（ログインフロー） |
| **drag-and-drop** | カンバンボード上で要素をドラッグ |
| **keyboard-shortcuts** | キーコンボの押下とHUDオーバーレイ表示 |
| **custom-theme** | カーソルオーバーレイ・HUDの外観を完全カスタマイズ |
| **mobile-viewport** | モバイルデバイスサイズで録画 |
| **modifier-clicks** | 修飾キー付きクリック（ファイルマネージャの複数選択） |
| **multi-demo** | 1つの設定ファイルから複数動画を生成 |
| **page-scrolling** | ページ・コンテナ要素のスクロール |
| **screenshots** | 録画中にPNGスクリーンショットをキャプチャ |
| **shared-steps** | `include` で共通セットアップステップを共有 |
| **gif-output** | MP4の代わりにアニメーションGIFとして出力 |
| **webm-output** | VP9エンコーディングでWebMとして出力 |

## パッケージ構成

| パッケージ | 説明 |
|---|---|
| `@webreel/core` | Chrome自動化、録画、オーバーレイ |
| `webreel` | JSON設定から動画を録画するCLI |

## 開発環境

- Node.js v18+
- pnpm

```bash
pnpm install
pnpm build
```

## 主要な特徴と発見

- **宣言的な動画作成**: コードを書かずにJSON設定だけでブラウザデモ動画を生成できる
- **豊富なアクション**: クリック、タイプ、ドラッグ、スクロール、キーボードショートカット、ホバーなど12種類のアクションをサポート
- **複数出力形式**: MP4（デフォルト）、GIF、WebM（VP9）に対応
- **自動依存解決**: Chrome・ffmpegを初回実行時に自動ダウンロード
- **リッチなオーバーレイ**: カーソルアニメーション、キーストロークHUD、効果音が自動付与され、テーマによるカスタマイズも可能
- **再合成機能**: `composite` コマンドにより、再録画せずにオーバーレイの変更や再エンコードが可能
- **共有ステップ**: `include` 機能で複数動画間でセットアップ手順を共有
- **スクリーンショット対応**: 動画録画中に任意のタイミングでPNGスクリーンショットをキャプチャでき、マーケティング素材やドキュメント画像の生成にも活用可能
