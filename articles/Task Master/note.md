---
title: Task Master
source: https://github.com/eyaltoledano/claude-task-master?tab=readme-ov-file
author:
  - eyaltoledano
  - RalphEcom
  - jasonzhou1993
published: 2025-06-08
created: 2025-06-12 18:29:44
description: |
  AI駆動の開発向けタスク管理システム。Claude、Cursor AI、Windsurf、Lovable、Rooなどと
  シームレスに連携し、プロジェクト要件書から自動的にタスクを生成・管理できる包括的な開発支援ツール。
tags:
  - ai
  - task-management
  - cursor-ai
  - windsurf
  - lovable
  - claude
  - mcp
  - development-tools
  - automation
---

# Task Master

Task Masterは、Claude AIを使用したAI駆動の開発向けタスク管理システムです。Cursor AI、Windsurf、Lovable、Rooなどの最新の開発環境とシームレスに連携し、開発プロセスを効率化します。

## 概要

Task Masterは、プロジェクト要件書（PRD）から自動的にタスクを生成し、開発の各段階を体系的に管理する革新的なツールです。14.2kのGitHubスターと1.5kのフォークを獲得している人気プロジェクトで、継続的に活発な開発が行われています。

## 主要な特徴

### MCP（Model Control Protocol）対応

- 各種エディターから直接Task Masterを実行可能
- Cursor、Windsurf、VS Codeで利用可能
- プロジェクト毎またはグローバルでの設定が可能

### 多様なAIモデル対応

Task Masterは以下のAIプロバイダーに対応しており、メインモデル、リサーチモデル、フォールバックモデルを自由に設定できます：

- **Anthropic API（Claude）**
- **OpenAI API**
- **Google Gemini API**
- **Perplexity API**（リサーチモデル推奨）
- **xAI API**
- **OpenRouter API**
- **Azure OpenAI**
- **Mistral API**
- **Ollama API**

### 自動タスク生成機能

- PRDを解析して実装可能なタスクを自動生成
- タスクの優先度と依存関係を自動で設定
- 各タスクに詳細な実装ガイドラインを含む

## セットアップ方法

### Option 1: MCP設定（推奨）

#### 1. MCP設定ファイルの作成

各エディターに応じて以下のパスに設定ファイルを配置：

| エディター | スコープ | パス（Linux/macOS） | パス（Windows） |
|-----------|---------|-----------------|---------------|
| **Cursor** | グローバル | `~/.cursor/mcp.json` | `%USERPROFILE%\.cursor\mcp.json` |
| **Windsurf** | グローバル | `~/.codeium/windsurf/mcp_config.json` | `%USERPROFILE%\.codeium\windsurf\mcp_config.json` |
| **VS Code** | プロジェクト | `<project_folder>/.vscode/mcp.json` | `<project_folder>\.vscode\mcp.json` |

#### 2. 設定例（Cursor & Windsurf）

```json
{
  "mcpServers": {
    "taskmaster-ai": {
      "command": "npx",
      "args": ["-y", "--package=task-master-ai", "task-master-ai"],
      "env": {
        "ANTHROPIC_API_KEY": "YOUR_ANTHROPIC_API_KEY_HERE",
        "PERPLEXITY_API_KEY": "YOUR_PERPLEXITY_API_KEY_HERE",
        "OPENAI_API_KEY": "YOUR_OPENAI_KEY_HERE"
      }
    }
  }
}
```

#### 3. プロジェクトの初期化

エディターのAIチャットで以下のコマンドを実行：

```
Initialize taskmaster-ai in my project
```

### Option 2: コマンドライン使用

```bash
# グローバルインストール
npm install -g task-master-ai

# プロジェクトの初期化
task-master init

# PRDの解析とタスク生成
task-master parse-prd your-prd.txt

# タスク一覧表示
task-master list

# 次のタスクを表示
task-master next
```

## 使用方法

### PRD（プロジェクト要件書）の準備

Task Masterの効果を最大化するには、詳細なPRDが重要です：

- 新規プロジェクト：`.taskmaster/docs/prd.txt`に配置
- 既存プロジェクト：`scripts/prd.txt`を使用または`task-master migrate`で移行
- 例）テンプレートが`.taskmaster/templates/example_prd.txt`に用意されています

### よく使用されるコマンド

AIアシスタントとの対話例：

```
# PRDの解析
"Can you parse my PRD at scripts/prd.txt?"

# 次のタスクの計画
"What's the next task I should work on?"

# タスクの実装
"Can you help me implement task 3?"

# タスクの展開
"Can you help me expand task 4?"

# 個別タスクの作成（PRDなしでも可能）
"Can you help me implement [description of what you want to do]?"
```

## プロジェクト構造

Task Masterは以下のディレクトリ構造でプロジェクトを管理します：

```
.taskmaster/
├── docs/
│   └── prd.txt          # プロジェクト要件書
├── tasks/
│   ├── task-001.md      # 生成されたタスク
│   └── task-002.md
└── templates/
    └── example_prd.txt  # PRDテンプレート
```

## ライセンス

Task MasterはMIT License with Commons Clauseの下でライセンスされています：

**許可されること：**

- 個人・商用・学術目的での使用
- コードの修正
- 配布
- Task Masterを使用した製品の作成・販売

**禁止されること：**

- Task Master自体の販売
- Task Masterのホスティングサービス提供
- Task Masterをベースにした競合製品の作成

## コミュニティとサポート

- **GitHub Stars**: 14.2k
- **Forks**: 1.5k
- **Contributors**: 21名の開発者が貢献
- **Discord**: [コミュニティチャンネル](https://discord.gg/taskmasterai)
- **NPM**: 活発なダウンロード実績

## まとめ

Task Masterは、現代のAI駆動開発に最適化された包括的なタスク管理システムです。PRDから自動的にタスクを生成し、複数のAIプロバイダーとの統合により、開発効率を大幅に向上させることができます。MCP対応により、普段使用している開発環境から直接利用できる利便性も大きな特徴です。
