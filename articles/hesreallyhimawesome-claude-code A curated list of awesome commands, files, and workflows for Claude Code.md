---
title: "hesreallyhim/awesome-claude-code: A curated list of awesome commands, files, and workflows for Claude Code"
source: "https://github.com/hesreallyhim/awesome-claude-code"
author:
  - "hesreallyhim"
published:
created: 2025-07-27
description: "A curated list of awesome commands, files, and workflows for Claude Code."
tags:
  - "clippings"
  - "awesome"
  - "awesome-list"
  - "claude"
  - "coding-assistant"
  - "ai-workflows"
  - "anthropic"
  - "anthropic-claude"
  - "coding-agents"
  - "ai-workflow-optimization"
  - "claude-code"
  - "agentic-code"
  - "coding-agent"
  - "agentic-coding"
---

[![Awesome](https://camo.githubusercontent.com/9f4534299c4fb07eccb37b82d3e7aa23cb225094b2dd2a311be7c4b9779c3ed8/68747470733a2f2f617765736f6d652e72652f62616467652d666c6174322e737667)](https://awesome.re)

# [Awesome Claude Code](https://github.com/hesreallyhim/awesome-claude-code) 🤝 [Awesome Claude Code Agents](https://github.com/hesreallyhim/awesome-claude-code-agents)

Claude Codeのワークフロー、生産性、そして雰囲気を向上させるためのスラッシュコマンド、`CLAUDE.md`ファイル、CLIツール、その他のリソースやガイドを集めたキュレーションリストです。

Claude Codeは、ターミナルやIDEからアクセスできる最先端のCLIベースのコーディングアシスタント兼エージェントです。急速に進化しているツールであり、多くの強力な機能を提供し、さまざまな方法で多くの設定が可能です。ユーザーは積極的にベストプラクティスとワークフローを模索しており、このリポジトリがコミュニティの知識共有とClaude Codeを最大限に活用する方法の理解に役立つことを願っています。

### 主な内容

* **Workflows & Knowledge Guides**: 特定のプロジェクトを容易にするためのClaude Codeネイティブリソースのセット。
* **Tooling**: Claude Codeの上に構築されたアプリケーション。
* **Hooks**: Claudeのエージェントライフサイクルのさまざまな時点でコマンドやスクリプトをアクティブにするための新しいAPI。
* **Slash-Commands**: バージョン管理、コード分析、ドキュメンテーションなど、多岐にわたるカスタムコマンド。
* **CLAUDE.md Files**: プロジェクトやコーディング標準をClaude Codeがよりよく理解するのに役立つガイドラインやコンテキスト情報を含むファイル。
* **Official Documentation**: Anthropicによる公式ドキュメントへのリンク。

### お知らせ

* **2025-07-26**: Anthropicはカスタムユーザーサブエージェント機能を発表しました。これに伴い、新しいリポジトリ [awesome-claude-code-agents](https://github.com/hesreallyhim/awesome-claude-code-agents) が立ち上げられました。
* **2025-07-25**: 新しい投稿ワークフローが公開されました。詳細は `CONTRIBUTING.md` を参照してください。

## コンテンツ詳細

### Workflows & Knowledge Guides 🧠

* `Blogging Platform Instructions`: ブログプラットフォームの公開と維持のためのコマンドセット。
* `ClaudeLog`: 詳細な知識ベースと高度なテクニックガイド。
* `Context Priming`: 包括的なプロジェクトコンテキストをClaude Codeに提供するための体系的なアプローチ。
* その他、多数のワークフローやガイドがリストアップされています。

### Tooling 🧰

* `CC Usage`: Claude Codeの使用状況を管理・分析するためのCLIツール。
* `ccexp`: 設定ファイルやスラッシュコマンドを発見・管理するための対話型CLIツール。
* `Claude Code Flow`: Claudeが自律的にコードを記述、編集、テスト、最適化することを可能にするコードファーストのオーケストレーションレイヤー。
* `Claude Hub`: Claude CodeをGitHubリポジトリに接続するWebhookサービス。
* その他、IDE統合（VS Code, Emacs, Neovim）やデスクトップアプリケーションなど。

### Hooks 🪝

* `claude-code-hooks-sdk`: Claude Codeフック応答を構築するためのPHP SDK。
* `claude-hooks`: フックを設定・カスタマイズするためのTypeScriptベースのシステム。
* `TDD Guard`: TDDの原則に違反するファイルの変更をブロックするシステム。

### Slash-Commands 🔪

* **Version Control & Git**: `/commit`, `/create-pr`, `/fix-github-issue` など、Git操作を効率化するコマンド。
* **Code Analysis & Testing**: `/check`, `/optimize`, `/tdd` など、コードの品質とパフォーマンスを向上させるコマンド。
* **Context Loading & Priming**: `/context-prime`, `/load-llms-txt` など、AIのコンテキストを初期設定するコマンド。
* **Documentation & Changelogs**: `/add-to-changelog`, `/create-docs` など、ドキュメント作成を支援するコマンド。
* その他、CI/CD、プロジェクト管理、作図（Mermaid）など、多岐にわたるコマンドが含まれています。

### CLAUDE.md Files 📂

* **Language-Specific**: Kotlin, Python, TypeScript, Go, Clojureなど、特定の言語向けの開発ガイドライン。
* **Domain-Specific**: ブロックチェーン（EigenLayer）、E2E暗号化メッセージング、ゲーム開発など、特定のドメインに特化した開発リファレンス。
* **Project Scaffolding & MCP**: AIと人間の協調フレームワークや、Claudeエージェントへの詳細な指示を含むファイル。

### 貢献について

このプロジェクトは貢献を歓迎しており、特に効果的なリソース、革新的なワークフロー、追加のツール、そして従来のコーディングアシスタントの枠を超えた応用例を求めています。詳細は `CONTRIBUTING.md` を参照してください。

ライセンスに関する注意書きも含まれており、GitHubリポジトリに`LICENSE`ファイルがない場合はデフォルトで著作権が保護されるため、オープンソースとして公開する意図がある場合はライセンスを選択することが重要であると注意喚起しています。
