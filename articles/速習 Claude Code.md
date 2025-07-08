---
title: "速習 Claude Code"
source: "https://zenn.dev/mizchi/articles/claude-code-cheatsheet"
author:
  - "mizchi"
published: 2025-07-07
created: 2025-07-08
description: |
  講習会用にまとめたもの。可能なら公式ドキュメントを参照するのを推奨するが、この資料ではサッと使いはじめるために要点を絞って解説する。
tags:
  - "AI"
  - "Claude Code"
  - "tech"
---

# 速習 Claude Code

この記事は、AnthropicのAIコーディングアシスタント「Claude Code」を迅速に使い始めるための要点をまとめたものです。公式ドキュメントの補完として、主要な機能に絞って解説されています。

> **注意**: Claude Codeは自身で開発されており、非常に速いペースで更新されるため、この資料の情報はすぐに古くなる可能性があります。最新情報は[公式ドキュメント](https://docs.anthropic.com/ja/docs/welcome)を参照してください。

## インストールと実行

`claude-code` はnpmを通じてグローバルにインストールします。

```bash
$ npm i -g @anthropic-ai/claude-code
$ claude
# 初回セットアップ（トークン等）
```

## セッションの管理

基本的な対話は `claude` コマンドで開始します。

```bash
$ claude
> hello
こんにちは！どのようなお手伝いをしましょうか？
# Ctrl-C で終了
```

デフォルトでは会話履歴は保存されませんが、`-c` オプションで直近のセッションを再開できます。

```bash
claude -c
```

特定のセッションに戻りたい場合は `-r` (`--resume`) を使用します。

```bash
$ claude -r
    Modified    Created     # Messages Summary
❯ 1. 1m ago      1m ago               2 hello
```

## セキュリティ

デフォルトのパーミッションは `~/.claude/settings.json` で設定できます。これにより、特定のコマンドの実行を許可または拒否できます。

```json
{
  "permissions": {
    "allow": ["Bash(npm run lint)", "Bash(npm run test:*)", "Read(~/.zshrc)"],
    "deny": ["Bash(curl:*)"]
  }
}
```

セッション中には `<Shift+TAB>` で動作モードを切り替え可能です。

* `⏵⏵ auto-accept edits on`: 許可済みのコマンドを自動で実行するモード。
* `⏸ plan mode on`: ファイルを編集せず、読み取り専用で設計を行うモード。
* `Bypassing Permissions`: `--allow-dangerously-permissions` フラグで起動した場合の全許可モード（**危険**）。

## よく使うコマンド

* `/model [Opus|Sonnet]`: 使用するAIモデルを指定します。`Opus` は高性能ですが、トークン消費が約5倍になります。
* `/clear`: 会話履歴をリセットします。AIが予期せぬ動作を始めた際に有効です。
* `/compact`: セッションの会話を要約し、コンテキストを圧縮します。履歴が長くなると自動的に実行されることもあります。
* `@/`: ファイル名を補完入力できます。
* `! <command>`: AIを介さずにシェルコマンドを直接実行します。
* `# <text>`: 入力した内容を動的に `CLAUDE.md` に追記します。
* `think`, `think hard`, `ultrathink`: プロンプトに含めると、AIがより深く思考するReasoningモードになります。トークンと時間を多く消費するため、難解な問題に直面した際に使用します。

## メモリの管理: CLAUDE.md

Claude Codeは以下のファイルから設定を読み込み、動作の前提とします。

* `~/.claude/CLAUDE.md`: グローバルな設定。常に読み込まれます。（例: `ユーザーには日本語で応答してください。`）
* `./CLAUDE.md`: プロジェクト固有の設定。実行ディレクトリで読み込まれます。（例: `このプロジェクトでは npm と typescript と vitest を使う`）

`/memory` コマンドで現在読み込まれているメモリを確認・編集できます。

## MCP (Multi-Claude-Agent Protocol) の設定

`claude mcp` コマンドで、AIが利用できる外部ツール（MCPサーバー）を追加・管理できます。

```bash
claude mcp add playwright-mcp npx -- -y @playwright/mcp@latest
```

設定は `.mcp.json` ファイルでも管理できますが、既存のプロジェクト設定との競合に注意が必要です。`/mcp` コマンドで現在接続されているツールを確認できます。

## レートリミットの体感値

Claude Codeを多用すると、APIのレートリミットに達することがあります。著者の経験では、$200プランで3セッションを並列使用していると、5時間あたり約1時間は利用制限により待機状態になることがあるようです。

---

この記事では、基本的なコマンドと設定に焦点を当てており、プロンプトの書き方については触れられていません。それらは実践を通じて習得することが推奨されています。
