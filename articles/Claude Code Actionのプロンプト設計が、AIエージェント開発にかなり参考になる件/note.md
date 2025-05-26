---
title: "Claude Code Actionのプロンプト設計が、AIエージェント開発にかなり参考になる件"
source: "https://zenn.dev/gotalab/articles/claudecode_9626d853742423"
author:
  - "Gota"
published: 2025-05-24
created: 2025-05-26
description: |
  Claude Code ActionのGitHub Actions実装が公開され、そのプロンプト設計がAIエージェント開発の参考になる点を詳細に分析。構造化されたプロンプト、コンテキスト管理、タスク実行フローなど、実用的なAIエージェント設計の要素を解説。
tags:
  - "claude"
  - "ai-agent"
  - "prompt-engineering"
  - "github-actions"
  - "mcp"
  - "coding-agent"
---

# Claude Code Actionのプロンプト設計が、AIエージェント開発にかなり参考になる件

## 概要

AnthropicのClaude CodeがGitHub Actions上で動作するコーディングエージェントとして実装され、その実装コードが公開されました。この記事では、Claude Code Actionのプロンプト設計を詳細に分析し、AIエージェント開発における参考点を解説します。

## Claude Codeとは

Claude CodeはAnthropicが提供するAIコーディングアシスタントで、GitHub Actions上で動作するバックグラウンド型のコーディングエージェントです。`@claude`とメンションするだけで、コードの分析、プルリクエストの作成、機能実装、バグ修正を自動で行います。

### GitHub Actions上で動作する利点

1. **カスタマイズ性**: ワークフローで動作やツールを自由にカスタマイズ可能
2. **透明性**: すべてのログがGitHub Workflows上に残る
3. **統合性**: 既存のCI/CDワークフローに組み込み可能
4. **SDK提供**: 開発者向けのSDKが公開されている

## Claude Code Actionの設計要素

### 1. モデル

- **主要モデル**: claude-sonnet-4-20250514
- **補助モデル**: claude-3-5-haiku-20241022（一部処理）
- **選択肢**: Bedrock、VertexAI経由での利用も可能

### 2. 組み込みツール

#### ファイル操作系

- `LS`, `Read`, `Edit`, `MultiEdit`, `Write`
- `NotebookRead`, `NotebookEdit`

#### 検索・分析系

- `Glob`, `Grep`
- `Task`, `TodoRead`, `TodoWrite`

#### GitHub操作系

- **GitHub File Ops MCP**: ファイルのコミット・削除
- **GitHub MCP**: 標準的なGitHub操作

#### 実行系

- `Bash`（制限付き）

#### セキュリティ制限

- `WebSearch`, `WebFetch`は禁止

### 3. カスタマイズ機能

- 好きなMCPサーバーの追加が可能
- ワークフローでツールの制御が可能

## プロンプト設計の詳細分析

### 全体構成

#### 1. 役割定義とコンテキスト

```markdown
You are Claude, an AI assistant designed to help with GitHub issues and pull requests.
```

明確な役割定義でGitHub特化のアシスタントであることを明示。

#### 2. コンテキスト情報の構造化

- **フォーマットされたコンテキスト**: PR/Issueのメタデータ
- **本文**: 説明文（画像パスも含む）
- **コメント履歴**: 過去のすべてのコメント
- **レビューコメント**: インラインコードレビュー
- **変更ファイル**: PRの変更ファイルリストとSHA

#### 3. イベントとメタデータ

```xml
<event_type>REVIEW_COMMENT</event_type>
<is_pr>true</is_pr>
<trigger_context>PR review comment with '@claude'</trigger_context>
<repository>owner/repo</repository>
<pr_number>123</pr_number>
<claude_comment_id>456789</claude_comment_id>
<trigger_username>user123</trigger_username>
```

### イベントタイプ別処理

対応するGitHubイベント：

1. `pull_request_review_comment`: PRのインラインコメント
2. `pull_request_review`: PRレビュー
3. `issue_comment`: Issue/PRへの一般コメント
4. `issues`: Issueの作成・割り当て
5. `pull_request`: PRの作成・更新

### タスク実行の5ステップフロー

#### ステップ1: ToDoリストの作成

```markdown
Create a Todo List:
- Use your GitHub comment to maintain a detailed task list based on the request.
- Format todos as a checklist (- [ ] for incomplete, - [x] for complete).
```

進捗の可視化とタスク管理を実現。

#### ステップ2: コンテキストの収集

提供された情報を分析し、必要に応じて追加ファイルを読み込み。

#### ステップ3: リクエストの理解

トリガーコメントから要求を抽出し、質問・コードレビュー・実装要求を判断。

#### ステップ4: アクションの実行

要求タイプに応じた適切なアクション：

- **質問・コードレビュー**: 詳細なフィードバック提供
- **単純な変更**: 直接編集・コミット
- **複雑な変更**: タスク細分化・段階的実装

#### ステップ5: 最終更新

完了時にGitHubコメントを更新し、結果をまとめ。

### 重要な制約事項

#### コミュニケーション制約

- すべての通信はGitHubコメント経由
- 新規コメント作成禁止、既存コメント更新のみ
- コンソール出力はユーザーに非表示

#### ブランチ管理

- Issue作業時: 自動的に専用ブランチ作成（`claude/issue-{番号}-{タイムスタンプ}`）
- PR作成用URL自動生成
- 適切なツール使用例の明示

#### 能力と制限の明確化

**可能な操作**:

- 単一コメントでの応答
- コード質問への回答
- コードレビューとフィードバック
- コード変更実装（単純〜中程度）
- Pull Request作成

**不可能な操作**:

- 正式なGitHub PRレビュー提出
- Pull Request承認
- 複数コメント投稿
- リポジトリ外コマンド実行
- ブランチ操作（マージ、リベース等）

### カスタマイズ要素

1. **トリガーフレーズ**: デフォルト`@claude`から変更可能
2. **カスタム指示**: 追加指示の提供
3. **ツール制御**: GitHub Workflowsでの調整
4. **ダイレクトプロンプト**: コメント非経由の直接指示
5. **CLAUDE.mdファイル**: リポジトリ固有の指示・ガイドライン

### 分析フェーズの重要性

実行前の必須分析項目：

```markdown
Before taking any action, conduct your analysis inside <analysis> tags:
a. Summarize the event type and context
b. Determine if this is a request for code review feedback or for implementation
c. List key information from the provided data
d. Outline the main tasks and potential challenges
e. Propose a high-level plan of action, including any repo setup steps and linting/testing steps
f. If you are unable to complete certain steps, particularly due to missing permissions, explain this
```

この分析フェーズにより、モデルの暴走を防ぎ、状況整理後の適切なアプローチ選択を実現。

## AIエージェント開発への示唆

### 1. 構造化されたプロンプト設計

- 明確な役割定義
- 詳細なコンテキスト情報の構造化
- イベント別の適切な処理分岐

### 2. タスク管理とフィードバック

- ToDoリスト形式での進捗可視化
- 段階的なタスク実行
- ユーザーへの継続的なフィードバック

### 3. 制約と安全性の確保

- 明確な能力と制限の定義
- セキュリティを考慮したツール制限
- 予期しない動作の防止

### 4. カスタマイズ性と拡張性

- 柔軟なツール構成
- リポジトリ固有の設定対応
- MCPサーバーによる機能拡張

## まとめ

Claude Code Actionのプロンプト設計は、AIエージェント開発における優れた参考例です。特に以下の点が注目に値します：

1. **複雑なコンテキストの効果的な管理**
2. **GitHub環境での安全性とユーザー体験の両立**
3. **構造化されたタスク実行フローの実装**
4. **明確な制約設定による予測可能な動作**

これらの設計原則は、他のAIエージェント開発プロジェクトにも応用可能な実用的な指針を提供しています。

## 参考リンク

- [Claude Code GitHub Actions公式ドキュメント](https://docs.anthropic.com/ja/docs/claude-code/github-actions)
- [Claude Code概要](https://docs.anthropic.com/ja/docs/claude-code/overview)
- [GitHub実装リポジトリ](https://github.com/anthropics/claude-code-action/)
