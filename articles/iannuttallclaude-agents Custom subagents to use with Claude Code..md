---
title: "iannuttall/claude-agents: Custom subagents to use with Claude Code."
source: "https://github.com/iannuttall/claude-agents"
author:
  - "iannuttall"
  - "claude"
published:
created: 2025-07-27
description: "Claude Codeのためのカスタムサブエージェントのリポジトリ。プロジェクト固有またはグローバルに使用するためのインストール手順と、利用可能なエージェントのリストを提供します。"
tags:
  - "Claude"
  - "Claude Code"
  - "AI Agent"
  - "Custom Agents"
  - "GitHub"
---

# iannuttall/claude-agents

`iannuttall/claude-agents` は、[Claude Code](https://claude.ai/code) で使用できるカスタムサブエージェントを提供するGitHubリポジトリです。これらのエージェントは、特定のタスクを支援するために設計されています。

## 概要

このリポジトリは、開発者がClaude Codeの機能を拡張し、特定のニーズに合わせてカスタマイズするためのエージェント群を含んでいます。

## インストール

エージェントは、プロジェクト固有、またはグローバル（すべてのプロジェクトで共通）にインストールできます。

### プロジェクト固有の利用

以下のコマンドを実行して、現在作業しているプロジェクトの `.claude/agents/` ディレクトリにエージェントをコピーします。

```sh
mkdir -p .claude/agents
cp agents/*.md .claude/agents/
```

### グローバルな利用

以下のコマンドを実行して、ユーザーのホームディレクトリにあるClaudeの設定フォルダにエージェントをコピーします。これにより、すべてのプロジェクトでエージェントが利用可能になります。

```sh
mkdir -p ~/.claude/agents
cp agents/*.md ~/.claude/agents/
```

## 利用可能なエージェント

このリポジトリでは、以下のようなエージェントが提供されています。

* **code-refactorer**: コードのリファクタリング支援
* **content-writer**: コンテンツ作成支援
* **frontend-designer**: フロントエンド設計支援
* **prd-writer**: プロダクト要求仕様書（PRD）作成
* **project-task-planner**: プロジェクト計画とタスク分割
* **security-auditor**: セキュリティ監査支援
* **vibe-coding-coach**: コーディングに関する指導とコーチング

## 使い方

エージェントを所定のディレクトリにインストールすると、Claude Codeはタスクに応じて自動的にこれらのエージェントを検出して使用します。

## ライセンス

このプロジェクトは [MITライセンス](https://github.com/iannuttall/claude-agents/blob/main/LICENSE) の下で公開されています。

## コントリビューター

* [iannuttall](https://github.com/iannuttall)
* [claude](https://github.com/claude)
