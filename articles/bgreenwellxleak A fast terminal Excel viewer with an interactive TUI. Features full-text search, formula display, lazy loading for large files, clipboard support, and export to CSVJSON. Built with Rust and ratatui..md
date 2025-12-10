---
title: "bgreenwell/xleak: A fast terminal Excel viewer with an interactive TUI. Features full-text search, formula display, lazy loading for large files, clipboard support, and export to CSV/JSON. Built with Rust and ratatui."
source: "https://github.com/bgreenwell/xleak"
author:
  - "Brandon Greenwell"
published: 2025-12-04
created: 2025-12-10
description: "xleak は Rust で構築された高速なターミナル Excel ビューワーで、ratatui を使用したインタラクティブな TUI を提供します。全文検索、数式表示、大規模ファイルの遅延読み込み、クリップボードサポート、CSV/JSON へのエクスポート機能を備えています。"
tags:
  - "rust"
  - "cli"
  - "excel"
  - "tui"
  - "ratatui"
  - "spreadsheet"
---

## 概要

**xleak** は、Microsoft Excel を必要とせずにターミナルで Excel ファイルを表示・操作できる高速なビューワーです。Rust で構築され、ratatui フレームワークを使用したインタラクティブな TUI（Terminal User Interface）を提供します。

## 主な機能

### コア機能

| 機能 | 説明 |
|------|------|
| **美しいターミナルレンダリング** | フォーマットされたテーブルで表示 |
| **インタラクティブ TUI モード** | ratatui による完全なキーボードナビゲーション |
| **スマートなデータ型処理** | 数値は右揃え、テキストは左揃え、ブール値は中央揃え |
| **マルチシートサポート** | Tab/Shift+Tab でシート間をシームレスに移動 |
| **Excel テーブルサポート** | 名前付きテーブルの一覧表示と抽出（.xlsx のみ） |
| **複数のエクスポート形式** | CSV、JSON、プレーンテキスト |
| **高速処理** | Rust 最速の Excel パーサー `calamine` を使用 |
| **複数ファイル形式対応** | `.xlsx`, `.xls`, `.xlsm`, `.xlsb`, `.ods` |

### インタラクティブ TUI 機能

- **全文検索**: `/` で全セルを検索、`n`/`N` で結果間を移動
- **クリップボードサポート**: `c` でセル、`C` で行全体をコピー
- **数式表示**: Enter キーでセル詳細ビューに数式を表示
- **行/列へのジャンプ**: `Ctrl+G` で任意のセルへ移動（例: `A100`, `500`, `10,5`）
- **大規模ファイル最適化**: 1000行以上のファイルで遅延読み込み
- **進捗インジケーター**: 長時間操作のリアルタイムフィードバック
- **視覚的なセルハイライト**: 現在の行、列、セルを明確に表示

## インストール方法

### パッケージマネージャー

```bash
# macOS / Linux (Homebrew)
brew install bgreenwell/tap/xleak

# Windows (Scoop)
scoop bucket add bgreenwell https://github.com/bgreenwell/scoop-bucket
scoop install xleak

# Arch Linux (AUR)
yay -S xleak-bin

# Cargo (全プラットフォーム)
cargo install xleak

# Nix
nix run github:bgreenwell/xleak -- file.xlsx
```

### クイックインストールスクリプト

```bash
# macOS / Linux
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/bgreenwell/xleak/releases/latest/download/xleak-installer.sh | sh

# Windows (PowerShell)
irm https://github.com/bgreenwell/xleak/releases/latest/download/xleak-installer.ps1 | iex
```

### ビルド要件

- Rust 1.70 以降

## 使用方法

### インタラクティブ TUI モード（推奨）

```bash
# インタラクティブビューワーを起動
xleak quarterly-report.xlsx -i

# 特定のシートから開始
xleak report.xlsx --sheet "Q3 Results" -i

# デフォルトで数式を表示
xleak data.xlsx -i --formulas

# 横スクロールを有効化（列幅自動調整）
xleak wide-data.xlsx -i -H
```

### TUI キーボードショートカット

| キー | 機能 |
|------|------|
| `↑ ↓ ← →` | セル移動 |
| `Enter` | セル詳細表示（数式含む） |
| `/` | 全セル検索 |
| `n` / `N` | 次/前の検索結果へ |
| `Ctrl+G` | 特定の行/セルへジャンプ |
| `c` | 現在のセルをクリップボードにコピー |
| `C` | 行全体をクリップボードにコピー |
| `Tab` / `Shift+Tab` | シート切り替え |
| `t` | テーマ切り替え |
| `?` | ヘルプ表示 |
| `q` | 終了 |

### 非インタラクティブモード

```bash
# スプレッドシートを表示
xleak quarterly-report.xlsx

# 特定のシートを表示
xleak report.xlsx --sheet "Q3 Results"

# 表示行数を制限
xleak large-file.xlsx -n 20

# CSV へエクスポート
xleak data.xlsx --export csv > output.csv

# JSON へエクスポート
xleak data.xlsx --export json > output.json

# Excel テーブルの一覧表示
xleak workbook.xlsx --list-tables

# 特定のテーブルを抽出
xleak workbook.xlsx --table "Sales" --export csv > sales.csv
```

## 設定

### 設定ファイルの場所

- **デフォルト**: `~/.config/xleak/config.toml`
- **macOS**: `~/Library/Application Support/xleak/config.toml`
- **Windows**: `%APPDATA%\xleak\config.toml`

### 設定例

```toml
[theme]
default = "Dracula"

[ui]
max_rows = 50
column_width = 30

[keybindings]
profile = "vim"
```

### 利用可能なテーマ

- `Default` - クリーンなライトテーマ
- `Dracula` - 紫のアクセントを持つダークテーマ
- `Solarized Dark` / `Solarized Light`
- `GitHub Dark`
- `Nord` - 北欧風の青みがかった配色

### キーバインディングプロファイル

- **default**: 標準的なターミナルアプリケーション用
- **vim**: VIM スタイルのナビゲーション（`h`/`j`/`k`/`l` など）

## パフォーマンス

| ファイルサイズ | 動作 |
|--------------|------|
| **1000行未満** | 即時読み込み（フル eager loading） |
| **1000行以上** | 自動遅延読み込み + 行キャッシュ |

- メモリ使用量: 10,000行ファイルで約400KB
- 可視行のみをオンデマンドで読み込み
- 長時間操作の進捗インジケーター

## 他ツールとの比較

| ツール | 形式 | 速度 | ターミナルネイティブ | インタラクティブ | 検索 | 数式 |
|--------|------|------|-------------------|----------------|------|------|
| **xleak** | ✅ xlsx/xls/ods | ⚡ 高速 | ✅ | ✅ | ✅ | ✅ |
| Excel | ✅ xlsx | ❌ 起動遅い | ❌ GUI のみ | ✅ | ✅ | ✅ |
| pandas | ✅ 多数 | ❌ 遅い | ❌ Python 必要 | ❌ | ❌ | ❌ |
| csvlook | ❌ CSV のみ | ✅ 高速 | ✅ | ❌ | ❌ | ❌ |

## 技術スタック

- **Rust** - パフォーマンスと信頼性
- **calamine** - 最速の Excel/ODS パーサー
- **ratatui** - ターミナル UI フレームワーク
- **prettytable-rs** - 美しいターミナルテーブル
- **clap** - CLI 引数パーサー
- **arboard** - クロスプラットフォームクリップボードサポート

## 関連プロジェクト

- **[doxx](https://github.com/bgreenwell/doxx)** - 同じ作者による `.docx` ファイルのターミナルビューワー

## ライセンス

MIT License

## リポジトリ情報

- **Stars**: 949
- **Forks**: 39
- **最新バージョン**: v0.2.5 (2025-12-04)
- **言語構成**: Rust 97.0%, Nix 3.0%
