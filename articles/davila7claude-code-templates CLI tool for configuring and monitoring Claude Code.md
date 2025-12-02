---
title: "davila7/claude-code-templates: CLI tool for configuring and monitoring Claude Code"
source: "https://github.com/davila7/claude-code-templates"
author:
  - "davila7"
published:
created: 2025-12-02
description: |
  AnthropicのClaude Code用の設定とモニタリングを行うCLIツール。100以上のエージェント、カスタムコマンド、設定、フック、外部統合（MCP）、プロジェクトテンプレートを提供し、開発ワークフローを強化します。インタラクティブなウェブインターフェース（aitmpl.com）でテンプレートを閲覧・インストールでき、リアルタイム分析、会話モニター、ヘルスチェック、プラグインダッシュボードなどの追加ツールも含まれています。
tags:
  - "claude"
  - "anthropic"
  - "claude-code"
  - "cli"
  - "templates"
  - "mcp"
  - "agents"
  - "development-tools"
---

## 概要

**Claude Code Templates**は、AnthropicのClaude Code用の設定とモニタリングを行う包括的なCLIツールです。100以上のエージェント、カスタムコマンド、設定、フック、外部統合（MCP）、プロジェクトテンプレートを提供し、開発ワークフローを大幅に強化します。

## プロジェクト概要

- **リポジトリ**: [davila7/claude-code-templates](https://github.com/davila7/claude-code-templates)
- **ウェブサイト**: [aitmpl.com](https://aitmpl.com)
- **ドキュメント**: [docs.aitmpl.com](https://docs.aitmpl.com)
- **ライセンス**: MIT License
- **スター数**: 12.1k
- **フォーク数**: 1k
- **最新リリース**: v1.28.3 (2025年11月15日)

## 主要機能

### コンポーネントタイプ

| コンポーネント | 説明 | 例 |
| --- | --- | --- |
| **🤖 Agents** | 特定ドメイン向けのAI専門家 | セキュリティ監査者、Reactパフォーマンス最適化、データベースアーキテクト |
| **⚡ Commands** | カスタムスラッシュコマンド | `/generate-tests`, `/optimize-bundle`, `/check-security` |
| **🔌 MCPs** | 外部サービス統合 | GitHub, PostgreSQL, Stripe, AWS, OpenAI |
| **⚙️ Settings** | Claude Code設定 | タイムアウト、メモリ設定、出力スタイル |
| **🪝 Hooks** | 自動化トリガー | コミット前検証、完了後のアクション |
| **🎨 Skills** | 再利用可能な機能（段階的開示） | PDF処理、Excel自動化、カスタムワークフロー |

### クイックインストール

```bash
# 完全な開発スタックをインストール
npx claude-code-templates@latest --agent development-team/frontend-developer --command testing/generate-tests --mcp development/github-integration --yes

# インタラクティブに閲覧・インストール
npx claude-code-templates@latest

# 特定のコンポーネントをインストール
npx claude-code-templates@latest --agent development-tools/code-reviewer --yes
npx claude-code-templates@latest --command performance/optimize-bundle --yes
npx claude-code-templates@latest --setting performance/mcp-timeouts --yes
npx claude-code-templates@latest --hook git/pre-commit-validation --yes
npx claude-code-templates@latest --mcp database/postgresql-integration --yes
```

## 追加ツール

### 📊 Claude Code Analytics

AI開発セッションをリアルタイムで監視し、ライブステート検出とパフォーマンスメトリクスを提供します。

```bash
npx claude-code-templates@latest --analytics
```

### 💬 Conversation Monitor

モバイル最適化されたインターフェースで、Claudeの応答をリアルタイムで表示。セキュアなリモートアクセスも可能です。

```bash
# ローカルアクセス
npx claude-code-templates@latest --chats

# Cloudflare Tunnel経由のセキュアなリモートアクセス
npx claude-code-templates@latest --chats --tunnel
```

### 🔍 Health Check

Claude Codeのインストールが最適化されているかを確認する包括的な診断ツール。

```bash
npx claude-code-templates@latest --health-check
```

### 🔌 Plugin Dashboard

マーケットプレイス、インストール済みプラグイン、権限管理を統合インターフェースから表示・管理。

```bash
npx claude-code-templates@latest --plugins
```

## ウェブインターフェース

**[aitmpl.com](https://aitmpl.com)**では、100以上のエージェント、コマンド、設定、フック、MCPをインタラクティブに閲覧・インストールできます。直感的なUIで、必要なコンポーネントを簡単に見つけてプロジェクトに統合できます。

## 技術スタック

- **JavaScript**: 47.7%
- **Python**: 27.2%
- **HTML**: 18.7%
- **CSS**: 4.2%
- **Shell**: 1.0%
- **TypeScript**: 0.9%

## 貢献

プロジェクトは積極的に貢献を歓迎しています。既存のテンプレートを[aitmpl.com](https://aitmpl.com)で閲覧し、[貢献ガイドライン](https://github.com/davila7/claude-code-templates/blob/main/CONTRIBUTING.md)に従って、独自のエージェント、コマンド、MCP、設定、フックを追加できます。

**貢献前に[行動規範](https://github.com/davila7/claude-code-templates/blob/main/CODE_OF_CONDUCT.md)をお読みください。**

## 帰属とライセンス

このコレクションには複数のソースからのコンポーネントが含まれています：

- **wshobson/agents Collection** by [wshobson](https://github.com/wshobson/agents) - MIT License (48エージェント)
- **awesome-claude-code Commands** by [hesreallyhim](https://github.com/hesreallyhim/awesome-claude-code) - CC0 1.0 Universal (21コマンド)

これらのリソースはそれぞれ**元のライセンスと帰属**を保持しています（主にMITライセンス）。

## コミュニティ

- **🌐 テンプレート閲覧**: [aitmpl.com](https://aitmpl.com)
- **📚 ドキュメント**: [docs.aitmpl.com](https://docs.aitmpl.com)
- **💬 コミュニティ**: [GitHub Discussions](https://github.com/davila7/claude-code-templates/discussions)
- **🐛 イシュー**: [GitHub Issues](https://github.com/davila7/claude-code-templates/issues)

## まとめ

Claude Code Templatesは、Claude Codeの機能を最大限に活用するための包括的なソリューションです。100以上のテンプレートと強力な開発ツールにより、AIを活用した開発ワークフローを大幅に改善できます。インタラクティブなウェブインターフェースとCLIツールの組み合わせにより、初心者から上級者まで、誰でも簡単に利用できる設計になっています。
