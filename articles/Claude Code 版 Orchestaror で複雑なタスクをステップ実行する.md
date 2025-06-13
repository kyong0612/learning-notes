---
title: "Claude Code 版 Orchestaror で複雑なタスクをステップ実行する"
source: "https://zenn.dev/mizchi/articles/claude-code-orchestrator"
author:
  - "mizchi"
published: 2025-06-12
created: 2025-06-13
description: |
  Roo Orchestratorを参考にしたClaude Code版のタスク分解システムを作成。
  複雑なタスクを段階的に分解し、並列実行を活用してコスト効率と速度を向上させる手法を紹介。
tags:
  - "ai"
  - "claude"
  - "claude-code"
  - "orchestrator"
  - "task-automation"
  - "typescript"
  - "clippings"
---

## tl;dr

- Roo Orchestrator の Claude Code 版を作ってみた
- Roo は並列タスク未対応だが、 Claude Code の Task の並列実行ができる

## はじめに

普段から Roo Orchestrator を愛用していて、その Claude 版が欲しかった。

Roo Orchestrator はタスクを段階的に分解して、個別にサブタスクに分解する。サブタスクは独立したセッションとして動き、タスク完了後は親にそのサマリを返す。

これはかなり効率的に動く。場合によるが、今までだと $6 かかっていたようなタスクが、$1 未満にコンテキストを圧縮できていた。動作も速い。

今回は、`.claude/commands` ディレクトリを使って、複雑なタスクを効率的に分解・実行する Orchestrator プロンプトを作成した。

## 事前知識: Task Tool と.claude/commands の仕組み

Claude Code はサブタスク分割に、チェックリスト生成と Task ツールという似たような仕組みがある。

これは自身を MCP サーバーとして起動し、親からタスクを受け取る。

また、Claude Code では、プロジェクトごとにカスタムコマンドを定義できる。`.claude/commands/*.md` に Markdown ファイルを配置すると、それらがコマンドとして利用可能になる。

```
.claude/
└── commands/
    ├── orchestrator.md      # 複雑なタスクの分解実行
    └── commit-with-check.md # テスト後のコミット
```

コマンドは `/project:コマンド名` の形式で実行できる。

例：

- `/project:orchestrator analyze test lint and commit`
- `/project:commit-with-check`

## project:orchestrator コマンド

Roo のプロンプトを参考に、Task を使うように指示して、Claude Code で効くようなプロンプトを生成。

### orchestrator.md の主要な仕組み

#### 1. 段階的な処理プロセス

1. **Initial Analysis**: 全体のタスクを理解し、スコープと要件を分析
2. **Step Planning**: 依存関係に基づき2-4の順次ステップに分解
3. **Step-by-Step Execution**: 各ステップ内のサブタスクを並列実行
4. **Step Review and Adaptation**: 各ステップ完了後に結果をレビューし、次のステップを調整
5. **Progressive Aggregation**: 結果を段階的に統合し、包括的な理解を構築

#### 2. 重要な特徴

- **Sequential Logic**: ステップは順序立てて実行され、後のステップが前の結果を利用
- **Parallel Efficiency**: 各ステップ内では独立したタスクが同時実行
- **Memory Optimization**: 各サブタスクは最小限のコンテキストで実行
- **Adaptive Planning**: 各ステップ後に計画を再評価し、必要に応じて調整

#### 3. 実装のポイント

- 常に単一の分析タスクで全体スコープを理解することから開始
- 関連する並列タスクを同じステップ内でグループ化
- ステップ間では要点のみ（完全な出力ではなく要約）を引き継ぎ
- 各ステップ後に明示的に計画を再検討

## 実行例：TypeScript MCP プロジェクトでの活用

### 実行結果の詳細

実行コマンド：`/project:orchestrator analyze test lint and commit`

#### Step 1: Initial Analysis

- プロジェクト構造とテスト/リント設定を理解
- 実行時間: 44.2秒、7ツール使用、17.8kトークン

#### Step 2: Quality Checks（並列実行）

- テスト実行とキャプチャ: 30秒、1ツール使用、16.4kトークン
- リンティングとタイプチェック: 26.1秒、2ツール使用、14.8kトークン
- git ステータス確認: 37.3秒、6ツール使用、15.8kトークン

#### Step 3: Fix Issues（並列実行）

検出されたエラーを並列で修正：

- ESLint エラー修正（lspGetDiagnostics.ts: 2エラー）
- ESLint エラー修正（lspGetHover.ts: 4エラー）
- ESLint エラー修正（tsMoveDirectory.ts: unbound method）
- TypeScript エラー修正（tsMoveDirectory.ts: typeof Project）

#### Step 4: Final Validation and Commit

- 全修正が完了し、テストとリンティングが正常に通過
- コミット実行：「fix: resolve linting and type errors in LSP and TypeScript tools」

### 効果的な実行パターン

著者が特に効果的だと判明した指示：

1. **初期分析の重要性**: 最初に大雑把にコードを調べ、サブタスクの分割とステップを計画
2. **並列化の活用**: サブタスクの実行ステップ内は並列化
3. **適応的計画**: ステップごとに、一つ前のタスクの実行結果から現在のサブタスク計画が妥当か再考
   - そのままだと計画が破綻した時に手戻りが大きい
   - アジャイル的なアプローチで柔軟性を保つ

## 成果と利点

### コスト効率の向上

- 従来 $6 かかっていたタスクが $1 未満に圧縮
- コンテキストの効率的な管理により大幅なコスト削減

### 実行速度の向上

- 並列実行により処理時間を短縮
- 各サブタスクが独立したセッションで動作

### 構造化された実行

- 「分析 → テスト → 修正 → コミット」の一連の作業を自動実行
- 依存関係を考慮した適切な順序での処理

## まとめ

Claude Code の Task 機能を活用したオーケストレーターシステムにより、複雑なタスクを効率的に分解・実行することが可能になった。Roo Orchestrator の概念を Claude Code に適用し、並列実行の利点を活かしながら、コスト効率と実行速度の両方を向上させることができた。

今後も Task の活用方法についてさらなる改善の余地があるが、現時点でも実用的なソリューションとして機能している。
