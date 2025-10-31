---
title: "Introducing Agent HQ: Any agent, any way you work"
source: "https://github.blog/news-insights/company-news/welcome-home-agents/?utm_source=twitter-amp-day1-keynote-blog&utm_medium=social&utm_campaign=universe25"
author:
  - "[[Kyle Daigle]]"
published: 2025-10-28
created: 2025-10-31
description: "At Universe 2025, GitHub's next evolution introduces a single, unified workflow for developers to be able to orchestrate any agent, any time, anywhere."
tags:
  - "clippings"
  - "AI"
  - "agents"
  - "GitHub"
  - "Copilot"
  - "development-tools"
  - "agent-orchestration"
  - "developer-workflow"
---

## 概要

GitHubは、Universe 2025カンファレンスにおいて「Agent HQ」を発表しました。これは、AIエージェントを外部ツールとしてではなく、開発ワークフローのネイティブな要素として位置づける統合プラットフォームです。複数のプロバイダーからのAIエージェントをGitHubの既存インフラストラクチャ内の単一エコシステムに統合します。

## 主要な発表内容

GitHubのCOOであるKyle Daiggleは、「開発者がいつでも、どこでも、あらゆるエージェントをオーケストレーションできる単一の統合ワークフロー」として「Agent HQ」を紹介しました。このプラットフォームは、Anthropic、OpenAI、Google、Cognition、xAIなどのエージェントを有料Copilotサブスクリプションを通じてGitHubに直接統合します。

## 重要な統計データ

- GitHubには1億8000万人の開発者が登録
- プラットフォームは過去最速の成長率を記録
- 毎秒新しい開発者が参加
- 新規開発者の80%が最初の週にCopilotを使用

## 主要機能と能力

### Mission Control（ミッションコントロール）

複数のエージェントを並行して割り当て、管理できる集中型コマンドセンター：

- 複数のエージェントを並行して割り当て・管理
- デバイス間（GitHub、VS Code、モバイル、CLI）で進捗を追跡
- エージェントが作成したコードのブランチ実行を制御
- エージェントのアイデンティティとアクセスポリシーを管理
- ワンクリックでマージコンフリクトを解決

### VS Codeの新機能

1. **プランモード**: 実装前にステップバイステップのタスクアプローチを構築するための質問を提供
2. **AGENTS.mdファイル**: エージェントの動作に関するルールとガードレールを設定するソースコントロールされたドキュメント
3. **GitHub MCP Registry**: VS CodeがModel Context Protocol仕様を完全にサポートし、Stripe、Figma、Sentryなどのツールをワンクリックでインストール可能

### コード品質とガバナンス

- **GitHub Code Quality**: 保守性、信頼性、テストカバレッジの組織全体の可視性を提供（パブリックプレビュー）
- **コードレビュー統合**: Copilotエージェントが人間のレビュー前に初期レビューを実施
- **Copilot Metricsダッシュボード**: 組織全体での使用状況と影響を追跡（パブリックプレビュー）
- **コントロールプレーン**: セキュリティポリシー、監査ログ、アクセス管理のためのエンタープライズガバナンスレイヤー

## 新しい統合機能

以下のサービスとの統合が追加されました：

- Slack
- Linear
- Microsoft Teams
- Azure Boards
- Atlassian Jira
- Raycast

## パートナーからのコメント

**OpenAI（Codex）**: 「コードが書かれるあらゆる場所にCodexの力を拡張」

**Anthropic（Claude）**: エージェントが「課題を取得し、ブランチを作成し、コードをコミットし、プルリクエストに応答できる」

**Google Labs（Jules）**: 統合により「手動手順を効率化し、摩擦を減らす」ことを目指す

## 展開スケジュール

- OpenAI Codexは今週からVS Code InsidersのCopilot Pro+ユーザーに提供開始
- 追加のエージェントは今後数ヶ月にわたって展開予定

## 哲学的フレームワーク

この発表では、エージェントはコンテキストスイッチングを必要とするのではなく、既存の開発者ワークフロー内で機能すべきだと強調しています。GitHubは、基本的なプリミティブ（Git、プルリクエスト、イシュー、Actions）を維持しながら、エージェントオーケストレーション機能を追加することで、自らを位置づけています。

## 技術アーキテクチャ

- 既存のGitHubプリミティブ上に構築
- GitHub Actionsおよびセルフホスト型ランナーと互換性あり
- Copilot Pro+サブスクリプションモデルと統合
- ローカル開発オプション付きのクラウドベースエージェント実行

## ガバナンスとコントロール要素

- セキュリティポリシー管理
- 監査ログ機能
- モデルアクセス制御
- 使用状況メトリクスとレポート
- エージェントの許可リスト
- MCPサーバーのアクセスガバナンス

## 結論

Kyle DaigleはAgent HQをAIツールの断片化を解決するものとして位置づけ、「選択肢を妥協することなく、この新しい時代に秩序とガバナンスをもたらす」ことを強調しています。同時に、開発者の自律性とワークフローの親しみやすさを維持することを重視しています。

## 重要な意義

Agent HQは、AIエージェントを開発ワークフローに統合する方法において重要な転換点を示しています。複数のエージェントプロバイダーを単一のプラットフォームに統合することで、開発者はツール間を移動することなく、最適なエージェントを選択して使用できるようになります。これは、AI支援開発の民主化と標準化における重要な一歩です。
