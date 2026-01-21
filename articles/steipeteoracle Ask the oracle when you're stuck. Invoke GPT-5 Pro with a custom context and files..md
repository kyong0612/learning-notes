---
title: "steipete/oracle: Ask the oracle when you're stuck. Invoke GPT-5 Pro with a custom context and files."
source: "https://github.com/steipete/oracle"
author:
  - "[[steipete]]"
published: 2025-11-14
created: 2026-01-21
description: "プロンプトとソースファイルをバンドルし、GPT-5 Pro などの AI モデルに文脈付きで質問できる CLI ツール"
tags:
  - "clippings"
  - "AI"
  - "GPT"
  - "CLI"
  - "developer-tools"
  - "LLM"
  - "openai"
  - "anthropic"
  - "gemini"
  - "MCP"
  - "browser-automation"
  - "openrouter"
---

## 概要

Oracle は、プロンプトとファイルをバンドルして AI モデル（GPT-5 Pro、Gemini 3 Pro、Claude Sonnet 4.5、Claude Opus 4.1 など）に文脈付きで質問できる CLI ツール。API モードとブラウザ自動化モードの両方をサポートし、複数モデルへの同時クエリも可能。

## 主な特徴

- **マルチモデル対応**: GPT-5.1 Pro（デフォルト）、GPT-5.1 Codex、GPT-5.2、Gemini 3 Pro、Claude Sonnet 4.5、Claude Opus 4.1、および OpenRouter 経由の任意のモデル
- **2つの実行エンジン**: API モード（推奨）とブラウザ自動化モード
- **マルチモデル同時実行**: 複数モデルに一度にクエリを送信し、コスト/使用量を集計
- **セッション管理**: 過去のセッションを保存・再生可能（`oracle status`、`oracle session <id>`）
- **MCP サーバー対応**: `oracle-mcp` で stdio サーバーとして実行可能
- **リモートブラウザサービス**: `oracle serve` でホストを起動し、クライアントから接続
- **Azure/OpenRouter 対応**: カスタムエンドポイントの設定が可能

## インストール

```bash
# npm でグローバルインストール
npm install -g @steipete/oracle

# Homebrew（macOS）
brew install steipete/tap/oracle

# npx で直接実行（Node 22+ 必須）
npx -y @steipete/oracle …
```

## 基本的な使い方

### コピー＆ペースト用バンドル作成
```bash
npx -y @steipete/oracle --render --copy -p "Review the TS data layer for schema drift" --file "src/**/*.ts,*/*.test.ts"
```

### API モード（OPENAI_API_KEY 必要）
```bash
npx -y @steipete/oracle -p "Write a concise architecture note" --file src/storage/README.md
```

### マルチモデル実行
```bash
npx -y @steipete/oracle -p "Cross-check the data layer assumptions" --models gpt-5.1-pro,gemini-3-pro --file "src/**/*.ts"
```

### ブラウザモード（API キー不要）
```bash
npx -y @steipete/oracle --engine browser -p "Walk through the UI smoke test" --file "src/**/*.ts"
```

### ドライラン（トークン消費なしでプレビュー）
```bash
npx -y @steipete/oracle --dry-run summary -p "Check release notes" --file docs/release-notes.md
```

### TUI（対話モード）
```bash
npx -y @steipete/oracle tui
```

## 主要フラグ

| フラグ | 説明 |
|--------|------|
| `-p, --prompt <text>` | プロンプト（必須） |
| `-f, --file <paths...>` | 添付するファイル/ディレクトリ（glob 対応） |
| `-e, --engine <api\|browser>` | API またはブラウザエンジンを選択 |
| `-m, --model <name>` | 使用するモデル |
| `--models <list>` | カンマ区切りで複数モデル指定 |
| `--render, --copy` | バンドルを出力/クリップボードにコピー |
| `--wait` | バックグラウンド実行をブロック |
| `--dry-run [summary\|json\|full]` | プレビュー（送信なし） |
| `--files-report` | ファイルごとのトークン使用量を表示 |

## 設定ファイル

`~/.oracle/config.json`（JSON5 形式）にデフォルト設定を記述可能：

```json
{
  "model": "gpt-5.1-pro",
  "engine": "api",
  "filesReport": true,
  "browser": {
    "chatgptUrl": "https://chatgpt.com/g/g-p-.../project"
  }
}
```

## 環境変数

- `OPENAI_API_KEY`: GPT-5.x 用
- `GEMINI_API_KEY`: Gemini 3 Pro 用
- `ANTHROPIC_API_KEY`: Claude Sonnet 4.5 / Opus 4.1 用
- `ORACLE_HOME_DIR`: セッションログの保存先（デフォルト `~/.oracle/sessions`）

## MCP 統合

```bash
# stdio サーバーとして起動
npx -y @steipete/oracle oracle-mcp
```

Cursor の `.cursor/mcp.json` 設定例：
```json
{
  "oracle": {
    "command": "oracle-mcp",
    "args": []
  }
}
```

## プラットフォーム対応

- **macOS**: 安定動作
- **Linux**: `--browser-chrome-path`/`--browser-cookie-path` が必要な場合あり
- **Windows**: `--browser-manual-login` またはインラインクッキー推奨

## 技術スタック

- TypeScript 95.0%
- JavaScript 4.2%
- Shell 0.8%
- ライセンス: MIT

## 関連リンク

- 公式サイト: https://askoracle.dev
- npm パッケージ: [@steipete/oracle](https://www.npmjs.com/package/@steipete/oracle)
