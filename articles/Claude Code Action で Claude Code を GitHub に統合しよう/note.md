---
title: "Claude Code Action で Claude Code を GitHub に統合しよう"
source: "https://azukiazusa.dev/blog/claude-code-action-github-integration/"
author:
  - "azukiazusa"
published: 2025-05-25
created: 2025-05-26
description: "Claude Code Action は Claude Code を GitHub Actions のワークフローに統合するためのアクションです。これを使用することで、GitHub 上でコードの生成やレビューを AI に依頼することができます。セットアップから実際の使用例、カスタマイズ方法まで詳しく解説します。"
tags:
  - "claude-code"
  - "github-actions"
  - "ai"
  - "automation"
  - "development-workflow"
---

# Claude Code Action で Claude Code を GitHub に統合しよう

Claude Code Action は Claude Code を GitHub Actions のワークフローに統合するためのアクションです。これを使用することで、GitHub 上でコードの生成やレビューを AI に依頼できます。

## 概要

Claude Code Action を使用すると、GitHub のワークフロー内で Claude AI を活用して以下のことが可能になります：

- Issue やプルリクエストのコメントで `@claude` をメンションしてタスクを依頼
- 自動的なコードレビューの実行
- 特定のイベント（プルリクエスト作成時など）での自動実行
- コード生成や修正の自動化

## セットアップ手順

### 前提条件

Claude Code Action を使用するには以下が必要です：

1. **Claude Code のインストール**

   ```bash
   npm install -g @anthropic-ai/claude-code
   ```

2. **GitHub CLI のインストールとログイン**

   ```bash
   gh auth login
   ```

### インストール手順

1. **Claude Code セッションの開始**

   ```bash
   claude
   ```

2. **GitHub アプリのインストール**

   ```bash
   /install-github-app
   ```

3. **リポジトリの選択**
   - 現在のリポジトリまたは他のリポジトリを選択

4. **GitHub アプリ「Claude」のインストール**
   - ブラウザで表示される画面で必要な権限を確認
   - 「Install」ボタンをクリック

5. **API キーの設定**
   - 既存の API キーを使用するか新しいキーを作成
   - `ANTHROPIC_API_KEY` シークレットが自動的に GitHub に追加される

6. **ワークフローファイルの確認**
   - `.github/workflows/claude.yml` が自動生成される
   - プルリクエストが作成されるのでマージして有効化

### 生成されるワークフローファイル

```yaml
name: Claude Code

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, assigned]
  pull_request_review:
    types: [submitted]

jobs:
  claude:
    if: |
      (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review' && contains(github.event.review.body, '@claude')) ||
      (github.event_name == 'issues' && (contains(github.event.issue.body, '@claude') || contains(github.event.issue.title, '@claude')))
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
      issues: read
      id-token: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 1
      - name: Run Claude Code
        id: claude
        uses: anthropics/claude-code-action@beta
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

## 実際の使用例

### 基本的な使用方法

1. **Issue での機能実装依頼**
   - Issue を作成し、`@claude` をメンションして「課題の説明に基づいてこの機能を実装してください」とコメント
   - Claude がタスクリストを生成し、実装を開始
   - 完了後、プルリクエスト作成用のリンクが提供される

2. **プルリクエストのレビュー依頼**
   - プルリクエストで `@claude このプルリクエストをレビューしてください` とコメント
   - Claude が自動的にコードレビューを実行

### 実行結果の例

- **タスクの自動分解**: Claude が複雑なタスクを小さなステップに分解
- **コード生成**: 指定された機能の実装コードを自動生成
- **ブランチ作成**: 新しいブランチを作成してコミット
- **思考過程の表示**: ワークフローログで Claude の思考プロセスを確認可能

### コスト情報

- 記事の例では `claude-opus-4-20250514` を使用して約 $4 のコストが発生

## カスタマイズとベストプラクティス

### 使用可能ツールの制限

```yaml
- name: Run Claude Code
  id: claude
  uses: anthropics/claude-code-action@beta
  with:
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
    allowed_tools: [
      "bash",
      "git", 
      "gh"
    ]
```

### プロジェクト設定ファイル

プロジェクトルートに `CLAUDE.md` ファイルを作成することで Claude の理解を向上：

```bash
claude
/init
```

このファイルには以下を記述：

- コードスタイル
- プロジェクト構造
- コマンドの実行方法
- 開発ガイドライン

## 高度な使用例：自動記事レビュー

特定のタイミングで自動実行するワークフローの例：

```yaml
name: Review with Claude

on:
  pull_request:
    types: [opened, synchronize]
    paths:
      - contents/blogPost/**/*.md

jobs:
  article-review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
      id-token: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Run Claude Code
        id: claude
        uses: anthropics/claude-code-action@beta
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          direct_prompt: |
            あなたは優秀な編集者です。PRの内容を確認し、以下の点についてレビューしてください。
            - 誤字脱字や文法の誤り
            - 内容の不明瞭な箇所
            - 記事の構成や流れ
```

この設定により：

- プルリクエスト作成時に自動でレビューを実行
- 指摘された誤字脱字を自動修正
- レビュー結果をコメントとして投稿

## 制限事項と注意点

1. **コマンド制限**: 許可されていない Bash コマンドは実行できない
2. **CI 失敗**: 生成されたコードが CI を通らない場合がある
3. **設定調整**: プロジェクトの要件に応じて `allowed_tools` の調整が必要
4. **コスト管理**: AI の使用量に応じてコストが発生

## まとめ

Claude Code Action の主要な利点：

- **簡単なセットアップ**: `/install-github-app` コマンド一つで導入可能
- **柔軟な実行方法**: メンション方式と自動実行の両方に対応
- **包括的な機能**: コード生成からレビューまで幅広くサポート
- **カスタマイズ性**: プロジェクトに応じた設定が可能
- **透明性**: 思考過程がログで確認できる

Claude Code Action を活用することで、GitHub 上での開発ワークフローに AI を効果的に統合し、開発効率の向上とコード品質の向上を実現できます。

## 参考リンク

- [GitHub Actions - Anthropic](https://docs.anthropic.com/ja/docs/claude-code/github-actions)
- [anthropics/claude-code-action](https://github.com/anthropics/claude-code-action)
