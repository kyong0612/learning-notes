---
title: "yoshiko-pg/difit: A lightweight command-line tool that spins up a local web server to display Git commit diffs in a GitHub-like Files changed view"
source: "https://github.com/yoshiko-pg/difit/tree/main"
author:
  - "yoshiko-pg"
published:
created: 2025-07-27
description: |
  difitは、ローカルのGit差分をGitHub風のビューアで表示・レビューできるCLIツールです。AIへのプロンプトとしてコメントをコピーできる機能を備え、AI時代のローカルコードレビューを支援します。
tags:
  - "clippings"
  - "git"
  - "diff"
  - "code-review"
  - "cli"
  - "developer-tool"
---

[![difit](/yoshiko-pg/difit/raw/main/public/logo.png)](https://github.com/yoshiko-pg/difit/blob/main/public/logo.png)

`difit`は、ローカルのGit差分をGitHubライクなUIで表示し、レビューすることができるコマンドラインツールです。AIへの指示プロンプトとしてコメントをコピーできるなど、AI時代に適したローカルコードレビュー体験を提供します。

## 主な特徴

* ⚡ **ゼロコンフィグ**: `npx difit`を実行するだけで、すぐに利用できます。
* 💬 **ローカルレビュー**: 差分にコメントを追加し、ファイルパスや行番号付きでAI向けのプロンプトとしてコピーできます。
* 🖥️ **WebUI/TerminalUI**: ブラウザでのWeb UI表示に加え、`--tui`オプションでターミナル上でも利用可能です。

## クイックスタート

```bash
# 最新のコミット差分をWebUIで表示
npx difit
```

## 使用方法

### 基本的な使い方

```bash
# 単一のコミット差分を表示
npx difit <target>

# 2つのコミット/ブランチを比較
npx difit <target> [compare-with]

# GitHubのプルリクエストをレビュー
npx difit --pr <github-pr-url>
```

### コミットの指定方法

* **単一コミット**: `HEAD` (最新), `6f4a9b7` (特定コミット), `feature` (ブランチの最新)
* **コミット間の比較**: `HEAD main`, `@ main` (`@`はHEADのエイリアス), `@^ @~3` (相対指定), `feature main` (ブランチ間)
* **ワークツリーとの比較**: `. origin/main` (ワーキングディレクトリとリモートのmainブランチを比較)

### 特殊な引数

* `.` : コミットされていないすべての変更 (ステージング + 未ステージ)
* `staged` : ステージングエリアの変更のみ
* `working`: 未ステージの変更のみ

### GitHubプルリクエストのレビュー

`--pr`オプションでGitHubのプルリクエストURLを指定します。認証は以下の順で自動的に処理されます。

1. **GitHub CLI**: `gh auth login`でログイン済みの場合、その認証情報を使用 (推奨)
2. **環境変数**: `GITHUB_TOKEN`
3. **認証なし**: パブリックリポジトリの場合 (レート制限あり)

GitHub Enterprise Serverの場合は、インスタンスで生成したPersonal Access Tokenを`GITHUB_TOKEN`環境変数に設定する必要があります。

## CLIオプション

| フラグ | デフォルト値 | 説明 |
| :--- | :--- | :--- |
| `<target>` | `HEAD` | コミットハッシュ、タグ、ブランチ、または特殊な引数 |
| `[compare-with]` | - | 比較対象のコミット (2つの差分を表示) |
| `--pr <url>` | - | レビュー対象のGitHub PRのURL |
| `--port` | 3000 | 使用するポート番号 (使用中の場合は+1される) |
| `--host` | 127.0.0.1 | サーバーがバインドするホストアドレス (`0.0.0.0`で外部アクセス可) |
| `--no-open` | `false` | ブラウザを自動で開かない |
| `--mode` | `side-by-side` | 表示モード (`inline` または `side-by-side`) |
| `--tui` | `false` | ターミナルUIモードを使用する |
| `--clean` | `false` | 起動時に既存のコメントをすべて削除する |

## コメントシステム

差分に対するレビューコメント機能です。AIコーディングエージェントへのフィードバックを容易にします。

1. **コメント追加**: 差分の行にあるコメントボタンをクリック、または範囲をドラッグして選択します。
2. **プロンプト生成**: コメントには「Copy Prompt」ボタンがあり、AI向けにフォーマットされたコンテキストをコピーできます。
3. **一括コピー**: 「Copy All Prompt」ですべてのコメントを構造化された形式でコピーします。
4. **永続化**: コメントはコミットごとにブラウザのlocalStorageに保存されます。

### プロンプト形式

```
src/components/Button.tsx:L42   # 自動的に追加される
Make this variable name more descriptive
```

## 対応言語 (シンタックスハイライト)

JavaScript/TypeScript, HTML, CSS, JSON, PHP, SQL, Python, Rust, Go, Swiftなど、多くの言語に対応しています。

## アーキテクチャ

* **CLI**: [Commander.js](https://github.com/tj/commander.js/)
* **Backend**: [Express](https://expressjs.com/) + [simple-git](https://github.com/steveukx/git-js)
* **GitHub Integration**: [Octokit](https://github.com/octokit/octokit.js)
* **Frontend**: [React](https://react.dev/) 18 + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
* **Syntax Highlighting**: [Prism.js](https://prismjs.com/)
* **Testing**: [Vitest](https://vitest.dev/)

## 要件

* Node.js ≥ 21.0.0
* レビュー対象のコミットが存在するGitリポジトリ
