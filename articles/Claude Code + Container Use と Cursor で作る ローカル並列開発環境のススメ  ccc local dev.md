---
title: "Claude Code + Container Use と Cursor で作る ローカル並列開発環境のススメ / ccc local dev"
source: "https://speakerdeck.com/kaelaela/ccc-local-dev"
author:
  - "Yuichi Maekawa"
published: 2025-07-08
created: 2025-07-10
description: |
  AIコーディングエージェント（Claude Code）とコンテナ技術（Dagger's Container Use）、そしてCursorエディタを組み合わせ、ローカル環境で安全かつ効率的な並列開発を実現する方法についての提案。
tags:
  - "Claude Code"
  - "Cursor"
  - "Container Use"
  - "Dagger"
  - "Agentic Coding"
  - "並列開発"
---

## 概要

本資料は、AIコーディングエージェントの活用が広がる中で、開発のボトルネックや並列開発に伴う課題を整理し、**Claude Code + Dagger's Container Use + Cursor** を組み合わせることで、ローカル環境で安全かつ効率的な並列開発を実現する方法を提案するものです。

## 課題：AIによる並列開発のカオス

### Agentic Codingの普及と新たなボトルネック

* Agentic Codingにより、実装、レビュー、自動テストの高速化が実現可能になった。
* 一方で、AIへの依存は創造性の低下や予期しないバグ、セキュリティリスクといった新たな問題を生み出しており、「人力でのカバー」には限界がきている。
* これまで人間が並列で行ってきた開発プロセスがAIに置き換わることで、ROIを最大化するための「並列数のチューニング」が新たな課題となる。

### 並列開発が引き起こす2つのカオス

1. **ローカルでのカオス**:
    * 単純な並列化は、ファイルシステムの競合、データベースの不整合、作業環境の破壊などを引き起こし、問題の追跡を困難にする。
    * 特にE2Eテストのように環境に依存する処理は、途端に動作しなくなることが多い。
2. **リモートAIへの依存**:
    * Claude Code ActionsやCopilot AgentのようなリモートAIサービスに依存すると、環境の障害点が増え、環境構築がサービスごとに独自仕様になりがち。
    * また、機密情報の取り扱いも課題となる。

## 提案：ローカルでの安全な並列開発環境

Claude Code、Container Use、Cursorを組み合わせることで、上記の課題を解決し、安全なローカル並列開発環境を構築する。

* **Claude Code + Container Use**:
  * Dagger社製の`Container Use`は、「Gitブランチ = コンテナ環境」をシンプルに実現するCLIツール。
  * 各AIエージェントに独立したコンテナ環境を提供することで、ファイルシステムやデータベースの競合を防ぎ、相互破壊のリスクをなくす。
  * AI（チャット）からの指示で自律的に環境を構築・管理できる点が、人間向けのDev Containerとの大きな違い。
* **Cursor**:
  * 統合開発環境（IDE）として、複数のAIモデルを切り替えながら実装や修正を行う「作業デスク」として活用する。

## Container Useの導入と利用法

### セットアップ

1. **インストール**:

    ```bash
    curl -fsSL https://raw.githubusercontent.com/dagger/container-use/main/install.sh | bash
    ```

2. **MCPサーバー追加**:
    * **Claude**: `claude mcp add container-use -- cu stdio`
    * **Cursor**: `https://cursor.com/install-mcp?name=container-use&config=eyJjb21tYW5kIjoiY3Ugc3RkaW8ifQ%3D%3D`
3. **Coding Rules追記**:
    * Claude/Cursorそれぞれにルールファイルを追加し、エージェントが`Container Use`を認識できるようにする。

### 主なコマンド

* `cu list`: 並列環境（コンテナ）の一覧を表示
* `cu terminal <ID>`: 指定した環境のターミナルを開く
* `cu watch`: 各コンテナの作業状況を`git tree`形式で監視
* `cu checkout <ID>`: コンテナ内の作業内容をローカルのGitブランチとして展開
* `cu delete <ID>`: 不要になった環境を削除
* `cu merge <ID>`: 作業内容をメインのブランチにマージ

## まとめ

* 開発のボトルネックは「人間の作業」であり、AIエージェントによる**Agentic Codingはいくら並列化しても良い**。
* しかし、ローカルでの単純な並列化は**環境汚染**という深刻な問題を引き起こす。
* **Claude Code + Container Use + Cursor** の組み合わせは、この問題を解決し、安全で管理しやすいローカル並列開発を実現するための強力なソリューションである。
