---
title: "claude-code/plugins at main · anthropics/claude-code"
source: "https://github.com/anthropics/claude-code/tree/main/plugins"
author:
  - "Anthropic"
published:
created: 2025-12-02
description: |
  Anthropicが公式に提供するClaude Codeプラグインのコレクション。カスタムコマンド、エージェント、ワークフローを通じてClaude Codeの機能を拡張する13個の公式プラグインが含まれており、コードレビュー、機能開発、セキュリティガイダンス、プラグイン開発など、様々な開発タスクをサポートする。
tags:
  - "claude-code"
  - "plugins"
  - "development"
  - "automation"
  - "ai-coding"
  - "code-review"
  - "git-workflow"
---

# Claude Code Plugins - 公式プラグインコレクション

## 概要

このディレクトリには、Anthropicが公式に提供するClaude Codeプラグインが含まれています。これらのプラグインは、カスタムコマンド、エージェント、ワークフローを通じてClaude Codeの機能を拡張する例を示しており、コミュニティマーケットプレイスを通じてさらに多くのプラグインが利用可能です。

## Claude Codeプラグインとは

Claude Codeプラグインは、カスタムスラッシュコマンド、専門化されたエージェント、フック、MCPサーバーを通じてClaude Codeを拡張する拡張機能です。プラグインはプロジェクトやチーム間で共有でき、一貫したツールとワークフローを提供します。

詳細は[公式プラグイン documentation](https://docs.claude.com/en/docs/claude-code/plugins)を参照してください。

## 提供されているプラグイン一覧

### 1. agent-sdk-dev

- **説明**: Claude Agent SDKを扱うための開発キット
- **機能**:
  - **コマンド**: `/new-sdk-app` - Agent SDKプロジェクトの対話的セットアップ
  - **エージェント**: `agent-sdk-verifier-py`, `agent-sdk-verifier-ts` - ベストプラクティスに基づいてSDKアプリケーションを検証

### 2. claude-opus-4-5-migration

- **説明**: Sonnet 4.xとOpus 4.1からOpus 4.5へのコードとプロンプトの移行
- **機能**:
  - **スキル**: `claude-opus-4-5-migration` - モデル文字列、ベータヘッダー、プロンプト調整の自動移行

### 3. code-review

- **説明**: 信頼度ベースのスコアリングを使用して誤検知をフィルタリングする、複数の専門化されたエージェントによる自動PRコードレビュー
- **機能**:
  - **コマンド**: `/code-review` - 自動PRレビューワークフロー
  - **エージェント**: CLAUDE.md準拠、バグ検出、履歴コンテキスト、PR履歴、コードコメントのための5つの並列Sonnetエージェント

### 4. commit-commands

- **説明**: コミット、プッシュ、プルリクエスト作成のためのGitワークフロー自動化
- **機能**:
  - **コマンド**: `/commit`, `/commit-push-pr`, `/clean_gone` - 効率的なgit操作

### 5. explanatory-output-style

- **説明**: 実装の選択とコードベースパターンに関する教育的な洞察を追加（非推奨のExplanatory output styleを模倣）
- **機能**:
  - **フック**: SessionStart - 各セッションの開始時に教育的コンテキストを注入

### 6. feature-dev

- **説明**: 構造化された7フェーズアプローチによる包括的な機能開発ワークフロー
- **機能**:
  - **コマンド**: `/feature-dev` - ガイド付き機能開発ワークフロー
  - **エージェント**: `code-explorer`, `code-architect`, `code-reviewer` - コードベース分析、アーキテクチャ設計、品質レビューのため

### 7. frontend-design

- **説明**: 汎用的なAIの美学を避ける、特徴的で本番レベルのフロントエンドインターフェースを作成
- **機能**:
  - **スキル**: `frontend-design` - フロントエンド作業で自動起動され、大胆なデザイン選択、タイポグラフィ、アニメーション、視覚的詳細に関するガイダンスを提供

### 8. hookify

- **説明**: 会話パターンや明示的な指示を分析して、望ましくない動作を防ぐカスタムフックを簡単に作成
- **機能**:
  - **コマンド**: `/hookify`, `/hookify:list`, `/hookify:configure`, `/hookify:help`
  - **エージェント**: `conversation-analyzer` - 問題のある動作について会話を分析
  - **スキル**: `writing-rules` - hookifyルール構文に関するガイダンス

### 9. learning-output-style

- **説明**: 意思決定ポイントで意味のあるコード貢献を要求する対話型学習モード（未出荷のLearning output styleを模倣）
- **機能**:
  - **フック**: SessionStart - 教育的な洞察を受けながら、意思決定ポイントで意味のあるコード（5-10行）を書くようユーザーに促す

### 10. plugin-dev

- **説明**: 7つの専門スキルとAI支援作成機能を備えた、Claude Codeプラグイン開発の包括的なツールキット
- **機能**:
  - **コマンド**: `/plugin-dev:create-plugin` - プラグイン構築のための8フェーズガイド付きワークフロー
  - **エージェント**: `agent-creator`, `plugin-validator`, `skill-reviewer`
  - **スキル**: フック開発、MCP統合、プラグイン構造、設定、コマンド、エージェント、スキル開発

### 11. pr-review-toolkit

- **説明**: コメント、テスト、エラーハンドリング、型設計、コード品質、コード簡素化に特化した包括的なPRレビューエージェント
- **機能**:
  - **コマンド**: `/pr-review-toolkit:review-pr` - オプションのレビュー側面（comments, tests, errors, types, code, simplify, all）で実行
  - **エージェント**: `comment-analyzer`, `pr-test-analyzer`, `silent-failure-hunter`, `type-design-analyzer`, `code-reviewer`, `code-simplifier`

### 12. ralph-wiggum

- **説明**: 反復開発のための対話型自己参照AIループ。Claudeが同じタスクを完了まで繰り返し作業
- **機能**:
  - **コマンド**: `/ralph-loop`, `/cancel-ralph` - 自律的な反復ループの開始/停止
  - **フック**: Stop - 終了試行をインターセプトして反復を継続

### 13. security-guidance

- **説明**: ファイル編集時に潜在的なセキュリティ問題について警告するセキュリティリマインダーフック
- **機能**:
  - **フック**: PreToolUse - コマンドインジェクション、XSS、eval使用、危険なHTML、pickle逆シリアル化、os.system呼び出しを含む9つのセキュリティパターンを監視

## インストール方法

これらのプラグインはClaude Codeリポジトリに含まれています。独自のプロジェクトで使用するには：

1. **Claude Codeをグローバルにインストール**:

```bash
npm install -g @anthropic-ai/claude-code
```

2. **プロジェクトに移動してClaude Codeを実行**:

```bash
claude
```

3. `/plugin`コマンドを使用してマーケットプレイスからプラグインをインストールするか、プロジェクトの`.claude/settings.json`で設定します。

詳細なプラグインのインストールと設定については、[公式ドキュメント](https://docs.claude.com/en/docs/claude-code/plugins)を参照してください。

## プラグイン構造

各プラグインは標準的なClaude Codeプラグイン構造に従います：

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json          # プラグインメタデータ
├── commands/                 # スラッシュコマンド（オプション）
├── agents/                  # 専門化されたエージェント（オプション）
├── skills/                  # エージェントスキル（オプション）
├── hooks/                   # イベントハンドラー（オプション）
├── .mcp.json                # 外部ツール設定（オプション）
└── README.md                # プラグイン documentation
```

## 貢献方法

このディレクトリに新しいプラグインを追加する際は：

- 標準的なプラグイン構造に従う
- 包括的なREADME.mdを含める
- `.claude-plugin/plugin.json`にプラグインメタデータを追加
- すべてのコマンドとエージェントを文書化
- 使用例を提供

## 参考リンク

- [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code/overview)
- [Plugin System Documentation](https://docs.claude.com/en/docs/claude-code/plugins)
- [Agent SDK Documentation](https://docs.claude.com/en/api/agent-sdk/overview)
