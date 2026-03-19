---
title: "pnpm + Git Worktrees for Multi-Agent Development | pnpm"
source: "https://pnpm.io/11.x/git-worktrees"
author: "Zoltan Kochan"
published:
created: 2026-03-19
description: "Git worktreesとpnpmのグローバル仮想ストアを組み合わせることで、複数のAIエージェントが同一モノレポで並行作業する際に、各ワークツリーが独立したnode_modulesを持ちながらも依存パッケージをディスク上の単一ストアで共有できる仕組みを解説する公式ドキュメント。"
tags:
  - "pnpm"
  - "git-worktrees"
  - "ai-agents"
  - "monorepo"
  - "multi-agent-development"
  - "clippings"
---

## 概要

複数のAIエージェントが同じモノレポで同時に作業する場合、各エージェントには独立した作業コピーと完全に機能する `node_modules` が必要になる。**Git worktrees** と **pnpmのグローバル仮想ストア（Global Virtual Store）** を組み合わせることで、各ワークツリーが独自のチェックアウトと `node_modules` を持ちつつ、依存パッケージはディスク上の単一のcontent-addressableストアを通じて共有される。

> **注意**: これはpnpm 11.x（未リリース版）のドキュメントである。

---

## Git Worktreeとは

通常、gitリポジトリは一度に1つのブランチに結びついた単一の作業ディレクトリを持つ。別のブランチを見るには、変更をstashまたはcommitしてから切り替える必要がある。**Git worktree** を使うと、複数のブランチを同時にチェックアウトし、それぞれ独自のディレクトリで作業できる。すべてのワークツリーは同じリポジトリ履歴とオブジェクトを共有する。

```sh
git worktree add ../feature-branch feat/my-feature
```

これにより `../feature-branch` に `feat/my-feature` がチェックアウトされた新しいディレクトリが作成され、元の作業ディレクトリは現在のブランチのまま維持される。

### Bare Repositoryパターン

作業ディレクトリを持たないbare repositoryをハブとして使い、すべての作業ディレクトリをworktreeとして作成する一般的なパターン：

```sh
git clone --bare https://github.com/your-org/your-repo.git your-repo
cd your-repo
git worktree add ./main main
git worktree add ./feature feat/something
```

---

## なぜWorktreeが必要か

### AI以前のユースケース

Worktreeはプロジェクトの複数メジャーバージョンを維持するのに有用。著者（pnpmメンテナ）は、pnpmリポジトリで少なくとも2つのworktreeを使用している：

- **main**: pnpm v11用
- **v10ブランチ**: バックポートとメンテナンスリリース用

これにより、進行中のv11作業をstashせずにv10のバグ修正が可能。

### AIエージェントとの組み合わせで不可欠に

AIコーディングエージェントを使うと、worktreeは「便利」から「不可欠」になる：

- 各エージェントはファイル編集、ビルド実行、テスト実行のために**独自の作業ディレクトリ**が必要
- worktreeなしでは、リポジトリを複数回クローンし、各コピーのgit履歴を複製する必要がある
- worktreeにより、基盤となるgitオブジェクトを共有しながら各エージェントが独立したチェックアウトを得られる

**しかし問題が残る**: 各ワークツリーにはそれぞれ数百MBの `node_modules` が必要。ここで **pnpmのグローバル仮想ストア** が活躍する。

---

## セットアップ手順

### 1. Bare Repositoryの作成

```sh
git clone --bare https://github.com/your-org/your-monorepo.git your-monorepo
cd your-monorepo
```

### 2. 各ブランチのワークツリー作成

```sh
# メイン開発用ワークツリー
git worktree add ./main main

# エージェントA用のフィーチャーブランチ
git worktree add ./feature-auth feat/auth

# エージェントB用のバグ修正ブランチ
git worktree add ./fix-api fix/api-error
```

各ワークツリーはファイルの完全なチェックアウトだが、すべて同じ `.git` オブジェクトストアを共有する。

### 3. グローバル仮想ストアの有効化

`pnpm-workspace.yaml` に `enableGlobalVirtualStore: true` を追加：

```yaml
packages:
  - 'packages/*'
enableGlobalVirtualStore: true
```

### 4. 各ワークツリーで依存関係をインストール

```sh
cd main && pnpm install
cd ../feature-auth && pnpm install
cd ../fix-api && pnpm install
```

**最初の `pnpm install`** でパッケージがグローバルストアにダウンロードされる。**以降のインストール**は同じストアへのシンボリックリンクを作成するだけなので、**ほぼ瞬時**に完了する。

---

## 動作の仕組み

### グローバル仮想ストアなし（従来の方法）

各ワークツリーが `node_modules` 内に独自の `.pnpm` 仮想ストアを持ち、すべてのパッケージのハードリンクまたはコピーが存在する。

### グローバル仮想ストアあり（推奨）

`enableGlobalVirtualStore: true` を設定すると、pnpmはすべてのパッケージ内容を**単一の共有ディレクトリ**（グローバルストア、`pnpm store path` で確認可能）に保持し、各ワークツリーの `node_modules` はそこへの**シンボリックリンク**で構成される：

```text
your-monorepo/                      (bare git repo)
├── main/                           (worktree: main branch)
│   ├── packages/
│   └── node_modules/
│       ├── lodash → <global-store>/links/@/lodash/...
│       └── express → <global-store>/links/@/express/...
├── feature-auth/                   (worktree: feat/auth branch)
│   └── node_modules/
│       ├── lodash → <global-store>/links/@/lodash/...  ← 同じターゲット
│       └── express → <global-store>/links/@/express/...
└── fix-api/                        (worktree: fix/api-error branch)
    └── node_modules/
        ├── lodash → <global-store>/links/@/lodash/...  ← 同じターゲット
        └── express → <global-store>/links/@/express/...
```

### 主要なメリット

| メリット | 説明 |
|---|---|
| **競合なし** | 各ワークツリーが独自の `node_modules` ツリーを持つため、エージェント間で異なるブランチの異なる依存バージョンをインストールしても干渉しない |
| **新ワークツリーの即時インストール** | パッケージは既にグローバルストアに存在するため、追加のダウンロード不要 |
| **ワークツリーごとのオーバーヘッドがほぼゼロ** | ローカルの `node_modules` はシンボリックリンクのみ。pnpmのデフォルト動作（content-addressableストアからローカルの `node_modules/.pnpm` へのハードリンク）と異なり、ファイルのコピーやハードリンクは一切発生しない |

---

## 実例: pnpmモノレポ自体

[pnpmリポジトリ](https://github.com/pnpm/pnpm)自体がこの構成を使用しており、bare gitリポジトリと `enableGlobalVirtualStore: true` を採用している。ワークツリー管理を簡単にするヘルパースクリプトも含まれる：

### `pnpm worktree:new`

```sh
# ブランチ用のワークツリーを作成（存在しない場合はmainから作成）
pnpm worktree:new feat/my-feature

# GitHub PRのワークツリーを作成（PRのrefを自動的にフェッチ）
pnpm worktree:new 10834
```

### `wt` コマンド（シェルエイリアス）

```sh
# シェル設定でsourceしてから使用:
wt feat/my-feature
wt 10834
```

---

## 制限事項・注意点

- これは **pnpm 11.x（未リリース版）** のドキュメントであり、安定版（10.x）では利用できない機能を含む可能性がある
- `enableGlobalVirtualStore` はpnpm 11.xの新機能であり、本番環境での導入前に十分なテストが推奨される
- グローバル仮想ストアはシンボリックリンクに依存するため、シンボリックリンクをサポートしない環境（一部のWindows設定など）では制約がある可能性がある