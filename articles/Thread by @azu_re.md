---
title: "Thread by @azu_re"
source: "https://x.com/azu_re/status/2025072220004122648?s=12"
author:
  - "[[@azu_re]]"
published: 2026-02-21
created: 2026-02-22
description: "ウェブアプリのフロントエンド開発をClaude Desktop Preview（Claude Code local）に完全移行した経験と、launch.json・autoPort・worktreesの設定ポイントについてのスレッド"
tags:
  - "clippings"
  - "Claude Code"
  - "Claude Desktop"
  - "フロントエンド開発"
  - "Git Worktrees"
---

## 概要

azu氏が、ウェブアプリのフロントエンド開発環境をClaude Desktop Preview（Claude Code local）に完全移行した過程を報告したスレッド。移行にあたって対応が必要な3つの要素（`launch.json`、`autoPort`、`.claude/worktrees`）と、実際の使用感について述べている。

## スレッド内容

### 1. 移行の動機と必要な対応

> ウェブアプリのフロントの開発はClaude DesktopのClaude Code(local)に乗った方が便利そうなので、全部移行してる

移行にあたり、以下の3つの対応が必要：

- **`launch.json` の対応** — Claude Desktopのプレビュー機能で使用する開発サーバーの設定ファイル（`.claude/launch.json`）。`runtimeExecutable`、`runtimeArgs`、`port` などを指定してプレビューサーバーを構成する
- **`autoPort` の対応** — ポート競合時の自動ポート割り当て機能。`launch.json` 内で `"autoPort": true` に設定すると、指定ポートが使用中の場合に空きポートを自動的に見つけて使用する
- **`.claude/worktrees` の対応** — Git worktreeによるセッション分離。Claude Desktopで複数セッションを並行して実行する際、各セッションが独立したworktreeで動作する

これらを対応すれば、**タスクごとにプレビューを確認しながら同時に複数タスクを操作できる**状態になる。

### 2. プレビュー機能の実用性

> 起動とスクショをとるとかができるのでdevTools使うようなもの以外は結構いけそうな気がする。

Claude Desktopのプレビュー機能は、開発サーバーの起動やスクリーンショットの取得が可能であり、DevToolsを必要とする操作以外は十分に対応できるとの評価。

ただし、**背景色が透過になる問題**が発生しているとの報告あり。

### 3. 移行完了と autoPort の挙動

> Claude Desktop Previewに全部移行できた。

移行は無事完了。`autoPort` の挙動については以下の所見：

- **挙動が不明確** — 複数タスクを同時に動かさないと検証が難しい
- **実用上は問題なし** — すでにポートで起動しているサーバーがある場合、自動的に終了してから起動し直してくれるため、人間が確認するだけなら特に気にする必要はない

## 技術的背景

### Claude Desktop Preview の主な機能

| 機能 | 説明 |
|---|---|
| ライブプレビュー | 内蔵ブラウザで開発サーバーの出力を確認可能 |
| 並行セッション | Git worktreeによるセッション分離で複数タスクを同時実行 |
| 自動検証 | コード編集後にスクリーンショット取得・DOM検査を自動実行 |
| ビジュアルdiffレビュー | ファイル単位の変更差分をインラインで確認 |

### launch.json の設定例

```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "my-app",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "port": 3000,
      "autoPort": true
    }
  ]
}
```

### autoPort の動作仕様

- **未設定（デフォルト）**: サーバーにそのポートが必要かどうかをClaudeが確認し、回答を保存
- **`false`**: 指定ポートが使用中の場合エラー（OAuthコールバックやCORS設定など、固定ポートが必要な場合）
- **`true`**: 空きポートを自動的に見つけて使用（`PORT` 環境変数経由でサーバーに渡される）

## 関連リンク

- [design-loop](https://github.com/azu/design-loop) — azu氏が開発した、Claude Codeのブラウザベースフロントエンド。ターミナルやエディタなしでウェブサイトを視覚的に編集できるツール
- [Claude Code Desktop ドキュメント](https://code.claude.com/docs/en/desktop) — Claude Desktop Preview の公式ドキュメント
