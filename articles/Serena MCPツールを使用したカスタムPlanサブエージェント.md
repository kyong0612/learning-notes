---
title: "Serena MCPツールを使用したカスタムPlanサブエージェント"
source: "https://blog.lai.so/serena-plan-mode/?ref=laiso-newsletter"
author:
  - "[[laiso]]"
published: 2025-10-29
created: 2025-10-30
description: "Claude Code v2.0.28でPlan機能がサブエージェント化され、MCPツールが使用できなくなった問題に対し、Planエージェントを上書きしてSerenaツールをサポートする解決策を紹介。カスタムPlanサブエージェントは、高度なコードベース探索ツール（ファイルパターンマッチング、シンボル検索、参照追跡など）を提供し、組み込みPlanの機能を拡張します。"
tags:
  - "clippings"
  - "Claude Code"
  - "MCP"
  - "Serena"
  - "サブエージェント"
  - "開発ツール"
---

## 概要

Claude Code v2.0.28のアップデートにより、Plan機能がサブエージェント化されました。この変更でPlan生成時のコンテキストが切り出され、メインコンテキストの削減につながりましたが、**MCPサーバーから提供されるツール（Serenaツール含む）が使用できなくなる**という問題が発生しました。

本記事では、Planエージェントを上書きしてSerenaツールをサポートする解決策を紹介します。

> ⚠️ **重要な注意**: これは公式にサポートされていない方法であり、将来のアップデートで動作しなくなる可能性があります。

## カスタムPlanサブエージェントとは

カスタムPlanサブエージェントは、Claude Codeの組み込みPlanサブエージェントをSerena MCPツールで拡張したものです。デフォルトツール（Glob、Grep、FileRead）を、より高度なコードベース探索ツールに置き換えます。

### 主な機能

- **ファイルパターンマッチング** (`mcp__serena__find_file`)
- **ファイル内容検索** (`mcp__serena__search_for_pattern`)
- **シンボル検索** (`mcp__serena__find_symbol`) - 関数/クラス定義の検索
- **コードベース構造把握** (`mcp__serena__get_symbols_overview`)
- **参照追跡** (`mcp__serena__find_referencing_symbols`) - コード使用箇所の追跡
- **ディレクトリ探索** (`mcp__serena__list_dir`)

## 前提条件

- Serena MCPサーバーが設定・接続されていること
- `/mcp`コマンドでSerenaが利用可能であることを確認

## インストール方法

### プロジェクト内でテスト（推奨）

```bash
mkdir -p .claude/agents
cp Plan.md .claude/agents/Plan.md
```

### グローバル設定（全プロジェクトに適用）

```bash
mkdir -p ~/.claude/agents
cp Plan.md ~/.claude/agents/Plan.md
```

### Plan.mdファイルの構成

Plan.mdファイルには以下の設定が含まれます：

- **名前**: Plan
- **説明**: コードベース探索に特化した高速エージェント
- **使用ツール**: 6つのSerena MCPツールとBash
- **モデル**: Sonnet
- **詳細なガイドライン**: ツールの使用方法と探索戦略

最新のコードはGitHub Gistで公開されています。

## 組み込みPlanとの機能比較

| 項目 | 組み込みPlan | カスタムPlan（Serena） |
|------|-----------|-----------------|
| ファイル検索 | Glob | mcp__serena__find_file |
| コンテンツ検索 | Grep | mcp__serena__search_for_pattern |
| ファイル読み込み | FileRead | Serenaツール統合 |
| シンボル検索 | ❌ | ✅ |
| 構造把握 | ❌ | ✅ |
| 参照追跡 | ❌ | ✅ |

## 使用方法

### 自動適用

カスタムPlanエージェントを適切なディレクトリに配置すると、組み込みPlanが自動的に上書きされます。Claude Codeを再起動後、カスタム定義が使用されます。

### 上書き確認

`/agents`コマンドで確認できます。正常に上書きされている場合、以下のように表示されます：

```
Plan · sonnet ⚠ overridden by projectSettings
```

## パフォーマンス

著者による検証結果：

- **組み込みPlan**: 60秒、27,946トークン消費
- **Serena Plan**: 60秒、30,854トークン消費

予想に反してSerena Planのトークン数がわずかに増加しましたが、これは検証環境による差異の可能性があります。

## トラブルシューティング

### 1. ツール認識問題

MCPツール名は `mcp__<サーバー名>__<ツール名>` 形式で指定する必要があります。

### 2. エージェント読み込みエラー

定義ファイルを変更した後は、Claude Codeの再起動が必要です。

### 3. 優先順位システム

サブエージェント読み込みの優先順位：

1. **policySettings** - 管理者設定（最優先）
2. **projectSettings** - プロジェクト設定（`.claude/agents/`）
3. **userSettings** - ユーザー設定（`~/.claude/agents/`）
4. **built-in** - 組み込み（最低優先）

## まとめ

Claude Codeの柔軟なプラグイン機構により、Planサブエージェントのカスタマイズが可能です。Serena MCPツールを統合することで、より高度なコードベース探索機能を利用できるようになります。

ただし、これは非公式な方法であるため、将来のアップデートで動作しなくなる可能性がある点に注意してください。

## 関連リンク

- [Serena MCPについての詳細記事](https://blog.lai.so/)
- [Claude Docs - サブエージェント公式ドキュメント](https://docs.anthropic.com/)
- [GitHub Gist - 最新コード実装](https://gist.github.com/)
