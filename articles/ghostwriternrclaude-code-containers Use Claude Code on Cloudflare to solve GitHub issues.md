---
title: "ghostwriternr/claude-code-containers: Use Claude Code on Cloudflare to solve GitHub issues"
source: "https://github.com/ghostwriternr/claude-code-containers"
author:
  - "[[ghostwriternr]]"
  - "[[claude]]"
published:
created: 2025-09-17
description: |
  This template provides a containerized environment on Cloudflare workers for Claude Code to process GitHub issues. It listens to new issues created from your connected repositories, and creates a Pull Request to solve them.
tags:
  - "Claude"
  - "Cloudflare"
  - "GitHub"
  - "AI"
  - "TypeScript"
  - "Serverless"
---

# 🤖 Claude Code on Cloudflare

[![Deploy to Cloudflare](https://camo.githubusercontent.com/dbfce91befb9e3595169aab72f1307a504559b7acc255ba911a0e170b927c485/68747470733a2f2f6465706c6f726b6572732e636c6f7564666c6172652e636f6d2f627574746f6e)](https://deploy.workers.cloudflare.com/?url=https://github.com/ghostwriternr/claude-code-containers)

このテンプレートは、Claude CodeがGitHubの問題を処理するためのコンテナ化された環境をCloudflareワーカー上で提供します。接続されたリポジトリから作成された新しい問題をリッスンし、それらを解決するためのプルリクエストを作成します。

## ✨ 特徴

- **🔌 最先端のコーディングエージェント**: コーディングタスクですでに使用しているのと同じ[Claude Code](https://claude.ai/code)を活用します。
- **⚡ 超高速**: Cloudflare Containersは即時スケーリングとミリ秒未満の応答時間を提供するため、Claude Codeは任意の数の問題に同時に取り組むことができます。
- **🔧 ゼロコンフィギュレーション**: ガイド付きセットアッププロセスによるワンクリックデプロイ。
- **🛡️ インストールトークン管理**: 安全で自動更新されるGitHub Appトークン。
- **🔒 安全**: あなた自身のCloudflareアカウントにデプロイされます。

## 🚀 クイックスタート

### 1️⃣ Cloudflareへのデプロイ

上記のデプロイボタンをクリックして、Cloudflareアカウントに即座にデプロイします。デプロイには以下が含まれます：

- コンテナをサポートするCloudflare Worker
- 安全なストレージのためのDurable Objects
- 必要なすべてのバインディングと設定

### 2️⃣ Anthropic APIの設定

デプロイ後、Claude AI統合を設定する必要があります：

1. **Anthropic APIキーの取得**:
    - [Anthropic Console](https://console.anthropic.com/)にアクセスします。
    - 適切な権限を持つAPIキーを作成します。
2. **APIキーの設定**:
    - デプロイされたワーカーの`/claude-setup`エンドポイントに移動します。
    - Anthropic APIキーを入力します。
    - システムは認証情報を安全に暗号化して保存します。

### 3️⃣ GitHub Appのインストール

Anthropic APIの設定が完了すると、`/gh-setup`エンドポイントにリダイレクトされます（手動でアクセスすることも可能です）。これにより、GitHub Appのインストールとリポジトリへのアクセスの設定がガイドされます。システムは自動的にインストールの詳細をキャプチャします。

## 📋 使い方

設定が完了すると、システムは自動的に動作します：

1. **問題の作成**: リポジトリで誰かが問題を作成すると、ClaudeはWebhookを受信します。
2. **AI分析**: Claudeは問題の内容を分析し、処理を開始します。
3. **進捗更新**: Claudeが作業を進めるにつれて、リアルタイムの進捗コメントが表示されます。
4. **解決策の提供**: Claudeはコード例を含む包括的な解決策を提供します。
5. **タスク完了**: 最終的な完了コメントが処理の終了を示します。

## 💻 ローカル開発

```
# Install dependencies
npm install

# Start development server
npm run dev
```

## 📄 ライセンス

このプロジェクトはオープンソースであり、MITライセンスの下で利用可能です。
