---
title: "Claude Code on the webとCLI間でのタスクの移動について"
source: "https://zenn.dev/beagle/articles/_0016_claude_code_session_cli_and_web"
author:
  - "[[びーぐる]]"
  - "[[Zenn]]"
published: 2025-12-08
created: 2025-12-10
description: "Claude Code on the web(CC on the web)とClaude Code CLI間でタスク/セッションを相互移動する方法について、Git操作に不慣れな人向けに具体的な手順を解説。Git WorktreeやGit Worktree Runnerを活用した複数ブランチの効率的な管理方法も紹介。"
tags:
  - "clippings"
  - "AI"
  - "Anthropic"
  - "Claude-Code"
  - "Coding-agent"
  - "Git"
  - "Git-Worktree"
  - "GitHub"
---

## 概要

Claude Code on the web（以下CC on the web）とClaude Code CLIには、タスクを相互移動できる機能がある。これにより：

- **CC on the web → ローカル**: Web上で行っている作業をローカルに持ち込んで検証
- **ローカル → CC on the web**: ローカルの作業をWeb上に投げて処理を任せる

本記事は、**mohikanz Advent Calendar 2025**の8日目の記事として、これらの具体的な方法を初心者向けに解説している。

![CC on the webとCLI間のタスク移動イメージ](https://res.cloudinary.com/zenn/image/fetch/s--xbCFf0W5--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/2dee0548ea47776a91a29548.png%3Fsha%3Dda08d8ce7eaf88dc5636059c83e4c6df7db41af0)

---

## CC on the webからローカルへのタスク移動（セッション移動）

WebからCLIへは、特定のタスクというよりは**セッション自体の移動**に近いイメージ。

### 手順

#### 1. GitHubリポジトリをローカルにクローン

```bash
git clone <リポジトリURL>
# または GitHub CLI を使用
gh repo clone <ユーザー名/リポジトリ名>

cd <リポジトリ名>
```

#### 2. 作業ブランチに移動

CC on the webでの作業は、mainブランチではなく新たな作業ブランチで行われている。

- ブランチ名は右下部チャット欄の上に表示
- 一般的に `claude/<何かしらの文字列>` という形式

![ブランチ名の表示位置](https://res.cloudinary.com/zenn/image/fetch/s--3dB-C3sh--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/a04f0687c474bf1d984c218d.png%3Fsha%3D93d232c0fb1a6999392a48db30c52f3efbfe61c9)

```bash
git switch <ブランチ名>
```

#### 3. 「CLIで開く」ボタンをクリック

クリップボードにコマンドがコピーされるので、貼り付けて実行：

```bash
claude --teleport <セッションID>
```

これでClaude Codeが起動し、CC on the webでのセッションが復元される。

---

## 補足1: Git Worktreeを利用する方法

### 使用シーン

「CC on the web上で作業を進め、作業結果を何度かmainブランチにマージしたGitHubリポジトリがある。今、**ある作業ブランチをローカルで検証したいが、同様に現状のmainブランチもローカルで検証を行いたい**。」

### Git Worktreeとは

1つのリポジトリにある**複数のブランチを、それぞれ別々のフォルダで展開できる**Gitの標準機能。

![Git Worktreeのイメージ](https://res.cloudinary.com/zenn/image/fetch/s--rDFcqZsI--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/a6465ebd08c09e1f82e85469.png%3Fsha%3Df3e12f393be524f031e88bb7e1128e1eddbde76a)

### 使用方法

```bash
git worktree add ../<任意のディレクトリ名> <ブランチ名>
```

- クローン先ディレクトリ → mainブランチ
- Worktree指定ディレクトリ → リモート作業ブランチ

これで各ブランチを個別に検証でき、Worktree側ディレクトリでCC on the webのセッションを復元可能。

---

## 補足2: Git Worktree Runnerを利用する方法

「Git Worktreeはなんとなくわかるが、ディレクトリ移動等の操作が煩雑に感じる」場合に有効。

### Git Worktree Runnerとは

AIレビューツール**CodeRabbit**が提供するツールで、Git Worktreeをより簡単に扱えるようになる。

- GitHub: <https://github.com/coderabbitai/git-worktree-runner>
- CodeRabbit: <https://www.coderabbit.ai/>

### 使用方法

```bash
# リモートブランチをローカルに展開
git gtr new <リモートブランチ名> --name <ローカルブランチ名>

# IDEでブランチを開く（対応IDE: vscode, cursor, zed）
git gtr editor <ローカルブランチ名> --editor <IDE名>

# ターミナルでブランチのディレクトリに移動
cd "$(git gtr go <ローカルブランチ名>)"
```

**メリット**: Worktreeのディレクトリがどこにあるのかを意識する必要がなくなる。

---

## Claude Code（CLI）からCC on the webへのタスク移動方法

2024年11月中旬に実装された比較的新しい機能。

### 前提条件

- 作業ディレクトリが**Git管理されている**
- リモートリポジトリが**GitHubに存在している**

### 手順

Claude CodeのChat欄に `&` を入力し、続けて作業内容を入力して送信：

```
& feature.tsが正しく動作しない問題を修正してください。
```

- しばらく待つとCC on the webで該当の作業が開始
- CC on the webへのURLリンクが表示され、ブラウザで進行状況を確認可能
- `/tasks` コマンドでClaude Code内でも進捗確認可能

---

## まとめ

最近のアップデートにより、CC on the webとClaude Code（CLI）の連携が強化され、タスク/セッションの移動が簡単になった。

### 活用シーン

| 移動方向 | 活用例 |
|---------|--------|
| **Web → CLI** | 生成コードのローカル検証、本格的な開発への移行 |
| **CLI → Web** | 外出前にタスクを投げてスマホで進行確認、時間のかかる作業をWebに任せて別作業を進める、頭のコンテキストを整理するためにタスクを切り離す |

開発に必須の機能ではないが、知っておくと便利な場面がある。

---

## 参考リンク

- [Claude Code on the webを触ってみた - びーぐる](https://zenn.dev/beagle/articles/bc6ef88dd68615)
- [Git Worktreeの使い方 - Zenn](https://zenn.dev/hiraoku/articles/56f4f9ffc6d186)
- [Git Worktree Runner - GitHub](https://github.com/coderabbitai/git-worktree-runner)
- [mohikanz Advent Calendar 2025](https://adventar.org/calendars/12219)
