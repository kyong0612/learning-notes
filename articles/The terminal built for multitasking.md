---
title: "The terminal built for multitasking"
source: "https://www.cmux.dev/"
author:
  - "[[manaflow-ai]]"
published:
created: 2026-02-22
description: "Ghosttyベースのネイティブ macOS ターミナルアプリ。AIコーディングエージェント向けに通知リング、縦タブ、分割ペイン、スクリプタブルなブラウザ、ソケットAPIを搭載。Claude Code、Codex、Gemini CLI など全てのCLIツールと連携可能。"
tags:
  - "clippings"
  - "terminal"
  - "macOS"
  - "ghostty"
  - "ai-coding-agent"
  - "developer-tools"
---

## 概要

**cmux** は、AIコーディングエージェントとの並列作業に特化したネイティブ macOS ターミナルアプリケーション。[libghostty](https://github.com/ghostty-org/ghostty) をレンダリングエンジンとして採用し、Swift + AppKit で構築されている（Electron不使用）。既存の Ghostty 設定ファイル（`~/.config/ghostty/config`）のテーマ・フォント・カラー設定をそのまま読み込める。

## 開発動機

作者は多数の Claude Code / Codex セッションを並列実行する中で、以下の課題に直面した：

- macOS のネイティブ通知はすべて「Claude is waiting for your input」で**コンテキストが分からない**
- タブが増えるとタイトルすら読めなくなる
- 既存のコーディングオーケストレーターは Electron/Tauri 製でパフォーマンスに不満
- GUI オーケストレーターはワークフローを固定してしまう

これらを解決するために、ターミナルの自由度を保ちつつ通知・マルチタスク管理を強化するアプリとして cmux が開発された。

## 主要機能

### 通知システム

- **通知リング**: エージェントが注意を必要とするとペインに青いリングが表示される
- **通知パネル**: 未読通知を一覧表示し、最新の未読にジャンプ可能（`⌘⇧U`）
- **タブバッジ**: サイドバーのタブにも未読バッジが表示される
- **macOS デスクトップ通知**にも対応
- ターミナルエスケープシーケンス（OSC 9/99/777）で自動発火、または `cmux notify` CLI や [Claude Code hooks](https://www.cmux.dev/docs/notifications) で手動トリガー可能

### 縦タブ（Vertical Tabs）

サイドバーに各ワークスペースの以下の情報を表示：

- **Git ブランチ名**
- **作業ディレクトリ**
- **リスニングポート**
- **最新の通知テキスト**

### 分割ペイン（Split Panes）

- 水平・垂直の分割に対応（`⌘D` / `⌘⇧D`）
- 方向キーによるペイン間フォーカス移動（`⌥⌘←→↑↓`）

### アプリ内ブラウザ

- ターミナルと並べてブラウザを分割表示（`⌘⇧L`）
- [agent-browser](https://github.com/vercel-labs/agent-browser) から移植された**スクリプタブル API** を搭載
- エージェントがアクセシビリティツリーのスナップショット取得、要素参照、クリック、フォーム入力、JavaScript 実行などを直接実行可能
- Claude Code がdev serverと直接やり取り可能

### スクリプタビリティ

- **CLI** と **ソケット API** で完全自動化
  - ワークスペース/タブの作成
  - ペインの分割
  - キーストロークの送信
  - ブラウザでの URL オープン

### その他の特徴

| 特徴 | 詳細 |
|---|---|
| ネイティブアプリ | Swift + AppKit、Electron不使用。高速起動・低メモリ |
| GPU アクセラレーション | libghostty によるスムーズなレンダリング |
| Ghostty 互換 | 既存の `~/.config/ghostty/config` を読み込み |
| 無料・オープンソース | AGPL-3.0-or-later ライセンス |

## 対応エージェント

ターミナルで動作するすべてのCLIツールと互換：

- Claude Code
- Codex
- OpenCode
- Gemini CLI
- Kiro
- Aider
- Goose
- Amp
- Cline
- Cursor Agent
- その他すべてのCLIツール

## tmux との比較

| | tmux | cmux |
|---|---|---|
| 種類 | ターミナルマルチプレクサ（任意のターミナル内で動作） | ネイティブ macOS GUI アプリ |
| UI | テキストベース | 縦タブ、分割ペイン、埋め込みブラウザ |
| 設定 | config ファイルとプレフィックスキーが必要 | 設定不要で即使用可能 |
| API | なし | ソケット API 搭載 |

## インストール

### DMG（推奨）

[ダウンロード](https://github.com/manaflow-ai/cmux/releases/latest/download/cmux-macos.dmg)して Applications フォルダにドラッグ。Sparkle による自動アップデート対応。

### Homebrew

```shell
brew tap manaflow-ai/cmux
brew install --cask cmux
```

## キーボードショートカット（抜粋）

| カテゴリ | ショートカット | 動作 |
|---|---|---|
| ワークスペース | `⌘N` | 新規ワークスペース |
| ワークスペース | `⌘1-8` | ワークスペースにジャンプ |
| サーフェス | `⌘T` | 新規サーフェス |
| 分割 | `⌘D` / `⌘⇧D` | 右に分割 / 下に分割 |
| ブラウザ | `⌘⇧L` | ブラウザを分割で開く |
| 通知 | `⌘I` | 通知パネル表示 |
| 通知 | `⌘⇧U` | 最新の未読にジャンプ |
| 検索 | `⌘F` | 検索 |

詳細は [キーボードショートカット一覧](https://www.cmux.dev/docs/keyboard-shortcuts) を参照。

## コミュニティの反応

- Ghostty の作者 **Mitchell Hashimoto** が「libghostty ベースのプロジェクト。縦タブ、通知、スクリプタブルブラウザを備えた macOS ターミナル」と紹介
- Hacker News ユーザーから「直感的で使いやすい」「ターミナルの縦タブは考えたことがなかった」と好評

## リンク

- [公式サイト](https://www.cmux.dev/)
- [GitHub](https://github.com/manaflow-ai/cmux)（⭐ 1,200+）
- [Discord](https://discord.gg/xsgFEVrWCZ)
- [デモ動画](https://www.youtube.com/watch?v=i-WxO5YUTOs)
