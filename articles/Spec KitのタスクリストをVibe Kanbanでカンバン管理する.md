---
title: "Spec KitのタスクリストをVibe Kanbanでカンバン管理する"
source: "https://zenn.dev/watany/articles/78a06904f681dd"
author:
  - "watany"
published: 2025-09-11
created: 2025-09-12
description: |
  仕様駆動開発ツール「Spec Kit」で生成されたタスクリストを、GUIベースのカンバン管理ツール「Vibe Kanban」と連携させて管理する方法について解説します。Spec Kitが生成する大規模なタスクをVibe Kanbanで分割・管理することで、開発プロセスの効率化を図るアプローチを紹介しています。
tags:
  - "Claude Code"
  - "Vibe Coding"
  - "speckit"
  - "Vibe Kanban"
---

この記事では、仕様駆動開発ツール「Spec Kit」とGUIベースのカンバン管理ツール「Vibe Kanban」を連携させ、開発タスクを効率的に管理する方法について解説します。

## 概要

Claude Codeで仕様駆動開発を可能にする「Spec Kit」は便利な一方、生成されるドキュメントやタスクが大規模になりがちという課題がありました。この記事では、その課題を解決するために、CLI型のコーディングエージェントをGUIでカンバン管理できるOSS「Vibe Kanban」を導入し、Spec Kitで生成されたタスクを分割して管理する手法を試みます。

## Vibe Kanbanとは

[Vibe Kanban](https://www.vibekanban.com/)は、CLIベースのコーディングエージェント（Claude Code, Codexなど）をGUIのカンバンボードで操作できるダッシュボードを提供するオープンソースソフトウェアです。Git Worktreeを活用してエージェントの並列実行を効率化し、開発プロセスを視覚的に管理できます。

- **ライセンス**: Apache License 2.0
- **リポジトリ**: [BloopAI/vibe-kanban](https://github.com/BloopAI/vibe-kanban)

## 実践手順

### 1. Vibe Kanbanの起動

`npx`コマンドで簡単にVibe Kanbanを起動できます。

```bash
PORT=3000 npx vibe-kanban
```

起動後、プロジェクトの標準エージェントやエディタを選択し、GitHubと連携させます。その後、Spec Kitで作成したリポジトリをプロジェクトとして登録します。

![](https://storage.googleapis.com/zenn-user-upload/bc1095d47fd3-20250910.png)

### 2. Vibe Kanban MCPサーバの登録

Vibe KanbanはMCP（Model Context Protocol）経由で操作可能です。以下のコマンドでClaude CodeにVibe KanbanのMCPサーバを登録します。

```bash
# 登録
claude mcp add vibe_kanban -s project -- npx -y vibe-kanban --mcp

# 確認
claude mcp list
```

### 3. MCP経由でのタスク登録

MCPサーバを介して、Spec Kitが生成したタスクリスト（例: `specs/001-web-100/tasks.md`）をVibe Kanbanのプロジェクトに一括で登録できます。

```
specs/001-web-100/tasks.md のタスクをvibe_kanbanの「001-web-100」プロジェクトに以下のルールを守って登録してください
- タスクは降順で登録する
- 各タスクの登録時は日本語訳も下部に記載
- 各タスクの想定時間を下部に記載
- Parallel実行できるタスクは、マーカーとして通番の後に[P]を付与
```

これにより、タスクがカンバンボードに自動で登録されます。

![](https://storage.googleapis.com/zenn-user-upload/1d7e72cdd2c7-20250910.png)

### 4. Vibe Kanbanでのタスク実行

登録されたタスクはGUIから実行できます。エージェントが自走中のタスクは「In Progress」、ユーザーの指示待ちは「In Review」といったステータスで管理されます。タスクから直接チャットで指示を送ることも可能です。

![](https://storage.googleapis.com/zenn-user-upload/1321d5df623f-20250910.png)

タスク完了後はプルリクエストを作成でき、マージされるとタスクは自動的に「Done」に移動します。並列実行可能なタスクはまとめて実施できるため、効率的です。

![](https://storage.googleapis.com/zenn-user-upload/a988358245e3-20250910.png)

## 感想とまとめ

### Vibe Kanbanの利点

- **環境の集約**: コーディングエージェントやLLMの実行環境をサーバーに集約できるため、各クライアント端末の管理が不要になります。
- **品質管理**: 各コミットをレビューしながら進める開発スタイルに適しており、品質を保証しやすいです。

### 課題と考察

- **効率**: タスク分割が細かすぎると、自走型エージェントに比べて開発速度が低下する可能性があります。推進力が求められる場面では、Claude Code単体の方が適しているかもしれません。
- **タスク分割の重要性**: 開発速度がタスク分割の質に大きく依存するため、タスク管理のスキル向上が期待でき、新人研修などにも応用できる可能性があります。

Vibe Kanbanは、チーム開発だけでなく個人のCLIラッパーとしても十分に便利なツールです。今後、アーキテクトがPlan（設計）を、QAがAct（実行管理）を分担するような、新しいペアプログラミングの形が生まれるかもしれません。
