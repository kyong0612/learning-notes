---
title: "Claude Code デスクトップで Worktree を作成するとき .worktreeinclude で .gitignore で除外されているファイルを含める"
source: "https://azukiazusa.dev/blog/claude-code-worktree-worktreeinclude-gitignore/"
author:
  - "[[azukiazusa]]"
published: 2026-02-23
created: 2026-02-24
description: "Git Worktree を作成するとき、.gitignore に指定している .env ファイルなどがコピーされないという問題があります。この問題を解決するために Claude Code のデスクトップバージョンでは .worktreeinclude で .gitignore で除外されているファイルを含めることができます。"
tags:
  - "clippings"
  - "Claude Code"
  - "Git Worktree"
  - "dotenv"
  - "AI Coding"
  - "開発環境"
---

## 背景・課題

AI コーディングエージェントで複数セッションを並行開発する際、**Git Worktree** を使って同一リポジトリの複数ブランチを同時チェックアウトするのが一般的なプラクティスとなっている。しかし、Git Worktree には根本的な問題がある。

> `.gitignore` で除外されているファイル（`.env` など）は新しい Worktree にコピーされない

開発に必要な `.env` ファイルが欠落するため、Worktree を作成するたびに手動でコピーする必要があり、手間がかかる。

## 解決策：`.worktreeinclude` ファイル

Claude Code デスクトップ版では **`.worktreeinclude`** というファイルがサポートされており、`.gitignore` で除外されているファイルを Worktree に含めることができる。

### 使い方

プロジェクトルートに `.worktreeinclude` ファイルを作成し、含めたいファイルのパスを `.gitignore` と同じパターン構文で記述する。

```
.env
.env.*
**/.claude/settings.local.json
```

> [!important]
> Worktree にコピーされるのは **`.worktreeinclude` と `.gitignore` の両方に一致するファイルのみ**。これにより、意図しないファイルの混入を防止できる。

## Claude Code デスクトップでの利用

デスクトップ版ではセッション作成画面で「**Worktree**」チェックボックスをオンにするだけで Worktree が作成される。

```bash
$ git worktree list
/Users/xxx/sandbox/kanban-app                                449a11e [main]
/Users/xxx/sandbox/kanban-app/.claude/worktrees/quirky-kare  449a11e [claude/quirky-kare]
```

Worktree フォルダを確認すると、`.worktreeinclude` に記述した `.env` が正しくコピーされている。

```bash
$ ls -a .claude/worktrees/quirky-kare
.  ..  .claude  .env  .git  .gitignore  README.md
```

## Claude Code CLI での利用

CLI では `-w` / `--worktree` オプションで Worktree を作成できる。

```bash
$ claude --worktree filtering-task
```

### 制限事項

**v2.1.50 時点では CLI で `.worktreeinclude` はサポートされていない。** ただし、関連 Issue（[#15327](https://github.com/anthropics/claude-code/issues/15327)）は 2026/02/22 にクローズされており、近日中のリリースが期待される。

### CLI での代替案：`WorktreeCreate` フック

`.claude/settings.json` に `WorktreeCreate` フックを設定することで、Worktree 作成時に `.env` を自動コピーできる。

```json
{
  "hooks": {
    "WorktreeCreate": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'NAME=$(jq -r .name); DIR=\"$HOME/.claude/worktrees/$NAME\"; git worktree add \"$DIR\" HEAD &2 && cp \"$CLAUDE_PROJECT_DIR/.env\" \"$DIR/.env\" &2 && echo \"$DIR\"'"
          }
        ]
      }
    ]
  }
}
```

**フックの仕組み：**

| 要素 | 説明 |
|---|---|
| 入力 | `--worktree` で指定した値が `name` フィールドとして渡される |
| `CLAUDE_PROJECT_DIR` | プロジェクトのルートパスを示す環境変数 |
| 標準出力 | 作成した Worktree の絶対パスを `echo` で出力する必要がある（出力がないとエラー扱い） |
| 注意点 | `WorktreeCreate` フックを設定するとデフォルトの動作が置き換わるため、`git worktree add` もフック内で実行する必要がある |

## まとめ

| 環境 | `.worktreeinclude` サポート | 代替手段 |
|---|---|---|
| **デスクトップ版** | サポート済み | — |
| **CLI (v2.1.50)** | 未サポート（近日対応予定） | `WorktreeCreate` フックで `.env` をコピー |

## 参考リンク

- [Hooks reference - Claude Code Docs](https://code.claude.com/docs/en/hooks#worktreecreate)
- [デスクトップ上の Claude Code - Claude Code Docs](https://code.claude.com/docs/ja/desktop)
- [GitHub Issue #15327](https://github.com/anthropics/claude-code/issues/15327)
