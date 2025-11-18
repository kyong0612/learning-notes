---
title: "coderabbitai/git-worktree-runner: Bash-based Git worktree manager with editor and AI tool integration. Automates per-branch worktree creation, configuration copying, dependency installation, and workspace setup for efficient parallel development."
source: "https://github.com/coderabbitai/git-worktree-runner"
author:
  - "[[helizaga]]"
published:
created: 2025-11-18
description: |
  BashベースのGit worktree管理ツール。エディタとAIツールとの統合を提供し、ブランチごとのworktree作成、設定ファイルのコピー、依存関係のインストール、ワークスペースのセットアップを自動化することで、効率的な並列開発を実現する。v2.0以降は`git gtr`コマンドとして提供され、485以上のスターを獲得している。
tags:
  - "clippings"
  - "git"
  - "git-worktree"
  - "development-tools"
  - "automation"
---

# gtr - Git Worktree Runner

## 概要

`git-worktree-runner`（`git gtr`）は、Git worktreeを簡単に管理するためのポータブルでクロスプラットフォームなCLIツールです。従来の`git worktree`コマンドの煩雑さを解消し、モダンな開発ワークフロー（エディタ統合、AIツール、自動化）に対応した品質向上機能を提供します。

**⚠️ v2.0 の破壊的変更:** v2.0.0以降、コマンド名が`gtr`から`git gtr`に変更されました（GNU coreutilsとの競合を避けるため）。すべてのコマンドで`git gtr`を使用してください。

## Git Worktreeとは

**簡単に説明すると:** 通常、1つのフォルダで同時に作業できるGitブランチは1つだけです。バグ修正をしながら機能開発を進めたい場合、変更をstashしてブランチを切り替え、また戻す必要があります。Git worktreeを使えば、異なるフォルダで複数のブランチを同時にチェックアウトできます。つまり、プロジェクトの複数のコピーを、それぞれ異なるブランチで持つことができます。

**問題点:** 多くの開発者がgit worktreeを誤用しているか、全く使っていません：

- ブランチの切り替えやstashが頻繁で、作業の流れが中断される
- メインブランチでテストを実行しながら機能開発をするには、手動でのコピーが必要
- PRのレビューは現在の作業を中断する必要がある
- **異なるブランチで並列AIエージェントを動かすことは、worktreeなしではほぼ不可能**

**worktreeが使われない理由:** 開発者体験（DX）が悪い。`git worktree add ../my-project-feature feature`は冗長で、手動操作が多く、エラーが起きやすい。

**gtrの解決策:** シンプルなコマンド、AIツール統合、自動セットアップ、モダンな並列開発ワークフローに最適化されています。

## 主な機能

### 1. シンプルなコマンド

従来の`git worktree`コマンドと比較：

| タスク | `git worktree` | `git gtr` |
| --- | --- | --- |
| worktree作成 | `git worktree add ../repo-feature feature` | `git gtr new feature` |
| エディタで開く | `cd ../repo-feature && cursor .` | `git gtr editor feature` |
| AIツール起動 | `cd ../repo-feature && aider` | `git gtr ai feature` |
| 設定ファイルコピー | 手動コピー/ペースト | `gtr.copy.include`で自動コピー |
| ビルドステップ実行 | 手動`npm install && npm run build` | `gtr.hook.postCreate`で自動実行 |
| worktree一覧 | `git worktree list`（パスのみ） | `git gtr list`（ブランチ+ステータス） |
| クリーンアップ | `git worktree remove ../repo-feature` | `git gtr rm feature` |

### 2. エディタ統合

以下のエディタをサポート：

- **Cursor** - AI搭載コードエディタ
- **VS Code** - Visual Studio Code
- **Zed** - 高性能エディタ

### 3. AIツールサポート

以下のAIコーディングツールと統合：

- **[Aider](https://aider.chat)** - ターミナルでのAIペアプログラミング
- **[Claude Code](https://claude.com/claude-code)** - ターミナルネイティブなコーディングエージェント
- **[Codex CLI](https://github.com/openai/codex)** - OpenAIコーディングアシスタント
- **[Cursor](https://cursor.com)** - CLIエージェント機能を持つAI搭載エディタ
- **[Continue](https://continue.dev)** - オープンソースコーディングエージェント

### 4. スマートファイルコピー

globパターンを使用して、新しいworktreeにファイルを選択的にコピー：

```bash
# コピーするパターンを追加（複数値）
git gtr config add gtr.copy.include "**/.env.example"
git gtr config add gtr.copy.include "**/CLAUDE.md"
git gtr config add gtr.copy.include "*.config.js"

# 除外パターン（複数値）
git gtr config add gtr.copy.exclude "**/.env"
git gtr config add gtr.copy.exclude "**/secrets.*"
```

**セキュリティのベストプラクティス:**

- 開発用シークレット（テストAPIキー、ローカルDBパスワード）は個人マシンでは低リスク
- 本番環境の認証情報は常に高リスク
- ツールはパストラバーサル（`../`）のみを防止。それ以外はユーザーの選択に委ねられます

### 5. フックシステム

worktree操作後にカスタムコマンドを実行：

```bash
# 作成後フック（複数値、順番に実行）
git gtr config add gtr.hook.postCreate "npm install"
git gtr config add gtr.hook.postCreate "npm run build"

# 削除後フック
git gtr config add gtr.hook.postRemove "echo 'Cleaned up!'"
```

**フックで利用可能な環境変数:**

- `REPO_ROOT` - リポジトリルートパス
- `WORKTREE_PATH` - 新しいworktreeパス
- `BRANCH` - ブランチ名

### 6. クロスプラットフォーム対応

- ✅ **macOS** - 完全サポート（Ventura+）
- ✅ **Linux** - 完全サポート（Ubuntu、Fedora、Archなど）
- ✅ **Windows** - Git BashまたはWSL経由

### 7. シェル補完

Bash、Zsh、Fishのタブ補完をサポート。

## クイックスタート

### インストール（30秒）

```bash
git clone https://github.com/coderabbitai/git-worktree-runner.git
cd git-worktree-runner
sudo ln -s "$(pwd)/bin/git-gtr" /usr/local/bin/git-gtr
```

### 使用方法（3コマンド）

```bash
cd ~/your-repo                              # Gitリポジトリに移動
git gtr config set gtr.editor.default cursor    # 初回セットアップ
git gtr config set gtr.ai.default claude        # 初回セットアップ

# 日常的なワークフロー
git gtr new my-feature                          # worktree作成
git gtr editor my-feature                       # エディタで開く
git gtr ai my-feature                           # AIツール起動
git gtr rm my-feature                           # 完了後に削除
```

## 要件

- **Git** 2.5+（`git worktree`サポートのため）
- **Bash** 3.2+（macOSは3.2を同梱；高度な機能には4.0+推奨）

## 主要コマンド

### `git gtr new <branch> [options]`

新しいgit worktreeを作成。フォルダ名はブランチ名に基づきます。

**オプション:**

- `--from <ref>`: 特定のrefから作成
- `--track <mode>`: トラッキングモード（auto|remote|local|none）
- `--no-copy`: ファイルコピーをスキップ
- `--no-fetch`: git fetchをスキップ
- `--force`: 同じブランチを複数のworktreeで許可（**--name必須**）
- `--name <suffix>`: カスタムフォルダ名サフィックス（オプション、--forceと併用時は必須）
- `--yes`: 非対話モード

### `git gtr editor <branch> [--editor <name>]`

worktreeをエディタで開く（`gtr.editor.default`または`--editor`フラグを使用）。

### `git gtr ai <branch> [--ai <name>] [-- args...]`

AIコーディングツールを起動（`gtr.ai.default`または`--ai`フラグを使用）。

### `git gtr go <branch>`

シェルナビゲーション用のworktreeパスを出力。

### `git gtr rm <branch>... [options]`

ブランチ名でworktreeを削除。

**オプション:** `--delete-branch`, `--force`, `--yes`

### `git gtr list [--porcelain]`

すべてのworktreeを一覧表示。`--porcelain`で機械読み取り可能な出力。

### `git gtr config {get|set|add|unset} <key> [value] [--global]`

git config経由で設定を管理。

### その他のコマンド

- `git gtr doctor` - ヘルスチェック（git、エディタ、AIツールの確認）
- `git gtr adapter` - 利用可能なエディタ&AIアダプターの一覧
- `git gtr clean` - 古いworktreeの削除
- `git gtr version` - バージョン表示

## 設定

すべての設定は`git config`経由で保存され、リポジトリごとまたはグローバルに管理できます。

### Worktree設定

```bash
# worktreeのベースディレクトリ
# デフォルト: <repo-name>-worktrees（リポジトリの兄弟）
# サポート: 絶対パス、リポジトリ相対パス、チルダ展開
gtr.worktrees.dir = <path>

# フォルダプレフィックス（デフォルト: ""）
gtr.worktrees.prefix = dev-

# デフォルトブランチ（デフォルト: 自動検出）
gtr.defaultBranch = main
```

**重要:** リポジトリ内にworktreeを保存する場合、ディレクトリを`.gitignore`に追加してください。

```bash
echo "/.worktrees/" >> .gitignore
```

### エディタ設定

```bash
# デフォルトエディタ: cursor, vscode, zed, または none
gtr.editor.default = cursor
```

### AIツール設定

```bash
# デフォルトAIツール: none（または aider, claude, codex, cursor, continue）
gtr.ai.default = none
```

## 高度な使用法

### リポジトリスコープ

**gtrはリポジトリスコープ** - 各gitリポジトリは独立したworktreeセットを持ちます：

- 任意のgitリポジトリ内で`git gtr`コマンドを実行
- worktreeフォルダはブランチ名に基づいて命名
- 各リポジトリが独自のworktreeを独立して管理
- `cd`でリポジトリを切り替え、そのリポジトリ用の`git gtr`コマンドを実行

### 複数ブランチでの作業

```bash
# ターミナル1: 機能開発
git gtr new feature-a
git gtr editor feature-a

# ターミナル2: PRレビュー
git gtr new pr/123
git gtr editor pr/123

# ターミナル3: メインブランチに移動（リポジトリルート）
cd "$(git gtr go 1)"  # 特別なID '1' = メインリポジトリ
```

### 同じブランチの複数worktree

Gitは通常、同じブランチを複数のworktreeでチェックアウトすることを防止しますが、`git gtr`は`--force`と`--name`フラグでこの安全チェックをバイパスできます。

**ユースケース:**

- 1つの機能を複数のAIエージェントで分割
- 異なる環境/設定で同じブランチをテスト
- 並列CI/ビルドプロセスの実行
- メインworktreeを中断せずにデバッグ

**リスク:**

- 複数のworktreeでの同時編集は競合を引き起こす可能性
- 注意しないと作業を失いやすい
- Gitの安全チェックには理由がある

**使用例:**

```bash
# 同じブランチの複数worktreeを説明的な名前で作成
git gtr new feature-auth                          # メインworktree: feature-auth/
git gtr new feature-auth --force --name backend   # 作成: feature-auth-backend/
git gtr new feature-auth --force --name frontend  # 作成: feature-auth-frontend/
git gtr new feature-auth --force --name tests     # 作成: feature-auth-tests/

# すべてのworktreeが同じ'feature-auth'ブランチ上
# --nameフラグは--forceと併用時、worktreeを区別するために必須
```

**並列AI開発の例:**

```bash
# ターミナル1: バックエンド作業
git gtr new feature-auth --force --name backend
git gtr ai feature-auth-backend -- --message "Implement API endpoints"

# ターミナル2: フロントエンド作業
git gtr new feature-auth --force --name frontend
git gtr ai feature-auth-frontend -- --message "Build UI components"

# ターミナル3: テスト
git gtr new feature-auth --force --name tests
git gtr ai feature-auth-tests -- --message "Write integration tests"

# すべてのエージェントが同じfeature-authブランチにコミット
```

## トラブルシューティング

### Worktree作成が失敗する

```bash
# 最新のrefを取得しているか確認
git fetch origin

# ブランチが既に存在するか確認
git branch -a | grep your-branch

# トラッキングモードを手動で指定
git gtr new test --track remote
```

### エディタが開かない

```bash
# エディタコマンドが利用可能か確認
command -v cursor  # または: code, zed

# 設定を確認
git gtr config get gtr.editor.default

# 再度開く
git gtr editor 2
```

### ファイルコピーの問題

```bash
# パターンを確認
git gtr config get gtr.copy.include

# findでパターンをテスト
cd /path/to/repo
find . -path "**/.env.example"
```

## 信頼性とテスト状況

**現在の状況:** 日常使用に本番環境対応

**テスト済みプラットフォーム:**

- ✅ **macOS** - Ventura (13.x), Sonoma (14.x), Sequoia (15.x)
- ✅ **Linux** - Ubuntu 22.04/24.04, Fedora 39+, Arch Linux
- ⚠️ **Windows** - Git Bash（テスト済み）、WSL2（テスト済み）、PowerShell（未サポート）

**Gitバージョン:**

- ✅ Git 2.25+（推奨）
- ✅ Git 2.22+（完全サポート）
- ⚠️ Git 2.5-2.21（基本サポート、一部機能制限）

**既知の制限事項:**

- シェル補完にはBash用にbash-completion v2+が必要
- 一部のAIアダプターには最新のツールバージョンが必要（アダプタードキュメント参照）
- Windowsネイティブ（非WSL）サポートは実験的

**実験的機能:**

- 同じブランチのworktree用`--force`フラグ（注意して使用）
- Windows PowerShellサポート（代わりにGit BashまたはWSLを使用）

## アーキテクチャ

```
git-worktree-runner/
├── bin/
│   ├── git-gtr         # Gitサブコマンドエントリーポイント（ラッパー）
│   └── gtr             # コア実装（1000+行）
├── lib/                 # コアライブラリ
│   ├── core.sh         # Git worktree操作
│   ├── config.sh       # 設定管理
│   ├── platform.sh     # OS固有コード
│   ├── ui.sh           # ユーザーインターフェース
│   ├── copy.sh         # ファイルコピー
│   └── hooks.sh        # フック実行
├── adapters/           # エディタ&AIツールプラグイン
│   ├── editor/
│   └── ai/
├── completions/        # シェル補完
└── templates/          # 設定例
```

## 統計情報

- **スター数:** 485+
- **フォーク数:** 24
- **ライセンス:** Apache-2.0
- **主要言語:** Shell 100.0%
- **コントリビューター:** 2名（helizaga, NatoBoram）

## まとめ

`git-worktree-runner`は、Git worktreeの管理を大幅に簡素化し、モダンな開発ワークフローに必要な機能（エディタ統合、AIツール統合、自動化）を提供する強力なツールです。特に、並列開発や複数のAIエージェントを異なるブランチで同時に動作させる必要がある場合に、その真価を発揮します。

従来の`git worktree`コマンドの煩雑さを解消し、設定ベースのアプローチで一度設定すれば簡単なコマンドで操作できるようになっています。クロスプラットフォーム対応で、macOS、Linux、Windows（Git Bash/WSL）で動作し、シェル補完もサポートされているため、開発者の生産性を大幅に向上させる可能性があります。
