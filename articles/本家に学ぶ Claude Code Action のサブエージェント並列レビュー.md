---
title: "本家に学ぶ Claude Code Action のサブエージェント並列レビュー"
source: "https://zenn.dev/genda_jp/articles/70aa9a74ac1e62"
author:
  - "[[WorldDownTown]]"
  - "[[GENDA]]"
published: 2025-12-04
created: 2025-12-11
description: "Claude Code ActionのデフォルトPRレビュー設定の課題を解決するため、Anthropic公式リポジトリで実践されているサブエージェント並列レビュー手法を解説。5つの専門エージェント（品質、パフォーマンス、テスト、ドキュメント、セキュリティ）による包括的なコードレビューと、インラインコメント機能の活用方法を紹介。"
tags:
  - "clippings"
  - "Claude"
  - "GitHub Actions"
  - "コードレビュー"
  - "サブエージェント"
  - "Claude Code Action"
---

## 概要

この記事はGENDA Advent Calendar 2025の4日目の記事で、`anthropics/claude-code-action`を使ったAIコードレビューの改善方法を解説している。デフォルト設定の課題を本家Anthropicのワークフローを参考に解決する手法を紹介。

## デフォルト設定の課題

### 課題1: ひとかたまりの長文レビュー

- PR全体に対して1つの長いコメントでフィードバックが返される
- 具体的な指摘箇所とコードの対応付けが難しい
- 「読むだけで疲れる」「重要な指摘を見落とす」問題が発生

### 課題2: PRページが縦に伸びて読みにくい

- 修正commitをpushするたびにレビューワークフローが再度動作
- Claudeによるコメントが複数追加されることで：
  - PRページが縦に長くなり検索性が低下
  - 追加したcommitが何を修正したものか確認しにくくなる

**補足**: `use_sticky_comment: true`オプションで最新コメントのみ残す設定が可能だが、v1リリース以降動かなくなっていた

## 本家Anthropicの利用方法

### 公式ワークフローの発見

- `anthropics/claude-code-action`リポジトリ自体のレビューワークフローを参照
- ワークフローは小さく、プロンプトは`/review-pr`コマンドの1行のみ

### 動作の流れ

1つの**スラッシュコマンド**が**5つのサブエージェント**を並列でレビュー実行する構成

## 3つの改善ポイント

### 1. /review-pr によるマルチエージェントレビュー

- ワークフローに直接プロンプトを記述するのではなく、`/review-pr`スラッシュコマンドにレビュー方法の詳細を記載
- ClaudeがGitHub MCPツールを使って情報収集・レビューを実行
- **レビュー観点ごとにサブエージェントを分離**することで：
  - 独立したコンテキストウィンドウで動作
  - PRレビューという目的から逸脱するのを防止

### 2. インラインコメント機能

**最大の改善点**

- `mcp__github_inline_comment__create_inline_comment` MCPツールを使用
- 設定方法：

```yaml
claude_args: |
  --allowedTools "mcp__github_inline_comment__create_inline_comment"
```

**効果**:

- PR全体への長文コメントではなく、該当コード行に直接コメント
- GitHubの「Files changed」タブでコードと指摘をセットで確認可能
- 人間のレビュアーからの指摘と同じ感覚で扱える
- suggestionを使った修正提案も可能

![suggestion_with_inline_comment](https://storage.googleapis.com/zenn-user-upload/1423a7ee3267-20251128.png)

### 3. トリガー設定の最適化（synchronize削除）

- `on.pull_request.types`から`synchronize`トリガーを削除
- 自動レビューはPR作成時のみに限定
- 修正途中の細かいコミットには反応させない

```yaml
on:
  pull_request:
    types: [opened]
```

**再レビューが必要な場合**: `@claude /review-pr`とコメントすることで`issue_comment`トリガーで再実行可能

## 実装例

### スラッシュコマンド（review-pr.md）

3ステップで構成：

1. **プロジェクトルールの読み込み**: CLAUDE.mdを読み込み、プロジェクト固有のルール・設計方針を確認
2. **サブエージェントによる包括的レビュー**: 5つの専門エージェントを並列実行
3. **フィードバックの統合と投稿**: インラインコメント＋トップレベルコメントで結果を報告

### 5つの専門エージェント

| エージェント | 役割 |
|---|---|
| **code-quality-reviewer** | コード品質、保守性、ベストプラクティス準拠のレビュー |
| **performance-reviewer** | パフォーマンスボトルネック、リソース効率の分析 |
| **security-code-reviewer** | セキュリティ脆弱性、認証/認可の欠陥のレビュー |
| **test-coverage-reviewer** | テスト実装とカバレッジのレビュー |
| **documentation-accuracy-reviewer** | ドキュメントの正確性・完全性の検証 |

各エージェントは以下のツールを使用可能：

- `Glob`, `Grep`, `Read`, `WebFetch`, `TodoWrite`, `WebSearch`, `BashOutput`, `KillBash`

### エージェント詳細

#### code-quality-reviewer

- クリーンコード分析（命名規則、単一責任原則、DRY原則）
- エラーハンドリングとエッジケース
- 可読性と保守性
- iOS/Swift固有：swift-format、async/await、プロトコル指向プログラミング

#### performance-reviewer

- アルゴリズム複雑度（O(n²)以上の検出）
- N+1問題、キャッシング、メモ化の機会
- メモリリーク、循環参照の検出
- iOS/Swift固有：ARC、Task優先度、バッテリー消費

#### security-code-reviewer

- OWASP Top 10脆弱性スキャン
- インジェクション攻撃対策
- 入力検証・サニタイゼーション
- iOS/OIDC固有：PKCE、Keychain、ASWebAuthenticationSession

#### test-coverage-reviewer

- カバレッジ目標（全体55%、ブランチ30%）の達成状況
- テスト品質（arrange-act-assert、モック使用）
- iOS/Swift固有：Swift Testingフレームワーク、URLProtocol

#### documentation-accuracy-reviewer

- コードドキュメントと実装の一致
- README/APIドキュメントの正確性
- iOS固有：DocC形式、日本語ドキュメント

## 導入後の効果

1. **複数の視点でのレビュー**: 人間が見落としがちなエッジケースや可読性をAIが補完
2. **指摘の見落とし減少**: インラインコメントで指摘箇所が明確化
3. **修正コスト削減**: Suggestion機能でボタン一つでコミット可能
4. **レビュー時間の短縮**: 人間のレビュアーは設計やロジック、仕様の整合性といった高度なレビューに集中可能

## まとめ

- **本家の構成を真似ることで**コードレビューの質とスピードが改善
- **サブエージェントの並列レビュー**はClaude Code Actionの効果的な活用例
- 今後の展望：プロジェクト固有ルール（命名規則、アーキテクチャ制約）をプロンプトやカスタムMCPで組み込み

## 参考リンク

- [anthropics/claude-code-action](https://github.com/anthropics/claude-code-action)
- [claude-review.yml（公式ワークフロー）](https://github.com/anthropics/claude-code-action/blob/v1.0.21/.github/workflows/claude-review.yml)
- [review-pr.md（公式スラッシュコマンド）](https://github.com/anthropics/claude-code-action/blob/v1.0.21/.claude/commands/review-pr.md)
- [ベストプラクティスドキュメント](https://github.com/anthropics/claude-code-action/blob/main/docs/solutions.md#best-practices)
