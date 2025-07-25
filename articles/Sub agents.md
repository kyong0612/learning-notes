---
title: "Sub agents"
source: "https://docs.anthropic.com/en/docs/claude-code/sub-agents"
author:
  - "Anthropic"
published:
created: 2025-07-25
description: "Create and use specialized AI sub agents in Claude Code for task-specific workflows and improved context management."
tags:
  - "Claude Code"
  - "AI agent"
  - "automation"
  - "workflow"
  - "tools"
---

Claude Codeのカスタムサブエージェントは、特定の種類のタスクを処理するために呼び出すことができる特化したAIアシスタントです。タスク固有の構成（カスタマイズされたシステムプロンプト、ツール、別のコンテキストウィンドウ）を提供することで、より効率的な問題解決を可能にします。

## サブエージェントとは？

サブエージェントは、Claude Codeがタスクを委任できる、事前に設定されたAIパーソナリティです。各サブエージェントは以下の特徴を持ちます。

- 特定の目的と専門分野を持つ
- メインの会話とは別の独自のコンテキストウィンドウを使用する
- 使用を許可された特定のツールで構成できる
- その振る舞いを導くカスタムシステムプロンプトを含む

Claude Codeは、サブエージェントの専門知識と一致するタスクに遭遇すると、そのタスクを専門のサブエージェントに委任できます。サブエージェントは独立して作業し、結果を返します。

## 主な利点

- **コンテキストの保存**: 各サブエージェントは独自のコンテキストで動作するため、メインの会話が汚染されるのを防ぎ、高レベルの目的に集中できます。
- **専門知識**: サブエージェントは、特定のドメインに関する詳細な指示で微調整でき、指定されたタスクでの成功率を高めます。
- **再利用性**: 作成されたサブエージェントは、異なるプロジェクトで再利用でき、一貫したワークフローのためにチームと共有できます。
- **柔軟な権限**: 各サブエージェントは異なるツールアクセスレベルを持つことができ、強力なツールを特定のサブエージェントタイプに制限できます。

## クイックスタート

最初のサブエージェントを作成するには、`/agents` コマンドを使用します。

1. `/agents` を実行してインターフェースを開きます。
2. 「Create New Agent」を選択します。
3. サブエージェントを定義します（Claudeでの生成を推奨）。
4. 保存すると、自動的または明示的な呼び出しによって使用可能になります。

## サブエージェントの設定

### ファイルの場所

サブエージェントは、YAMLフロントマターを持つMarkdownファイルとして、以下の2つの場所に保存されます。

| タイプ | 場所 | スコープ | 優先度 |
| --- | --- | --- | --- |
| **プロジェクトサブエージェント** | `.claude/agents/` | 現在のプロジェクトで利用可能 | 最高 |
| **ユーザーサブエージェント** | `~/.claude/agents/` | すべてのプロジェクトで利用可能 | 低い |

名前が競合する場合、プロジェクトレベルのサブエージェントが優先されます。

### ファイル形式

各サブエージェントは、以下の構造を持つMarkdownファイルで定義されます。

```yaml
---
name: your-sub-agent-name
description: Description of when this sub agent should be invoked
tools: tool1, tool2, tool3  # Optional - inherits all tools if omitted
---

Your sub agent's system prompt goes here.
```

- `name` (必須): 小文字とハイフンを使用した一意の識別子。
- `description` (必須): サブエージェントの目的を自然言語で記述。
- `tools` (任意): 特定のツールのコンマ区切りリスト。省略した場合、メインスレッドからすべてのツールを継承します。

### 利用可能なツール

サブエージェントには、Claude Codeの内部ツールへのアクセスを許可できます。ツールの設定は、`/agents`コマンドの対話型インターフェースを使用することが推奨されます。MCPサーバーから構成されたMCPツールも利用可能です。

## サブエージェントの管理

`/agents` コマンドは、サブエージェントの表示、作成、編集、削除など、包括的な管理インターフェースを提供します。ファイルシステムで直接ファイルを管理することも可能です。

## 効果的な使い方

### 自動委任

Claude Codeは、リクエストのタスク説明やサブエージェントの`description`フィールドに基づいて、タスクを積極的に委任します。

### 明示的な呼び出し

コマンドで特定のサブエージェントを名指しでリクエストすることもできます。
例: `> Use the code-reviewer sub agent to check my recent changes`

## サブエージェントの例

### コードレビュアー

品質、セキュリティ、保守性のためにコードをレビューする専門家。

```yaml
---
name: code-reviewer
description: Expert code review specialist. Proactively reviews code for quality, security, and maintainability. Use immediately after writing or modifying code.
tools: Read, Grep, Glob, Bash
---
You are a senior code reviewer...
```

### デバッガー

エラー、テスト失敗、予期せぬ振る舞いをデバッグする専門家。

```yaml
---
name: debugger
description: Debugging specialist for errors, test failures, and unexpected behavior. Use proactively when encountering any issues.
tools: Read, Edit, Bash, Grep, Glob
---
You are an expert debugger...
```

### データサイエンティスト

SQLクエリ、BigQuery操作、データインサイトのためのデータ分析専門家。

```yaml
---
name: data-scientist
description: Data analysis expert for SQL queries, BigQuery operations, and data insights. Use proactively for data analysis tasks and queries.
tools: Bash, Read, Write
---
You are a data scientist...
```

## ベストプラクティス

- **Claude生成から始める**: 初期エージェントをClaudeで生成し、それをカスタマイズするのが最良のアプローチです。
- **焦点を絞った設計**: 単一で明確な責任を持つサブエージェントを作成します。
- **詳細なプロンプト**: システムプロンプトに具体的な指示、例、制約を含めます。
- **ツールアクセスの制限**: サブエージェントの目的に必要なツールのみを付与します。
- **バージョン管理**: プロジェクトサブエージェントをバージョン管理にチェックインし、チームで協力して改善します。

## 高度な使い方

### サブエージェントの連鎖（チェイニング）

複雑なワークフローのために、複数のサブエージェントを連鎖させることができます。
例: `> First use the code-analyzer sub agent to find performance issues, then use the optimizer sub agent to fix them`

### 動的なサブエージェント選択

Claude Codeはコンテキストに基づいてインテリジェントにサブエージェントを選択します。`description`フィールドを具体的で行動指向にすることが最良の結果をもたらします。

## パフォーマンスに関する考慮事項

- **コンテキスト効率**: エージェントはメインコンテキストを節約し、より長いセッションを可能にします。
- **レイテンシー**: サブエージェントは呼び出されるたびにクリーンな状態で開始されるため、ジョブの実行に必要なコンテキストを収集する際にレイテンシーが発生する可能性があります。

## 関連ドキュメント

- [Slash commands](/en/docs/claude-code/slash-commands)
- [Settings](/en/docs/claude-code/settings)
- [Hooks](/en/docs/claude-code/hooks)
