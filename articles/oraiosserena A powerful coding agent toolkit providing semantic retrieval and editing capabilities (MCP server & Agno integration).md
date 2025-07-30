---
title: "oraios/serena: A powerful coding agent toolkit providing semantic retrieval and editing capabilities (MCP server & Agno integration)"
source: "https://github.com/oraios/serena"
author:
  - "[[opcode81]]"
  - "[[MischaPanch]]"
published: 2025-07-21
created: 2025-07-30
description: |
  Serena is a powerful, free, and open-source coding agent toolkit that enhances Large Language Models (LLMs) with IDE-like semantic code retrieval and editing capabilities. It integrates with various LLMs and development environments through the Model Context Protocol (MCP) and the Agno agent framework, allowing agents to work directly on your codebase with high efficiency.
tags:
  - "clippings"
  - "agent"
  - "programming"
  - "ai"
  - "language-server"
  - "llms"
  - "ai-coding"
  - "mcp-server"
---

[![](/oraios/serena/raw/main/resources/serena-logo.svg#gh-light-mode-only)](/oraios/serena/blob/main/resources/serena-logo.svg#gh-light-mode-only)
[![](/oraios/serena/raw/main/resources/serena-logo-dark-mode.svg#gh-dark-mode-only)](/oraios/serena/blob/main/resources/serena-logo-dark-mode.svg#gh-dark-mode-only)

Serenaは、LLMをコードベース上で直接動作するフル機能のエージェントに変えることができる、強力な**コーディングエージェントツールキット**です。IDEのようなセマンティックなコード検索・編集ツールを提供し、既存のコーディングエージェントと組み合わせることでトークン効率を大幅に向上させます。Serenaは**無料でオープンソース**であり、すでにお持ちのLLMの能力を無料で強化します。

### **デモンストレーション**

Serenaが自身の機能（より良いログGUI）を実装するデモが公開されています。SerenaのツールがClaudeに適切なシンボルを見つけて編集させる様子を見ることができます。

[Serena-Add-Logo_x264.mp4](https://private-user-images.githubusercontent.com/1295099/429255707-6eaa9aa1-610d-4723-a2d6-bf1e487ba753.mp4?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTM4NTU1NTcsIm5iZiI6MTc1Mzg1NTI1NywicGF0aCI6Ii8xMjk1MDk5LzQyOTI1NTcwNy02ZWFhOWFhMS02MTBkLTQ3MjMtYTJkNi1iZjFlNDg3YmE3NTMubXA0P1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI1MDczMCUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTA3MzBUMDYwMDU3WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9ZTliZmRiOTg2M2VjNWIyNDM3MmRjZWM0Zjc1YTRjYmE3ZjRhMDExODVmMWUyZDkzMjhlNGI5OWIyMmZiZjQ2OSZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QifQ.3yvbKR81sG4oEbqsew7HK2LpAuDM2GKY9fBkiga4biY)

### **LLM連携**

Serenaはコーディングワークフローのためのツールを提供しますが、実際の作業やツールの調整はLLMが行います。
以下の方法でLLMと連携できます。

* **Model Context Protocol (MCP)**: Claude Code, Claude Desktop, VSCode, Cursor, IntelliJなどのIDEや拡張機能と連携します。
* **Agno**: Google, OpenAI, Anthropicの有料APIや、Ollama, Together, Anyscaleの無料モデルなど、事実上すべてのLLMをコーディングエージェントに変えることができます。
* **カスタムエージェントフレームワーク**: Serenaのツールを任意のフレームワークに組み込むことができます。

### **対応プログラミング言語**

Serenaは**Language Server Protocol (LSP)**を利用して、幅広い言語のセマンティックなコード解析を可能にします。

* **標準サポート**: Python, TypeScript/Javascript, PHP, Go, Rust, C#, Java, Elixir, Clojure, C/C++
* **間接サポート (要調整)**: Ruby, Kotlin, Dart

### **クイックスタート**

`uv`のインストールが必要です。Serena MCPサーバーはローカルインストール、`uvx`、または実験的なDockerサポートを通じて実行できます。クライアント（Claude Code, Claude Desktopなど）は、MCPサーバーをサブプロセスとして実行するため、起動コマンドを設定する必要があります。

**プロジェクトの有効化とインデックス作成**: LLMにプロジェクトのパスを伝えることで有効化します。大規模プロジェクトでは、パフォーマンス向上のために事前にインデックス作成が推奨されます。

#### **Claude Code / Desktop連携**

* **Claude Code**: `claude mcp add`コマンドでSerenaを追加します。
* **Claude Desktop**: 設定ファイル (`claude_desktop_config.json`) にMCPサーバーの設定を追記します。

### **主な機能と推奨事項**

* **ツール実行**: セマンティックなコード検索、編集、シェル実行などのツールを提供します。安全のため、読み取り専用モードも設定可能です。
* **コンテキストとモード**: 実行環境（`desktop-app`, `agent`, `ide-assistant`）やタスクの種類（`planning`, `editing`）に応じて動作を調整できます。
* **オンボーディングとメモリ**: 初回プロジェクト起動時にオンボーディングプロセスを実行し、プロジェクトの構造を学習して`.serena/memories/`に保存します。これにより、将来の対話でコンテキストを効率的に利用できます。
* **プロンプト戦略**: 複雑なタスクでは、実装前に計画を立てるセッションを設けることが推奨されます。
* **ツールの全リスト**: `activate_project`, `execute_shell_command`, `find_symbol`, `read_file`, `replace_lines`など、多数のツールが含まれています。

### **他のコーディングエージェントとの比較**

Serenaは、APIキーやサブスクリプションを必要としないMCPサーバー経由で全機能を利用できる初のコーディングエージェントです。IDEベースのエージェント（Cursorなど）やAPIベースのエージェント（Aiderなど）とは異なり、コスト効率と柔軟性に優れています。また、言語サーバーの統合により、他のMCPベースのエージェントよりも強力なシンボリックなコード理解能力を持ちます。
