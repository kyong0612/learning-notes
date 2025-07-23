---
title: "jj-vcs/jj: シンプルかつパワフルなGit互換のバージョン管理システム"
source: "https://github.com/jj-vcs/jj"
author:
  - "Martin von Zweigbergk"
  - "The jj-vcs team"
published:
created: 2025-07-23
description: "Jujutsu (jj) は、シンプルかつパワフルなGit互換のバージョン管理システムです。個人のプロジェクトから大規模なチーム開発まで、誰でも簡単に使えるように設計されています。"
tags:
  - "vcs"
  - "git"
  - "devtools"
  - "rust"
  - "mercurial"
  - "jujutsu"
---

[![jj logo](https://github.com/jj-vcs/jj/raw/main/docs/images/jj-logo.svg)](https://github.com/jj-vcs/jj/blob/main/docs/images/jj-logo.svg)

**[ホームページ](https://jj-vcs.github.io/jj) | [インストール](https://jj-vcs.github.io/jj/latest/install-and-setup) | [チュートリアル](https://jj-vcs.github.io/jj/latest/tutorial) | [ロードマップ](https://jj-vcs.github.io/jj/latest/roadmap) | [貢献](#contributing)**

## 概要

Jujutsu (`jj`) は、パワフルなGit互換のバージョン管理システム（VCS）です。個人のプロジェクトで作業する初心者から、大規模なソフトウェア開発に携わる経験豊富なチームまで、誰もが簡単に使えるように設計されています。

多くのシステムとは異なり、Jujutsuはユーザーインターフェースと基盤となるストレージを抽象化しているため、Git、Mercurial、Breezyなどのバックエンドと連携できます。現在、ストレージにはGitリポジトリを使用しており、既存のGitベースのツールやGitHubのようなプラットフォームとの互換性を確保しています。

`jj`は、様々なVCSのコンセプトを組み合わせています:

* **Git**: デフォルトのストレージバックエンドとしてGitリポジトリを使用することで、速度、効率性、相互運用性に重点を置いています。
* **Mercurial & Sapling**: コミットを選択するための`revset`言語、明示的なステージングエリア（インデックス）の廃止、そしてパワフルでシンプルな履歴書き換えプリミティブなどの機能を備えています。
* **Darcs**: コンフリクトをデータモデル内で第一級のオブジェクトとして扱うことで、多くのコンフリクトの自動的な解決と伝播を可能にしています。

## 主な特徴

### 1. ワーキングコピーをコミットとして扱う

ファイルへの変更は自動的に通常のコミットとして記録され、その後の変更で修正（amend）されます。これにより、データモデルが簡素化され（コミットのみが可視化される）、`git stash`やステージングエリアのような機能が不要になります。

[![](https://github.com/jj-vcs/jj/raw/main/demos/working_copy.png)](https://github.com/jj-vcs/jj/blob/main/demos/working_copy.png)

### 2. 操作ログと取り消し機能 (`jj op log`, `jj op undo`)

すべての操作（コミット、プル、プッシュ）が記録されます。これにより、リポジトリで何が起こったかを簡単にデバッグし、簡単なコマンドでどんな間違いでも取り消すことができます。

[![](https://github.com/jj-vcs/jj/raw/main/demos/operation_log.png)](https://github.com/jj-vcs/jj/blob/main/demos/operation_log.png)

### 3. 自動リベースとコンフリクト解決

コミットが変更されると、そのすべての子孫が自動的に新しいコミットの上にリベースされます。コンフリクトの解決策も伝播されるため、`git rebase --update-refs`と`git rerere`を組み合わせたような、透過的で強力なワークフローが実現します。

* **基本的なコンフリクト解決:**
    [![](https://github.com/jj-vcs/jj/raw/main/demos/resolve_conflicts.png)](https://github.com/jj-vcs/jj/blob/main/demos/resolve_conflicts.png)

* **コンフリクトの操作:**
    [![](https://github.com/jj-vcs/jj/raw/main/demos/juggle_conflicts.png)](https://github.com/jj-vcs/jj/blob/main/demos/juggle_conflicts.png)

### 4. 安全な並行レプリケーション

Jujutsuは、Dropboxにリポジトリを保存したり、`rsync`でバックアップしたりするような、並行処理が発生するシナリオでも安全に動作するように設計されています。この設計により、リポジトリの破損が防止され、代わりにローカルとリモートの状態間のコンフリクトが表面化され、解決を促します。

### 5. 包括的な履歴書き換え機能

`jj`は履歴を書き換えるための強力なコマンドを提供します:

* `jj describe`: 任意のコミットのコミットメッセージを編集します。
* `jj diffedit`: コミットをチェックアウトせずに、その中の変更を編集します。
* `jj split`: 1つのコミットを2つに分割します。
* `jj squash`: あるコミットから別のコミットに変更を移動します。

## ステータス

このツールは多くのワークフローにおいて機能が完成しており、コア開発者によって日常的に使用されています。しかし、Gitサブモジュールのサポートなど、一部の機能はまだ開発中であり、パフォーマンスに関するバグが存在する可能性があります。バージョン1.0.0より前にディスク上のフォーマットが変更される可能性がありますが、開発チームは透過的なアップグレードを提供することを目指しています。

## 利用開始にあたって

1. **インストール**: [公式のインストール手順](https://jj-vcs.github.io/jj/latest/install-and-setup)に従ってください。
2. **チュートリアル**: [チュートリアル](https://jj-vcs.github.io/jj/latest/tutorial)で基本を学んでください。
3. **Gitとの比較**: [Gitとの比較ガイド](https://jj-vcs.github.io/jj/latest/git-comparison)で対応するコマンドを確認してください。

`jj`を使ってGitHubリポジトリを探索したり、`git`コマンドと並行して["co-located"リポジトリ](https://jj-vcs.github.io/jj/latest/git-compatibility#co-located-jujutsugit-repos)で使用したりすることもできます。

[![](https://github.com/jj-vcs/jj/raw/main/demos/git_compat.png)](https://github.com/jj-vcs/jj/blob/main/demos/git_compat.png)

## 貢献

貢献を歓迎します。主要なガイドラインは以下の通りです:

* バグ報告は非常に高く評価されます。
* `main`ブランチへのすべてのコミットはコードレビューを受けます。
* 必須のCLA（コントリビューターライセンス同意書）があり、これに同意する必要があります。これは再配布権を許諾するものですが、著作権の所有権を譲渡するものではありません。

このプロジェクトはMartin von Zweigbergkによって開始され、現在は彼のGoogleでのフルタイムプロジェクトとなっていますが、**これはGoogleの公式製品ではありません**。

## ライセンス

Jujutsuは、Apache 2.0ライセンスの下で提供されるオープンソースソフトウェアです。ロゴはクリエイティブ・コモンズ・ライセンスの下でライセンスされています。
