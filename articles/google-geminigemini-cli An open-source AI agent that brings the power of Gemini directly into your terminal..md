---
title: "google-gemini/gemini-cli: An open-source AI agent that brings the power of Gemini directly into your terminal."
source: "https://github.com/google-gemini/gemini-cli"
author:
  - "google-gemini"
published:
created: 2025-06-28
description: "An open-source AI agent that brings the power of Gemini directly into your terminal."
tags:
  - "Gemini"
  - "CLI"
  - "AI"
  - "Node.js"
  - "Google"
  - "open-source"
  - "gemini-api"
---

# Gemini CLI: Geminiをターミナルで利用するAIエージェント

**Gemini CLI** は、ターミナルから直接Geminiのパワーを活用できるオープンソースのAIエージェントです。このツールは、手元のツールとの連携、コードベースの理解、そしてワークフローの高速化を実現します。

[![Gemini CLI Screenshot](https://github.com/google-gemini/gemini-cli/raw/main/docs/assets/gemini-screenshot.png)](https://github.com/google-gemini/gemini-cli/blob/main/docs/assets/gemini-screenshot.png)

## 主な機能

Gemini CLIを使用することで、以下のことが可能になります。

* **大規模なコードベースの操作**: Geminiの100万トークンのコンテキストウィンドウを超える規模のコードベースをクエリ・編集できます。
* **マルチモーダルなアプリ生成**: PDFやスケッチから新しいアプリケーションを生成できます。
* **運用タスクの自動化**: プルリクエストのクエリや複雑なリベース操作などを自動化します。
* **拡張性**: ツールやMCPサーバーを利用して、Imagen、Veo、Lyriaによるメディア生成などの新機能を追加できます。
* **Google検索連携**: Geminiに組み込まれたGoogle検索ツールを使って、クエリのグラウンディング（事実に基づいた回答生成）が可能です。

## クイックスタート

### 前提条件

* [Node.js v18](https://nodejs.org/en/download)以上がインストールされていること。

### 実行方法

以下のコマンドをターミナルで実行します。

```bash
npx https://github.com/google-gemini/gemini-cli
```

または、グローバルにインストールすることもできます。

```bash
npm install -g @google/gemini-cli
gemini
```

### セットアップ

1. CLIを実行すると、まずカラーテーマの選択を求められます。
2. 次に、個人のGoogleアカウントでサインインするよう求められます。これにより、Geminiを毎分最大60リクエスト、毎日最大1,000リクエストまで利用できます。

### APIキーを利用した高度な使い方

特定のモデルを使用したり、より高いリクエスト上限が必要な場合は、APIキーを使用できます。

1. [Google AI Studio](https://aistudio.google.com/apikey)でAPIキーを生成します。
2. 生成したキーを環境変数に設定します。

    ```bash
    export GEMINI_API_KEY="YOUR_API_KEY"
    ```

その他の認証方法については、[認証ガイド](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/authentication.md)を参照してください。

## 使用例

### 新規プロジェクトで利用する

```bash
cd new-project/
gemini
> Write me a Gemini Discord bot that answers questions using a FAQ.md file I will provide
```

### 既存のプロジェクトで利用する

```bash
git clone https://github.com/google-gemini/gemini-cli
cd gemini-cli
gemini
> Give me a summary of all of the changes that went in yesterday
```

## 一般的なタスク例

### コードベースの探索

```bash
> Describe the main pieces of this system's architecture.
> What security mechanisms are in place?
```

### 既存コードの操作

```bash
> Implement a first draft for GitHub issue #123.
> Help me migrate this codebase to the latest version of Java. Start with a plan.
```

### ワークフローの自動化

```bash
> Make me a slide deck showing the git history from the last 7 days, grouped by feature and team member.
> Make a full-screen web app for a wall display to show our most interacted-with GitHub issues.
```

### システムとの対話

```bash
> Convert all the images in this directory to png, and rename them to use dates from the exif data.
> Organise my PDF invoices by month of expenditure.
```

## 詳細情報

* **コントリビューション**: [CONTRIBUTING.md](https://github.com/google-gemini/gemini-cli/blob/main/CONTRIBUTING.md)
* **CLIコマンド一覧**: [CLI Commands](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/commands.md)
* **トラブルシューティング**: [Troubleshooting guide](https://github.com/google-gemini/gemini-cli/blob/main/docs/troubleshooting.md)
* **完全なドキュメント**: [Full documentation](https://github.com/google-gemini/gemini-cli/blob/main/docs/index.md)
* **ライセンス**: [Apache-2.0 License](https://github.com/google-gemini/gemini-cli/blob/main/LICENSE)
* **利用規約とプライバシー通知**: [Terms of Service and Privacy Notice](https://github.com/google-gemini/gemini-cli/blob/main/docs/tos-privacy.md)
