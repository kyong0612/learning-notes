---
title: "Linear + Claude Code GitHub Actionsを組み合わせてDevinみたいな開発体験を得る"
source: "https://zenn.dev/poyachi/articles/8c428b71c24b13"
author:
  - "ayachy"
published: 2025-05-27
created: 2025-05-30
description: |
  Claude CodeのGitHub連携とLinearを組み合わせて、Linearでタスクを作成するだけでClaudeがコードを書いてくれるワークフローの実装方法を詳細に解説。Flutter環境での実践的なセットアップから実際の運用まで。
tags:
  - "Claude Code"
  - "Linear"
  - "GitHub Actions"
  - "Flutter"
  - "AI開発"
  - "自動化"
  - "タスク管理"
---

## 概要

この記事では、Linear（タスク管理ツール）とClaude CodeのGitHub連携を組み合わせて、Devinのような自動化された開発体験を実現する方法を詳しく解説しています。「寝転がってタスクを投げるだけの生活」をキャッチフレーズに、実際にFlutterプロジェクトで検証した結果を報告しています。

## セットアップの流れ

### 1. リポジトリの準備

- **Flutterプロジェクトの初期化**

  ```bash
  flutter create claude_linear_integration
  cd claude_linear_integration
  git init
  git branch -m main
  ```

- **GitHubプライベートリポジトリの作成**
  - GitHub CLIを使用した簡潔なセットアップ
  - 初期コミットとプッシュ

### 2. Claude CodeのGitHub App設定

- **`/install-github-app`コマンドの実行**
  - Claude Code内での対話的セットアップ
  - ディレクトリ信頼確認とリポジトリ選択
- **GitHub App権限の設定**
  - ブラウザでの権限付与プロセス
  - APIキー設定オプション
- **GitHub Actions自動生成**
  - `.github/workflows`の自動作成
  - Pull Requestでの設定確認とマージ

### 3. Linearとの統合設定

- **Linear ワークスペース作成**
  - 新規ワークスペースのセットアップ
  - GitHub連携の有効化
- **GitHub Issues双方向同期**
  - Two-way sync Linear issues to GitHubの設定
  - プロジェクトとリポジトリの連携
- **連携完了の確認**
  - Linear・GitHub両方での同期確認

## 実際の運用フロー

### タスク作成から完了まで

1. **Linearでのタスク作成**（`C`キーでクイック作成）
   - タイトルと詳細説明の入力
   - 自動的にGitHub Issueとして同期

2. **Claude Code起動**
   - `@claude`メンションでタスク依頼
   - Linear・GitHubどちらからでもコメント可能

3. **自動コード生成**
   - ClaudeによるTodoリスト作成と実行
   - リアルタイムでの作業進捗確認
   - GitHub Actionsでの実行ログ確認

4. **完了とPull Request作成**
   - 自動コミットとコード変更
   - ワンクリックでのPR作成
   - Linearでの通知受信（モバイル対応）

## 技術的なポイント

### GitHub連携の仕組み

- **Claude GitHub App**：Issues/PRでの`@claude`メンション対応
- **Linear GitHub App**：タスクとIssuesの双方向同期
- **GitHub Actions**：Claudeの実行環境提供

### ユーザーエクスペリエンス

- **モバイル対応**：Linearアプリでの通知受信
- **完全自動化**：タスク作成からPR作成まで手作業なし
- **透明性**：作業プロセスの完全な可視化

## 実装例：Flutter UIの改善

記事では実際の例として、「ボタンの色を変更する」という簡単なタスクを実行し、その結果を表形式で比較しています：

| Before | After |
|--------|-------|
| デフォルトのFlutter UI | 改善されたボタンデザイン |

## 制限事項と注意点

- **複数ワークスペース問題**：Linearの他ワークスペースで既にGitHub連携済みの場合のエラー
- **初回セットアップ**：Claude Code初回使用時のログインとAPIキー設定が必要
- **コメント欄の理解**：Linear内の2つのコメント欄（GitHub同期用/Linear専用）の区別

## 結論

この統合により、開発者は以下の体験を得ることができます：

- **最小限の労力**：LinearでタスクをQ作成するだけ
- **完全自動化**：コード生成からPR作成まで自動
- **モバイル対応**：スマートフォンからでも開発指示が可能
- **透明性**：すべての作業プロセスが可視化

記事の著者は「寝転がってタスクを投げるだけの生活」というユニークな表現で、この革新的な開発ワークフローの利便性を強調しています。これは従来のSlackとDevinの組み合わせに代わる、より統合された開発体験を提供する手法として注目されています。
