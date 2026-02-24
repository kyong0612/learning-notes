---
title: "Claude Code on the web / on desktop 向けの設定をした"
source: "https://yaakai.to/blog/2026/setup-claude-code-on-the-web-desktop-worktree"
author:
  - "[[yaakai.to]]"
published: 2026-02-21
created: 2026-02-25
description: "Claude Code の on the web / on desktop / worktree まわりの設定・運用をまとめた備忘録。GitHub アカウントの分離、DevContainer への SSH 接続、SessionStart hooks による依存インストール、.worktreeinclude の活用、PR フォーマットのカスタマイズなど実践的な Tips を紹介している。"
tags:
  - "clippings"
  - "Claude Code"
  - "DevContainer"
  - "worktree"
  - "開発環境"
  - "AI開発ツール"
---

## 概要

2026年2月時点での Claude Code on the web / on desktop / worktree まわりの設定・運用の備忘録。`claude -w` と Previews が導入されたタイミングでの記録であり、情報の鮮度には注意が必要。

**前提**: 特別な設定なしでも on the web はある程度動作し、調査タスクや bugfix 程度なら十分にワークする。on the web と on desktop は同じ UI から利用できるが、中身は別物で有効な設定も異なる。

---

## 連携する GitHub アカウントを分ける

on the web では、メインの GitHub アカウントに Claude Code に触ってほしくないリポジトリが含まれる可能性があり、また UI に無数のリポジトリが表示されると扱いづらいため、**専用の GitHub ユーザーを作成**し、必要なリポジトリだけにアクセス権を与えて使用している。

切り替えは Claude と連携している GitHub アカウントを変更するだけで OK。著者は [Issue 経由での開発フロー](https://yaakai.to/blog/2025/issue-driven-workflow-with-claude-and-coderabbit) で使っているユーザーをそのまま流用している。

---

## DevContainer に SSH する

OrbStack + DevContainer で開発しているため、on desktop の SSH 接続を活用する。`ghcr.io/devcontainers/features/sshd` を使い DevContainer 内で sshd を起動する。

**devcontainer.json の設定（抜粋）:**

```json
{
    "postCreateCommand": ".devcontainer/setup.sh",
    "features": {
        "ghcr.io/devcontainers/features/sshd:1": {}
    },
    "mounts": [
        "source=${localEnv:HOME}/.ssh/id_rsa.pub,target=/home/vscode/.ssh-host-authorized_keys,type=bind,readonly"
    ]
}
```

**setup.sh:**

```bash
if [ -z "$CODESPACES" ] && [ -s "$HOME/.ssh-host-authorized_keys" ]; then
    mkdir -p ~/.ssh && chmod 700 ~/.ssh
    cp "$HOME/.ssh-host-authorized_keys" ~/.ssh/authorized_keys
    chmod 600 ~/.ssh/authorized_keys
fi
```

OrbStack 使用時はコンテナ名で SSH 接続が可能:

```bash
ssh -p 2222 vscode@condescending_dewdney.orb.local
```

**注意点:**
- この設定は個人的なニーズに紐づくため、プライベートリポジトリ限定の運用になりそう
- Previews は執筆時点で SSH 非対応のため、使用頻度は低くなる見込み

---

## SessionStart で依存の install

on the web 公式のセットアップ手順として `SessionStart` hooks が紹介されているが、これを on desktop と `claude -w` でも使えるようにする。

**hooks 設定:**

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/session-start.sh"
          }
        ]
      }
    ]
  }
}
```

**session-start.sh:**

```bash
#!/bin/bash

# Claude Code on the Web 環境
if [ "$CLAUDE_CODE_REMOTE" = "true" ]; then
  bun install --no-save
fi

# worktree 内での実行
if [[ "$PWD" == */.claude/worktrees/* ]]; then
  main_tree="$(git worktree list --porcelain | head -1 | sed 's/^worktree //')"
  include_file="$main_tree/.worktreeinclude"
  if [ -f "$include_file" ]; then
    while IFS= read -r entry || [ -n "$entry" ]; do
      [ -z "$entry" ] && continue
      src="$main_tree/$entry"
      [ -e "$src" ] && cp -a "$src" "$PWD/$entry"
    done < "$include_file"
  fi
  bun install --no-save
fi
```

**ポイント:**
- `.claude/worktrees` 以下での実行を on desktop / `claude -w` として判定
- worktree 内では `.worktreeinclude` に記載されたファイル（git 管理外）をメインワークツリーからコピー
- `claude -w` では公式の `.worktreeinclude` が動作しないため、その workaround として実装
- on the web で SessionStart が終わらないことがある（おそらく `bun install` のネットワーク問題）。クラウド環境のネットワークアクセス設定を操作すると直ることがある

---

## .worktreeinclude

`.env` など `.gitignore` に含まれるが worktree でも必要なファイルを `.gitignore` と同じフォーマットで列挙する:

```
.env
```

- on desktop 用（元ファイルが必要）
- on the web の場合は代わりに環境変数を定義可能
- `claude -w` はこのファイルに非対応のため、著者は SessionStart スクリプトで独自に対応

---

## PR のフォーマットを指定する

on the web では最終的に PR を作成して完結させることが多いが、UI の PR ボタンでは **CLAUDE.md を読んでいないように見える**。デフォルトでは一般的な PR テンプレート＋英語で作成される。

**対策:** PR 作成用の Skills を user レベルから repository レベルに移し、`gh` CLI が使えない場合は GitHub の PR 作成 URL を出力するようにした。

```
Check if `gh` CLI is available by running `which gh`
  - **If available**: Create the PR using `gh pr create`
  - **If not available**: Output a GitHub PR creation URL:
    `https://github.com/{owner}/{repo}/compare/main...{branch}?expand=1&title={url-encoded-title}&body={url-encoded-body}`
```

**課題:** URL 経由の PR 作成はブラウザでログイン中のアカウントで作成されるため、アカウントを分けている意味が薄れる。

---

## Previews for Claude Code

執筆時点では on desktop の Local のみ対応。SSH や on the web への対応が待たれる。

---

## 現在の運用と雑感

| 用途 | 使用方法 |
|------|----------|
| バグレポート対応、Issue として残せるもの | Issue ベース |
| 新しいことの試行、調査タスク | on the web |
| メインの開発 | CLI（従来通り） |

**良い点:**
- 個人リポジトリは on the web で十分に開発可能
- PR を出せば Preview URLs で動作確認が完結
- CLI 以外は非同期で投げておき、後からまとめて確認するスタイルで並列作業が可能に
- on desktop の SSH と `claude -w` により、自作の worktree 管理を廃止して claude に一本化

**on desktop (local) の課題:**
- `NODE_EXTRA_CA_CERTS` を見ておらず、環境によっては動作しない（[Issue #22559](https://github.com/anthropics/claude-code/issues/22559)）
- diff 表示が常に main worktree を優先してしまう
- worktree 作成時に `.worktreeinclude` との兼ね合いでブランチ指定が効かないことがある
- main worktree を綺麗に保つことが難しい環境では branch や diff が崩壊する
- 現状は **Codex App** がこのあたりをうまく処理できるため、そちらを利用中

**その他:**
- DevContainer サポートが AI Agent 全般で弱い（相性は良いはずだが…）
- rewind 機能がないため困ることがある
- on the web は常に push しているため、GitHub Actions の設定次第ではコスト増に注意
