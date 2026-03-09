---
title: "110y/muxac: Multiplexer for Agentic Coding tools"
source: "https://github.com/110y/muxac"
author:
  - "[[110y]]"
published: 2026-03-06
created: 2026-03-09
description: "tmuxを活用してAgentic Codingツール（Claude Code等）の複数セッションを管理するマルチプレクサ。セッションの作成・一覧・アタッチの3つのプリミティブを提供し、fzfやNeovimと組み合わせたダッシュボード構築も可能。"
tags:
  - "clippings"
  - "agentic-coding"
  - "tmux"
  - "cli-tool"
  - "claude-code"
  - "golang"
---

## 概要

`muxac` は **Agentic Codingツールのセッションを管理するマルチプレクサ**。tmuxをバックエンドとして利用し、Claude Codeなどのエージェント型コーディングツールの複数セッションを効率的に切り替え・監視できる。

Go言語で実装されており、MITライセンスで公開されている。

## 3つのプリミティブ機能

| コマンド | 機能 |
|---|---|
| `muxac new` | 新しいセッションを作成し、指定したAgenticツールを起動 |
| `muxac list` | すべてのセッションとそのステータスを一覧表示 |
| `muxac attach` | 既存のセッションにアタッチ |

これらのプリミティブを組み合わせることで、ダッシュボードやカスタムUIを構築できる。作者自身は [fzf](https://github.com/junegunn/fzf) と [Neovim](https://github.com/neovim/neovim) と組み合わせて、Claude Codeのセッション間をプレビューしながら切り替える運用をしている。

## セッションステータス

| Status | 説明 |
|--------|------|
| `running` | エージェントがアクティブに処理中 |
| `waiting` | エージェントがユーザーの応答を待機中 |
| `stopped` | エージェントが停止またはセッションがアイドル状態 |

## 使い方の例

```bash
# 現在のディレクトリに対して claude コマンドで新しいセッションを作成
$ muxac new claude

# Ctrl+b d でセッションからデタッチ

# すべてのセッションを一覧表示
$ muxac list
DIRECTORY               NAME     STATUS
/path/to/workspace-1    default  running
/path/to/workspace-2    foo      waiting
/path/to/workspace-3    bar      stopped

# 現在のディレクトリの既存セッションにアタッチ
$ muxac attach
```

## コマンドリファレンス

### `muxac new`

tmuxセッションを作成し、指定したAgenticツールを起動する。

```bash
$ muxac new [--name <name>] [--dir <path>] [--env KEY=VALUE ...] [--tmux-conf <path>] <command>
```

| フラグ | 説明 |
|--------|------|
| `--name <name>` | セッション名（デフォルト: `default`） |
| `--dir <path>` | 作業ディレクトリ（デフォルト: カレントディレクトリ） |
| `--env KEY=VALUE` | セッションに渡す環境変数（複数指定可） |
| `--tmux-conf <path>` | セッション作成後に読み込むtmux設定ファイルのパス |

### `muxac list`

すべてのmuxacセッションをステータス付きで一覧表示する。

```bash
$ muxac list [--no-header] [--json]
```

| フラグ | 説明 |
|--------|------|
| `--no-header` | ヘッダー行を省略 |
| `--json` | JSON形式で出力 |

### `muxac attach`

既存のtmuxセッションにアタッチする。

```bash
$ muxac attach [--name <name>] [--dir <path>]
```

| フラグ | 説明 |
|--------|------|
| `--name <name>` | セッション名（デフォルト: `default`） |
| `--dir <path>` | 作業ディレクトリ（デフォルト: カレントディレクトリ） |

## インストールと設定

### 前提条件

- [tmux](https://github.com/tmux/tmux) が必要

### インストール

[リリースページ](https://github.com/110y/muxac/releases)からバイナリをダウンロード。

### Claude Code との連携設定

`~/.claude/settings.json` に以下のhook設定を追加することで、Claude Codeのライフサイクルイベント（ツール使用前後、停止、プロンプト送信、セッション開始/終了、権限リクエスト）に `muxac hook` を連携させ、セッションステータスを自動更新できる。

対象フック:
- `PreToolUse` / `PostToolUse`
- `Stop`
- `UserPromptSubmit`
- `SessionStart` / `SessionEnd`
- `PermissionRequest`

```json
{
  "hooks": {
    "PreToolUse": [{ "matcher": "", "hooks": [{ "type": "command", "command": "muxac hook" }] }],
    "PostToolUse": [{ "matcher": "", "hooks": [{ "type": "command", "command": "muxac hook" }] }],
    "Stop": [{ "matcher": "", "hooks": [{ "type": "command", "command": "muxac hook" }] }],
    "UserPromptSubmit": [{ "matcher": "", "hooks": [{ "type": "command", "command": "muxac hook" }] }],
    "SessionStart": [{ "matcher": "", "hooks": [{ "type": "command", "command": "muxac hook" }] }],
    "SessionEnd": [{ "matcher": "", "hooks": [{ "type": "command", "command": "muxac hook" }] }],
    "PermissionRequest": [{ "matcher": "", "hooks": [{ "type": "command", "command": "muxac hook" }] }]
  }
}
```

## 対応ツールの状況

| ツール | 対応状況 |
|--------|----------|
| Claude Code | 対応済み |
| Codex | 未対応（近日対応予定） |
| Gemini CLI | 未対応（近日対応予定） |
| GitHub Copilot CLI | 未対応（近日対応予定） |
| OpenCode | 未対応（近日対応予定） |

## 注目ポイント

- **シンプルな設計思想**: 3つのプリミティブコマンドのみで構成され、ユーザーが自由にワークフローを構築できる
- **tmuxベース**: 既存のtmuxインフラを活用するため、追加の複雑な依存が不要
- **hook連携**: Claude Codeのhook機構と連携し、エージェントの状態（running/waiting/stopped）をリアルタイムに追跡
- **拡張性**: JSON出力対応により、カスタムダッシュボードやUI構築が容易
- **現時点ではClaude Code専用**だが、Codex、Gemini CLI、GitHub Copilot CLI、OpenCodeへの対応も予定されている
