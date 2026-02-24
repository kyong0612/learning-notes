---
title: "Superpowers – Claude Plugin | Anthropic"
source: "https://claude.com/plugins/superpowers"
author:
  - "Jesse Vincent (obra)"
published: 2025-10-09
created: 2026-02-25
description: "Superpowersは、Claude Code等のコーディングエージェントに構造化されたソフトウェア開発ワークフローを教える包括的なスキルフレームワーク。TDD、体系的デバッグ、ブレインストーミング、サブエージェント駆動開発、コードレビューなどの手法を組み合わせ可能なスキルとして提供する。"
tags:
  - "clippings"
  - "claude-code"
  - "tdd"
  - "agentic-development"
  - "skills-framework"
  - "code-review"
---

## 概要

**Superpowers** は、コーディングエージェント（Claude Code、Cursor、Codex、OpenCode）に対して、構造化されたソフトウェア開発ワークフローを提供する包括的なスキルフレームワーク。作者は **Jesse Vincent** ([obra](https://github.com/obra/superpowers))。GitHub上で **60,000以上のスター**、**92,000以上のインストール** を獲得している。

スキルは自動的にトリガーされるため、特別な操作は不要。エージェントが状況を認識し、適切なスキルを発動する。

## コアワークフロー

Superpowersの基本的な開発フローは以下の通り：

1. **ブレインストーミング** — コードを書く前に発動。質問を通じてアイデアを洗練し、代替案を探り、設計をセクションごとに提示して検証する
2. **Git Worktree の活用** — 設計承認後に発動。新しいブランチで隔離されたワークスペースを作成し、テストのベースラインを確認
3. **実装計画の作成** — 承認された設計に基づき発動。各タスクを2〜5分の細かい単位に分割し、正確なファイルパス・完全なコード・検証ステップを含む計画を作成
4. **サブエージェント駆動開発 / 計画実行** — 計画に基づき発動。タスクごとに新しいサブエージェントを起動し、仕様準拠→コード品質の2段階レビューを実施。または、バッチ実行でヒューマンチェックポイントを挟む
5. **テスト駆動開発 (TDD)** — 実装時に発動。**RED-GREEN-REFACTOR** サイクルを厳格に適用（テストが失敗してから実装、テストより前にコードを書いた場合は削除）
6. **コードレビュー** — タスク間に発動。計画との照合、重大度による問題報告。重大な問題は進行をブロック
7. **開発ブランチの完了** — タスク完了時に発動。テスト検証後、マージ・PR・保持・破棄のオプションを提示し、ワークツリーをクリーンアップ

## スキルライブラリ

### テスティング

| スキル | 説明 |
|---|---|
| **test-driven-development** | RED-GREEN-REFACTOR サイクルの強制実行。テストアンチパターンのリファレンスを含む |

### デバッグ

| スキル | 説明 |
|---|---|
| **systematic-debugging** | 4フェーズの根本原因分析プロセス（原因追跡、多層防御、条件ベース待機の技法を含む） |
| **verification-before-completion** | 修正が実際に適用されたことを確認してから完了宣言 |

### コラボレーション

| スキル | 説明 |
|---|---|
| **brainstorming** | ソクラテス式設計精緻化 |
| **writing-plans** | 詳細な実装計画の作成 |
| **executing-plans** | チェックポイント付きバッチ実行 |
| **dispatching-parallel-agents** | 並列サブエージェントワークフロー |
| **requesting-code-review** | レビュー前チェックリスト |
| **receiving-code-review** | フィードバックへの対応 |
| **using-git-worktrees** | 並列開発ブランチ |
| **finishing-a-development-branch** | マージ/PRの判断ワークフロー |
| **subagent-driven-development** | 2段階レビュー（仕様準拠→コード品質）による高速イテレーション |

### メタ

| スキル | 説明 |
|---|---|
| **writing-skills** | ベストプラクティスに従った新スキルの作成（テスト手法を含む） |
| **using-superpowers** | スキルシステムの概要 |

## 強制されるプラクティス

- **TDD の厳格な適用**: テストが失敗する状態（RED）を確認してから実装。テストより先にコードを書くことは許容されない
- **4フェーズデバッグ**: 修正に入る前に根本原因の調査が必須。3回の修正失敗後はアーキテクチャレビューが自動トリガー
- **ソクラテス式ブレインストーミング**: コーディング前に要件を精緻化。「何を作るのか」を明確にしてから実装に進む
- **YAGNI & DRY の徹底**: 実装計画は「判断力に乏しい熱心なジュニアエンジニア」でも迷わず実行できるレベルの明確さを要求

## 設計思想

- **テスト駆動開発** — テストを常に先に書く
- **体系的アプローチ** — 推測ではなくプロセスに従う
- **複雑性の削減** — シンプルさを第一目標とする
- **証拠に基づく判断** — 成功を宣言する前に検証する

## インストール方法

### Claude Code

```shell
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

### Cursor

```
/plugin-add superpowers
```

### Codex / OpenCode

各プラットフォームのインストール手順に従い、GitHub上のINSTALL.mdを取得・実行する。

## 関連リンク

- GitHub: https://github.com/obra/superpowers
- ブログ記事: https://blog.fsck.com/2025/10/09/superpowers/
- Issues: https://github.com/obra/superpowers/issues
