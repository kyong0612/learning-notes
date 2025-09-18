---
title: "Overview"
source: "https://docs.coderabbit.ai/cli/overview"
author:
  - "[[CodeRabbit]]"
published:
created: 2025-09-18
description: "Get AI code reviews directly in your CLI before you commit. Catch race conditions, memory leaks, and security vulnerabilities without leaving your development environment."
tags:
  - "clippings"
  - "CodeRabbit"
  - "CLI"
  - "code review"
  - "AI"
  - "static analysis"
---

## 概要

CodeRabbit CLIは、コミット前にCLI内で直接AIによるコードレビューを受けることができるツールです。開発環境を離れることなく、競合状態、メモリリーク、セキュリティ脆弱性を検出できます。

## 主な機能

* **コミット前の変更をレビュー**: 作業ディレクトリを分析し、コミット前に競合状態、nullポインタ例外、ロジックエラーを検出します。
* **ワンステップでの修正**: インポートの修正などの簡単な修正を即座に適用し、複雑なアーキテクチャの問題はAIエージェントに渡すことができます。
* **コンテキストを考慮したレビュー**: 有料プランでは、チームのパターンから学習し、エラーハンドリングのスタイル、アーキテクチャの決定、コーディングの好みを記憶してレビューを強化します。
* **コーディングエージェントファイルの検出**: `claude.md`、`.cursorrules`、およびカスタムチーム標準を自動的に読み取り、特定のコーディングガイドラインを強制します。

## 価格と機能

* **無料ティア**: 限定的な日次使用量で基本的な静的解析を提供します。構文エラー、明らかなロジックの問題、一般的なセキュリティパターンを検出します。
* **有料プラン**: コードベースの履歴からの学習によって強化されたレビューと、より高いレート制限を提供します。GitHubアカウントをリンクした有料ユーザーは、学習ベースのレビュー、完全なコンテキスト分析、チーム標準の適用、高度な問題検出などの機能を利用できます。

プラットフォームサポート: 現在、Apple (IntelおよびApple Silicon) とLinuxで利用可能です。Windowsはサポートされていません。

## はじめに

1. **CLIのインストール**:

    ```shell
    curl -fsSL https://cli.coderabbit.ai/install.sh | sh
    ```

2. **シェルの再起動**:

    ```shell
    source ~/.zshrc
    ```

3. **認証**:

    ```shell
    coderabbit auth login
    ```

4. **コードのレビュー**:

    ```shell
    coderabbit
    # or with a different base branch
    coderabbit --base develop
    ```

5. **提案の適用**: ターミナルで結果を確認し、迅速な修正を適用するか、複雑な問題をAIコーディングエージェントに送信します。

## レビューモード

* **インタラクティブモード (デフォルト)**: `coderabbit`
* **プレーンテキストモード**: `coderabbit --plain`
* **プロンプト専用モード**: `coderabbit --prompt-only`

## レビュー結果の操作

CodeRabbitは、問題の場所、説明、推奨される修正を含む具体的な問題を提示します。インタラクティブモードでは、矢印キーで結果をナビゲートし、Enterキーで詳細を確認できます。簡単な問題は即座に適用でき、複雑な問題は`--prompt-only`モードを使用してAIエージェントに渡すことができます。

## コマンドリファレンス

| コマンド | 説明 |
| --- | --- |
| `coderabbit` | コードレビューを実行 (デフォルトはインタラクティブモード) |
| `coderabbit --plain` | プレーンテキスト形式で詳細なフィードバックを出力 |
| `coderabbit --prompt-only` | AIエージェントに最適化された最小限の出力を表示 |
| `coderabbit auth` | 認証コマンド |
| `coderabbit review` | AIによるコードレビュー |
| `cr` | `coderabbit`コマンドの短いエイリアス |

### 追加オプション

| オプション | 説明 |
| --- | --- |
| `-t, --type <type>` | レビュータイプ: all, committed, uncommitted (デフォルト: "all") |
| `-c, --config <files...>` | CodeRabbit AIへの追加の指示 (例: claude.md, coderabbit.yaml) |
| `--base <branch>` | 比較対象のベースブランチ |
| `--base-commit <commit>` | 比較対象のベースコミット |
| `--cwd <path>` | 作業ディレクトリのパス |
| `--no-color` | 色付き出力を無効にする |
