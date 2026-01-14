---
title: "Introducing Cowork | Claude"
source: "https://claude.com/blog/cowork-research-preview"
author:
  - "[[@claudeai]]"
published: 2026-01-12
created: 2026-01-14
description: "Claude Codeのエージェント機能を開発者以外の全ユーザーに提供する新機能「Cowork」のリサーチプレビュー発表。フォルダへのアクセス権限を付与することで、ファイルの読み取り・編集・作成を自律的に実行可能。"
tags:
  - "clippings"
  - "claude"
  - "ai-agent"
  - "productivity"
  - "anthropic"
---

## 概要

Anthropicは**Cowork**を発表した。これはClaude Codeのエージェント機能を開発者以外の全ユーザーに提供する新機能である。Claude Maxサブスクライバー向けにmacOSアプリでリサーチプレビューとして利用可能。

## Coworkとは

### 背景

Claude Codeはコーディング用として開発されたが、ユーザーは[それ以外のほぼすべてのタスク](https://x.com/claudeai/status/2009666254815269313)にも使用し始めた。これがCowork開発の契機となった。

### 通常の会話との違い

- ユーザーが選択した**コンピュータ上のフォルダ**へのアクセス権限をClaudeに付与
- Claudeはそのフォルダ内のファイルを**読み取り、編集、作成**可能

### 実行可能なタスクの例

| タスク | 説明 |
|--------|------|
| ダウンロードの整理 | ファイルの分類・リネーム |
| スプレッドシート作成 | スクリーンショットの山から経費リストを作成 |
| レポート作成 | 散在するメモから初稿を作成 |

### 動作方式

- タスク設定後、Claudeが**計画を立てて着実に実行**
- 進捗状況をユーザーに随時報告
- Claude Codeと[同じ基盤](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)上に構築

## 高度な機能

### 拡張機能との連携

| 機能 | 説明 |
|------|------|
| [Connectors](https://claude.com/connectors) | 外部情報ソースとの連携 |
| [Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) | ドキュメント、プレゼンテーション等の作成能力向上 |
| [Claude in Chrome](https://claude.com/chrome) | ブラウザアクセスが必要なタスクの実行 |

### ワークフローの特徴

- 手動でのコンテキスト提供や出力フォーマット変換が不要
- Claudeの完了を待たずに**タスクをキューに追加**可能
- 複数タスクの**並列処理**
- 会話のやり取りというより、**同僚へのメッセージ**のような体験

## セキュリティと制御

### アクセス制御

- Claudeがアクセスできるフォルダとコネクタを**ユーザーが選択**
- 明示的にアクセス権を付与したもの以外は読み取り・編集不可
- 重要なアクションの実行前に**確認を求める**

### 注意事項

#### 破壊的操作のリスク
- デフォルトでは、指示された場合にローカルファイルの削除など**破壊的アクション**を実行可能
- 指示の誤解の可能性があるため、**明確なガイダンス**を提供すべき

#### プロンプトインジェクションのリスク
- [プロンプトインジェクション](https://www.anthropic.com/research/prompt-injection-defenses)：インターネット上のコンテンツを通じてClaudeの計画を変更しようとする攻撃
- 高度な防御機能を実装済みだが、**エージェントセキュリティは業界全体で開発中の分野**

### 推奨事項

- 特に使い方を学んでいる間は**予防措置**を講じること
- 詳細は[ヘルプセンター](https://support.claude.com/en/articles/13364135-using-cowork-safely)を参照

## 今後の展望

### リサーチプレビューの目的

- ユーザーの使用方法を学習
- 改善点のフィードバック収集
- 予想外の使い方の発見を奨励

### 今後の改善予定

- **クロスデバイス同期**の追加
- **Windows対応**
- 安全性のさらなる向上

## 利用方法

| 条件 | 方法 |
|------|------|
| Claude Maxサブスクライバー | [macOSアプリ](https://claude.com/download)をダウンロード → サイドバーの「Cowork」をクリック |
| その他のプラン | [ウェイトリスト](https://forms.gle/mtoJrd8kfYny29jQ9)に登録 |

## 関連情報

- [Skills explained: How Skills compares to prompts, Projects, MCP, and subagents](https://claude.com/blog/skills-explained) - Nov 13, 2025
- [Claude can now use tools](https://claude.com/blog/tool-use-ga) - May 30, 2024
- [Introducing Agent Skills](https://claude.com/blog/skills) - Oct 16, 2025
- [Managing context on the Claude Developer Platform](https://claude.com/blog/context-management) - Sep 29, 2025
